'use client';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartAreaInteractiveProps {
  data: Array<{ date: string; [key: string]: string | number }>;
  categories: { key: string; label: string; color: string }[];
}

export function ChartAreaInteractive({ data, categories }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');

  const chartConfig = React.useMemo<ChartConfig>(() => {
    const config: ChartConfig = {};
    categories.forEach((category) => {
      config[category.key] = {
        label: category.label,
        color: category.color,
      };
    });
    return config;
  }, [categories]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date('2024-06-30');
      let daysToSubtract = 90;
      if (timeRange === '30d') {
        daysToSubtract = 30;
      } else if (timeRange === '7d') {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [data, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tổng Quan Lịch Hẹn</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Tổng quan cho 3 tháng gần nhất
          </span>
          <span className="@[540px]/card:hidden">3 tháng gần nhất</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 tháng gần nhất</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 ngày gần nhất</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 ngày gần nhất</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 *:data-[slot=select-value]:block *:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Chọn khoảng thời gian"
            >
              <SelectValue placeholder="3 tháng gần nhất" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 tháng gần nhất
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 ngày gần nhất
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 ngày gần nhất
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {categories.map((category) => (
                <linearGradient key={category.key} id={`fill${category.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={category.color} stopOpacity={1.0} />
                  <stop offset="95%" stopColor={category.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('vi-VN', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis />
            <Tooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('vi-VN', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {categories.map((category) => (
              <Area
                key={category.key}
                dataKey={category.key}
                type="natural"
                fill={`url(#fill${category.key})`}
                stroke={category.color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}