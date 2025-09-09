"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartDataItem {
  month: string
  desktop: number
}

interface ChartProps {
  chartData: ChartDataItem[]
}

const chartConfig = {
  desktop: {
    label: "₹",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Chart({ chartData }: ChartProps) {
  return (
    <Card className="rounded-2xl shadow-md border border-muted">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg bg-background p-2 shadow-md border">
                        <p className="text-sm font-medium">
                          {payload[0].payload.month}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{payload[0].value}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="desktop"
                stroke="var(--color-desktop)"
                strokeWidth={2.5}
                fill="url(#colorDesktop)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month{" "}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
