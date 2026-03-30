import DashboardLayout from "@/components/DashboardLayout";
import { UserCheck, Phone, Mail } from "lucide-react";

const parentsData = [
  { name: "Mr. Sanjay Kumar", child: "Rahul Kumar", class: "10A", phone: "+91 98765 43210", email: "sanjay@mail.com" },
  { name: "Mrs. Rekha Sharma", child: "Priya Sharma", class: "10A", phone: "+91 98765 43211", email: "rekha@mail.com" },
  { name: "Mr. Dinesh Patel", child: "Amit Patel", class: "10B", phone: "+91 98765 43212", email: "dinesh@mail.com" },
  { name: "Mrs. Sunita Gupta", child: "Sneha Gupta", class: "9A", phone: "+91 98765 43213", email: "sunita@mail.com" },
  { name: "Mr. Harish Singh", child: "Vikram Singh", class: "10B", phone: "+91 98765 43214", email: "harish@mail.com" },
  { name: "Mrs. Lakshmi Das", child: "Ananya Das", class: "9B", phone: "+91 98765 43215", email: "lakshmi@mail.com" },
];

const Parents = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parents</h1>
          <p className="text-sm text-muted-foreground">Parent & guardian contact directory</p>
        </div>

        <div className="glass rounded-2xl overflow-hidden glow-teal">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Parent</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Child</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Class</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Phone</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {parentsData.map((p, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center text-foreground font-semibold text-xs">
                          {p.name.split(" ").slice(-1)[0][0]}
                        </div>
                        <span className="font-medium text-foreground text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{p.child}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{p.class}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{p.phone}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{p.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Parents;
