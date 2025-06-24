# AI-Optimized Authentication & Authorization Implementation Plan

## OBJECTIVES
- Restrict all application pages to authenticated users only.
- Redirect unauthenticated users to `/login`.
- Support authentication via Supabase (email/password) and Google OAuth.
- Use NextAuth with Supabase Adapter for user/session management.
- Ensure accessibility, performance, and security (see user rules).

---

## ENVIRONMENT VARIABLES (REQUIRED)
- `NEXTAUTH_URL`: Base URL of the app
- `NEXTAUTH_SECRET`: Secret for NextAuth
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)
- `SUPABASE_ANON_KEY`: Supabase anon/public key (client-side use)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

---

## STEP 1: Install Dependencies
- Ensure the following packages are installed:
  - `next-auth`
  - `@auth/supabase-adapter`
  - `@supabase/supabase-js`

---

## STEP 2: Configure NextAuth API Route
- Path: `/src/app/api/auth/[...nextauth].js`
- Providers:
  - Credentials (email/password, use Supabase JS client’s `signInWithPassword` in `authorize`)
  - Google (use credentials from env)
- Adapter:
  - Use SupabaseAdapter from `@auth/supabase-adapter` (server-side only, use service role key)
- Session:
  - Use JWT strategy
- Callbacks:
  - Ensure user data from Supabase is attached to session
- Ensure Supabase is initialized with correct keys and URL

---

## STEP 3: Login Page Implementation
- Path: `/src/app/login/page.js`
- Features:
  - Accessible form for email/password login (calls `signIn('credentials', ...)`)
  - Google login button (calls `signIn('google')`)
  - Show error messages on failure
  - Use Tailwind 4 for styling, ensure accessibility

---

## STEP 4: Protect Application Pages
- For all protected pages (all under `/app` except `/login` and `/api/auth/*`):
  - Use `getServerSession` from `next-auth/next` in server components/route handlers to check authentication
  - In client components, use `useSession` and handle loading states
  - If not authenticated, redirect to `/login`
  - Implement a reusable `requireAuth` wrapper for server components/pages

---

## STEP 5: Session Handling in UI
- Wrap app in `SessionProvider` (already done in `providers.js` and `layout.tsx`)
- Use `useSession` in client components to access session state
- Show user info and logout button when authenticated

---

## STEP 6: Supabase Integration
- In Credentials provider, use Supabase JS client’s `signInWithPassword` to verify email/password (server-side only)
- Store user metadata in Supabase
- Ensure all user data is consistent between Supabase and NextAuth

---

## STEP 7: Security, Performance, and Accessibility
- Store all secrets in `.env.local` (never commit to git)
- Never expose the service role key to the client
- Use HTTPS in production
- Sanitize and validate all user input (client and server)
- Rate limit login attempts to prevent brute force attacks
- Follow WordPress coding standards for JS/React
- Use Tailwind 4 and ensure all UI is accessible (keyboard/screen reader)
- Optimize for performance (lazy-load auth UI, minimize bundle size)

---

## FILE STRUCTURE (REFERENCE)
```
src/app/
  api/auth/[...nextauth].js
  login/page.js
  components/requireAuth.js
  providers.js
  layout.tsx
```
- Place `requireAuth.js` in `/src/app/components/requireAuth.js`
- Ensure `/src/app/login/page.js` is public (not protected)

---

## CHECKLIST FOR AI AGENT
- [x] All required environment variables are set (step 2a complete)
- [x] All dependencies are installed (step 1 complete)
- [x] NextAuth API route is configured with Supabase and Google providers (step 2b complete)
- [x] Login page is implemented and accessible (step 3 complete)
- [x] All protected pages use authentication check and redirect (step 4 complete)
- [x] Session is handled in UI and user info is displayed (step 5 complete)
- [x] Security, accessibility, and performance best practices are followed (step 6 complete)

---

**Note:**
- All code follows WordPress coding standards for JS/React.
- Tailwind 4 is used for styling.
- All UI is accessible and performance-optimized.
- Security best practices are followed: secrets are not exposed, input is validated, and authentication is enforced server-side.

---

## REFERENCES
- https://next-auth.js.org/
- https://authjs.dev/reference/adapter/supabase
- https://supabase.com/docs/reference/javascript/auth-signin
- https://next-auth.js.org/tutorials/securing-pages-and-api-routes
- Use Supabase Adapter for user management

## 3. Login Page
- Create `/login` page with:
  - Accessible form for email/password login
  - Button for Google login
  - Error handling and feedback
- Use `signIn()` from next-auth/react

## 4. Protecting Pages
- Create a higher-order component or wrapper (`withAuth` or `requireAuth`) for server components/pages
- Use `getServerSession` (App Router) to check authentication server-side
- If not authenticated, redirect to `/login`
- Ensure API routes are protected as needed

## 5. Session Handling
- Use `SessionProvider` in `_app.js` or layout.tsx
- Use `useSession` in client components for conditional rendering
- Show user info and logout button when logged in

## 6. Supabase Integration
- Use Supabase JS client for user verification in credentials provider
- Store user metadata in Supabase
- Ensure user data consistency between Supabase and NextAuth

## 7. Security & Best Practices
- Store secrets in `.env.local` (never commit to git)
- Use HTTPS in production
- Sanitize and validate all user input
- Follow WordPress coding standards for JS/React where possible
- Use Tailwind 4 for styling, ensuring accessibility

## 8. Performance & Accessibility
- Lazy-load authentication components where possible
- Use semantic HTML for forms/buttons
- Ensure screen reader and keyboard navigation support

---

## Example File/Folder Structure
```
src/app/
  api/auth/[...nextauth].js
  login/page.js
  components/withAuth.js
  providers.js
  layout.tsx
```

---

## Next Steps
1. Configure environment variables for Supabase and Google
2. Update NextAuth config for Supabase/Google
3. Implement login page UI
4. Implement page protection logic
5. Test all flows (login, logout, redirect, error states)

---

## References
- [NextAuth.js Docs](https://next-auth.js.org/)
- [NextAuth.js Supabase Adapter](https://authjs.dev/reference/adapter/supabase)
- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript/auth-signin)
- [Next.js App Router Auth Example](https://next-auth.js.org/tutorials/securing-pages-and-api-routes)
