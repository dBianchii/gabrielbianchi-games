import * as React from "react";

import { GameSwitcher } from "~/components/game-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import NavUser from "./nav-user/nav-user-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <GameSwitcher />
      </SidebarHeader>
      <SidebarContent>{/* <NavMain items={data.navMain} /> */}</SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
