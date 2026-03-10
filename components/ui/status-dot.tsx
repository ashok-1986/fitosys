import { cn } from "@/lib/utils";

interface StatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "green" | "orange" | "red" | "gray";
  animate?: boolean;
}

export function StatusDot({
  className,
  color = "gray",
  animate = false,
  ...props
}: StatusDotProps) {
  const colorMap = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-[#E8001D]",
    gray: "bg-[#333333]",
  };

  const shadowMap = {
    green: "shadow-[0_0_8px_rgba(34,197,94,0.4)]",
    orange: "shadow-[0_0_8px_rgba(249,115,22,0.4)]",
    red: "shadow-[0_0_8px_rgba(232,0,29,0.4)]",
    gray: "",
  };

  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full",
        colorMap[color],
        shadowMap[color],
        animate && "animate-pulse",
        className
      )}
      {...props}
    />
  );
}
