
import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from "./sidebar-constants";

export function SidebarWrapper({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <TooltipProvider delayDuration={0}>
      <div
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TooltipProvider>
  );
}
