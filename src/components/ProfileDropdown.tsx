import { User, Settings, LogOut } from "lucide-react";
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
        <button className="relative group rounded-xl focus:outline-none">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/40 to-accent/30 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
          <div className="relative w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-foreground font-semibold text-sm ring-1 ring-border/30 group-hover:ring-primary/40 transition-all duration-200">
            A
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)] p-0 overflow-hidden"
      >
        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border/30">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-foreground font-bold text-sm shrink-0">
            A
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
            className="mx-1.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-secondary/50"
          >
            <User className="w-4 h-4 mr-2.5" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/settings")}
            className="mx-1.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-secondary/50"
          >
            <Settings className="w-4 h-4 mr-2.5" />
            Settings
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-border/30 mx-3" />

        <div className="py-1.5">
          <DropdownMenuItem
            onClick={() => navigate("/")}
            className="mx-1.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2.5" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
