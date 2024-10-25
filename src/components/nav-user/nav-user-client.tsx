"use client";

import dynamic from "next/dynamic";

const NavUser = dynamic(() => import("."), {
  ssr: false,
});
export default NavUser;
