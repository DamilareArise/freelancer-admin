import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as Chart from "@/components/ui/chart"
import * as Sel from "@/components/ui/select"
import { shortNum } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import {
  PaymentPerTimeR,
  Period,
  usePaymentPerTimeQuery,
} from "@/services/report.service"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"
import { Area, AreaChart, CartesianGrid, Dot, XAxis, YAxis } from "recharts"

const defaultData = [
  { label: "Jan", total_payment: 0 },
  { label: "Feb", total_payment: 0 },
  { label: "Mar", total_payment: 0 },
  { label: "Apr", total_payment: 0 },
  { label: "May", total_payment: 0 },
  { label: "Jun", total_payment: 0 },
  { label: "Jul", total_payment: 0 },
  { label: "Aug", total_payment: 0 },
  { label: "Sep", total_payment: 0 },
  { label: "Oct", total_payment: 0 },
  { label: "Nov", total_payment: 0 },
  { label: "Dec", total_payment: 0 },
]

const chartConfig = {
  total_payment: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies Chart.ChartConfig

const periods: { label: string; value?: Period }[] = [
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
  { label: "Yearly", value: "year" },
  { label: "All time" },
]

const charts = [
  { label: "Revenue", value: "revenue" },
  // { label: "This Month", value: "thismonth" },
]

const Insights = () => {
  const [chart, setChart] = React.useState(charts[0].value)

  const [filters, setFilters] = useState<PaymentPerTimeR>({
    period: "year",
    year: new Date().getFullYear(),
  })
  const { data, isLoading, isFetching } = usePaymentPerTimeQuery(filters)

  const chartData = React.useMemo(() => {
    if (isLoading) return defaultData
    return (
      data?.data.map(({ label, total_payment }) => ({
        label,
        total_payment,
      })) || defaultData
    )
  }, [data, isLoading])

  return (
    <Card className="flex flex-col h-full shadow-none pb-4 pt-0">
      <CardHeader className="flex-row items-center space-y-0 pb-0 px-7 border-b py-5">
        <div className="flex flex-wrap w-full items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CardTitle>More Insights</CardTitle>
            <Sel.Select value={chart} onValueChange={setChart}>
              <Sel.SelectTrigger
                className="ml-auto h-7 w-[7rem] text-xs rounded-full text-neutral-700 ring-0 shadow-none"
                aria-label="Select a value"
              >
                <Sel.SelectValue placeholder="Select month" />
              </Sel.SelectTrigger>
              <Sel.SelectContent align="start" className="min-w-[5rem]">
                {charts.map(({ value, label }) => {
                  return (
                    <Sel.SelectItem
                      key={value}
                      value={value}
                      className="text-xs [&_span]:flex"
                    >
                      {label}
                    </Sel.SelectItem>
                  )
                })}
              </Sel.SelectContent>
            </Sel.Select>
          </div>

          <div className="bg-base-white font-instr rounded-md h-[2.15rem] p-1 gap-1 flex items-center">
            {periods.map(({ label, value }, i) => (
              <button
                key={label + i}
                onClick={() => setFilters({ ...filters, period: value })}
                className={cn(
                  "text-[.65rem] transition p-1 h-full rounded-md",
                  filters.period == value
                    ? "bg-white text-[#5A5555]"
                    : "text-[#726C6C]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex-wrap gap-5 flex pb-0 px-3 relative">
        {isFetching && (
          <div className="absolute backdrop-blur-sm z-10 bg-white/70 fade inset-0 flex items-center justify-center">
            <Loader2
              className={"animate-spin text-primary transition-all absolute"}
            />
          </div>
        )}

        <Chart.ChartContainer
          config={chartConfig}
          className="h-80 font-instr min-w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              left: 5,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray={2}
              stroke="#DDDDDD"
            />
            <YAxis
              tickLine={false}
              tickMargin={15}
              axisLine={{
                stroke: "#DDDDDD",
                strokeDasharray: 2,
              }}
              tickFormatter={(val) => shortNum(val, true)}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <Chart.ChartTooltip
              // formatter={(value) => shortNum(value as number, true)}
              cursor={false}
              content={<Chart.ChartTooltipContent />}
            />
            <defs>
              {/* <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient> */}
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="10%"
                  stopColor="var(--color-primary-200)"
                  stopOpacity={0.8}
                />
                <stop offset="95%" stopColor="#fff" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.label}
                    r={3.5}
                    cx={props.cx}
                    cy={props.cy}
                    fill={"var(--primary)"}
                    // fill={payload.fill}
                    // stroke={payload.fill}
                  />
                )
              }}
              // strokeDasharray={10}
              strokeWidth={2}
              dataKey="total_payment"
              type="bumpX"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-primary)"
              stackId="a"
            />
            {/* <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            /> */}
          </AreaChart>
        </Chart.ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Insights
