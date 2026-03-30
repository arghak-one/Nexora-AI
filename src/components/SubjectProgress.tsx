const subjects = [
  { name: "Mathematics", score: 85, color: "bg-primary" },
  { name: "Physics", score: 72, color: "bg-accent" },
  { name: "Chemistry", score: 90, color: "bg-info" },
  { name: "English", score: 78, color: "bg-success" },
  { name: "Computer Science", score: 95, color: "bg-warning" },
];

const SubjectProgress = () => {
  return (
    <div className="glass rounded-2xl p-5 glow-accent">
      <h3 className="text-base font-semibold text-foreground mb-1">Subject-wise Progress</h3>
      <p className="text-xs text-muted-foreground mb-5">Average scores by subject</p>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-foreground/80 font-medium">{subject.name}</span>
              <span className="text-muted-foreground">{subject.score}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
              <div
                className={`h-full rounded-full ${subject.color} transition-all duration-1000`}
                style={{ width: `${subject.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectProgress;
