export type ExportFormat = "csv" | "json";

export interface AppSettings {
  appearance: {
    darkMode: boolean;
    compactLayout: boolean;
    animationsEnabled: boolean;
  };
  notifications: {
    emailAlerts: boolean;
    pushNotifications: boolean;
    weeklySummary: boolean;
  };
  privacySecurity: {
    twoFactorAuth: boolean;
    loginHistoryVisible: boolean;
    dataExportEnabled: boolean;
  };
  dataManagement: {
    autoBackup: boolean;
    dataRetentionYears: number;
    exportFormat: ExportFormat;
  };
  userId: string;
  updatedAt: string;
}

type SettingsPatch = Partial<{
  appearance: Partial<AppSettings["appearance"]>;
  notifications: Partial<AppSettings["notifications"]>;
  privacySecurity: Partial<AppSettings["privacySecurity"]>;
  dataManagement: Partial<AppSettings["dataManagement"]>;
}>;

interface SettingsDb {
  [userId: string]: AppSettings;
}

const SETTINGS_STORAGE_KEY = "nexora_settings_db";
const DEFAULT_USER_ID = "admin@nexora.local";
const SETTINGS_UPDATE_EVENT = "nexora_settings_updated";

const defaultSettingsByUser = (userId: string): AppSettings => ({
  appearance: {
    darkMode: true,
    compactLayout: false,
    animationsEnabled: true,
  },
  notifications: {
    emailAlerts: true,
    pushNotifications: false,
    weeklySummary: true,
  },
  privacySecurity: {
    twoFactorAuth: false,
    loginHistoryVisible: true,
    dataExportEnabled: true,
  },
  dataManagement: {
    autoBackup: true,
    dataRetentionYears: 2,
    exportFormat: "csv",
  },
  userId,
  updatedAt: new Date().toISOString(),
});

function readSettingsDb(): SettingsDb {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SettingsDb;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  return {};
}

function writeSettingsDb(db: SettingsDb) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(db));
}

function resolveSettingsUserId(): string {
  try {
    const rawProfile = localStorage.getItem("userProfile");
    if (rawProfile) {
      const profile = JSON.parse(rawProfile) as { email?: string };
      const email = profile?.email?.trim().toLowerCase();
      if (email) return email;
    }
  } catch {}
  return DEFAULT_USER_ID;
}

function mergeSettings(current: AppSettings, patch: SettingsPatch, userId: string): AppSettings {
  return {
    ...current,
    appearance: { ...current.appearance, ...patch.appearance },
    notifications: { ...current.notifications, ...patch.notifications },
    privacySecurity: { ...current.privacySecurity, ...patch.privacySecurity },
    dataManagement: { ...current.dataManagement, ...patch.dataManagement },
    userId,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeSettings(value: AppSettings | undefined, userId: string): AppSettings {
  const defaults = defaultSettingsByUser(userId);
  if (!value) return defaults;
  return mergeSettings(defaults, value, userId);
}

function notifySettingsUpdated(settings: AppSettings) {
  window.dispatchEvent(
    new CustomEvent(SETTINGS_UPDATE_EVENT, {
      detail: settings,
    }),
  );
}

function applyTheme(darkMode: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", darkMode);
}

function applyCompactLayout(compactLayout: boolean) {
  document.body.classList.toggle("compact-layout", compactLayout);
}

function applyAnimations(animationsEnabled: boolean) {
  document.body.classList.toggle("reduce-animations", !animationsEnabled);
}

export function applySettingsGlobally(settings: AppSettings) {
  applyTheme(settings.appearance.darkMode);
  applyCompactLayout(settings.appearance.compactLayout);
  applyAnimations(settings.appearance.animationsEnabled);
  notifySettingsUpdated(settings);
}

export function getCurrentUserId() {
  return resolveSettingsUserId();
}

export function applyStoredSettingsOnBoot(userId: string = resolveSettingsUserId()) {
  const db = readSettingsDb();
  const normalized = normalizeSettings(db[userId], userId);
  if (!db[userId]) {
    db[userId] = normalized;
    writeSettingsDb(db);
  }
  applySettingsGlobally(normalized);
  return normalized;
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// GET /settings
export async function getSettings(userId: string = resolveSettingsUserId()): Promise<AppSettings> {
  await wait(120);
  const db = readSettingsDb();
  const normalized = normalizeSettings(db[userId], userId);
  if (!db[userId]) {
    db[userId] = normalized;
    writeSettingsDb(db);
  }
  return normalized;
}

// POST /settings/update
export async function updateSettings(
  userId: string = resolveSettingsUserId(),
  patch: SettingsPatch,
): Promise<AppSettings> {
  await wait(220);
  const db = readSettingsDb();
  const current = normalizeSettings(db[userId], userId);
  const next = mergeSettings(current, patch, userId);
  db[userId] = next;
  writeSettingsDb(db);
  return next;
}

export { SETTINGS_UPDATE_EVENT };
export type { SettingsPatch };
