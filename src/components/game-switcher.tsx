"use client";

import { AudioWaveform, ChevronsUpDown, Gamepad } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function GameSwitcher() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const defaultOption = {
    name: "Games!!!",
    logo: Gamepad,
  };

  const games = [
    {
      name: "Chess",
      logo: Gamepad,
      href: "/chess",
    },
    {
      name: "Connect4",
      logo: AudioWaveform,
      href: "/connect4",
    },
  ];

  const activeGame =
    games.find((game) => pathname.includes(game.href)) ?? defaultOption;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeGame.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeGame.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Games
            </DropdownMenuLabel>
            {games.map((game, index) => (
              <DropdownMenuItem
                key={game.name}
                onClick={() => {
                  void router.push(game.href);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <game.logo className="size-4 shrink-0" />
                </div>
                {game.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
