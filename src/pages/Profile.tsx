import DashboardLayout from "@/components/DashboardLayout";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">Your account information</p>
        </div>

        <div className="glass rounded-2xl p-6 glow-primary">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-foreground text-2xl font-bold">
              A
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Argha Mukherjee</h2>
              <p className="text-sm text-muted-foreground">Administrator</p>
              <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary">Admin</span>
            </div>
            <Button variant="outline" className="border-border/50 text-foreground hover:bg-secondary/50">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Mail, label: "Email", value: "argha@eduai.com" },
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: MapPin, label: "Location", value: "Kolkata, India" },
              { icon: Calendar, label: "Joined", value: "January 2025" },
              { icon: Shield, label: "Role", value: "Super Admin" },
              { icon: User, label: "Department", value: "Academic Administration" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
