"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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
import { countriesWithCode } from "@/services/country.service"
import { Period, useActivitiesByCategoryQuery } from "@/services/report.service"
import { Loader2 } from "lucide-react"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  january: {
    label: "January",
    color: "hsl(var(--chart-1))",
  },
  february: {
    label: "February",
    color: "hsl(var(--chart-2))",
  },
  march: {
    label: "March",
    color: "hsl(var(--chart-3))",
  },
  april: {
    label: "April",
    color: "hsl(var(--chart-4))",
  },
  may: {
    label: "May",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const periods: { label: string; value: Period }[] = [
  { label: "This week", value: "week" },
  { label: "This Month", value: "month" },
]

const UserActivity = ({
  by = "category",
}: {
  by?: "category" | "location"
}) => {
  const id = "pie-interactive"
  const [period, setPeriod] = React.useState<Period>(periods[0].value)
  const { data, isFetching } = useActivitiesByCategoryQuery({ period })

  const totalUsers = React.useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.users, 0) ?? 0
  }, [data])

  const chartData = React.useMemo(
    () =>
      by == "category"
        ? (data?.data ?? []).map((each, i) => ({
            ...each,
            fill: `var(--color-chart-${(i % 10) + 1})`,
            users: each.users,
            percentage:
              totalUsers > 0 ? ((each.users / totalUsers) * 100).toFixed(2) : 0,
          }))
        : countriesWithCode
            .filter((_, i) => i > 40 && i <= 63)
            .map((each, i) => ({
              category: each.name,
              percentage: 10,
              users: 2000,
              fill: `var(--color-chart-${(i % 10) + 1})`,
            })),
    [by, data?.data, totalUsers]
  )

  return (
    <Card
      data-chart={id}
      className="flex h-full flex-col overflow-hidden shadow-none relative py-4"
    >
      {isFetching && (
        <div className="absolute backdrop-blur-sm z-10 bg-white/70 fade inset-0 flex items-center justify-center">
          <Loader2
            className={"animate-spin text-primary transition-all absolute"}
          />
        </div>
      )}

      {/* <Card data-chart={id} className="flex flex-col shadow-none"> */}
      {/* <ChartStyle id={id} config={chartConfig} /> */}
      <CardHeader className="flex-row items-start space-y-0 pb-0 px-3">
        <div className="grid gap-1">
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Track user activities by {by}</CardDescription>
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
              dataKey="impression_count"
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
                          {shortNum(data?.total_user || 0)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Users
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
              key={each.category + i}
              className="flex flex-1 min-w-28 flex-col"
            >
              <span className="leading-1">
                <span
                  style={{ backgroundColor: `${each.fill}` }}
                  className="size-2 min-w-2 inline-block rounded-full mr-2 "
                ></span>
                <span className="text-neutral-900 font-medium text-xs">
                  {each.category}
                </span>
              </span>
              <span className="text-neutral-600 text-[.65rem]">
                {each.percentage}%, {each.users.toLocaleString()} users
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserActivity
