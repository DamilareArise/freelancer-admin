"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { keyValue, shortNum } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import React from "react"
import { TrendingUp } from "lucide-react"
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

const periods = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "All time", value: "alltime" },
]

const chartConfig = {
  number: {
    label: "Number of super ads",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const SuperAdsChart = () => {
  const [period, setPeriod] = React.useState(periods[0].value)

  return (
    <Card className="shadow-none h-full pt-0">
      <CardHeader className="flex-col gap-4 space-y-0 pb-0 px-4 py-5">
        <div className="flex flex-wrap sm:flex-nowrap w-full items-center justify-between gap-4">
          <div className="flex items-center pb-2 gap-4 border-b w-full">
            <CardTitle>Super Ads</CardTitle>
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
                <span className="text-neutral-900 font-medium text-sm">
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
              stroke={chartConfig.number.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default SuperAdsChart
