// import { useSession, signOut } from "next-auth/react"
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Topbar = ({ name, workspace }) => {
  // let { id } = workspace;

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Visceral</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={"/workspace/" + workspace.id}>
              {workspace.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Topbar;
