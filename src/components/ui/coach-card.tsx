import { cn } from "@/lib/utils";

export function CoachCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#111111] border border-white/5 shadow-sm text-white overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
