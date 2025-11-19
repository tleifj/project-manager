# Project Manager – Multi-tenant Access Control Plan (Supabase Auth + Prisma + Next.js)

## Goals
- **Google-only authentication** via Supabase Auth.
- **Multi-tenant isolation**: each user belongs to one or more Organizations (Accounts).
- **Scoped access**: users can only see Projects and Tasks for Organizations they are members of.
- **Secure by default**: Row-Level Security (RLS) on all tenant data tables.
- **Prisma used for schema and migrations**. App data access uses Supabase JS to respect RLS.
- **Accessible, performant, and secure** (per global rules).

## Key Decisions
- **Source of truth for users**: Supabase `auth.users`.
- **App schema**: `organizations`, `organization_members`, `projects`, `tasks` in `public` schema.
- **User linkage**: store `user_id uuid` (from `auth.users`) in membership and audit columns.
- **RLS-first**: enable RLS on all tenant tables; all queries from the app use the Supabase client (propagates JWT claims), not Prisma.
- **Prisma role**: manage schema/migrations; use Prisma only in admin scripts with service role if necessary.
- **Identifiers**: use `uuid` for tenant entities.

### Chosen variant for this app
- **Single organization per user**. Keep a dedicated mapping table (`user_organizations`) with a unique `(user_id)` to enforce one org per user.
- **Hierarchy**: Organization -> Workspaces -> Projects -> Tasks. Workspaces belong to an Organization; Projects belong to a Workspace; Tasks belong to a Project. Denormalize `organization_id` on Projects and Tasks for efficient RLS checks and indexing.

## Data Model (Prisma-facing)
Prisma note: to avoid cross-schema FK limitations with `auth.users`, set `relationMode = "prisma"` and enforce user linkage by RLS and optional raw SQL constraints.

- **Organization** (`organizations`):
  - `id uuid pk`, `name`, `created_at`, `updated_at`, `created_by uuid`
- **UserOrganization** (`user_organizations`):
  - `user_id uuid`, `organization_id uuid`, unique on `user_id` to enforce single org per user
- **Workspace** (`workspaces`):
  - `id uuid pk`, `organization_id uuid fk`, `name`, timestamps, `created_by uuid`
- **Project** (`projects`):
  - `id uuid pk`, `workspace_id uuid fk`, `organization_id uuid` (denormalized), `name`, `description`, timestamps, `created_by uuid`
- **Task** (`tasks`):
  - `id uuid pk`, `project_id uuid fk`, `organization_id uuid` (denormalized), `name`, `description`, timestamps

Indexes:
- `user_organizations (user_id)`
- `workspaces (organization_id)`
- `projects (organization_id, workspace_id)`
- `tasks (organization_id, project_id)`

Optional: `statuses` table per organization if needed.

## RLS Policies (Supabase SQL)
Enable RLS on all tables and use policies based on `auth.uid()`:
- organizations: `select` if member; `insert` if `created_by = auth.uid()`; `update/delete` by owner/admin.
- organization_members: `select` if member; `insert/update/delete` via SECURITY DEFINER functions gating by owner/admin; allow self-delete for members.
- projects: CRUD if member of `organization_id`.
- tasks: CRUD if member of `organization_id`.

Use triggers to default `created_by` to `auth.uid()`.
Use `WITH CHECK` to ensure writes remain within tenant.

### Example RLS SQL (to include in a SQL migration)
```sql
-- Organizations
alter table public.organizations enable row level security;

create policy org_select_if_member on public.organizations
  for select using (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = organizations.id
        and uo.user_id = auth.uid()
    )
  );

create policy org_insert_self on public.organizations
  for insert with check (created_by = auth.uid());

-- Optional: owner/admin roles can be modeled later if needed. For now, restrict updates to creator
create policy org_update_creator_only on public.organizations
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

-- User -> Organization mapping (single org per user)
alter table public.user_organizations enable row level security;

create policy user_org_read_self on public.user_organizations
  for select using (user_id = auth.uid());

create policy user_org_insert_self on public.user_organizations
  for insert with check (user_id = auth.uid());

-- Projects
alter table public.projects enable row level security;

create policy project_crud_if_member on public.projects
  for all using (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = projects.organization_id
        and uo.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = projects.organization_id
        and uo.user_id = auth.uid()
    )
  );

-- Tasks
alter table public.tasks enable row level security;

create policy task_crud_if_member on public.tasks
  for all using (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = tasks.organization_id
        and uo.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = tasks.organization_id
        and uo.user_id = auth.uid()
    )
  );

-- Trigger example to default created_by to auth.uid()
create or replace function public.set_created_by()
returns trigger language plpgsql security definer as $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  return new;
end; $$;

drop trigger if exists trg_projects_created_by on public.projects;
create trigger trg_projects_created_by before insert on public.projects
for each row execute function public.set_created_by();
```

## Migration Strategy
- Update `prisma/schema.prisma` with new models (uuid ids) and `relationMode = "prisma"`.
- Generate Prisma migration.
- Add a companion SQL migration for:
  - `ENABLE ROW LEVEL SECURITY`
  - Policies for each table
  - SECURITY DEFINER helper functions (e.g., add/remove member)
- Apply via `npx prisma migrate deploy` plus executing SQL in Supabase SQL Editor if needed.

### Prisma schema hints
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
  relationMode = "prisma"
}

model Organization {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @db.VarChar(255)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?  @db.Uuid
  workspaces  Workspace[]
}

model UserOrganization {
  userId         String @id @db.Uuid
  organizationId String @db.Uuid
}

model Workspace {
  id              String   @id @default(uuid()) @db.Uuid
  organizationId  String   @db.Uuid
  name            String   @db.VarChar(255)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?  @db.Uuid
  organization    Organization @relation(fields: [organizationId], references: [id])
  projects        Project[]
  @@index([organizationId])
}

model Project {
  id              String   @id @default(uuid()) @db.Uuid
  organizationId  String   @db.Uuid
  workspaceId     String   @db.Uuid
  name            String   @db.VarChar(255)
  description     String?  @db.VarChar(600)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?  @db.Uuid
  organization    Organization @relation(fields: [organizationId], references: [id])
  workspace       Workspace    @relation(fields: [workspaceId], references: [id])
  tasks           Task[]

  @@index([organizationId, workspaceId])
}

model Task {
  id              String   @id @default(uuid()) @db.Uuid
  organizationId  String   @db.Uuid
  projectId       String   @db.Uuid
  name            String   @db.VarChar(255)
  description     String?  @db.VarChar(600)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  project         Project  @relation(fields: [projectId], references: [id])

  @@index([organizationId, projectId])
}
```

### Raw SQL companion migration
Place the RLS/policy SQL into a SQL file and execute it after the Prisma migration (e.g., via Supabase SQL Editor or a scripted step).

### Migration from current repo schema
- Current tables: `Task`, `Status`, `Project`, `Workspace`, `Organization`, plus `User`, `Account`, `Session`, `VerificationToken`.
- Adjustments:
  - Keep `Workspace` and place it under `Organization` as the immediate parent of `Project`.
  - Replace integer IDs with UUIDs for `Organization`/`Project`/`Task` going forward.
  - Remove Prisma `User/Account/Session/VerificationToken` if fully adopting Supabase Auth. Keep historical data if needed; otherwise, deprecate and drop.
  - Add `organization_id` to `Project` and `Task` (denormalized) for simpler RLS checks and indexing.
  - Migrate existing data (if any) into the new tables with simple scripts, then drop old tables.

## Auth Flow (Google-only)
- Client: `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- After callback, check memberships.
- If none: onboarding asks org name -> create org (owner = current user) -> redirect to projects.
- Store selected `organization_id` in app state (cookie or local storage) and pass to server actions.

## Next.js Integration
- Use Supabase JS on server (via `@supabase/ssr`) and client so JWT is propagated and RLS enforced.
- Avoid Prisma in user-facing requests (unless using service role on isolated admin ops).
- Middleware/layout: redirect unauthenticated users to login.
- Server actions/route handlers wrap Supabase queries and validate `organization_id` against membership.

### Server client example (RSC/route handlers)
```ts
// src/utils/supabaseServer.ts
import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export function getSupabaseServer() {
  const cookieStore = cookies()
  const hdrs = headers()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set(name, value, options) },
        remove(name, options) { cookieStore.set(name, '', { ...options, maxAge: 0 }) },
      },
      headers: {
        get(key) { return hdrs.get(key) || undefined },
      },
    }
  )
}
```

## API Endpoints (examples)
- POST `/api/organizations` – create organization (owner = current user)
- GET `/api/organizations` – list user organizations
- POST `/api/projects` – create project in selected org
- GET `/api/projects?org=...` – list projects for org
- POST `/api/tasks` – create task in project
- GET `/api/tasks?project=...` – list tasks for project

## Environment Variables
- `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `.env`: `DATABASE_URL` (pooled), `DIRECT_URL` (direct) for Prisma

## Security
- RLS-first design; no service role in client.
- Validate inputs; cross-check membership on server.
- Separate policies for select/insert/update/delete.
- Audit fields and triggers using `auth.uid()`.

## Performance
- Index tenancy and membership columns.
- Paginate lists.
- Consider materialized views for dashboards later.

## Accessibility
- Semantic markup, aria labels, focus styles, high contrast.
- Tailwind 4 utilities for consistent spacing/contrast.

## Checklist
1) Configure Google provider in Supabase.
2) Update Prisma schema (uuid ids; models; relationMode).
3) Create migration and SQL policies.
4) Apply migrations to Supabase.
5) Implement Next.js auth + onboarding.
6) Replace data access with Supabase client (server + client).
7) Add guards and org selection.
8) Test isolation with multiple users.
9) Indexes and perf tweaks.
10) Accessibility QA.

## Open Questions
- Single vs multi-organization per user? (Plan supports multiple.)
- Invitation flows and extended role model?
- Do you still need Workspaces in addition to Organizations?
