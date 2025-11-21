"use client";

import Link from "next/link";
// import { useRouter } from "next/router";
// import styled from "styled-components";
import NewWorkspace from "./NewWorkspace";
import WorkspaceList from "./WorkspaceList";
import SidebarAccount from "./SidebarAccount";
import Modal from "./WorkspaceModal";
import { useState } from "react";

// This is the custom styles for the sidebar. It will be used as a component down below
// const StyledSideBar = styled.section`
//   width: 280px;
//   height: 100%;
//   border-right: 1px solid rgb(233, 233, 233);

//   .logo-container {
//     margin-bottom: 30px;
//     text-align: center;
//   }

//   .app-main-nav {
//     a {
//       text-decoration: none;

//       color: rgb(99, 115, 129);
//       padding: 10px;
//       border-radius: 5px;
//       display: block;
//       margin-bottom: 5px;

//       &:hover {
//         background: rgb(145, 158, 171, 0.08);
//       }

//       &.active {
//         background: rgb(0, 171, 171, 0.08);
//       }
//     }
//   }
// `;

const Sidebar = () => {
  // We need this to set active paths on nav links below
  // const router = useRouter();
  let [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 w-[300px] text-black dark:text-white">
      <SidebarAccount />
      <nav className="app-main-nav py-8 text-sm">
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
        </ul>
        <div className="mb-2 flex justify-between items-center">
          <span className="uppercase font-bold">Workspaces</span>
          <button
            onClick={() => {
              setShowModal(true);
            }}
          >
            +
          </button>
        </div>
        {/* <WorkspaceList /> */}
      </nav>
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Sidebar;
