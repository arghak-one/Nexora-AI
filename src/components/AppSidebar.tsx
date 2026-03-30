import {
  LayoutDashboard,
  Users,
  School,
  GraduationCap,
  BarChart3,
  CalendarCheck,
  ShieldAlert,
  LineChart,
  Brain,
  Sparkles,
  DollarSign,
  FileText,
  UserCheck,
  Bell,
  Settings,
  User,
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

const sections = [
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
      { title: "Classes", url: "/dashboard", icon: School },
      { title: "Teachers", url: "/dashboard", icon: GraduationCap },
      { title: "Results", url: "/dashboard", icon: BarChart3 },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { title: "Attendance", url: "/dashboard", icon: CalendarCheck },
      { title: "Behaviour", url: "/dashboard", icon: ShieldAlert },
      { title: "Analytics", url: "/dashboard", icon: LineChart },
    ],
  },
  {
    label: "AI",
    glow: true,
    items: [
      { title: "AI Insights", url: "/dashboard", icon: Sparkles, highlight: true },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Fees", url: "/dashboard", icon: DollarSign },
      { title: "Reports", url: "/dashboard", icon: FileText },
      { title: "Parents", url: "/dashboard", icon: UserCheck },
    ],
  },
  {
    label: "General",
    items: [
      { title: "Notifications", url: "/dashboard", icon: Bell },
      { title: "Settings", url: "/dashboard", icon: Settings },
      { title: "Profile", url: "/dashboard", icon: User },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight">
            EduAI <span className="text-gradient">OS</span>
          </span>
        )}
      </div>

      <SidebarContent className="px-2 mt-1 overflow-y-auto">
        {sections.map((section, si) => (
          <SidebarGroup key={si} className={section.glow ? "relative" : ""}>
            {section.glow && !collapsed && (
              <div className="absolute inset-0 rounded-xl bg-accent/5 glow-accent pointer-events-none" />
            )}
            {section.label && !collapsed && (
              <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-semibold px-3 mb-1">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = location.pathname === item.url && item.title === "Dashboard" 
                    ? location.pathname === "/dashboard" 
                    : location.pathname === item.url && item.url !== "/dashboard";
                  const isActive = item.url === "/dashboard" && item.title === "Dashboard" && location.pathname === "/dashboard"
                    || item.url === "/students" && location.pathname.startsWith("/students");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end
                          className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-primary/10 text-primary glow-primary"
                              : item.highlight
                              ? "text-accent hover:text-accent hover:bg-accent/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          }`}
                          activeClassName=""
                        >
                          <item.icon className={`w-[18px] h-[18px] shrink-0 ${item.highlight ? "text-accent" : ""}`} />
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
