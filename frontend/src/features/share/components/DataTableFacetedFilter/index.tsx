import * as React from 'react'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Square, SquareCheck } from 'lucide-react'

interface DataTableFacetedFilterProps {
  value?: string | number | number[]
  title: string
  options: {
    label: string
    value: string | number
    icon?: React.ComponentType<{ className?: string }>
  }[]
  onChange: (value: string | number) => void
}

export function DataTableFacetedFilter({
  value,
  title,
  options,
  onChange,
}: DataTableFacetedFilterProps) {
  const handleSelect = (valueChange: string | number) => {
    onChange(value === valueChange ? '' : valueChange)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {title}
          {value && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                1
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {options
                  .filter(option => value === option.value)
                  .map(option => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Không có kết quả.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        'border-primary flex h-4 w-4 items-center justify-center rounded-sm border',
                        value === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      {value === option.value ? (
                        <SquareCheck className={cn('h-4 w-4')} />
                      ) : (
                        <Square className={cn('h-4 w-4')} />
                      )}
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {value && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange('')}
                    className="justify-center text-center"
                  >
                    Xoá bộ lọc
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
