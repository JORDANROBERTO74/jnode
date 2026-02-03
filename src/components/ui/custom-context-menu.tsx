'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'

// Types
interface ContextMenuContextType {
  isOpen: boolean
  position: { x: number; y: number }
  openMenu: (x: number, y: number) => void
  closeMenu: () => void
}

// Context
const ContextMenuContext = React.createContext<ContextMenuContextType | null>(
  null
)

const useContextMenu = () => {
  const context = React.useContext(ContextMenuContext)
  if (!context) {
    throw new Error('useContextMenu must be used within a CustomContextMenu')
  }
  return context
}

// Root Component
interface CustomContextMenuProps {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

export function CustomContextMenu({
  children,
  onOpenChange
}: CustomContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const openMenu = useCallback((x: number, y: number) => {
    setPosition({ x, y })
    setIsOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  return (
    <ContextMenuContext.Provider
      value={{ isOpen, position, openMenu, closeMenu }}
    >
      {children}
    </ContextMenuContext.Provider>
  )
}

// Trigger Component
interface CustomContextMenuTriggerProps {
  children: React.ReactNode
  onContextMenu?: (event: React.MouseEvent) => void
}

export function CustomContextMenuTrigger({
  children,
  onContextMenu
}: CustomContextMenuTriggerProps) {
  const { openMenu } = useContextMenu()

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    openMenu(event.clientX, event.clientY)
    onContextMenu?.(event)
  }

  // Clone the child and add onContextMenu handler
  return (
    <div onContextMenu={handleContextMenu} className="contents">
      {children}
    </div>
  )
}

// Content Component
interface CustomContextMenuContentProps {
  children: React.ReactNode
  className?: string
}

export function CustomContextMenuContent({
  children,
  className
}: CustomContextMenuContentProps) {
  const { isOpen, position, closeMenu } = useContextMenu()
  const contentRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const [isMounted, setIsMounted] = useState(false)

  // SSR compatibility
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Adjust position to keep menu within viewport
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const menu = contentRef.current
      const menuRect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let { x, y } = position

      // Adjust horizontal position
      if (x + menuRect.width > viewportWidth) {
        x = viewportWidth - menuRect.width - 10
      }

      // Adjust vertical position
      if (y + menuRect.height > viewportHeight) {
        y = viewportHeight - menuRect.height - 10
      }

      // Ensure menu doesn't go off-screen on the left or top
      x = Math.max(10, x)
      y = Math.max(10, y)

      setAdjustedPosition({ x, y })
    }
  }, [isOpen, position])

  // Block all interactions outside menu and handle escape key
  useEffect(() => {
    if (!isOpen) return

    // Prevent scroll when menu is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Unified keyboard handler
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeMenu()
        return
      }

      // Block all other keyboard events outside the menu
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    // Block all mouse events outside the menu
    const handleMouseEvent = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        event.preventDefault()
        event.stopPropagation()
        closeMenu()
      }
    }

    // Block scroll events
    const handleWheel = (event: WheelEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    // Options for wheel event
    const wheelOptions = { passive: false, capture: true }

    // Add event listeners with capture phase to block all events
    document.addEventListener('keydown', handleKeyboard, true)
    document.addEventListener('mousedown', handleMouseEvent, true)
    document.addEventListener('click', handleMouseEvent, true)
    document.addEventListener('wheel', handleWheel, wheelOptions)

    return () => {
      // Restore original overflow
      document.body.style.overflow = originalOverflow

      // Remove event listeners with matching options
      document.removeEventListener('keydown', handleKeyboard, true)
      document.removeEventListener('mousedown', handleMouseEvent, true)
      document.removeEventListener('click', handleMouseEvent, true)
      document.removeEventListener('wheel', handleWheel, wheelOptions)
    }
  }, [isOpen, closeMenu])

  // Don't render during SSR or when menu is closed
  if (!isMounted || !isOpen) return null

  return createPortal(
    <>
      {/* Backdrop overlay to block interactions */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        style={{ cursor: 'default' }}
        aria-hidden="true"
      />
      {/* Menu content */}
      <div
        ref={contentRef}
        className={cn(
          'fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          'animate-in fade-in-0 zoom-in-95 duration-100',
          className
        )}
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          transformOrigin: 'top left'
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </>,
    document.body
  )
}

// Item Component
interface CustomContextMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function CustomContextMenuItem({
  children,
  onClick,
  className,
  disabled = false
}: CustomContextMenuItemProps) {
  const { closeMenu } = useContextMenu()

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    closeMenu()
  }

  return (
    <div
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        disabled
          ? 'pointer-events-none opacity-50'
          : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      )}
      onClick={handleClick}
      role="menuitem"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {children}
    </div>
  )
}

// Separator Component
interface CustomContextMenuSeparatorProps {
  className?: string
}

export function CustomContextMenuSeparator({
  className
}: CustomContextMenuSeparatorProps) {
  return <div className={cn('-mx-1 my-1 h-px bg-border', className)} />
}

// Label Component (optional)
interface CustomContextMenuLabelProps {
  children: React.ReactNode
  className?: string
}

export function CustomContextMenuLabel({
  children,
  className
}: CustomContextMenuLabelProps) {
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-sm font-semibold text-foreground',
        className
      )}
    >
      {children}
    </div>
  )
}
