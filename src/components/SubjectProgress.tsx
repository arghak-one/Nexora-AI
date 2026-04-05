import { useMemo } from "react";
import { store } from "@/lib/store";

// ─── Color map per subject ────────────────────────────────────────────────────
const subjectColorMap: Record<string, string> = {
  Mathematics:       "bg-primary",
  Physics:           "bg-accent",
  Chemistry:         "bg-info",
  English:           "bg-success",
  "Computer Science":"bg-warning",
  Biology:           "bg-teal-400",
};

const fallbackColors = [
  "bg-primary", "bg-accent", "bg-info",
  "bg-success", "bg-warning", "bg-destructive",
];

// ─── Component ────────────────────────────────────────────────────────────────
const SubjectProgress = () => {
  const subjectData = useMemo(() => {
    const results = store.getResults();
    if (!results.length) return [];

    // Group by subject and compute average percentage
    const grouped: Record<string, number[]> = {};
    results.forEach((r) => {
      if (!grouped[r.subject]) grouped[r.subject] = [];
      grouped[r.subject].push(r.percentage);
    });

    return Object.entries(grouped)
      .map(([subject, pcts], idx) => ({
        name: subject,
        score: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
        color: subjectColorMap[subject] ?? fallbackColors[idx % fallbackColors.length],
        count: pcts.length,
      }))
      .sort((a, b) => b.score - a.score); // highest first
  }, []);

  const getScoreColor = (score: number) =>
    score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";

  return (
    <div className="glass rounded-2xl p-5 glow-accent">
      <h3 className="text-base font-semibold text-foreground mb-1">Subject-wise Progress</h3>
      <p className="text-xs text-muted-foreground mb-5">
        Live averages from {store.getResults().length} result records
      </p>

      {subjectData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground">No result data yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Add results to see subject progress.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subjectData.map((subject) => (
            <div key={subject.name}>
              <div className="flex justify-between items-center text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-foreground/80 font-medium">{subject.name}</span>
                  <span className="text-[10px] text-muted-foreground/60">({subject.count} records)</span>
                </div>
                <span className={`font-semibold text-sm ${getScoreColor(subject.score)}`}>
                  {subject.score}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={`h-full rounded-full ${subject.color} transition-all duration-700`}
                  style={{ width: `${subject.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectProgress;
