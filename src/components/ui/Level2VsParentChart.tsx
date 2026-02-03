'use client'

import React, { useMemo, useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DashboardLevel2BreakdownResponse,
  DashboardLevel2BreakdownItem
} from '@/lib/hooks/dashboard'
import { Spinner } from '@/components/ui/spinner'

interface Level2VsParentChartProps {
  className?: string
  breakdownData?: DashboardLevel2BreakdownResponse
  isLoading?: boolean
}

const STORAGE_KEY = 'dashboard-category-breakdown-settings'

interface ChartDataPoint {
  name: string
  volume: number
  percentage: number
  parent_category?: string
}

// Helper function to filter data by parent category
const filterDataByParent = (
  data: DashboardLevel2BreakdownItem[],
  selectedParent: string
): DashboardLevel2BreakdownItem[] => {
  if (selectedParent === 'all') {
    return data
  }
  return data.filter(
    (item: DashboardLevel2BreakdownItem) =>
      item.parent_category === selectedParent
  )
}

// Calculate chart data grouped by parent category
const calculateParentChartData = (
  filteredData: DashboardLevel2BreakdownItem[]
): ChartDataPoint[] => {
  const breakdownMap: Record<string, number> = {}

  filteredData.forEach((item: DashboardLevel2BreakdownItem) => {
    const key = item.parent_category || 'Unknown'
    breakdownMap[key] = (breakdownMap[key] || 0) + (item.ticket_volume || 0)
  })

  const totalVolume = Object.values(breakdownMap).reduce((a, b) => a + b, 0)
  return Object.entries(breakdownMap)
    .map(([key, volume]) => ({
      name: key,
      volume,
      percentage: totalVolume > 0 ? (volume / totalVolume) * 100 : 0
    }))
    .sort((a, b) => b.volume - a.volume)
}

// Calculate chart data grouped by level 2 category
const calculateLevel2ChartData = (
  filteredData: DashboardLevel2BreakdownItem[]
): ChartDataPoint[] => {
  const breakdownMap: Record<
    string,
    { parent_category: string; level2_category: string; volume: number }
  > = {}

  filteredData.forEach((item: DashboardLevel2BreakdownItem) => {
    const level2Key = item.level_2_category || 'Unknown'
    const parentCategory = item.parent_category || 'Unknown'
    const volume = item.ticket_volume || 0

    if (!breakdownMap[level2Key]) {
      breakdownMap[level2Key] = {
        parent_category: parentCategory,
        level2_category: level2Key,
        volume: 0
      }
    }
    breakdownMap[level2Key].volume += volume
  })

  const totalVolume = Object.values(breakdownMap).reduce(
    (sum, item) => sum + item.volume,
    0
  )

  return Object.values(breakdownMap)
    .map(item => ({
      name: item.level2_category,
      parent_category: item.parent_category,
      volume: item.volume,
      percentage: totalVolume > 0 ? (item.volume / totalVolume) * 100 : 0
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10) // Limit to top 10 for readability
}

export const Level2VsParentChart = ({
  className,
  breakdownData,
  isLoading = false
}: Level2VsParentChartProps) => {
  const [viewMode, setViewMode] = useState<'parent' | 'level2'>('level2')
  const [selectedParent, setSelectedParent] = useState<string>('all')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const settings = JSON.parse(stored)
        if (settings.viewMode) setViewMode(settings.viewMode)
        if (settings.selectedParent) setSelectedParent(settings.selectedParent)
      }
    } catch (e) {
      console.warn('Failed to load chart settings', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage when changed
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ viewMode, selectedParent })
      )
    } catch (e) {
      console.warn('Failed to save chart settings', e)
    }
  }, [viewMode, selectedParent, isLoaded])

  // Extract unique parent categories for the filter
  const parentCategories = useMemo(() => {
    if (!breakdownData?.results) return []
    const parents = new Set<string>()
    breakdownData.results.forEach((item: DashboardLevel2BreakdownItem) => {
      if (item.parent_category) parents.add(item.parent_category)
    })
    return Array.from(parents).sort()
  }, [breakdownData])

  const chartData = useMemo(() => {
    if (!breakdownData?.results || breakdownData.results.length === 0) {
      return []
    }

    const filteredData = filterDataByParent(
      breakdownData.results,
      selectedParent
    )

    return viewMode === 'parent'
      ? calculateParentChartData(filteredData)
      : calculateLevel2ChartData(filteredData)
  }, [breakdownData, viewMode, selectedParent])

  const hasData = chartData && chartData.length > 0

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Category Breakdown
        </CardTitle>
        <div className="flex gap-2">
          <Select
            value={viewMode}
            onValueChange={(v: 'parent' | 'level2') => setViewMode(v)}
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">By Parent</SelectItem>
              <SelectItem value="level2">By Level 2</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedParent}
            onValueChange={setSelectedParent}
            disabled={viewMode === 'parent'}
          >
            <SelectTrigger className="h-8 w-[160px] text-xs">
              <SelectValue placeholder="Filter Parent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parents</SelectItem>
              {parentCategories.map(parent => (
                <SelectItem key={parent} value={parent}>
                  {parent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="font-semibold">{label}</div>
                            {viewMode === 'level2' && (
                              <div className="text-xs text-muted-foreground">
                                Parent: {data.parent_category}
                              </div>
                            )}
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm">Volume:</span>
                              <span className="font-bold">
                                {data.volume.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm">Share:</span>
                              <span className="font-bold">
                                {Number(data.percentage).toFixed(1)}%
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
                  fill="hsl(var(--chart-2))"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  background={{ fill: 'hsl(var(--muted))' }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
