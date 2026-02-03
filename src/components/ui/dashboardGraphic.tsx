'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Download,
  TrendingDown,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import {
  useDashboardStats,
  useDashboardLevel2Breakdown,
  useDashboardChartData
} from '@/lib/hooks/dashboard'
import { useTaxonomies } from '@/lib/hooks/tickets'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { SelectableTableWithContextMenu } from '@/components/selectable-table-with-context-menu'
import { OverallCompanySummary } from '@/components/ui/OverallCompanySummary'
import { OverallCompanyTrendChart } from '@/components/ui/OverallCompanyTrendChart'
import { Level2VsParentChart } from '@/components/ui/Level2VsParentChart'

interface CategoryOption {
  value: string
  label: string
}

const useCategoryOptions = () => {
  const { data: taxonomies, isLoading } = useTaxonomies()

  const categoryOptions = React.useMemo((): CategoryOption[] => {
    if (!taxonomies) return []

    const level1Taxonomies = taxonomies.filter(taxonomy => taxonomy.level === 1)
    const options: CategoryOption[] = [
      { value: 'all', label: 'All Categories' },
      ...level1Taxonomies.map(taxonomy => ({
        value: taxonomy.id, // Use ID instead of name for API compatibility
        label: taxonomy.name
      }))
    ]

    return options
  }, [taxonomies])

  return { categoryOptions, isLoading }
}

const useVolumeFilterOptions = () => {
  const volumeFilterOptions = React.useMemo((): CategoryOption[] => {
    const options: CategoryOption[] = [
      { value: 'all', label: 'All Categories' },
      { value: 'low-volume', label: 'Low Volume Only' },
      { value: 'high-volume', label: 'High Volume Only' }
    ]

    return options
  }, [])

  return { volumeFilterOptions, isLoading: false }
}

const PAGE_SIZE_OPTIONS = [
  { value: '5', label: '5 per page' },
  { value: '10', label: '10 per page' },
  { value: '20', label: '20 per page' },
  { value: '50', label: '50 per page' }
]

const ChangeIndicator = React.memo(
  ({ change, trend }: { change: number; trend: 'up' | 'down' }) => {
    const isPositive = trend === 'up'
    const color = isPositive ? 'text-green-600' : 'text-red-600'
    const Icon = isPositive ? TrendingUp : TrendingDown

    if (change === 0) {
      return (
        <div className="flex justify-end items-center gap-1 text-gray-500">
          <span className="text-sm font-medium">0%</span>
        </div>
      )
    }

    if (isNaN(change) || !isFinite(change)) {
      return (
        <div className="flex justify-end items-center gap-1 text-gray-500">
          <span className="text-sm font-medium">--</span>
        </div>
      )
    }

    return (
      <div className={`flex justify-end items-center gap-1 ${color}`}>
        <Icon className="w-3 h-3" />
        <span className="text-sm font-medium">{Math.abs(change)}%</span>
      </div>
    )
  }
)

ChangeIndicator.displayName = 'ChangeIndicator'

type DatePreset =
  | 'today'
  | 'thisWeek'
  | 'thisMonth'
  | 'thisYear'
  | 'personalized'

// Helper functions to calculate preset dates (shared between components)
const getTodayRange = (): DateRange => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return { from: today, to: today }
}

const getThisWeekRange = (): DateRange => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(today)
  weekAgo.setDate(today.getDate() - 6) // 7 días total: desde hace 6 días hasta hoy
  weekAgo.setHours(0, 0, 0, 0)
  return { from: weekAgo, to: today }
}

const getThisMonthRange = (): DateRange => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const monthAgo = new Date(today)
  monthAgo.setMonth(today.getMonth() - 1) // Un mes hacia atrás
  monthAgo.setHours(0, 0, 0, 0)
  return { from: monthAgo, to: today }
}

const getThisYearRange = (): DateRange => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yearAgo = new Date(today)
  yearAgo.setFullYear(today.getFullYear() - 1) // Un año hacia atrás
  yearAgo.setHours(0, 0, 0, 0)
  return { from: yearAgo, to: today }
}

const getPresetRange = (preset: DatePreset): DateRange => {
  switch (preset) {
    case 'today':
      return getTodayRange()
    case 'thisWeek':
      return getThisWeekRange()
    case 'thisMonth':
      return getThisMonthRange()
    case 'thisYear':
      return getThisYearRange()
    default:
      return getThisMonthRange()
  }
}

const DateRangeSelector = React.memo(
  ({
    date,
    setDate,
    onPresetChange
  }: {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
    onPresetChange?: (preset: DatePreset) => void
  }) => {
    const isValidDateRange = React.useCallback(
      (dateRange: DateRange | undefined): boolean => {
        if (!dateRange?.from) return false
        if (!dateRange.to) return true
        return dateRange.from <= dateRange.to
      },
      []
    )

    // Detect which preset matches the current date range (memoized)
    const detectPreset = React.useCallback(
      (dateRange: DateRange | undefined): DatePreset => {
        if (!dateRange?.from || !dateRange.to) return 'thisMonth'

        const todayRange = getTodayRange()
        const thisWeekRange = getThisWeekRange()
        const thisMonthRange = getThisMonthRange()
        const thisYearRange = getThisYearRange()

        const formatDateKey = (d: Date) =>
          `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

        const currentFromKey = formatDateKey(dateRange.from)
        const currentToKey = formatDateKey(dateRange.to)

        if (
          todayRange.from &&
          todayRange.to &&
          formatDateKey(todayRange.from!) === currentFromKey &&
          formatDateKey(todayRange.to!) === currentToKey
        ) {
          return 'today'
        }

        if (
          thisWeekRange.from &&
          thisWeekRange.to &&
          formatDateKey(thisWeekRange.from!) === currentFromKey &&
          formatDateKey(thisWeekRange.to!) === currentToKey
        ) {
          return 'thisWeek'
        }

        if (
          thisMonthRange.from &&
          thisMonthRange.to &&
          formatDateKey(thisMonthRange.from!) === currentFromKey &&
          formatDateKey(thisMonthRange.to!) === currentToKey
        ) {
          return 'thisMonth'
        }

        if (
          thisYearRange.from &&
          thisYearRange.to &&
          formatDateKey(thisYearRange.from!) === currentFromKey &&
          formatDateKey(thisYearRange.to!) === currentToKey
        ) {
          return 'thisYear'
        }

        return 'personalized'
      },
      []
    )

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)
    const [tempPreset, setTempPreset] = React.useState<DatePreset>(
      date ? detectPreset(date) : 'thisMonth'
    )
    const [calendarMonth, setCalendarMonth] = React.useState<Date | undefined>(
      date?.from
    )

    // Update preset when date changes externally (only when popover is closed)
    React.useEffect(() => {
      if (date && !isPopoverOpen) {
        setTempDate(date)
        setTempPreset(detectPreset(date))
        setCalendarMonth(date.from)
      }
    }, [date, isPopoverOpen, detectPreset])

    // Initialize temp state when popover opens
    React.useEffect(() => {
      if (isPopoverOpen) {
        setTempDate(date)
        setTempPreset(date ? detectPreset(date) : 'thisMonth')
        setCalendarMonth(date?.from)
      }
    }, [isPopoverOpen, date, detectPreset])

    // Handle popover close - apply changes or set default
    const handlePopoverClose = React.useCallback(
      (open: boolean) => {
        setIsPopoverOpen(open)

        if (!open) {
          // Popover is closing, apply changes
          if (!tempDate?.from || !tempDate?.to) {
            // No valid date range, apply default (this month)
            const thisMonthRange = getThisMonthRange()
            setDate(thisMonthRange)
            onPresetChange?.('thisMonth')
          } else {
            // Validate date range before applying
            if (isValidDateRange(tempDate)) {
              setDate(tempDate)
              onPresetChange?.(tempPreset)
            } else {
              // Invalid range, apply default
              const thisMonthRange = getThisMonthRange()
              setDate(thisMonthRange)
              onPresetChange?.('thisMonth')
            }
          }
        }
      },
      [tempDate, tempPreset, setDate, isValidDateRange, onPresetChange]
    )

    const handlePresetChange = React.useCallback((preset: DatePreset) => {
      setTempPreset(preset)

      switch (preset) {
        case 'today': {
          const range = getTodayRange()
          setTempDate(range)
          setCalendarMonth(range.from)
          break
        }
        case 'thisWeek': {
          const range = getThisWeekRange()
          setTempDate(range)
          setCalendarMonth(range.from)
          break
        }
        case 'thisMonth': {
          const range = getThisMonthRange()
          setTempDate(range)
          setCalendarMonth(range.from)
          break
        }
        case 'thisYear': {
          const range = getThisYearRange()
          setTempDate(range)
          setCalendarMonth(range.from)
          break
        }
        case 'personalized':
          // Don't change date, just allow manual selection
          break
      }
    }, [])

    const handleCalendarSelect = React.useCallback(
      (newDate: DateRange | undefined) => {
        if (!newDate) {
          // If cleared, clear temp date (will apply default on close)
          setTempDate(undefined)
          setTempPreset('thisMonth')
          return
        }

        setTempDate(newDate)
        // When manually selecting in calendar, always set to 'personalized'
        setTempPreset('personalized')
      },
      []
    )

    const presetOptions = [
      { value: 'today', label: 'Today' },
      { value: 'thisWeek', label: 'This Week' },
      { value: 'thisMonth', label: 'This Month' },
      { value: 'thisYear', label: 'This Year' },
      { value: 'personalized', label: 'Personalized' }
    ]

    return (
      <div className="flex items-center gap-2">
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverClose}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              aria-label="Select date range"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 border-b space-y-3">
              <h3 className="text-sm font-semibold">Select Date Range</h3>
              <Select
                value={tempPreset}
                onValueChange={value => handlePresetChange(value as DatePreset)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {presetOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Calendar
              key={tempPreset}
              initialFocus
              mode="range"
              defaultMonth={calendarMonth || tempDate?.from || date?.from}
              selected={tempDate}
              onSelect={handleCalendarSelect}
              isDual
            />
          </PopoverContent>
        </Popover>
        {date?.from && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const thisMonthRange = getThisMonthRange()
              setDate(thisMonthRange)
              onPresetChange?.('thisMonth')
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        )}
      </div>
    )
  }
)

DateRangeSelector.displayName = 'DateRangeSelector'

const createLocalDate = (dateString: string): Date | null => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null
  }

  try {
    const [year, month, day] = dateString.split('-').map(Number)
    // Set to noon to avoid timezone/DST issues at midnight
    const date = new Date(year, month - 1, day, 12, 0, 0)

    if (isNaN(date.getTime())) {
      return null
    }

    return date
  } catch (error) {
    return null
  }
}

const PeriodSelector = React.memo(
  ({
    selectedPeriod,
    onPeriodChange
  }: {
    selectedPeriod: 'daily' | 'weekly' | 'monthly'
    onPeriodChange: (value: 'daily' | 'weekly' | 'monthly') => void
  }) => {
    const periodOptions = [
      { value: 'daily' as const, label: 'Daily Period' },
      { value: 'weekly' as const, label: 'Weekly Period' },
      { value: 'monthly' as const, label: 'Monthly Period' }
    ]

    return (
      <div className="flex items-center gap-2">
        <Select
          value={selectedPeriod}
          onValueChange={value =>
            onPeriodChange(value as 'daily' | 'weekly' | 'monthly')
          }
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
)

PeriodSelector.displayName = 'PeriodSelector'

const DateRangeFilter = React.memo(
  ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onPresetChange
  }: {
    startDate: string
    endDate: string
    onStartDateChange: (value: string) => void
    onEndDateChange: (value: string) => void
    onPresetChange?: (preset: DatePreset) => void
  }) => {
    const memoizedCreateLocalDate = React.useCallback(createLocalDate, [])
    const dateRange = React.useMemo(() => {
      if (!startDate && !endDate) return undefined

      const from = startDate
        ? memoizedCreateLocalDate(startDate) || undefined
        : undefined
      const to = endDate
        ? memoizedCreateLocalDate(endDate) || undefined
        : undefined

      return { from, to } as DateRange
    }, [startDate, endDate, memoizedCreateLocalDate])

    const handleDateRangeChange = React.useCallback(
      (range: DateRange | undefined) => {
        // When date changes from DateRangeSelector, we still need to update the dates
        // The preset will be handled separately via onPresetChange
        const formatDateToLocal = (date: Date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        onStartDateChange(range?.from ? formatDateToLocal(range.from) : '')
        onEndDateChange(range?.to ? formatDateToLocal(range.to) : '')
      },
      [onStartDateChange, onEndDateChange]
    )

    return (
      <div className="flex items-center gap-2">
        <DateRangeSelector
          date={dateRange}
          setDate={handleDateRangeChange}
          onPresetChange={onPresetChange}
        />
      </div>
    )
  }
)

DateRangeFilter.displayName = 'DateRangeFilter'

const FilterControls = React.memo(
  ({
    selectedCategory,
    volumeFilter,
    pageSize,
    onCategoryChange,
    onVolumeFilterChange,
    onPageSizeChange,
    isLoading
  }: {
    selectedCategory: string
    volumeFilter: string
    pageSize: number
    onCategoryChange: (value: string) => void
    onVolumeFilterChange: (value: string) => void
    onPageSizeChange: (value: string) => void
    isLoading: boolean
  }) => {
    const { categoryOptions, isLoading: categoriesLoading } =
      useCategoryOptions()
    const { volumeFilterOptions, isLoading: volumeFiltersLoading } =
      useVolumeFilterOptions()

    return (
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Select
            value={selectedCategory}
            onValueChange={onCategoryChange}
            disabled={isLoading || categoriesLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <div className="flex justify-center gap-2 py-4">
                  <Spinner />
                </div>
              ) : (
                categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-1">
          <label className="text-sm font-medium text-gray-700">
            Volume Filter
          </label>
          <Select
            value={volumeFilter}
            onValueChange={onVolumeFilterChange}
            disabled={isLoading || volumeFiltersLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {volumeFiltersLoading ? (
                <div className="flex justify-center gap-2 py-4">
                  <Spinner />
                </div>
              ) : (
                volumeFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-1">
          <label className="text-sm font-medium text-gray-700">Page Size</label>
          <Select
            value={pageSize.toString()}
            onValueChange={onPageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }
)

FilterControls.displayName = 'FilterControls'

const Pagination = React.memo(
  ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange
  }: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
    onPageChange: (page: number) => void
  }) => (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500">
        Showing {(currentPage - 1) * pageSize + 1} to{' '}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8"
              >
                {pageNum}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
)

Pagination.displayName = 'Pagination'

const Page = () => {
  const router = useRouter()
  const { toast } = useToast()

  const FILTERS_STORAGE_KEY = 'dashboard-filters'
  const saveFiltersToStorage = React.useCallback(
    (filters: {
      currentPage: number
      pageSize: number
      selectedCategory: string
      volumeFilter: string
      startDate: string
      endDate: string
      selectedPeriod: 'daily' | 'weekly' | 'monthly'
      view: 'level2' | 'parent'
    }) => {
      try {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters))
      } catch (error) {
        console.warn('Failed to save filters to localStorage:', error)
      }
    },
    []
  )

  const loadFiltersFromStorage = React.useCallback(() => {
    try {
      const stored = localStorage.getItem(FILTERS_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load filters from localStorage:', error)
    }
    return null
  }, [])

  const initialFilters = React.useMemo(() => {
    const stored = loadFiltersFromStorage()
    const defaultFilters = {
      currentPage: 1,
      pageSize: 10,
      selectedCategory: 'all',
      volumeFilter: 'all',
      startDate: '',
      endDate: '',
      selectedPeriod: 'monthly' as const,
      view: 'level2' as const,
      datePreset: 'thisMonth' as DatePreset
    }

    if (!stored) {
      // Apply default preset (thisMonth) and calculate dates
      const defaultRange = getThisMonthRange()
      const formatDateToLocal = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      return {
        ...defaultFilters,
        startDate: formatDateToLocal(defaultRange.from!),
        endDate: formatDateToLocal(defaultRange.to!)
      }
    }

    // Migrate old period values (yearly, ytd) to supported values
    const validPeriods = ['daily', 'weekly', 'monthly']
    const storedPeriod = stored.selectedPeriod
    const migratedPeriod = validPeriods.includes(storedPeriod)
      ? storedPeriod
      : 'monthly' // Default to monthly if period is not supported

    const mergedFilters = {
      ...defaultFilters,
      ...stored,
      selectedPeriod: migratedPeriod
    }

    // If there's a stored preset (not personalized), recalculate dates from preset
    if (stored.datePreset && stored.datePreset !== 'personalized') {
      const presetRange = getPresetRange(stored.datePreset as DatePreset)
      const formatDateToLocal = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      return {
        ...mergedFilters,
        datePreset: stored.datePreset as DatePreset,
        startDate: formatDateToLocal(presetRange.from!),
        endDate: formatDateToLocal(presetRange.to!)
      }
    }

    // If personalized or no preset, use stored dates or defaults
    return {
      ...mergedFilters,
      datePreset: (stored.datePreset || 'personalized') as DatePreset
    }
  }, [loadFiltersFromStorage])

  const [currentPage, setCurrentPage] = React.useState(
    initialFilters.currentPage
  )
  const [pageSize, setPageSize] = React.useState(initialFilters.pageSize)
  const [selectedCategory, setSelectedCategory] = React.useState(
    initialFilters.selectedCategory
  )
  const [volumeFilter, setVolumeFilter] = React.useState(
    initialFilters.volumeFilter
  )
  const [startDate, setStartDate] = React.useState(initialFilters.startDate)
  const [endDate, setEndDate] = React.useState(initialFilters.endDate)
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    'daily' | 'weekly' | 'monthly'
  >(initialFilters.selectedPeriod)

  const [tableViewMode, setTableViewMode] = React.useState<'level2' | 'parent'>(
    initialFilters.view || 'level2'
  )
  const [datePreset, setDatePreset] = React.useState<DatePreset>(
    initialFilters.datePreset || 'thisMonth'
  )

  React.useEffect(() => {
    const filters = {
      currentPage,
      pageSize,
      selectedCategory,
      volumeFilter,
      startDate,
      endDate,
      selectedPeriod,
      view: tableViewMode,
      datePreset
    }
    saveFiltersToStorage(filters)
  }, [
    currentPage,
    pageSize,
    selectedCategory,
    volumeFilter,
    startDate,
    endDate,
    selectedPeriod,
    tableViewMode,
    datePreset,
    saveFiltersToStorage
  ])

  // Calculate days for Dashboard Stats (only uses days parameter)
  // If dates are selected, calculate lookback from start date to today
  // Otherwise default to 30 days
  const statsDays = React.useMemo(() => {
    if (startDate) {
      const start = new Date(startDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    // Default to 30 days if no dates provided
    return 30
  }, [startDate])

  // Map period to API format (week, month, or day)
  const chartPeriod = React.useMemo(() => {
    if (selectedPeriod === 'daily') return 'day'
    if (selectedPeriod === 'weekly') return 'week'
    if (selectedPeriod === 'monthly') return 'month'
    return 'week' // default
  }, [selectedPeriod])

  // Dashboard Stats Hook (only accepts days parameter)
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError
  } = useDashboardStats({ days: statsDays })

  // Calculate volume filter parameters
  const volumeFilterParams = React.useMemo(() => {
    const LOW_VOLUME_THRESHOLD = 50 // Threshold for low volume
    const HIGH_VOLUME_THRESHOLD = 5000 // Threshold for high volume
    if (volumeFilter === 'low-volume') {
      return { max_volume: LOW_VOLUME_THRESHOLD }
    } else if (volumeFilter === 'normal-volume') {
      return {
        min_volume: LOW_VOLUME_THRESHOLD + 1,
        max_volume: HIGH_VOLUME_THRESHOLD - 1
      }
    } else if (volumeFilter === 'high-volume') {
      return { min_volume: HIGH_VOLUME_THRESHOLD }
    }
    return {}
  }, [volumeFilter])

  // Dashboard Level2 Breakdown Hook (for table)
  const {
    data: breakdownData,
    isLoading: breakdownLoading,
    error: breakdownError
  } = useDashboardLevel2Breakdown({
    start_date: startDate ? `${startDate}T00:00:00Z` : undefined,
    end_date: endDate ? `${endDate}T23:59:59Z` : undefined,
    days: !startDate && !endDate ? 30 : undefined, // Only use days if no dates provided
    group_by: tableViewMode,
    category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
    ...volumeFilterParams,
    page: currentPage,
    page_size: pageSize
  })

  // Dashboard Chart Data Hook
  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError
  } = useDashboardChartData({ period: chartPeriod })

  // Combine loading states
  const isLoading = statsLoading || breakdownLoading || chartLoading

  // Combine errors - prioritize breakdown error as it's the main data
  const automationError = breakdownError || statsError || chartError

  // Map breakdown data to table format
  const rawIssuesTableData = React.useMemo(() => {
    if (!breakdownData?.results) return []
    return breakdownData.results.map((item: any) => ({
      parent_category: item.parent_category,
      parent_category_id: item.parent_category_id,
      level2_taxonomy_name: item.level_2_category,
      level_2_category_id: item.level_2_category_id,
      ticket_volume_month: item.ticket_volume,
      confidence_percent: item.total_tickets_percentage,
      automation_rate: item.ticket_automated_percentage,
      automation_eligible_count: item.tickets_automated_number,
      automation_success_rate: item.success_rate,
      automation_failure_rate: item.failure_rate,
      automation_count: item.number_of_automations,
      subcategories: (item as any).subcategories || undefined
    }))
  }, [breakdownData])

  const issuesTableData = React.useMemo(() => {
    // Note: volume_filter logic removed as new API doesn't provide is_low_volume
    // If needed, this could be calculated based on ticket_volume thresholds
    return rawIssuesTableData
  }, [rawIssuesTableData])

  const totalPages = React.useMemo(() => {
    if (!breakdownData?.num_pages) return 1
    return breakdownData.num_pages
  }, [breakdownData?.num_pages])

  const handlePageChange = React.useCallback((newPage: number) => {
    setCurrentPage(newPage)
  }, [])

  const handlePageSizeChange = React.useCallback((newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1)
  }, [])

  const handleCategoryChange = React.useCallback((newCategory: string) => {
    setSelectedCategory(newCategory)
    setCurrentPage(1)
  }, [])

  const handleVolumeFilterChange = React.useCallback(
    (newVolumeFilter: string) => {
      setVolumeFilter(newVolumeFilter)
      setCurrentPage(1)
    },
    []
  )

  const handleStartDateChange = React.useCallback((newStartDate: string) => {
    setStartDate(newStartDate)
    setDatePreset('personalized') // When manually changing dates, mark as personalized
    setCurrentPage(1)
  }, [])

  const handleEndDateChange = React.useCallback((newEndDate: string) => {
    setEndDate(newEndDate)
    setDatePreset('personalized') // When manually changing dates, mark as personalized
    setCurrentPage(1)
  }, [])

  const handleDatePresetChange = React.useCallback((preset: DatePreset) => {
    setDatePreset(preset)

    if (preset !== 'personalized') {
      // Calculate dates from preset and update them
      const presetRange = getPresetRange(preset)
      const formatDateToLocal = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      setStartDate(formatDateToLocal(presetRange.from!))
      setEndDate(formatDateToLocal(presetRange.to!))
    }
    // If personalized, dates are already set manually, don't change them
    setCurrentPage(1)
  }, [])

  const handlePeriodChange = React.useCallback(
    (newPeriod: 'daily' | 'weekly' | 'monthly') => {
      setSelectedPeriod(newPeriod)
      setCurrentPage(1)
    },
    []
  )

  const handleTableViewModeChange = React.useCallback(
    (newMode: 'level2' | 'parent') => {
      setTableViewMode(newMode)
      setCurrentPage(1)
    },
    []
  )

  React.useEffect(() => {
    if (automationError) {
      const errorMessage = 
        automationError && typeof automationError === 'object' && 'message' in automationError
          ? String((automationError as any).message)
          : 'Failed to load automation opportunities'
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage
      })
    }
  }, [automationError, toast])

  // Helper function to build URL with filters
  const buildDetailUrl = React.useCallback(
    (id: string, categoryType: 'level2' | 'parent', status?: string) => {
      const params = new URLSearchParams()
      params.set('category_type', categoryType)
      if (status) params.set('status', status)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)

      return `/home/${id}${params.toString() ? `?${params.toString()}` : ''}`
    },
    [startDate, endDate]
  )

  // Define table columns for context menu
  const tableColumns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'parent_category',
        header: 'Parent Category',
        accessorKey: 'parent_category',
        cell: (row: any) => row?.parent_category || '--'
      },
      {
        id: 'level2_taxonomy_name',
        header: `Level 2 ${
          tableViewMode === 'parent' ? 'Categories' : 'Category'
        }`,
        accessorKey: 'level2_taxonomy_name',
        className: `${tableViewMode === 'parent' ? 'text-right' : ''}`,
        cell: (row: any) => {
          if (tableViewMode === 'parent') {
            // Show count of subcategories when in "By parent" mode
            const subcategoriesCount = row?.subcategories?.length || 0
            return subcategoriesCount > 0 ? subcategoriesCount : '--'
          } else {
            // Show level2_taxonomy_name when in "By level 2" mode
            return row?.level2_taxonomy_name || '--'
          }
        }
      },
      {
        id: 'ticket_volume_month',
        header: 'Ticket Volume/Month (Reach)',
        accessorKey: 'ticket_volume_month',
        className: 'text-right',
        cell: (row: any) => row?.ticket_volume_month?.toLocaleString() || '--'
      },
      {
        id: 'confidence_percent',
        header: 'Total Tickets %',
        accessorKey: 'confidence_percent',
        className: 'text-right',
        cell: (row: any) =>
          row?.confidence_percent ? `${row?.confidence_percent}%` : '--'
      },
      {
        id: 'automation_rate',
        header: 'Ticket automated %',
        accessorKey: 'automation_rate',
        className: 'text-right',
        cell: (row: any) => (
          <div
            className="w-full h-full flex items-center justify-end cursor-pointer group"
            onClick={e => {
              e.stopPropagation()
              // Try level_2_category_id first, then fallback to parent_category_id
              const id = row?.level_2_category_id || row?.parent_category_id
              if (id) {
                // Determine category_type based on which ID is used
                const categoryType: 'level2' | 'parent' =
                  row?.level_2_category_id ? 'level2' : 'parent'
                router.push(buildDetailUrl(id, categoryType, 'automated'))
              }
            }}
          >
            {row?.automation_rate !== undefined ? (
              <span>{row?.automation_rate.toFixed(1)}%</span>
            ) : (
              '--'
            )}
          </div>
        )
      },
      {
        id: 'automation_eligible_count',
        header: 'Tickets Automated Number',
        accessorKey: 'automation_eligible_count',
        className: 'text-right',
        cell: (row: any) =>
          row?.automation_eligible_count !== undefined ? (
            <span>{row?.automation_eligible_count}</span>
          ) : (
            '--'
          )
      },
      {
        id: 'automation_success_rate',
        header: 'Success Rate',
        accessorKey: 'automation_success_rate',
        className: 'text-right',
        cell: (row: any) => (
          <div
            className="w-full h-full flex items-center justify-end cursor-pointer group"
            onClick={e => {
              e.stopPropagation()
              // Try level_2_category_id first, then fallback to parent_category_id
              const id = row?.level_2_category_id || row?.parent_category_id
              if (id) {
                // Determine category_type based on which ID is used
                const categoryType: 'level2' | 'parent' =
                  row?.level_2_category_id ? 'level2' : 'parent'
                router.push(buildDetailUrl(id, categoryType, 'success'))
              }
            }}
          >
            {row?.automation_success_rate !== null &&
            row?.automation_success_rate !== undefined ? (
              <span>{row.automation_success_rate.toFixed(1)}%</span>
            ) : (
              '--'
            )}
          </div>
        )
      },
      {
        id: 'automation_failure_rate',
        header: 'Failure Rate',
        accessorKey: 'automation_failure_rate',
        className: 'text-right',
        cell: (row: any) => (
          <div
            className="w-full h-full flex items-center justify-end cursor-pointer group"
            onClick={e => {
              e.stopPropagation()
              // Try level_2_category_id first, then fallback to parent_category_id
              const id = row?.level_2_category_id || row?.parent_category_id
              if (id) {
                // Determine category_type based on which ID is used
                const categoryType: 'level2' | 'parent' =
                  row?.level_2_category_id ? 'level2' : 'parent'
                router.push(buildDetailUrl(id, categoryType, 'failed'))
              }
            }}
          >
            {row?.automation_failure_rate !== null &&
            row?.automation_failure_rate !== undefined ? (
              <span>{row.automation_failure_rate.toFixed(1)}%</span>
            ) : (
              '--'
            )}
          </div>
        )
      },
      {
        id: 'automation_count',
        header: 'Number of Automations',
        accessorKey: 'automation_count',
        className: 'text-right',
        cell: (row: any) =>
          row?.automation_count !== undefined &&
          row?.automation_count !== null ? (
            <span>{row?.automation_count}</span>
          ) : (
            '--'
          )
      }
    ]
    return baseColumns
  }, [tableViewMode, router, buildDetailUrl])

  return (
    <div className="w-full px-[20px] py-[20px] flex flex-col">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mt-2">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <PeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
            />
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onPresetChange={handleDatePresetChange}
            />
          </div>
        </div>
      </div>
      <Separator className="my-4" />

      {/* Main Content */}
      <div className="pb-[80px] md:pb-[20px]">
        <div className="flex flex-col gap-4">
          {/* Overall Company Summary */}
          <OverallCompanySummary
            data={statsData?.overall}
            isLoading={statsLoading}
          />

          {/* New Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <OverallCompanyTrendChart
              period={selectedPeriod}
              chartData={chartData}
              isLoading={chartLoading}
            />
            <Level2VsParentChart
              breakdownData={breakdownData}
              isLoading={breakdownLoading}
            />
          </div>

          {/* Tickets by Category */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Tickets by Category</CardTitle>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Filtered by {selectedPeriod} period
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={tableViewMode}
                    onValueChange={(v: 'parent' | 'level2') =>
                      handleTableViewModeChange(v)
                    }
                  >
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">By Parent</SelectItem>
                      <SelectItem value="level2">By Level 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">Sort</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters Section */}
              <FilterControls
                selectedCategory={selectedCategory}
                volumeFilter={volumeFilter}
                pageSize={pageSize}
                onCategoryChange={handleCategoryChange}
                onVolumeFilterChange={handleVolumeFilterChange}
                onPageSizeChange={handlePageSizeChange}
                isLoading={isLoading}
              />

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </div>
              ) : (
                <>
                  <SelectableTableWithContextMenu
                    data={issuesTableData}
                    columns={tableColumns}
                    tableName="Automation Opportunities Dashboard"
                    onRowClick={(item: any) => {
                      const categoryId =
                        item?.level_2_category_id || item?.parent_category_id
                      if (!categoryId) {
                        return
                      }
                      // Determine category_type based on which ID is used
                      const categoryType: 'level2' | 'parent' =
                        item?.level_2_category_id ? 'level2' : 'parent'
                      const url = buildDetailUrl(categoryId, categoryType)
                      router.push(url)
                    }}
                  />

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={breakdownData?.count || 0}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
