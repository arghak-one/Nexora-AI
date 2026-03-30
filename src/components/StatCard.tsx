import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  glowClass?: string;
  gradientClass?: string;
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendUp, glowClass = "glow-primary", gradientClass = "gradient-primary" }: StatCardProps) => {
  return (
    <div className={`glass rounded-2xl p-5 ${glowClass} hover:scale-[1.02] transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${gradientClass} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${trendUp ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
