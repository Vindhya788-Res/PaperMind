import {
  FlaskConical,
  LayoutDashboard,
  Library,
  Network,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

/** Primary navigation shown in the left sidebar. */
export const primaryNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Library", href: "/library", icon: Library },
  { title: "Projects", href: "/projects", icon: Sparkles },
  { title: "Experiments", href: "/experiments", icon: FlaskConical },
  { title: "Knowledge Graph", href: "/knowledge-graph", icon: Network, badge: "Soon" },
];

/** Secondary navigation pinned to the bottom of the sidebar. */
export const secondaryNav: NavItem[] = [{ title: "Settings", href: "/settings", icon: Settings }];
