import { useMemo, useState } from "react";
import { AlertTriangle, TrendingUp, Target, Lightbulb, Sparkles, Brain, DollarSign, CalendarCheck } from "lucide-react";
import { store } from "@/lib/store";
import { InsightDetailModal, InsightData } from "./InsightDetailModal";

// ─── Generate insights from live data ────────────────────────────────────────
function generateInsights(): InsightData[] {
  const students = store.getStudents();
  const results  = store.getResults();
  const fees     = store.getStudentFees ? store.getStudentFees() : [];

  const insights: InsightData[] = [];

  // 1. High-risk students
  const highRisk = students.filter((s) => s.risk === "High");
  if (highRisk.length > 0) {
    insights.push({
      icon: AlertTriangle,
      title: "Students at Risk",
      description: `${highRisk.length} student${highRisk.length > 1 ? "s are" : " is"} flagged as High Risk due to low attendance or poor marks. Immediate intervention recommended.`,
      variant: "destructive",
      type: "risk",
    });
  }

  // 2. Low attendance students (<75%)
  const lowAtt = students.filter((s) => (s.attendance ?? 100) < 75);
  if (lowAtt.length > 0) {
    insights.push({
      icon: CalendarCheck,
      title: "Attendance Alert",
      description: `${lowAtt.length} student${lowAtt.length > 1 ? "s have" : " has"} attendance below 75%. Contact parents and schedule counselling sessions.`,
      variant: "destructive",
      type: "risk",
    });
  }

  // 3. Performance trend — pass rate
  const passRate = results.length
    ? Math.round(results.filter((r) => r.status === "Pass").length / results.length * 100)
    : null;
  if (passRate !== null) {
    const isGood = passRate >= 75;
    insights.push({
      icon: TrendingUp,
      title: isGood ? "Strong Pass Rate" : "Pass Rate Needs Attention",
      description: `Overall pass rate is ${passRate}%. ${isGood ? "Class is performing well across subjects." : "Consider revision sessions for underperforming students."}`,
      variant: isGood ? "success" : "primary",
      type: "improvement",
    });
  }

  // 4. Weakest subject
  const subjectGroups: Record<string, number[]> = {};
  results.forEach((r) => {
    if (!subjectGroups[r.subject]) subjectGroups[r.subject] = [];
    subjectGroups[r.subject].push(r.percentage);
  });
  const subjectAvgs = Object.entries(subjectGroups).map(([sub, pcts]) => ({
    sub, avg: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
  }));
  if (subjectAvgs.length > 0) {
    const weakest = subjectAvgs.sort((a, b) => a.avg - b.avg)[0];
    insights.push({
      icon: Target,
      title: "Focus: Weakest Subject",
      description: `${weakest.sub} has the lowest average at ${weakest.avg}%. Schedule extra classes or provide targeted study material.`,
      variant: weakest.avg < 50 ? "destructive" : "primary",
      type: "focus",
    });
  }

  // 5. Unpaid fees
  const unpaid = fees.filter((f: any) => f.status === "Unpaid").length;
  if (unpaid > 0) {
    insights.push({
      icon: DollarSign,
      title: "Fee Collection Pending",
      description: `${unpaid} student${unpaid > 1 ? "s have" : " has"} unpaid fees. Send reminders or schedule a parent meeting.`,
      variant: "accent",
      type: "suggestion",
    });
  }

  // 6. Top performers suggestion
  const topPerformers = students.filter((s) => (s.aiScore ?? 0) >= 9);
  if (topPerformers.length > 0) {
    insights.push({
      icon: Brain,
      title: "Top Performers Identified",
      description: `${topPerformers.length} student${topPerformers.length > 1 ? "s have" : " has"} an AI Score ≥ 9.0. Consider advanced modules or recognition programs to keep them motivated.`,
      variant: "success",
      type: "improvement",
    });
  }

  // 7. Generic smart suggestion (always show)
  insights.push({
    icon: Lightbulb,
    title: "Smart Suggestion",
    description: "Students scoring 55–70% often improve fastest with targeted 2-week revision sprints. Consider personalised practice tests for this group.",
    variant: "accent",
    type: "suggestion",
  });

  return insights.slice(0, 5); // max 5 insights
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const variantStyles = {
  destructive: "border-destructive/30 bg-destructive/5",
  success:     "border-success/30 bg-success/5",
  primary:     "border-primary/30 bg-primary/5",
  accent:      "border-accent/30 bg-accent/5",
};

const iconStyles = {
  destructive: "text-destructive bg-destructive/10",
  success:     "text-success bg-success/10",
  primary:     "text-primary bg-primary/10",
  accent:      "text-accent bg-accent/10",
};

// ─── Component ────────────────────────────────────────────────────────────────
const AIInsights = () => {
  const insights = useMemo(() => generateInsights(), []);
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (insight: InsightData) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  return (
    <div className="glass rounded-2xl p-5 glow-accent">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="text-base font-semibold text-foreground">AI Insights</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Smart insights generated from live student, result &amp; fee data
      </p>

      <div className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div
              key={i}
              onClick={() => handleClick(insight)}
              className={`p-3 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all duration-200 ${variantStyles[insight.variant]}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${iconStyles[insight.variant]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedInsight && (
        <InsightDetailModal
          insight={selectedInsight}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AIInsights;
