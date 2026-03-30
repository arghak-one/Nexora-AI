import { AlertTriangle, TrendingUp, Target, Sparkles } from "lucide-react";

const insights = [
  {
    icon: AlertTriangle,
    title: "Student at Risk",
    description: "3 students flagged due to low attendance (<60%) in the last 2 weeks",
    variant: "destructive" as const,
  },
  {
    icon: TrendingUp,
    title: "Performance Improving",
    description: "Overall class average improved by 8% compared to last month",
    variant: "success" as const,
  },
  {
    icon: Target,
    title: "Focus on Weak Subjects",
    description: "Physics needs attention — 40% of students scored below passing marks",
    variant: "primary" as const,
  },
];

const variantStyles = {
  destructive: "border-destructive/30 bg-destructive/5",
  success: "border-success/30 bg-success/5",
  primary: "border-primary/30 bg-primary/5",
};

const iconStyles = {
  destructive: "text-destructive bg-destructive/10",
  success: "text-success bg-success/10",
  primary: "text-primary bg-primary/10",
};

const AIInsights = () => {
  return (
    <div className="glass rounded-2xl p-5 glow-accent">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="text-base font-semibold text-foreground">AI Insights</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Powered by EduAI Intelligence</p>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${variantStyles[insight.variant]} transition-all duration-200 hover:scale-[1.01]`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconStyles[insight.variant]}`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
