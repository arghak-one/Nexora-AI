import DashboardLayout from "@/components/DashboardLayout";
import { ShieldAlert, ThumbsUp, AlertTriangle, Clock, Search, Filter, Eye, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { store, BehaviourRecord, useStoreUpdate } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BehaviourPreviewModal } from "@/components/BehaviourPreviewModal";
import { EditBehaviourModal } from "@/components/EditBehaviourModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Warning" },
  concern: { icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Concern" },
  positive: { icon: ThumbsUp, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Positive" },
};

const Behaviour = () => {
  useStoreUpdate();
  const [behaviours, setBehaviours] = useState<BehaviourRecord[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "warning" | "concern" | "positive">("all");

  const [selectedRecord, setSelectedRecord] = useState<BehaviourRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<BehaviourRecord | null>(null);

  useEffect(() => {
    setBehaviours(store.getBehaviours());
  }, []);

  const handleView = (record: BehaviourRecord) => {
    setSelectedRecord(record);
    setIsPreviewOpen(true);
  };

  const handleEditClick = (record: BehaviourRecord) => {
    setSelectedRecord(record);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (record: BehaviourRecord) => {
    setRecordToDelete(record);
    setIsDeleteOpen(true);
  };

  const handleSaveEdit = (updatedRecord: BehaviourRecord) => {
    const updatedList = store.getBehaviours().map(r => r.id === updatedRecord.id ? updatedRecord : r);
    setBehaviours(updatedList);
    store.setBehaviours(updatedList);
    setIsEditOpen(false);
    toast({ title: "Success", description: "Behaviour record updated successfully." });
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    const updatedList = store.getBehaviours().filter(r => r.id !== recordToDelete.id);
    setBehaviours(updatedList);
    store.setBehaviours(updatedList);
    setIsDeleteOpen(false);
    toast({ title: "Deleted", description: "Behaviour log deleted successfully.", variant: "destructive" });
  };

  const filteredBehaviours = useMemo(() => {
    return behaviours.filter(b => {
      const matchesSearch = b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            b.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "all" || b.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [behaviours, searchQuery, filterType]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Behaviour</h1>
            <p className="text-sm text-muted-foreground">Student behaviour tracking and reports</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex">
            Log Behaviour
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border border-border/50 p-4 rounded-2xl glass">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by student or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex bg-secondary/50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
            {["all", "warning", "concern", "positive"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
                  filterType === type 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredBehaviours.length === 0 ? (
            <div className="text-center p-12 glass rounded-2xl border border-border/50">
              <Filter className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-foreground">No records found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria or filter type.</p>
            </div>
          ) : (
            filteredBehaviours.map((log) => {
              const config = typeConfig[log.type];
              return (
                <div 
                  key={log.id} 
                  onClick={() => handleView(log)}
                  className={`glass rounded-2xl p-5 border ${config.border} hover:scale-[1.01] active:scale-[0.99] cursor-pointer cursor-crosshair transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group relative`}
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                  
                  <div className="flex items-start gap-4 relative z-10 w-full">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                      <config.icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground text-sm">{log.studentName}</span>
                        <span className="text-xs text-muted-foreground">• Class {log.class}</span>
                        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}>{config.label}</span>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-1 sm:line-clamp-none">{log.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {log.date}</span>
                        <span>•</span>
                        <span>Reported by: {log.reportedBy}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 relative z-10 sm:ml-auto">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); handleView(log); }} title="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); handleEditClick(log); }} title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); handleDeleteClick(log); }} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <BehaviourPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        record={selectedRecord} 
      />
      
      <EditBehaviourModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        record={selectedRecord} 
        onSave={handleSaveEdit} 
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        reportTitle={`${recordToDelete?.studentName}'s Behaviour Log`} 
        onConfirm={handleConfirmDelete} 
      />
    </DashboardLayout>
  );
};
export default Behaviour;
