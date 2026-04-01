import { User, Settings, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProfileDropdown = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative group rounded-xl focus:outline-none transition-transform duration-200 active:scale-95">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/50 to-accent/40 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 group-hover:scale-110" />
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="relative w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-foreground font-semibold text-sm ring-1 ring-border/30 group-hover:ring-primary/60 transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
            A
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl border-border/40 bg-card/95 backdrop-blur-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3),0_0_0_1px_hsl(var(--border)/0.1)] p-0 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
      >
        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="relative group/avatar">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/40 to-accent/30 blur-sm opacity-60" />
            <div className="relative w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-foreground font-bold text-sm shrink-0 ring-1 ring-primary/20">
              A
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Argha Mukherjee</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="py-1.5">
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="group/item mx-1.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-primary/10 hover:bg-primary/10 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center mr-2.5 transition-colors duration-200">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            View Profile
            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 -translate-x-1 group-hover/item:opacity-50 group-hover/item:translate-x-0 transition-all duration-200" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/settings")}
            className="group/item mx-1.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-primary/10 hover:bg-primary/10 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center mr-2.5 transition-colors duration-200">
              <Settings className="w-3.5 h-3.5 text-primary group-hover/item:rotate-90 transition-transform duration-300" />
            </div>
            Settings
            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 -translate-x-1 group-hover/item:opacity-50 group-hover/item:translate-x-0 transition-all duration-200" />
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-border/20 mx-3" />

        <div className="py-1.5">
          <DropdownMenuItem
            onClick={() => navigate("/")}
            className="group/item mx-1.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-destructive/80 hover:text-destructive focus:text-destructive focus:bg-destructive/10 hover:bg-destructive/10 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-destructive/10 group-hover/item:bg-destructive/20 flex items-center justify-center mr-2.5 transition-colors duration-200">
              <LogOut className="w-3.5 h-3.5 text-destructive group-hover/item:-translate-x-0.5 transition-transform duration-200" />
            </div>
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
