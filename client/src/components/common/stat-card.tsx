import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

export type StatCardProps = {
  title: string
  value: string | number
  description: string
  badge: {
    value: string
    trend: "up" | "down"
  }
  footerLabel: string
  footerSub?: string
}

export function StatCard({ title, value, badge, footerLabel, footerSub }: StatCardProps) {
  const TrendIcon = badge.trend === "up" ? IconTrendingUp : IconTrendingDown

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendIcon className="size-4" />
            {badge.value}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex gap-2 font-medium">
          {footerLabel} <TrendIcon className="size-4" />
        </div>
        {footerSub && (
          <div className="text-muted-foreground">{footerSub}</div>
        )}
      </CardFooter>
    </Card>
  )
}
