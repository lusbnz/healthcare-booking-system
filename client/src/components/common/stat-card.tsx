import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { LucideIcon } from "lucide-react";

export type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  badge?: {
    value: string;
    trend: "up" | "down";
  };
  footerLabel: string;
  footerSub?: string;
  icon?: LucideIcon;
  className?: string;
};

export function StatCard({
  title,
  value,
  description,
  badge,
  footerLabel,
  footerSub,
  icon: Icon,
  className,
}: StatCardProps) {
  const TrendIcon = badge?.trend === "up" ? IconTrendingUp : IconTrendingDown;

  return (
    <Card className={cn("border border-border/50 shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            {title}
          </CardDescription>
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          {badge && (
          <Badge
            variant="secondary"
            className={cn(
              "inline-flex items-center gap-1",
              badge.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            <TrendIcon className="h-4 w-4" />
            {badge.value}
          </Badge>
        )}
        </div>
        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {footerLabel}
          {badge && <TrendIcon className="h-4 w-4 text-muted-foreground" />}
        </div>
        {footerSub && (
          <div className="text-xs text-muted-foreground">{footerSub}</div>
        )}
      </CardFooter>
    </Card>
  );
}