import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Download, Calendar, Plus, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { store, ReportRecord, useStoreUpdate } from "@/lib/store";
import { ReportPreviewModal } from "@/components/ReportPreviewModal";
import { EditReportModal } from "@/components/EditReportModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { toast } from "@/hooks/use-toast";

const Reports = () => {
  useStoreUpdate();
  const [reports, setReports] = useState<ReportRecord[]>(() => store.getReports());
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<ReportRecord | null>(null);

  useEffect(() => {
    setReports(store.getReports());
  }, []);

  const handleView = (report: ReportRecord) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  const handleEditClick = (report: ReportRecord) => {
    setSelectedReport(report);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (report: ReportRecord) => {
    setReportToDelete(report);
    setIsDeleteOpen(true);
  };

  const handleDownload = (report: ReportRecord) => {
    if (report.fileUrl) {
      const link = document.createElement("a");
      link.href = report.fileUrl;
      link.download = report.title + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(report.title, 20, 20);

    doc.setFontSize(12);
    doc.text(`Type: ${report.type}`, 20, 30);
    doc.text(`Date: ${report.date}`, 20, 40);

    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(11);
    doc.text("Summary:", 20, 55);

    const splitText = doc.splitTextToSize(
      report.content || "Sample report content",
      170
    );

    doc.text(splitText, 20, 65);

    doc.save(`${report.title}.pdf`);
  };

  const handleGenerateReport = () => {
    const newReport: ReportRecord = {
      id: "r" + Date.now(),
      title: "New AI Generated Report",
      type: "System",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      size: "24 KB",
      fileUrl: null,
      content: "This is a dynamically generated report detailing recent AI insights, attendance metrics, and grade predictions. The system automatically drafted this summary based on the latest metrics gathered across all student dashboards.",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const updatedReports = [newReport, ...store.getReports()];
    setReports(updatedReports);
    store.setReports(updatedReports);
  };

  const handleSaveEdit = (updatedReport: ReportRecord) => {
    const updatedList = store.getReports().map(r => r.id === updatedReport.id ? updatedReport : r);
    setReports(updatedList);
    store.setReports(updatedList);
    setIsEditOpen(false);
    toast({ title: "Success", description: "Report updated successfully." });
  };

  const handleConfirmDelete = () => {
    if (!reportToDelete) return;
    const updatedList = store.getReports().filter(r => r.id !== reportToDelete.id);
    setReports(updatedList);
    store.setReports(updatedList);
    setIsDeleteOpen(false);
    toast({ title: "Deleted", description: "Report deleted successfully.", variant: "destructive" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">Generated reports and documents</p>
          </div>
          <Button onClick={handleGenerateReport} className="gradient-primary text-foreground glow-primary gap-2">
            <Plus className="w-4 h-4" />
            Generate New Report
          </Button>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => handleView(report)}
              className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:scale-[1.01] active:scale-[0.99] cursor-pointer transition-all duration-200 group relative gap-4"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="flex items-center gap-4 relative z-10 w-full">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{report.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">{report.type}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{report.date}</span>
                    <span className="text-xs text-muted-foreground">{report.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10 sm:ml-auto">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); handleView(report); }} title="View">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); handleEditClick(report); }} title="Edit">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); handleDeleteClick(report); }} title="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); handleDownload(report); }} title="Download PDF">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReportPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        report={selectedReport}
        onDownload={handleDownload}
      />

      <EditReportModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        report={selectedReport}
        onSave={handleSaveEdit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        reportTitle={reportToDelete?.title}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  );
};

export default Reports;
