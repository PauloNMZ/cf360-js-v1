import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(({
  className,
  ...props
}, ref) => <TabsPrimitive.List ref={ref} className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props} />);
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({
  className,
  ...props
}, ref) => <TabsPrimitive.Trigger ref={ref} className={cn("group relative inline-flex items-center justify-center whitespace-nowrap px-5 py-2 text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-visible", "data-[state=active]:bg-[#ECF2FF] data-[state=active]:text-[#0E1F46] dark:data-[state=active]:bg-[#0E1F46] dark:data-[state=active]:text-[#FCFC30]", "data-[state=inactive]:bg-[#F3F4F6] data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:bg-[#0F1729] dark:data-[state=inactive]:text-gray-400", className)} {...props}>
    {props.children}
    <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-b-md z-10 hidden group-data-[state=active]:block transition-all duration-300 bg-[#3986FF] dark:bg-[#FCFC30] text-[t] text-[#ff6b35]" />
  </TabsPrimitive.Trigger>);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(({
  className,
  ...props
}, ref) => <TabsPrimitive.Content ref={ref} className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props} />);
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };