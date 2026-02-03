import * as React from 'react'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { Input } from './input'

interface Propstype {
  field?: any
  isRequired?: boolean
  placeholder?: string
}

const InputPassword = ({ field, isRequired, placeholder }: Propstype) => {
  const [isShowed, setIsShowed] = React.useState(false)

  return (
    <div className="relative mt-2 z-10">
      {isShowed ? (
        <EyeOpenIcon
          className="absolute z-100 right-2.5 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={() => setIsShowed(!isShowed)}
        />
      ) : (
        <EyeClosedIcon
          className="absolute z-100 right-2.5 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={() => setIsShowed(!isShowed)}
        />
      )}
      <Input
        required={isRequired}
        type={isShowed ? 'text' : 'password'}
        placeholder={placeholder}
        className="w-full rounded-lg bg-background pr-8"
        {...field}
      />
    </div>
  )
}
export default InputPassword
