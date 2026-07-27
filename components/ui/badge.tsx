import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white shadow-sm",
        brand:
          "bg-blue-50 text-blue-700 border border-blue-200/60 shadow-sm",
        secondary:
          "bg-slate-100 text-slate-700 hover:bg-slate-200/80",
        outline:
          "border border-slate-200 text-slate-700 bg-white",
        success:
          "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
        warning:
          "bg-amber-50 text-amber-700 border border-amber-200/60",
        destructive:
          "bg-rose-50 text-rose-700 border border-rose-200/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
