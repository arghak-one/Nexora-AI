import {
  LayoutDashboard,
  Users,
  School,
  GraduationCap,
  BarChart3,
  CalendarCheck,
  ShieldAlert,
  LineChart,
  Sparkles,
  DollarSign,
  FileText,
  UserCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

interface Section {
  label: string | null;
  glow?: boolean;
  items: NavItem[];
}

const sections: Section[] = [
  {
    label: null,
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Academic",
    items: [
      { title: "Students", url: "/students", icon: Users },
      { title: "Classes", url: "/classes", icon: School },
      { title: "Teachers", url: "/teachers", icon: GraduationCap },
      { title: "Results", url: "/results", icon: BarChart3 },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { title: "Attendance", url: "/attendance", icon: CalendarCheck },
      { title: "Behaviour", url: "/behaviour", icon: ShieldAlert },
      { title: "Analytics", url: "/analytics", icon: LineChart },
    ],
  },
  {
    label: "AI",
    glow: true,
    items: [
      { title: "AI Insights", url: "/ai-insights", icon: Sparkles, highlight: true },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Fees", url: "/fees", icon: DollarSign },
      { title: "Reports", url: "/reports", icon: FileText },
      { title: "Parents", url: "/parents", icon: UserCheck },
    ],
  },
  {
    label: "General",
    items: [
      
      { title: "Settings", url: "/settings", icon: Settings },
      
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isItemActive = (item: NavItem) => {
    if (item.url === "/students") return location.pathname.startsWith("/students");
    return location.pathname === item.url;
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-br from-primary/25 to-accent/20 blur-lg opacity-60" />
          <img src="/nexora-ai-logo.png" alt="Nexora AI" className="relative w-[34px] h-[34px] rounded-lg object-contain drop-shadow-[0_0_8px_hsl(217_91%_60%/0.5)]" />
        </div>
        {!collapsed && (
          <span className="font-bold text-[1.1rem] tracking-tight leading-none">
            <span className="text-foreground">Nexora</span>{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-[0_0_6px_hsl(262_83%_58%/0.4)]">AI</span>
          </span>
        )}
      </div>

      <SidebarContent className="px-2 mt-1 overflow-y-auto">
        {sections.map((section, si) => (
          <SidebarGroup key={si} className={`${section.glow ? "relative" : ""} py-1`}>
            {section.glow && !collapsed && (
              <div className="absolute inset-0 rounded-xl bg-accent/5 glow-accent pointer-events-none" />
            )}
            {section.label && !collapsed && (
              <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-semibold px-3 mb-0.5 mt-1">
                {section.label}
              </SidebarGroupLabel>
            )}
            {section.label && collapsed && (
              <div className="mx-3 my-1 border-t border-border/30" />
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url !== "/students"}
                          className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-primary/10 text-primary glow-primary"
                              : item.highlight
                              ? "text-accent hover:text-accent hover:bg-accent/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          }`}
                          activeClassName=""
                        >
                          <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-primary" : item.highlight ? "text-accent" : ""}`} />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                activeClassName=""
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span>Logout</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
