import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell, AlertTriangle, TrendingUp, CalendarCheck, FileText,
  Sparkles, Clock, CheckCheck, BellOff, X, Info, Trash2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type NotifType = "alert" | "info" | "success" | "warning" | "ai";

interface StoredNotification {
  id: string;
  title: string;
  message: string;
  detail: string;
  time: string;
  type: NotifType;
  createdAt: number;
  isRead: boolean;
}

const STORAGE_KEY = "nexora_notifications";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const now = Date.now();

const SEED_NOTIFICATIONS: StoredNotification[] = [
  {
    id: "seed-1",
    title: "Risk Alert",
    message: "Vikram Singh's attendance dropped below 60%",
    detail: "Vikram Singh (Class 10B) has recorded an attendance of 58% this term, which is below the minimum threshold of 60%. Immediate intervention is recommended — consider scheduling a parent-teacher meeting and enrolling him in the catch-up program.",
    time: "5 min ago",
    type: "alert",
    createdAt: now - 5 * 60 * 1000,
    isRead: false,
  },
  {
    id: "seed-2",
    title: "Performance Update",
    message: "Class 10A average improved by 8% this month",
    detail: "Class 10A has shown significant improvement with an average score increase from 71% to 79% compared to last month. Top performers include Rahul Kumar (88%) and Kavita Reddy (68%). The upward trend aligns with the new AI-guided study plan introduced four weeks ago.",
    time: "1 hr ago",
    type: "success",
    createdAt: now - 60 * 60 * 1000,
    isRead: false,
  },
  {
    id: "seed-3",
    title: "Attendance Marked",
    message: "All classes attendance recorded for today",
    detail: "Attendance has been successfully recorded for all 6 classes (9A, 9B, 10A, 10B, 11A, 12A) for today. Total present: 178 out of 190 students. Overall today's attendance rate stands at 93.7%. Three students are marked absent across multiple classes — follow-up required.",
    time: "2 hrs ago",
    type: "info",
    createdAt: now - 2 * 60 * 60 * 1000,
    isRead: false,
  },
  {
    id: "seed-4",
    title: "Report Ready",
    message: "Term 1 Performance Report has been generated",
    detail: "The Term 1 Performance Report is now available. It covers all 190 students across 6 classes, includes subject-wise breakdowns, attendance summaries, AI risk scores, and teacher evaluations. You can download the report from the Reports section.",
    time: "3 hrs ago",
    type: "info",
    createdAt: now - 3 * 60 * 60 * 1000,
    isRead: true,
  },
  {
    id: "seed-5",
    title: "Fee Reminder",
    message: "8 students have unpaid fees for this quarter",
    detail: "8 students have outstanding fee payments for Q2. Total amount due: ₹24,000. Students: Priya Sharma, Vikram Singh, Rohan Mehta, and 5 others. Payment deadline is end of this month. Automated reminders have been sent to their registered parent contacts.",
    time: "1 day ago",
    type: "warning",
    createdAt: now - 24 * 60 * 60 * 1000,
    isRead: true,
  },
  {
    id: "seed-6",
    title: "AI Insight",
    message: "New predictions available for at-risk students",
    detail: "The AI model has generated updated risk predictions for the current term. 3 students have been newly flagged as High Risk based on declining attendance and marks trends. Additionally, 2 previously at-risk students have improved to Medium Risk. Visit the AI Insights page to review all predictions and recommended actions.",
    time: "2 days ago",
    type: "ai",
    createdAt: now - 2 * 24 * 60 * 60 * 1000,
    isRead: false,
  },
];

function loadAndCleanNotifications(): StoredNotification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: StoredNotification[] = JSON.parse(stored);
      const now = Date.now();
      const valid = parsed.filter((n) => now - n.createdAt < SEVEN_DAYS_MS);
      if (valid.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
      }
      return valid;
    }
  } catch {}
  // First load — seed defaults
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOTIFICATIONS));
  return SEED_NOTIFICATIONS;
}

function saveNotifications(notifications: StoredNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

// ── Icon + style maps (derived at runtime, not stored) ──────────────────────
const typeIcon: Record<NotifType, React.ComponentType<{ className?: string }>> = {
  alert: AlertTriangle,
  info: CalendarCheck,
  success: TrendingUp,
  warning: AlertTriangle,
  ai: Sparkles,
};

const typeColor: Record<NotifType, string> = {
  alert: "text-destructive",
  info: "text-primary",
  success: "text-success",
  warning: "text-warning",
  ai: "text-accent",
};

const typeBg: Record<NotifType, string> = {
  alert: "bg-destructive/10",
  info: "bg-primary/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  ai: "bg-accent/10",
};

const typeDetailIcon: Record<NotifType, React.ReactNode> = {
  alert: <AlertTriangle className="w-5 h-5 text-destructive" />,
  info: <Info className="w-5 h-5 text-primary" />,
  success: <TrendingUp className="w-5 h-5 text-success" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" />,
  ai: <Sparkles className="w-5 h-5 text-accent" />,
};

// ── Component ────────────────────────────────────────────────────────────────
const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<StoredNotification | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const initialized = useRef(false);

  // Load & clean on mount only
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setNotifications(loadAndCleanNotifications());
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const updateNotifications = useCallback((updated: StoredNotification[]) => {
    setNotifications(updated);
    saveNotifications(updated);
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const handleToggleRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n));
      saveNotifications(updated);
      return updated;
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Animate out first
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        saveNotifications(updated);
        return updated;
      });
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      // Close modal if the deleted notif was open
      setSelectedNotif((curr) => (curr?.id === id ? null : curr));
    }, 250);
  };

  const handleNotifClick = (n: StoredNotification) => {
    markRead(n.id);
    setSelectedNotif(n);
    setPanelOpen(false);
  };

  return (
    <>
      {/* ── Bell Popover ──────────────────────────────────────────────────── */}
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
          className="w-[390px] p-0 rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)] overflow-hidden"
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
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
                <BellOff className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">You're all caught up!</p>
                <p className="text-xs opacity-60 mt-1">No notifications</p>
              </div>
            ) : (
              <div className="py-1">
                {notifications.map((n) => {
                  const isRead = n.isRead;
                  const isRemoving = removingIds.has(n.id);
                  const IconComp = typeIcon[n.type];
                  return (
                    <div
                      key={n.id}
                      data-testid={`notification-item-${n.id}`}
                      onClick={() => handleNotifClick(n)}
                      style={{
                        transition: "opacity 0.25s ease, transform 0.25s ease, max-height 0.25s ease",
                        opacity: isRemoving ? 0 : 1,
                        transform: isRemoving ? "translateY(-6px) scale(0.97)" : "none",
                        maxHeight: isRemoving ? "0px" : "200px",
                        overflow: "hidden",
                      }}
                      className={`group relative flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors duration-200 hover:bg-secondary/40 ${
                        !isRead ? "bg-primary/[0.04]" : ""
                      }`}
                    >
                      {/* Unread left border accent */}
                      {!isRead && (
                        <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-primary" />
                      )}

                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg ${typeBg[n.type]} flex items-center justify-center shrink-0 mt-0.5`}>
                        <IconComp className={`w-4 h-4 ${typeColor[n.type]}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground truncate">{n.title}</span>
                          {!isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground/50">
                          <Clock className="w-2.5 h-2.5" />
                          {n.time}
                        </div>
                      </div>

                      {/* Action buttons — appear on hover */}
                      <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 mt-0.5">
                        {/* Toggle read */}
                        <button
                          data-testid={`button-toggle-read-${n.id}`}
                          onClick={(e) => handleToggleRead(e, n.id)}
                          title={isRead ? "Mark as unread" : "Mark as read"}
                          className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isRead ? (
                            <Bell className="w-3 h-3" />
                          ) : (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </button>
                        {/* Delete */}
                        <button
                          data-testid={`button-delete-notif-${n.id}`}
                          onClick={(e) => handleDelete(e, n.id)}
                          title="Delete notification"
                          className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border/30 px-5 py-3 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/60">
              {notifications.length === 0
                ? "No notifications"
                : unreadCount === 0
                ? "All caught up"
                : `${unreadCount} unread · ${notifications.length} total`}
            </span>
            <span className="text-[10px] text-muted-foreground/40">Auto-expire: 7 days</span>
          </div>
        </PopoverContent>
      </Popover>

      {/* ── Detail Modal ──────────────────────────────────────────────────── */}
      <Dialog open={!!selectedNotif} onOpenChange={(open) => { if (!open) setSelectedNotif(null); }}>
        {selectedNotif && (() => {
          const IconComp = typeIcon[selectedNotif.type];
          return (
            <DialogContent className="glass-strong border-border/50 rounded-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3)] max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-foreground">
                  <div className={`w-9 h-9 rounded-xl ${typeBg[selectedNotif.type]} flex items-center justify-center shrink-0`}>
                    <IconComp className={`w-4 h-4 ${typeColor[selectedNotif.type]}`} />
                  </div>
                  <span>{selectedNotif.title}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-1">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0">{typeDetailIcon[selectedNotif.type]}</div>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {selectedNotif.message}
                  </p>
                </div>

                <div className="rounded-xl bg-secondary/40 border border-border/30 px-4 py-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedNotif.detail}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedNotif.time}</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-semibold">
                    Read
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  data-testid="button-delete-from-modal"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { handleDelete(e, selectedNotif.id); setSelectedNotif(null); }}
                  className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
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
          );
        })()}
      </Dialog>
    </>
  );
};

export default NotificationPanel;
