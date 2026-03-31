import { useState } from "react";
import { Bell, AlertTriangle, TrendingUp, CalendarCheck, FileText, Sparkles, Clock, Check, CheckCheck, BellOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  time: string;
  color: string;
  bg: string;
  unread: boolean;
}

const initialNotifications: Notification[] = [
  { id: "1", icon: AlertTriangle, title: "Risk Alert", message: "Vikram Singh's attendance dropped below 60%", time: "5 min ago", color: "text-destructive", bg: "bg-destructive/10", unread: true },
  { id: "2", icon: TrendingUp, title: "Performance Update", message: "Class 10A average improved by 8% this month", time: "1 hr ago", color: "text-success", bg: "bg-success/10", unread: true },
  { id: "3", icon: CalendarCheck, title: "Attendance Marked", message: "All classes attendance recorded for today", time: "2 hrs ago", color: "text-primary", bg: "bg-primary/10", unread: true },
  { id: "4", icon: FileText, title: "Report Ready", message: "Term 1 Performance Report has been generated", time: "3 hrs ago", color: "text-info", bg: "bg-info/10", unread: false },
  { id: "5", icon: AlertTriangle, title: "Fee Reminder", message: "8 students have unpaid fees for this quarter", time: "1 day ago", color: "text-warning", bg: "bg-warning/10", unread: false },
  { id: "6", icon: Sparkles, title: "AI Insight", message: "New predictions available for at-risk students", time: "2 days ago", color: "text-accent", bg: "bg-accent/10", unread: false },
];

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1 animate-pulse-glow">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="h-7 text-xs text-muted-foreground hover:text-primary px-2"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification list */}
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BellOff className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">You're all caught up!</p>
              <p className="text-xs opacity-60 mt-1">No new notifications</p>
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => toggleRead(n.id)}
                  className={`group flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-all duration-200 hover:bg-secondary/40 ${
                    n.unread ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <n.icon className={`w-4 h-4 ${n.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">{n.title}</span>
                      {n.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground/60">
                      <Clock className="w-2.5 h-2.5" />
                      {n.time}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-secondary/60 text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                    title={n.unread ? "Mark as read" : "Mark as unread"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPanel;
