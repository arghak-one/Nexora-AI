import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import NotificationPanel from "@/components/NotificationPanel";
import ProfileDropdown from "@/components/ProfileDropdown";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/50 glass-strong sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-foreground">Welcome back, <span className="text-gradient">Argha</span></h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="w-64 pl-9 h-9 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground text-sm focus:border-primary/50"
                />
              </div>
              <NotificationPanel />
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-foreground font-semibold text-sm">
                A
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 gradient-bg overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
