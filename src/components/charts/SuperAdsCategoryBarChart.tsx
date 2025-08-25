"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { currency, keyValue, shortNum } from "@/lib/helpers"
const chartData = [
  { month: "January", homepage: 1860, topCategory: 800, searchHighlight: 1500 },
  {
    month: "February",
    homepage: 3050,
    topCategory: 2000,
    searchHighlight: 2000,
  },
  { month: "March", homepage: 2370, topCategory: 1200, searchHighlight: 1400 },
  { month: "April", homepage: 730, topCategory: 1900, searchHighlight: 3200 },
  { month: "May", homepage: 2090, topCategory: 1300, searchHighlight: 2000 },
  { month: "June", homepage: 2140, topCategory: 1400, searchHighlight: 2300 },
]

const chartConfig = {
  homepage: {
    label: "Homepage",
    color: "var(--primary)",
  },
  topCategory: {
    label: "Top Category",
    color: "var(--primary-400)",
  },
  searchHighlight: {
    label: "Search Highlight",
    color: "var(--secondary-600)",
  },
} satisfies ChartConfig

const SuperAdsCategoryBarChart = () => {
  return (
    <Card className="shadow-none py-4 h-full">
      <CardHeader className="px-4">
        <div className="flex flex-wrap items-center text-xs text-neutral-800 gap-3">
          {keyValue(chartConfig).map(({ key, value }) => (
            <span key={key + "category"} className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: value.color }}
              ></span>
              <span>{value.label}</span>
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-full px-4">
        <ChartContainer config={chartConfig} className="h-full max-w-full">
          <BarChart margin={{ left: -10 }} accessibilityLayer data={chartData}>
            <CartesianGrid strokeDasharray={2} vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${currency.symbol}${shortNum(val)}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {keyValue(chartConfig).map(({ key, value }) => (
              <Bar
                dataKey={key}
                key={key}
                barSize={10}
                fill={value.color}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <Button variant={"outline"} className="w-full">
          Details
        </Button> */}
      </CardFooter>
    </Card>
  )
}

export default SuperAdsCategoryBarChart
