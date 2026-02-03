'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { DashboardChartDataResponse } from '@/lib/hooks/dashboard'
import { Spinner } from '@/components/ui/spinner'

interface OverallCompanyTrendChartProps {
  className?: string
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'ytd'
  chartData?: DashboardChartDataResponse
  isLoading?: boolean
}

export const OverallCompanyTrendChart = ({
  className,
  period = 'monthly',
  chartData,
  isLoading = false
}: OverallCompanyTrendChartProps) => {
  const processedChartData = useMemo(() => {
    if (!chartData?.trend || chartData.trend.length === 0) {
      return []
    }

    // Map the API data to the format expected by the chart
    // The API returns { date, total, automated, percentage }
    // We'll use 'total' as the volume for the chart
    return chartData.trend.map((item: any) => ({
      date: item.date,
      volume: item.total
    }))
  }, [chartData])

  const hasData = processedChartData && processedChartData.length > 0

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Overall Ticket Volume Trend
        </CardTitle>
        <div className="text-sm text-muted-foreground capitalize">
          {period === 'ytd' ? 'Year to date' : period}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Spinner />
            </div>
          ) : !hasData ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
              <p>No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={value => {
                    const date = new Date(value)
                    return period === 'yearly'
                      ? date.getFullYear().toString()
                      : date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={value => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length && label) {
                      const date = new Date(label)
                      const formattedDate =
                        period === 'yearly'
                          ? date.getFullYear().toString()
                          : date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })

                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-semibold text-muted-foreground">
                                {formattedDate}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Volume
                              </span>
                              <span className="font-semibold">
                                {payload[0].value?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="volume"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
