import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Database, Download, Loader2, Moon, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  applySettingsGlobally,
  type AppSettings,
  getCurrentUserId,
  getSettings,
  type SettingsPatch,
  updateSettings,
} from "@/lib/settings";
import { store } from "@/lib/store";

type SettingKey =
  | "darkMode"
  | "compactLayout"
  | "animationsEnabled"
  | "emailAlerts"
  | "pushNotifications"
  | "weeklySummary"
  | "twoFactorAuth"
  | "loginHistoryVisible"
  | "dataExportEnabled"
  | "autoBackup"
  | "dataRetentionYears"
  | "exportFormat";

const retentionOptions = [1, 2, 3, 5];
const sampleLoginHistory = [
  { id: "lh1", location: "Kolkata, India", ip: "103.91.12.77", at: "2026-04-07 09:10" },
  { id: "lh2", location: "Bengaluru, India", ip: "49.37.112.20", at: "2026-04-05 22:46" },
  { id: "lh3", location: "Mumbai, India", ip: "122.161.4.12", at: "2026-04-03 08:11" },
];

function mergeOptimistic(current: AppSettings, patch: SettingsPatch): AppSettings {
  return {
    ...current,
    appearance: { ...current.appearance, ...patch.appearance },
    notifications: { ...current.notifications, ...patch.notifications },
    privacySecurity: { ...current.privacySecurity, ...patch.privacySecurity },
    dataManagement: { ...current.dataManagement, ...patch.dataManagement },
    updatedAt: new Date().toISOString(),
  };
}

function toSettingsCsv(settings: AppSettings) {
  const rows: string[] = ["key,value"];
  rows.push(`userId,${settings.userId}`);
  rows.push(`updatedAt,${settings.updatedAt}`);
  rows.push(`appearance.darkMode,${settings.appearance.darkMode}`);
  rows.push(`appearance.compactLayout,${settings.appearance.compactLayout}`);
  rows.push(`appearance.animationsEnabled,${settings.appearance.animationsEnabled}`);
  rows.push(`notifications.emailAlerts,${settings.notifications.emailAlerts}`);
  rows.push(`notifications.pushNotifications,${settings.notifications.pushNotifications}`);
  rows.push(`notifications.weeklySummary,${settings.notifications.weeklySummary}`);
  rows.push(`privacySecurity.twoFactorAuth,${settings.privacySecurity.twoFactorAuth}`);
  rows.push(`privacySecurity.loginHistoryVisible,${settings.privacySecurity.loginHistoryVisible}`);
  rows.push(`privacySecurity.dataExportEnabled,${settings.privacySecurity.dataExportEnabled}`);
  rows.push(`dataManagement.autoBackup,${settings.dataManagement.autoBackup}`);
  rows.push(`dataManagement.dataRetentionYears,${settings.dataManagement.dataRetentionYears}`);
  rows.push(`dataManagement.exportFormat,${settings.dataManagement.exportFormat}`);
  return rows.join("\n");
}

function saveFile(contents: string, fileName: string, mimeType: string) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

interface RowProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  saving: boolean;
  onChange: (value: boolean) => void;
}

const ToggleRow = ({ title, description, checked, disabled, saving, onChange }: RowProps) => (
  <div className="compact-row flex items-center justify-between p-3 rounded-xl bg-secondary/30 gap-3">
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <div className="flex items-center gap-2">
      {saving ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : null}
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  </div>
);

const SettingsPage = () => {
  const userId = useMemo(() => getCurrentUserId(), []);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<SettingKey | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const loaded = await getSettings(userId);
        if (!mounted) return;
        setSettings(loaded);
        applySettingsGlobally(loaded);
      } catch {
        toast({ title: "Error", description: "Unable to load settings.", variant: "destructive" });
      } finally {
        if (mounted) setInitialLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const persist = async (key: SettingKey, patch: SettingsPatch, successTitle = "Settings updated") => {
    if (!settings) return;

    const previous = settings;
    const optimistic = mergeOptimistic(previous, patch);
    setSettings(optimistic);
    applySettingsGlobally(optimistic);
    setSavingKey(key);

    try {
      const saved = await updateSettings(userId, patch);
      setSettings(saved);
      applySettingsGlobally(saved);
      toast({ title: successTitle, description: "Preference saved successfully." });
    } catch {
      setSettings(previous);
      applySettingsGlobally(previous);
      toast({ title: "Save failed", description: "Your last change could not be saved.", variant: "destructive" });
    } finally {
      setSavingKey(null);
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled && typeof Notification === "undefined") {
      toast({ title: "Not supported", description: "Browser push notifications are not available.", variant: "destructive" });
      return;
    }

    if (enabled && Notification.permission !== "granted") {
      if (Notification.permission === "denied") {
        toast({ title: "Permission blocked", description: "Allow notifications in browser settings first.", variant: "destructive" });
        return;
      }
      const result = await Notification.requestPermission();
      if (result !== "granted") {
        toast({ title: "Permission required", description: "Push notifications were not enabled.", variant: "destructive" });
        return;
      }
    }

    await persist("pushNotifications", { notifications: { pushNotifications: enabled } }, enabled ? "Push enabled" : "Push disabled");
  };

  const handleExport = async () => {
    if (!settings) return;
    setExporting(true);

    try {
      const fileDate = new Date().toISOString().slice(0, 10);
      if (settings.dataManagement.exportFormat === "json") {
        const payload = {
          exportedAt: new Date().toISOString(),
          settings,
          dataCounts: {
            students: store.getStudents().length,
            teachers: store.getTeachers().length,
            parents: store.getParents().length,
            classes: store.getClasses().length,
            reports: store.getReports().length,
          },
        };
        saveFile(JSON.stringify(payload, null, 2), `nexora-settings-${fileDate}.json`, "application/json");
      } else {
        const csv = toSettingsCsv(settings);
        saveFile(csv, `nexora-settings-${fileDate}.csv`, "text/csv;charset=utf-8;");
      }
      toast({ title: "Export complete", description: "Settings export has been downloaded." });
    } catch {
      toast({ title: "Export failed", description: "Unable to generate export file.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  if (initialLoading || !settings) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading settings...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 compact-page animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage system behavior and user preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="glass compact-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Appearance</h3>
                <p className="text-xs text-muted-foreground">Theme, density, and animation controls</p>
              </div>
            </div>
            <div className="space-y-3">
              <ToggleRow
                title="Dark Mode"
                description="Switch instantly between light and dark themes."
                checked={settings.appearance.darkMode}
                saving={savingKey === "darkMode"}
                onChange={(value) => void persist("darkMode", { appearance: { darkMode: value } }, "Theme updated")}
              />
              <ToggleRow
                title="Compact Layout"
                description="Reduce spacing and card padding across the dashboard."
                checked={settings.appearance.compactLayout}
                saving={savingKey === "compactLayout"}
                onChange={(value) => void persist("compactLayout", { appearance: { compactLayout: value } })}
              />
              <ToggleRow
                title="Animations"
                description="Enable or disable transitions and motion globally."
                checked={settings.appearance.animationsEnabled}
                saving={savingKey === "animationsEnabled"}
                onChange={(value) => void persist("animationsEnabled", { appearance: { animationsEnabled: value } })}
              />
            </div>
          </section>

          <section className="glass compact-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">Alert channels and report preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <ToggleRow
                title="Email Alerts"
                description="Store backend preference for email notifications."
                checked={settings.notifications.emailAlerts}
                saving={savingKey === "emailAlerts"}
                onChange={(value) => void persist("emailAlerts", { notifications: { emailAlerts: value } })}
              />
              <ToggleRow
                title="Push Notifications"
                description="Enable browser-level push notifications if supported."
                checked={settings.notifications.pushNotifications}
                saving={savingKey === "pushNotifications"}
                onChange={(value) => void handlePushToggle(value)}
              />
              <ToggleRow
                title="Weekly Summary"
                description="Store weekly digest preference for scheduled reports."
                checked={settings.notifications.weeklySummary}
                saving={savingKey === "weeklySummary"}
                onChange={(value) => void persist("weeklySummary", { notifications: { weeklySummary: value } })}
              />
            </div>
          </section>

          <section className="glass compact-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Privacy & Security</h3>
                <p className="text-xs text-muted-foreground">Authentication and access visibility</p>
              </div>
            </div>
            <div className="space-y-3">
              <ToggleRow
                title="Two-Factor Authentication"
                description="Enable extra verification for account sign-ins."
                checked={settings.privacySecurity.twoFactorAuth}
                saving={savingKey === "twoFactorAuth"}
                onChange={(value) => void persist("twoFactorAuth", { privacySecurity: { twoFactorAuth: value } })}
              />
              <ToggleRow
                title="Login History"
                description="Show or hide the login history section below."
                checked={settings.privacySecurity.loginHistoryVisible}
                saving={savingKey === "loginHistoryVisible"}
                onChange={(value) => void persist("loginHistoryVisible", { privacySecurity: { loginHistoryVisible: value } })}
              />
              <ToggleRow
                title="Data Export Access"
                description="Control if the export action is available."
                checked={settings.privacySecurity.dataExportEnabled}
                saving={savingKey === "dataExportEnabled"}
                onChange={(value) => void persist("dataExportEnabled", { privacySecurity: { dataExportEnabled: value } })}
              />
            </div>

            {settings.privacySecurity.loginHistoryVisible ? (
              <div className="mt-4 p-3 rounded-xl bg-secondary/20 space-y-2">
                <p className="text-sm font-medium text-foreground">Recent Login History</p>
                {sampleLoginHistory.map((item) => (
                  <div key={item.id} className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                    <span>{item.at}</span>
                    <span>{item.location}</span>
                    <span>{item.ip}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-xl bg-secondary/20">
                <p className="text-xs text-muted-foreground">Login history is currently hidden.</p>
              </div>
            )}
          </section>

          <section className="glass compact-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Data Management</h3>
                <p className="text-xs text-muted-foreground">Backup, retention policy, and export format</p>
              </div>
            </div>
            <div className="space-y-3">
              <ToggleRow
                title="Auto Backup"
                description="Simulate backup scheduling state for this account."
                checked={settings.dataManagement.autoBackup}
                saving={savingKey === "autoBackup"}
                onChange={(value) => void persist("autoBackup", { dataManagement: { autoBackup: value } })}
              />

              <div className="compact-row p-3 rounded-xl bg-secondary/30">
                <p className="text-sm font-medium text-foreground mb-1">Data Retention</p>
                <p className="text-xs text-muted-foreground mb-2">Choose how long records should be retained.</p>
                <Select
                  value={String(settings.dataManagement.dataRetentionYears)}
                  onValueChange={(value) => void persist("dataRetentionYears", { dataManagement: { dataRetentionYears: Number(value) } })}
                >
                  <SelectTrigger className="glass border-border/50 rounded-xl h-9 w-full sm:w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {retentionOptions.map((years) => (
                      <SelectItem key={years} value={String(years)}>
                        {years} year{years > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="compact-row p-3 rounded-xl bg-secondary/30">
                <p className="text-sm font-medium text-foreground mb-1">Export Format</p>
                <p className="text-xs text-muted-foreground mb-2">Set default download format.</p>
                <Select
                  value={settings.dataManagement.exportFormat}
                  onValueChange={(value) =>
                    void persist("exportFormat", { dataManagement: { exportFormat: value as "csv" | "json" } }, "Export format updated")
                  }
                >
                  <SelectTrigger className="glass border-border/50 rounded-xl h-9 w-full sm:w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {settings.dataManagement.autoBackup ? "Auto backup active: next backup in 24 hours." : "Auto backup is paused."}
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => void handleExport()}
                disabled={!settings.privacySecurity.dataExportEnabled || exporting}
              >
                {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Export
              </Button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
