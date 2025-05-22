
import React from "react";

// H2 Typography with shadcn and Tailwind style
export const TypographyH2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = "", ...props }) => (
  <h2 className={`scroll-m-20 font-poppins text-2xl font-bold tracking-tight ${className}`} {...props}>
    {children}
  </h2>
);

// Muted text style (secondary color, subtle look)
export const TypographyMuted: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, className = "", ...props }) => (
  <span className={`text-muted-foreground text-sm ${className}`} {...props}>
    {children}
  </span>
);
