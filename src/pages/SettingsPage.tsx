import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Moon, Bell, Shield, Database } from "lucide-react";

const settingsSections = [
  {
    icon: Moon,
    title: "Appearance",
    description: "Theme, display density, and visual preferences",
    options: ["Dark mode (active)", "Compact layout", "Animations enabled"],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure alerts and notification preferences",
    options: ["Email alerts", "Push notifications", "Weekly summary"],
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Account security and data privacy settings",
    options: ["Two-factor authentication", "Login history", "Data export"],
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Backup, export, and data retention settings",
    options: ["Auto backup (daily)", "Data retention: 2 years", "Export format: CSV"],
  },
];

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your preferences and configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {settingsSections.map((section, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:scale-[1.01] transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
              </div>
              <div className="space-y-3">
                {section.options.map((option, j) => (
                  <div key={j} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                    <span className="text-sm text-foreground/80">{option}</span>
                    <div className="w-9 h-5 rounded-full bg-primary/30 flex items-center px-0.5">
                      <div className="w-4 h-4 rounded-full bg-primary ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
