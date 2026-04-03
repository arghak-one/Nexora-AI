import DashboardLayout from "@/components/DashboardLayout";
import { Sparkles, AlertTriangle, TrendingUp, Target, Lightbulb, Brain } from "lucide-react";
import { useState } from "react";
import { InsightDetailModal, InsightData } from "@/components/InsightDetailModal";

const allInsights: InsightData[] = [
  { icon: AlertTriangle, title: "Student at Risk", description: "Vikram Singh (10B) — attendance dropped to 58%, marks declining in Physics & Chemistry. Immediate intervention recommended.", variant: "destructive", type: "risk" },
  { icon: AlertTriangle, title: "Attendance Alert", description: "Priya Sharma (10A) — 3 consecutive absences this week. Parent notification triggered.", variant: "destructive", type: "attendance" },
  { icon: TrendingUp, title: "Performance Improving", description: "Class 10A overall average improved by 8% compared to last month. Mathematics showing strongest gains.", variant: "success", type: "improvement" },
  { icon: TrendingUp, title: "Rising Star", description: "Amit Patel (10B) — AI score improved from 6.2 to 7.9 in the last 30 days. Positive trajectory.", variant: "success", type: "rising" },
  { icon: Target, title: "Focus Area: Physics", description: "40% of Class 10B students scored below passing marks in Physics. Consider additional support sessions.", variant: "primary", type: "focus" },
  { icon: Lightbulb, title: "Smart Suggestion", description: "Based on learning patterns, recommend adaptive practice tests for students scoring 60-75% to maximize improvement.", variant: "accent", type: "suggestion" },
  { icon: Brain, title: "Predictive Alert", description: "AI model predicts 5 students at risk of failing Term 2 if current trends continue. Early intervention recommended.", variant: "accent", type: "prediction" },
];

const variantStyles = {
  destructive: "border-destructive/30 bg-destructive/5",
  success: "border-success/30 bg-success/5",
  primary: "border-primary/30 bg-primary/5",
  accent: "border-accent/30 bg-accent/5",
};

const iconStyles = {
  destructive: "text-destructive bg-destructive/10",
  success: "text-success bg-success/10",
  primary: "text-primary bg-primary/10",
  accent: "text-accent bg-accent/10",
};

const AIInsightsPage = () => {
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInsightClick = (insight: InsightData) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center glow-accent">
            <Sparkles className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
            <p className="text-sm text-muted-foreground">Powered by EduAI Intelligence Engine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {allInsights.map((insight, i) => (
            <div
              key={i}
              onClick={() => handleInsightClick(insight)}
              className={`glass rounded-2xl p-5 border ${variantStyles[insight.variant]} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer relative group`}
            >
              <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="flex items-start gap-4 pointer-events-none">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconStyles[insight.variant]}`}>
                  <insight.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{insight.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <InsightDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        insight={selectedInsight}
      />
    </DashboardLayout>
  );
};

export default AIInsightsPage;
