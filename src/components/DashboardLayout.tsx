import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import NotificationPanel from "@/components/NotificationPanel";
import ProfileDropdown from "@/components/ProfileDropdown";
import GlobalSearch from "@/components/GlobalSearch";
import { useEffect, useState } from "react";
import { store, useStoreUpdate } from "@/lib/store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  useStoreUpdate();
  const profile = store.getUserProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-16 compact-header flex items-center justify-between px-4 md:px-6 border-b border-border/50 glass-strong sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-foreground">Welcome back, <span className="text-gradient">{mounted ? profile.name.split(' ')[0] : '...'}</span></h2>
                <p className="text-xs text-muted-foreground hidden sm:block">Here's what's happening today.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GlobalSearch />
              <NotificationPanel />
              <ProfileDropdown />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 compact-main gradient-bg overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
