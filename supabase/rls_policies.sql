-- RLS policies and trigger functions for single-organization-per-user with Workspaces
-- Schema: public

-- Enable RLS (Prisma uses quoted PascalCase table names)
alter table if exists public."Organization" enable row level security;
alter table if exists public."UserOrganization" enable row level security;
alter table if exists public."Workspace" enable row level security;
alter table if exists public."Project" enable row level security;
alter table if exists public."Task" enable row level security;

-- Organizations: readable by users mapped to them; insert/update by creator
drop policy if exists org_select_if_member on public."Organization";
create policy org_select_if_member on public."Organization"
  for select using (
    exists (
      select 1 from public."UserOrganization" uo
      where uo."organizationId" = "Organization".id
        and uo."userId" = auth.uid()
    )
  );

drop policy if exists org_insert_self on public."Organization";
create policy org_insert_self on public."Organization"
  for insert with check ("createdBy" = auth.uid());

drop policy if exists org_update_creator_only on public."Organization";
create policy org_update_creator_only on public."Organization"
  for update using ("createdBy" = auth.uid()) with check ("createdBy" = auth.uid());

-- User -> Organization mapping (single org per user)
drop policy if exists user_org_read_self on public."UserOrganization";
create policy user_org_read_self on public."UserOrganization"
  for select using ("userId" = auth.uid());

drop policy if exists user_org_insert_self on public."UserOrganization";
create policy user_org_insert_self on public."UserOrganization"
  for insert with check ("userId" = auth.uid());

-- Workspaces: must belong to same organization as user
drop policy if exists workspace_crud_if_member on public."Workspace";
create policy workspace_crud_if_member on public."Workspace"
  for all using (
    exists (
      select 1 from public."UserOrganization" uo
      where uo."organizationId" = "Workspace"."organizationId"
        and uo."userId" = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public."UserOrganization" uo
      where uo."organizationId" = "Workspace"."organizationId"
        and uo."userId" = auth.uid()
    )
  );

-- Projects: organizationId is denormalized for efficient checks
drop policy if exists project_crud_if_member on public."Project";
create policy project_crud_if_member on public."Project"
  for all using (
    exists (
      select 1 from public."UserOrganization" uo
      where uo."organizationId" = "Project"."organizationId"
        and uo."userId" = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public."UserOrganization" uo
      where uo."organizationId" = "Project"."organizationId"
        and uo."userId" = auth.uid()
    )
  );

-- Tasks: organizationId is denormalized for efficient checks
drop policy if exists task_crud_if_member on public."Task";
create policy task_crud_if_member on public."Task"
  for all using (
    exists (
      select 1 from public."UserOrganization" uo
      where uo."organizationId" = "Task"."organizationId"
        and uo."userId" = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public."UserOrganization" uo
      where uo."organizationId" = "Task"."organizationId"
        and uo."userId" = auth.uid()
    )
  );

-- Trigger and function to default createdBy fields
create or replace function public.set_created_by()
returns trigger language plpgsql security definer as $$
begin
  if new."createdBy" is null then
    new."createdBy" := auth.uid();
  end if;
  return new;
end; $$;

-- Attach triggers to tables that have createdBy
do $$ begin
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='Organization' and column_name='createdBy') then
    drop trigger if exists trg_organizations_created_by on public."Organization";
    create trigger trg_organizations_created_by before insert on public."Organization"
    for each row execute function public.set_created_by();
  end if;
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='Workspace' and column_name='createdBy') then
    drop trigger if exists trg_workspaces_created_by on public."Workspace";
    create trigger trg_workspaces_created_by before insert on public."Workspace"
    for each row execute function public.set_created_by();
  end if;
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='Project' and column_name='createdBy') then
    drop trigger if exists trg_projects_created_by on public."Project";
    create trigger trg_projects_created_by before insert on public."Project"
    for each row execute function public.set_created_by();
  end if;
end $$;
