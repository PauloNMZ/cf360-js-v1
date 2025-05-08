
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const sidebarMenuSubButtonVariants = cva(
  "flex w-full items-center gap-2 rounded-md p-2 text-sm outline-none ring-sidebar-ring transition-all aria-disabled:pointer-events-none aria-disabled:opacity-50 text-sidebar-foreground aria-expanded:text-sidebar-foreground [&>svg]:size-4 [&>svg]:shrink-0 [&>svg:last-child]:ml-auto [&>svg:last-child]:transition-transform [&>svg:last-child]:aria-expanded:rotate-180 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SidebarMenuSubButtonProps
  extends React.ComponentProps<"button"> {
  variant?: "default" | "outline";
}

export function SidebarMenuSub({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="menu-sub"
      className={cn("group relative", className)}
      {...props}
    />
  );
}

export function SidebarMenuSubButton({
  className,
  variant = "default",
  children,
  ...props
}: SidebarMenuSubButtonProps) {
  return (
    <button
      data-sidebar="menu-sub-button"
      className={cn(sidebarMenuSubButtonVariants({ variant }), className)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

export function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="menu-sub-item"
      className={cn(
        "flex w-full flex-col gap-1 overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down group-data-[collapsible=icon]:px-0",
        className
      )}
      {...props}
    />
  );
}
