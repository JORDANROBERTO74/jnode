'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Propstype {
  items: string[]
  setItems: (items: string[]) => void
}

const SelectMulti = ({ items, setItems }: Propstype) => {
  const [inputValue, setInputValue] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmedValue = inputValue.trim()
      if (trimmedValue) {
        setItems([...items, trimmedValue])
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && inputValue === '') {
      e.preventDefault()
      if (items.length > 0) {
        setItems(items.slice(0, -1))
      }
    }
  }

  const handleBlur = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue) {
      setItems([...items, trimmedValue])
      setInputValue('')
    }
    setIsFocused(false)
  }

  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <div className="relative mt-2 z-10">
      <div
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={cn(
          `flex flex-wrap items-center rounded-lg bg-background border border-gray-300 pr-0 pl-1 space-x-1 ${
            isFocused && 'ring-2 ring-ring ring-offset-2'
          } ${!items?.length && 'pl-3'}`
        )}
      >
        {items?.map((word, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-full"
          >
            {word}
            <X
              className="ml-1 h-3 w-3 cursor-pointer text-muted-foreground"
              onClick={() => handleDelete(index)}
            />
          </Badge>
        ))}
        <Input
          type="text"
          className="flex-1 px-0 bg-transparent border border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
        />
      </div>
    </div>
  )
}

export default SelectMulti
