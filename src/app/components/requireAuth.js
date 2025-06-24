import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Client component wrapper to protect pages.
 * Usage: export default requireAuth(PageComponent)
 */
export default function requireAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data?.session) {
          router.replace("/login");
        }
      });
    }, [router]);
    return <Component {...props} />;
  };
}
