'use client'

import React from 'react'
import { X, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface InputWithContextProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  contextChip?: {
    label: string
    count: number
    onRemove?: () => void
    tableData?: any[] // Data for tooltip preview
    columns?: any[] // Column definitions for proper ordering
  }
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const InputWithContext = React.forwardRef<
  HTMLTextAreaElement,
  InputWithContextProps
>(({ className, contextChip, onChange, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  // Auto-resize textarea
  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [])

  React.useEffect(() => {
    adjustHeight()
  }, [props.value, adjustHeight])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e)
    adjustHeight()
  }

  return (
    <div
      className={cn(
        'flex flex-col min-h-[40px] w-full gap-2.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-shadow focus-within:shadow-sm',
        className
      )}
    >
      {contextChip && (
        <div className="flex items-center w-full min-w-0 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="group flex items-center gap-1.5 w-fit max-w-full min-w-0 rounded-md border border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-800 px-2 py-1 text-xs shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-400">
                  <Database className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                  {(() => {
                    // Get display value for the first item
                    const getDisplayValue = (row: any, columns?: any[]) => {
                      if (!row) return null

                      // If columns are provided, use their order
                      if (columns && columns.length > 0) {
                        for (const col of columns) {
                          const accessor = col.accessorKey || col.id
                          const value = row[accessor]

                          if (
                            typeof value === 'string' &&
                            value.length > 0 &&
                            value.length < 100 &&
                            !accessor?.startsWith('_')
                          ) {
                            return value
                          }
                        }
                      }

                      // Fallback: Get the first valid field value from object
                      const values = Object.values(row)
                      const firstValidValue = values.find(
                        val =>
                          typeof val === 'string' &&
                          val.length > 0 &&
                          val.length < 100 &&
                          !String(val).startsWith('_')
                      )

                      return firstValidValue || null
                    }

                    const firstItem =
                      contextChip.tableData && contextChip.tableData.length > 0
                        ? contextChip.tableData[0]
                        : null

                    const displayValue = firstItem
                      ? getDisplayValue(firstItem, contextChip.columns)
                      : null
                    const hasMultipleItems = contextChip.count > 1

                    // Strategy: Show item name(s) when 1-3 items, otherwise show count
                    if (displayValue && contextChip.count <= 3) {
                      // Show item name(s) for 1-3 items
                      const maxLength = contextChip.count === 1 ? 60 : 40
                      const truncatedValue =
                        String(displayValue).length > maxLength
                          ? String(displayValue).substring(0, maxLength) + '...'
                          : String(displayValue)

                      return (
                        <>
                          {contextChip.count === 1 ? (
                            // Single item: "Billing & Account from Automation Opportunities Dashboard"
                            <>
                              <span className="text-blue-800 truncate min-w-0 font-medium">
                                {truncatedValue}
                              </span>
                              {contextChip.label && (
                                <span className="text-blue-600 truncate min-w-0 text-xs ml-1">
                                  from {contextChip.label}
                                </span>
                              )}
                            </>
                          ) : (
                            // Multiple items (2-3): "Row 3: Billing & Account from Automation... (+2 more)"
                            <>
                              <span className="font-semibold whitespace-nowrap flex-shrink-0 text-blue-900">
                                Row {contextChip.count}:{' '}
                              </span>
                              <span className="text-blue-800 truncate min-w-0 font-medium">
                                {truncatedValue}
                              </span>
                              {contextChip.label && (
                                <span className="text-blue-600 truncate min-w-0 text-xs ml-1">
                                  from {contextChip.label}
                                </span>
                              )}
                              {hasMultipleItems && (
                                <span className="text-blue-500 text-xs ml-1 flex-shrink-0 font-medium whitespace-nowrap">
                                  (+{contextChip.count - 1} more)
                                </span>
                              )}
                            </>
                          )}
                        </>
                      )
                    } else {
                      // Show count format for 4+ items or when no display value
                      return (
                        <>
                          <span className="font-semibold whitespace-nowrap flex-shrink-0">
                            {contextChip.count}{' '}
                            {contextChip.count === 1 ? 'item' : 'items'}
                          </span>
                          {contextChip.label && (
                            <span className="text-blue-700 truncate min-w-0 font-medium">
                              from {contextChip.label}
                            </span>
                          )}
                        </>
                      )
                    }
                  })()}
                </div>
              </TooltipTrigger>
              {contextChip.tableData && contextChip.tableData.length > 0 && (
                <TooltipContent
                  side="bottom"
                  align="start"
                  className="max-w-md max-h-64 overflow-hidden flex flex-col p-0 border border-gray-200 shadow-lg"
                  sideOffset={4}
                >
                  <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200">
                    <p className="font-semibold text-xs text-blue-900">
                      {contextChip.label && (
                        <span className="text-blue-700">
                          {contextChip.label}
                        </span>
                      )}
                      <span
                        className={cn(
                          'text-blue-600 font-medium',
                          contextChip.label && 'ml-1'
                        )}
                      >
                        ({contextChip.count})
                      </span>
                    </p>
                  </div>
                  <div className="overflow-y-auto max-h-48 px-3 py-2 space-y-1.5">
                    {contextChip.tableData.slice(0, 10).map((row, index) => {
                      // Get the first valid field value using column order if available
                      let displayValue = null

                      if (
                        contextChip.columns &&
                        contextChip.columns.length > 0
                      ) {
                        for (const col of contextChip.columns) {
                          const accessor = col.accessorKey || col.id
                          const value = row[accessor]

                          if (
                            typeof value === 'string' &&
                            value.length > 0 &&
                            value.length < 100 &&
                            !accessor?.startsWith('_')
                          ) {
                            displayValue = value
                            break
                          }
                        }
                      }

                      // Fallback: Get first valid field value from object
                      if (!displayValue) {
                        const values = Object.values(row)
                        const firstValidValue = values.find(
                          val =>
                            typeof val === 'string' &&
                            val.length > 0 &&
                            val.length < 100 &&
                            !String(val).startsWith('_')
                        )
                        displayValue = firstValidValue || `Row ${index + 1}`
                      }

                      return (
                        <div
                          key={index}
                          className="text-xs text-gray-700 py-1 px-2 rounded hover:bg-gray-50 transition-colors flex items-start gap-2"
                        >
                          <span className="text-blue-500 mt-0.5 flex-shrink-0">
                            •
                          </span>
                          <span className="truncate flex-1">
                            {String(displayValue).substring(0, 50)}
                            {String(displayValue).length > 50 ? '...' : ''}
                          </span>
                        </div>
                      )
                    })}
                    {contextChip.tableData.length > 10 && (
                      <div className="pt-1 pb-1 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic text-center">
                          ... and {contextChip.tableData.length - 10} more{' '}
                          {contextChip.tableData.length - 10 === 1
                            ? 'item'
                            : 'items'}
                        </p>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          {contextChip.onRemove && (
            <button
              type="button"
              aria-label="Remove context"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                contextChip.onRemove?.()
              }}
              className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-md p-0.5 leading-none transition-all duration-200 hover:bg-red-100 hover:text-red-600 text-gray-500 hover:scale-110 flex-shrink-0 self-center group/remove"
              title="Remove context"
            >
              <X className="h-3.5 w-3.5 transition-transform group-hover/remove:rotate-90" />
            </button>
          )}
        </div>
      )}
      <textarea
        ref={node => {
          textareaRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(
          'w-full bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-auto min-h-[24px]'
        )}
        onChange={handleChange}
        rows={1}
        {...props}
      />
    </div>
  )
})

InputWithContext.displayName = 'InputWithContext'
