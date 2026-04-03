import { useState, useEffect, useCallback } from "react";
import {
  Bell, AlertTriangle, TrendingUp, CalendarCheck, FileText,
  Sparkles, Clock, CheckCheck, BellOff, X, Info,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type NotifType = "alert" | "info" | "success" | "warning" | "ai";

interface Notification {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  detail: string;
  time: string;
  type: NotifType;
  color: string;
  bg: string;
}

const NOTIF_READ_KEY = "nexora_notif_read";

const ALL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    icon: AlertTriangle,
    title: "Risk Alert",
    message: "Vikram Singh's attendance dropped below 60%",
    detail: "Vikram Singh (Class 10B) has recorded an attendance of 58% this term, which is below the minimum threshold of 60%. Immediate intervention is recommended — consider scheduling a parent-teacher meeting and enrolling him in the catch-up program.",
    time: "5 min ago",
    type: "alert",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    id: "2",
    icon: TrendingUp,
    title: "Performance Update",
    message: "Class 10A average improved by 8% this month",
    detail: "Class 10A has shown significant improvement with an average score increase from 71% to 79% compared to last month. Top performers include Rahul Kumar (88%) and Kavita Reddy (68%). The upward trend aligns with the new AI-guided study plan introduced four weeks ago.",
    time: "1 hr ago",
    type: "success",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    id: "3",
    icon: CalendarCheck,
    title: "Attendance Marked",
    message: "All classes attendance recorded for today",
    detail: "Attendance has been successfully recorded for all 6 classes (9A, 9B, 10A, 10B, 11A, 12A) for today. Total present: 178 out of 190 students. Overall today's attendance rate stands at 93.7%. Three students are marked absent across multiple classes — follow-up required.",
    time: "2 hrs ago",
    type: "info",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "4",
    icon: FileText,
    title: "Report Ready",
    message: "Term 1 Performance Report has been generated",
    detail: "The Term 1 Performance Report is now available. It covers all 190 students across 6 classes, includes subject-wise breakdowns, attendance summaries, AI risk scores, and teacher evaluations. You can download the report from the Reports section.",
    time: "3 hrs ago",
    type: "info",
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    id: "5",
    icon: AlertTriangle,
    title: "Fee Reminder",
    message: "8 students have unpaid fees for this quarter",
    detail: "8 students have outstanding fee payments for Q2. Total amount due: ₹24,000. Students: Priya Sharma, Vikram Singh, Rohan Mehta, and 5 others. Payment deadline is end of this month. Automated reminders have been sent to their registered parent contacts.",
    time: "1 day ago",
    type: "warning",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    id: "6",
    icon: Sparkles,
    title: "AI Insight",
    message: "New predictions available for at-risk students",
    detail: "The AI model has generated updated risk predictions for the current term. 3 students have been newly flagged as High Risk based on declining attendance and marks trends. Additionally, 2 previously at-risk students have improved to Medium Risk. Visit the AI Insights page to review all predictions and recommended actions.",
    time: "2 days ago",
    type: "ai",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

function loadReadIds(): Set<string> {
  try {
    const stored = localStorage.getItem(NOTIF_READ_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {}
  return new Set();
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(Array.from(ids)));
}

const typeIcon: Record<NotifType, React.ReactNode> = {
  alert: <AlertTriangle className="w-5 h-5 text-destructive" />,
  info: <Info className="w-5 h-5 text-primary" />,
  success: <TrendingUp className="w-5 h-5 text-success" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" />,
  ai: <Sparkles className="w-5 h-5 text-accent" />,
};

const NotificationPanel = () => {
  const [readIds, setReadIds] = useState<Set<string>>(loadReadIds);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  const unreadCount = ALL_NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length;

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    const all = new Set(ALL_NOTIFICATIONS.map((n) => n.id));
    setReadIds(all);
    saveReadIds(all);
  }, []);

  const handleNotifClick = (n: Notification) => {
    markRead(n.id);
    setSelectedNotif(n);
    setPanelOpen(false);
  };

  const handleToggleRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveReadIds(next);
      return next;
    });
  };

  return (
    <>
      {/* Bell Popover */}
      <Popover open={panelOpen} onOpenChange={setPanelOpen}>
        <PopoverTrigger asChild>
          <button
            data-testid="button-notifications"
            className="relative p-2 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          >
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
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span
                  data-testid="badge-unread-count"
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary"
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                data-testid="button-mark-all-read"
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

          {/* List */}
          <ScrollArea className="max-h-[420px]">
            {ALL_NOTIFICATIONS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BellOff className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">You're all caught up!</p>
                <p className="text-xs opacity-60 mt-1">No new notifications</p>
              </div>
            ) : (
              <div className="py-1">
                {ALL_NOTIFICATIONS.map((n) => {
                  const isRead = readIds.has(n.id);
                  return (
                    <div
                      key={n.id}
                      data-testid={`notification-item-${n.id}`}
                      onClick={() => handleNotifClick(n)}
                      className={`group flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-all duration-200 hover:bg-secondary/40 active:scale-[0.99] ${
                        !isRead ? "bg-primary/[0.03]" : ""
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <n.icon className={`w-4 h-4 ${n.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground truncate">{n.title}</span>
                          {!isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground/60">
                          <Clock className="w-2.5 h-2.5" />
                          {n.time}
                        </div>
                      </div>

                      {/* Toggle read button */}
                      <button
                        data-testid={`button-toggle-read-${n.id}`}
                        onClick={(e) => handleToggleRead(e, n.id)}
                        title={isRead ? "Mark as unread" : "Mark as read"}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                      >
                        {isRead ? (
                          <Bell className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCheck className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border/30 px-5 py-3 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/60">
              {unreadCount === 0 ? "All caught up" : `${unreadCount} unread`}
            </span>
            <span className="text-[10px] text-muted-foreground/40">Click to open · Hover to mark</span>
          </div>
        </PopoverContent>
      </Popover>

      {/* Detail Modal */}
      <Dialog open={!!selectedNotif} onOpenChange={(open) => { if (!open) setSelectedNotif(null); }}>
        {selectedNotif && (
          <DialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3)] max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-foreground">
                <div className={`w-9 h-9 rounded-xl ${selectedNotif.bg} flex items-center justify-center shrink-0`}>
                  <selectedNotif.icon className={`w-4.5 h-4.5 ${selectedNotif.color}`} />
                </div>
                <span>{selectedNotif.title}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-1">
              {/* Type icon in header area */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  {typeIcon[selectedNotif.type]}
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {selectedNotif.message}
                </p>
              </div>

              {/* Full detail */}
              <div className="rounded-xl bg-secondary/40 border border-border/30 px-4 py-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedNotif.detail}
                </p>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedNotif.time}</span>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-semibold">
                  Read
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                data-testid="button-close-notif-modal"
                variant="ghost"
                onClick={() => setSelectedNotif(null)}
                className="rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1.5" />
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default NotificationPanel;
