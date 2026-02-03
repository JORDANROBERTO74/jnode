'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { DayPicker, MonthCaptionProps, DateRange } from 'react-day-picker'
import { addMonths, isSameMonth } from 'date-fns'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  isDual?: boolean
}

// Create a context to share the onMonthChange function
const CalendarContext = React.createContext<{
  onMonthChange?: (date: Date) => void
}>({})

// Custom Caption component with year and month selectors
function CustomCaption(props: MonthCaptionProps) {
  const displayMonth = props.calendarMonth?.date || new Date()
  const { onMonthChange } = React.useContext(CalendarContext)
  const currentYear = displayMonth.getFullYear()
  const currentMonth = displayMonth.getMonth()

  // Generate year options (last 100 years to future 10 years)
  const currentYearNum = new Date().getFullYear()
  const years = Array.from({ length: 111 }, (_, i) => currentYearNum - 100 + i)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const handleYearChange = React.useCallback(
    (year: string) => {
      const newDate = new Date(currentYear, currentMonth, 1)
      newDate.setFullYear(parseInt(year))
      if (onMonthChange) {
        onMonthChange(newDate)
      }
    },
    [currentYear, currentMonth, onMonthChange]
  )

  const handleMonthChange = React.useCallback(
    (month: string) => {
      const newDate = new Date(currentYear, parseInt(month), 1)
      if (onMonthChange) {
        onMonthChange(newDate)
      }
    },
    [currentYear, onMonthChange]
  )

  return (
    <div className="flex items-center justify-center gap-2 px-1">
      <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
        <SelectTrigger className="h-8 w-[140px] text-sm">
          <SelectValue>{months[currentMonth]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={month} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={currentYear.toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="h-8 w-[100px] text-sm">
          <SelectValue>{currentYear}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  month: controlledMonth,
  onMonthChange: onMonthChangeProp,
  defaultMonth,
  isDual,
  ...props
}: CalendarProps) {
  // --- Standard Logic (Single or Linked Months) ---
  const [internalMonth, setInternalMonth] = React.useState<Date | undefined>(
    controlledMonth || defaultMonth
  )
  const currentMonth = controlledMonth ?? internalMonth ?? new Date()

  const handleMonthChange = React.useCallback(
    (date: Date) => {
      if (!controlledMonth) {
        setInternalMonth(date)
      }
      if (onMonthChangeProp) {
        onMonthChangeProp(date)
      }
    },
    [controlledMonth, onMonthChangeProp]
  )

  // --- Dual Logic (Independent Months) ---
  const range = (props.mode === 'range' && 'selected' in props ? props.selected : undefined) as DateRange | undefined
  const { from: rangeFrom, to: rangeTo } = range || {}

  const initialMonth1 = rangeFrom || defaultMonth || new Date()
  const tempMonth2 = rangeTo || addMonths(initialMonth1, 1)
  // If months are the same, show next month in the second calendar
  const initialMonth2 = isSameMonth(initialMonth1, tempMonth2)
    ? addMonths(initialMonth1, 1)
    : tempMonth2

  const [month1, setMonth1] = React.useState<Date>(initialMonth1)
  const [month2, setMonth2] = React.useState<Date>(initialMonth2)

  // Sync months when range changes externally (e.g., from preset selection)
  // Use refs to track previous values and avoid unnecessary updates during manual selection
  const prevRangeFromRef = React.useRef<Date | undefined>(rangeFrom)
  const prevRangeToRef = React.useRef<Date | undefined>(rangeTo)

  React.useEffect(() => {
    if (!isDual) return

    const prevFrom = prevRangeFromRef.current
    const prevTo = prevRangeToRef.current

    // Only update months if range changed externally (not during manual selection)
    // We detect this by checking if both from and to exist and the range is complete
    if (
      rangeFrom &&
      rangeTo &&
      (!prevFrom ||
        !prevTo ||
        rangeFrom.getTime() !== prevFrom.getTime() ||
        rangeTo.getTime() !== prevTo.getTime())
    ) {
      const newMonth1 = rangeFrom
      const tempMonth2 = rangeTo
      const newMonth2 = isSameMonth(newMonth1, tempMonth2)
        ? addMonths(newMonth1, 1)
        : tempMonth2

      setMonth1(newMonth1)
      setMonth2(newMonth2)
      prevRangeFromRef.current = rangeFrom
      prevRangeToRef.current = rangeTo
    } else if (
      rangeFrom &&
      !rangeTo &&
      (!prevFrom || rangeFrom.getTime() !== prevFrom.getTime())
    ) {
      // Initial selection or new start date - only start date selected
      setMonth1(rangeFrom)
      prevRangeFromRef.current = rangeFrom
      prevRangeToRef.current = undefined
    }
  }, [isDual, rangeFrom, rangeTo])

  // If dual mode is active, we render two independent DayPickers
  if (isDual) {
    return (
      <div
        className={cn(
          'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          className
        )}
      >
        <CalendarContext.Provider value={{ onMonthChange: setMonth1 }}>
          <DayPicker
            showOutsideDays={showOutsideDays}
            month={month1}
            onMonthChange={setMonth1}
            className="p-3"
            classNames={{
              months: 'flex flex-col',
              month: 'space-y-4',
              caption: 'flex justify-center pt-1 relative items-center mb-2',
              caption_label: 'text-sm font-medium',
              nav: 'hidden',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell:
                'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: cn(
                'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                props.mode === 'range'
                  ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                  : '[&:has([aria-selected])]:rounded-md'
              ),
              day: cn(
                buttonVariants({ variant: 'ghost' }),
                'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
              ),
              day_range_start: 'day-range-start',
              day_range_end: 'day-range-end',
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside:
                'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
              day_disabled: 'text-muted-foreground opacity-50',
              day_range_middle:
                'aria-selected:bg-accent aria-selected:text-accent-foreground',
              day_hidden: 'invisible',
              ...classNames
            }}
            components={{
              MonthCaption: CustomCaption
            }}
            {...props}
            // Force 1 month per picker
            numberOfMonths={1}
          />
        </CalendarContext.Provider>

        <CalendarContext.Provider value={{ onMonthChange: setMonth2 }}>
          <DayPicker
            showOutsideDays={showOutsideDays}
            month={month2}
            onMonthChange={setMonth2}
            className="p-3"
            classNames={{
              months: 'flex flex-col',
              month: 'space-y-4',
              caption: 'flex justify-center pt-1 relative items-center mb-2',
              caption_label: 'text-sm font-medium',
              nav: 'hidden',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell:
                'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: cn(
                'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                props.mode === 'range'
                  ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                  : '[&:has([aria-selected])]:rounded-md'
              ),
              day: cn(
                buttonVariants({ variant: 'ghost' }),
                'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
              ),
              day_range_start: 'day-range-start',
              day_range_end: 'day-range-end',
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside:
                'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
              day_disabled: 'text-muted-foreground opacity-50',
              day_range_middle:
                'aria-selected:bg-accent aria-selected:text-accent-foreground',
              day_hidden: 'invisible',
              ...classNames
            }}
            components={{
              MonthCaption: CustomCaption
            }}
            {...props}
            // Force 1 month per picker
            numberOfMonths={1}
          />
        </CalendarContext.Provider>
      </div>
    )
  }

  return (
    <CalendarContext.Provider value={{ onMonthChange: handleMonthChange }}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        month={currentMonth}
        onMonthChange={handleMonthChange}
        className={cn('p-3', className)}
        classNames={{
          months:
            'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center mb-2',
          caption_label: 'text-sm font-medium',
          nav: 'hidden',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hidden'
          ),
          nav_button_previous: 'absolute left-1 hidden',
          nav_button_next: 'absolute right-1 hidden',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell:
            'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: cn(
            'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
            props.mode === 'range'
              ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
              : '[&:has([aria-selected])]:rounded-md'
          ),
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
          ),
          day_range_start: 'day-range-start',
          day_range_end: 'day-range-end',
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-accent text-accent-foreground',
          day_outside:
            'day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames
        }}
        components={{
          MonthCaption: CustomCaption
        }}
        {...props}
      />
    </CalendarContext.Provider>
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
