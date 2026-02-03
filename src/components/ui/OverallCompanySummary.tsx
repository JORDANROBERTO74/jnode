import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Ticket,
  Zap,
  CheckCircle,
  XCircle,
  Activity,
  Percent
} from 'lucide-react'
import { DashboardStatsOverall } from '@/lib/hooks/dashboard'
import { Spinner } from '@/components/ui/spinner'

interface OverallCompanySummaryProps {
  data?: DashboardStatsOverall
  isLoading?: boolean
}

export const OverallCompanySummary = ({
  data,
  isLoading = false
}: OverallCompanySummaryProps) => {
  const metrics = React.useMemo(() => {
    if (!data) return []

    return [
      {
        title: 'Total Tickets',
        value: data.total_tickets.toLocaleString(),
        icon: Ticket,
        color: 'text-blue-500'
      },
      {
        title: 'Automated Tickets',
        value: data.automated_tickets_count.toLocaleString(),
        icon: Zap,
        color: 'text-yellow-500'
      },
      {
        title: 'Percentage Automated',
        value: `${data.automated_percentage.toFixed(1)}%`,
        icon: Percent,
        color: 'text-indigo-500'
      },
      {
        title: 'Total Automations',
        value: data.automation_runs.toLocaleString(),
        icon: Activity,
        color: 'text-purple-500'
      },
      {
        title: 'Success Rate',
        value: `${data.success_rate.toFixed(1)}%`,
        icon: CheckCircle,
        color: 'text-green-500'
      },
      {
        title: 'Failure Rate',
        value: `${data.failure_rate.toFixed(1)}%`,
        icon: XCircle,
        color: 'text-red-500'
      }
    ]
  }, [data])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-8">
                <Spinner />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data || metrics.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        <div className="col-span-full text-center text-muted-foreground py-4">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
