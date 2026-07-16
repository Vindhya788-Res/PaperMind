"use client";

import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNav, secondaryNav, type NavItem } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

export function LeftSidebar() {
  const collapsed = useUiStore((state) => state.sidebarCollapsed);

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "hidden shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-in-out md:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-14 items-center gap-2.5 px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BrainCircuit className="size-5" />
        </div>
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-foreground">{siteConfig.name}</span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {primaryNav.map((item) => (
          <SidebarLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border px-3 py-3">
        {secondaryNav.map((item) => (
          <SidebarLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </div>
    </aside>
  );
}

function SidebarLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  const link = (
    <Link
      href={item.disabled ? "#" : item.href}
      aria-disabled={item.disabled}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-4.5 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
      {!collapsed && item.badge && (
        <Badge variant="secondary" className="ml-auto text-[10px]">
          {item.badge}
        </Badge>
      )}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.title}</TooltipContent>
    </Tooltip>
  );
}
