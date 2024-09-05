// import { useSession, signOut } from "next-auth/react"
import Link from "next/link";

const Topbar = ({ name }) => {
  // const { data: session, status } = useSession()
  return (
    <div>
      {/* {(status === "authenticated") &&
                <p>Signed in as {session.user.email} <button onClick={() => signOut({ redirect: false })}>Sign out</button></p>
            }
            {(status !== "authenticated") &&
                <p><Link href="/signup">
                <a >Log in or Sign Up</a>
              </Link></p>
            } */}
      <p>{name}</p>
    </div>
  );
};

export default Topbar;
