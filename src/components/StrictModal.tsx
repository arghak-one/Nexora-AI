import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface StrictModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export function StrictModal({ open, setOpen, children }: StrictModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(state) => {
      if (!state) return;
      setOpen(state);
    }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none flex items-center justify-center p-4 bg-transparent border-none shadow-none pointer-events-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="pointer-events-auto w-full flex justify-center">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
