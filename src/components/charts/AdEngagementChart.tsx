"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { keyValue, shortNum } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"
import * as React from "react"
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

const AdEngagementChart = () => {
  const chartData = React.useMemo(
    () => [
      { label: "Impressions", value: 6400, fill: "#FB923C" },
      { label: "Chats", value: 1400, fill: "#4F46E5" },
      { label: "Conversions", value: 1400, fill: "#2DD4BF" },
    ],
    []
  )

  return (
    <Card className="flex flex-col h-full shadow-none py-4">
      <CardHeader className="flex-row justify-center items-start space-y-0 pb-0 px-3">
        <CardTitle className="mt-5">Ad Engagement</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex-wrap gap-5 flex pb-0 px-3">
        <ChartContainer
          config={chartConfig}
          className="m-auto flex-1 min-w-full max-h-[16rem] aspect-square"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              paddingAngle={4}
              outerRadius={"100%"}
              innerRadius={"78%"}
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
                          {shortNum(257500)}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex justify-center flex-1 min-w-full md:min-w-[15rem] h-fit my-auto flex-wrap gap-x-10 gap-y-5">
          {/* <div className="flex w-full items-center flex-col">
            <span className="text-gray-500 text-xs">Total Super Ads</span>
            <span className="text-neutral-900 font-bold text-xl">
              {shortNum(3000)}
            </span>
          </div> */}
          {chartData.map((each, i) => (
            <div
              key={each.label + i + "category"}
              className="flex items-center flex-col"
            >
              <span className="text-gray-500 text-xs">{each.label}</span>
              <span className="flex justify-center items-center gap-2">
                <span
                  style={{ backgroundColor: `${each.fill}` }}
                  className="size-2 min-w-2 block rounded-full"
                ></span>
                <span className="text-neutral-900 font-medium">
                  {shortNum(each.value)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default AdEngagementChart

const periods = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "All time", value: "alltime" },
]

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "#B9104F",
  },
  chats: {
    label: "Chats",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export const AdPerformanceLineChart = () => {
  const chartData = [
    { month: "January", chats: 186, impressions: 780 },
    { month: "February", chats: 305, impressions: 1200 },
    { month: "March", chats: 237, impressions: 720 },
    { month: "April", chats: 73, impressions: 1690 },
    { month: "May", chats: 209, impressions: 830 },
    { month: "June", chats: 186, impressions: 680 },
    { month: "July", chats: 305, impressions: 800 },
    { month: "August", chats: 237, impressions: 1220 },
    { month: "September", chats: 73, impressions: 1590 },
    { month: "October", chats: 209, impressions: 730 },
    { month: "November", chats: 214, impressions: 440 },
    { month: "December", chats: 254, impressions: 1140 },
  ]
  const [period, setPeriod] = React.useState(periods[0].value)

  return (
    <Card className="shadow-none h-full pt-0">
      <CardHeader className="flex-col gap-4 space-y-0 pb-0 px-4 py-5">
        <div className="flex flex-wrap sm:flex-nowrap w-full items-center justify-between gap-4">
          <div className="flex items-center pb-2 gap-4 border-b w-full">
            <CardTitle>Ads Performance</CardTitle>
          </div>

          <div className="bg-base-white font-instr rounded-md h-[2.15rem] p-1 gap-1 flex items-center">
            {periods.map(({ label, value }, i) => (
              <button
                key={value + i}
                onClick={() => setPeriod(value)}
                className={cn(
                  " text-[.65rem] whitespace-nowrap transition p-1 h-full rounded-md",
                  period == value ? "bg-white text-[#5A5555]" : "text-[#726C6C]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex gap-4 items-center">
            <h3 className="font-bold text-xl">35%</h3>
            <span className="text-primary flex items-center gap-1">
              <TrendingUp className="size-4" /> 25.3%
            </span>
          </div>
          <div className="flex gap-4">
            {keyValue(chartConfig).map(({ key, value }) => (
              <span key={key} className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: `${value.color}` }}
                  className="size-2 min-w-2 block rounded-full"
                ></span>
                <span className="text-neutral-900 font-medium text-xs">
                  {value.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer
          className="max-h-[20rem] min-w-full"
          config={chartConfig}
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -10,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              tickMargin={15}
              axisLine={false}
              tickFormatter={(val) => shortNum(val, true)}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="chats"
              type="monotone"
              stroke={chartConfig.chats.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="impressions"
              type="monotone"
              stroke={chartConfig.impressions.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
