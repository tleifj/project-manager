import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    // Match all routes except auth, api/auth, _next, and static files
    "/((?!api/auth|_next|.*\\..*).*)",
  ],
};
