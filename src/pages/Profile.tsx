import DashboardLayout from "@/components/DashboardLayout";
import { User, Mail, Phone, MapPin, Calendar, Shield, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { store, useStoreUpdate } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { StrictModal } from "@/components/StrictModal";

const Profile = () => {
  useStoreUpdate();
  const profile = store.getUserProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const handleEditClick = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast({ title: "Error", description: "Name and Email are required.", variant: "destructive" });
      return;
    }
    store.setUserProfile(editForm);
    setIsEditing(false);
    toast({ title: "Success", description: "Profile updated successfully." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl relative">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">Your account information</p>
        </div>

        <div className="glass rounded-2xl p-6 glow-primary">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-foreground text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.department}</p>
              <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary">{profile.role}</span>
            </div>
            <Button onClick={handleEditClick} variant="outline" className="border-border/50 text-foreground hover:bg-secondary/50">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Mail, label: "Email", value: profile.email },
              { icon: Phone, label: "Phone", value: profile.phone },
              { icon: MapPin, label: "Location", value: profile.location },
              { icon: Calendar, label: "Joined", value: "January 2025" },
              { icon: Shield, label: "Role", value: profile.role },
              { icon: User, label: "Department", value: profile.department },
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

      {/* Edit Profile Modal */}
      <StrictModal open={isEditing} setOpen={setIsEditing}>
        <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <button onClick={handleCancelClick} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Role</label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Department</label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
            <Button variant="ghost" onClick={handleCancelClick}>Cancel</Button>
            <Button onClick={handleSaveClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </StrictModal>
    </DashboardLayout>
  );
}

export default Profile;
