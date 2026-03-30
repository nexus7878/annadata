import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass: string;
  bgClass: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorClass,
  bgClass,
}: StatCardProps) {
  return (
    <Card className="border-border/60 transition-all duration-400 card-hover">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className={cn("p-2 rounded-xl block w-fit", bgClass)}>
              <Icon className={cn("h-4.5 w-4.5", colorClass)} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-0.5">{title}</p>
              <h3 className="text-2xl font-heading font-bold">{value}</h3>
            </div>
          </div>

          {trend && (
            <div className={cn(
              "px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-0.5",
              trend.isPositive ? "bg-emerald-500/8 text-emerald-600" : "bg-red-500/8 text-red-500"
            )}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-3">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
