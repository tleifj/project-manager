// Providers wrapper for NextAuth.js and other context providers
"use client";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
