import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const data = [
  { month: "Jan", performance: 72, attendance: 85 },
  { month: "Feb", performance: 68, attendance: 82 },
  { month: "Mar", performance: 75, attendance: 88 },
  { month: "Apr", performance: 80, attendance: 91 },
  { month: "May", performance: 78, attendance: 87 },
  { month: "Jun", performance: 85, attendance: 93 },
  { month: "Jul", performance: 82, attendance: 90 },
  { month: "Aug", performance: 88, attendance: 95 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl p-3 border border-border/50">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PerformanceChart = () => {
  return (
    <div className="glass rounded-2xl p-5 glow-primary">
      <h3 className="text-base font-semibold text-foreground mb-1">Performance & Attendance Trends</h3>
      <p className="text-xs text-muted-foreground mb-6">Monthly overview across all students</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
            <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="performance" stroke="hsl(217, 91%, 60%)" fill="url(#perfGradient)" strokeWidth={2} name="Performance" />
            <Area type="monotone" dataKey="attendance" stroke="hsl(262, 83%, 58%)" fill="url(#attGradient)" strokeWidth={2} name="Attendance" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
