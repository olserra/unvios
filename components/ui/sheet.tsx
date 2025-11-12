"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetContext = React.createContext<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>({});

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(SheetContext);

  return (
    <button
      ref={ref}
      className={className}
      onClick={() => onOpenChange?.(true)}
      {...props}
    >
      {children}
    </button>
  );
});
SheetTrigger.displayName = "SheetTrigger";

const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right" | "top" | "bottom";
  }
>(({ side = "right", className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(SheetContext);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const sideClasses = {
    right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
    top: "inset-x-0 top-0 w-full border-b",
    bottom: "inset-x-0 bottom-0 w-full border-t",
  };

  const animationClasses = {
    right: "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom: "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  };

  return (
    <>
      <SheetOverlay onClick={() => onOpenChange?.(false)} />
      <div
        ref={ref}
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed z-50 bg-white shadow-xl",
          "transition-transform duration-300 ease-in-out",
          sideClasses[side],
          open ? "translate-x-0" : "translate-x-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 border-b border-gray-200 px-6 py-4",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(SheetContext);

  return (
    <button
      ref={ref}
      className={className}
      onClick={() => onOpenChange?.(false)}
      {...props}
    >
      {children}
    </button>
  );
});
SheetClose.displayName = "SheetClose";

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
};
