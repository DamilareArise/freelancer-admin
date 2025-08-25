"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import * as Sel from "@/components/ui/select"
import { shortNum } from "@/lib/helpers"
import { Period, useBookingsByCategoryQuery } from "@/services/report.service"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

const chartConfig = {
  // visitors: {
  //   label: "Visitors",
  // },
  // chrome: {
  //   label: "Chrome",
  //   color: "hsl(var(--chart-1))",
  // },
  // safari: {
  //   label: "Safari",
  //   color: "hsl(var(--chart-2))",
  // },
  // firefox: {
  //   label: "Firefox",
  //   color: "hsl(var(--chart-3))",
  // },
  // edge: {
  //   label: "Edge",
  //   color: "hsl(var(--chart-4))",
  // },
  // other: {
  //   label: "Other",
  //   color: "hsl(var(--chart-5))",
  // },
} satisfies ChartConfig

const periods: { label: string; value: Period }[] = [
  { label: "This week", value: "week" },
  { label: "This Month", value: "month" },
]

const CategoryChart = () => {
  const [period, setPeriod] = React.useState(periods[0].value)
  const { data, isFetching } = useBookingsByCategoryQuery({ period })

  const chartData = React.useMemo(
    () =>
      (data?.data ?? []).map((each, i) => ({
        ...each,
        fill: `var(--color-chart-${(i % 10) + 1})`,
        percentage:
          (data?.total ?? 0) > 0
            ? ((each.booking_count / (data?.total ?? 0)) * 100).toFixed(2)
            : 0,
      })),
    [data]
  )

  return (
    <Card className="flex flex-col h-full shadow-none relative overflow-hidden py-4">
      {isFetching && (
        <div className="absolute backdrop-blur-sm z-10 bg-white/70 fade inset-0 flex items-center justify-center">
          <Loader2
            className={"animate-spin text-primary transition-all absolute"}
          />
        </div>
      )}

      <CardHeader className="flex-row items-start space-y-0 pb-0 px-3">
        <div className="grid gap-1">
          <CardTitle>Categories</CardTitle>
          <CardDescription>Track bookings by category</CardDescription>
        </div>
        <Sel.Select
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
        >
          <Sel.SelectTrigger
            className="ml-auto h-7 w-[7.5rem] rounded-lg border-0 ring-0 shadow-none"
            aria-label="Select a value"
          >
            <Sel.SelectValue placeholder="Select month" />
          </Sel.SelectTrigger>
          <Sel.SelectContent align="end">
            {periods.map(({ value, label }) => {
              return (
                <Sel.SelectItem
                  key={value}
                  value={value}
                  className=" [&_span]:flex"
                >
                  {label}
                </Sel.SelectItem>
              )
            })}
          </Sel.SelectContent>
        </Sel.Select>
      </CardHeader>
      <CardContent className="flex-1 flex-wrap gap-5 flex pb-0 px-3">
        <ChartContainer
          config={chartConfig}
          className="m-auto flex-1 sm:min-w-[17rem] min-w-full max-w-[17rem] max-h-[17rem] aspect-square"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="booking_count"
              nameKey="category"
              outerRadius={"100%"}
              innerRadius={"68%"}
              radius={"100%"}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {shortNum(data?.total || 0)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Bookings
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-1 min-w-full md:min-w-[15rem] h-fit my-auto flex-wrap gap-3.5">
          {chartData.map((each, i) => (
            <div
              key={each.category + i + "category"}
              className="flex flex-1 min-w-28 flex-col"
            >
              <span className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: `${each.fill}` }}
                  className="size-2 min-w-2 block rounded-full"
                ></span>
                <span className="text-neutral-900 font-medium text-xs">
                  {each.category}
                </span>
              </span>
              <span className="text-neutral-600 text-[.65rem]">
                {each.percentage}%, {each.booking_count.toLocaleString()}{" "}
                bookings
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CategoryChart
