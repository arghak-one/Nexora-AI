import { StrictModal } from "@/components/StrictModal";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reportTitle?: string;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, reportTitle }: ConfirmDeleteModalProps) {
  return (
    <StrictModal open={isOpen} setOpen={(open) => { if (!open) onClose(); }}>
      <div className="w-full max-w-sm bg-card border border-border/50 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Confirm Deletion</h2>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-semibold text-foreground">"{reportTitle}"</span>? This action cannot be undone.
        </p>

        <div className="flex w-full gap-3 pt-4 border-t border-border/20 mt-4">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={onConfirm} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </Button>
        </div>
      </div>
    </StrictModal>
  );
}
