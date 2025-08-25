"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { shortNum } from "@/lib/helpers"
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
} satisfies ChartConfig

const RevenueDistroChart = () => {
  const chartData = React.useMemo(
    () => [
      { label: "Super Ads", value: 1400, fill: "#2DD4BF" },
      { label: "Paid Listings", value: 1000, fill: "#FB923C" },
    ],
    []
  )

  return (
    <Card className="flex flex-col h-full shadow-none py-4">
      <CardHeader className="flex-row justify-center items-start space-y-0 pb-0 px-3">
        <CardTitle className="mt-5">Revenue Distribution</CardTitle>
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
                          {shortNum(5000000)}
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
          <div className="flex w-full items-center flex-col">
            <span className="text-gray-500 text-xs">Revenue Total</span>
            <span className="text-neutral-900 font-bold text-xl">
              {shortNum(5000000)}
            </span>
          </div>
          {chartData.map((each, i) => (
            <div key={each.label + i + "category"} className="flex flex-col">
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

export default RevenueDistroChart
