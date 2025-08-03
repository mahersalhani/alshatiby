'use client';

import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
  id: string;
  name: string;
  email?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loadingText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = 'Select items...',
  searchPlaceholder = 'Search...',
  emptyText = 'No items found',
  loadingText = 'Loading...',
  isLoading = false,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOptions = options.filter((option) => selected.includes(option.id));

  const handleSelect = (optionId: string) => {
    if (selected.includes(optionId)) {
      onSelectionChange(selected.filter((id) => id !== optionId));
    } else {
      onSelectionChange([...selected, optionId]);
    }
  };

  const handleRemove = (optionId: string) => {
    onSelectionChange(selected.filter((id) => id !== optionId));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : selected.length > 0 ? (
              `${selected.length} selected`
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{isLoading ? loadingText : emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.id} onSelect={() => handleSelect(option.id)}>
                    <Check className={cn('mr-2 h-4 w-4', selected.includes(option.id) ? 'opacity-100' : 'opacity-0')} />
                    <div className="flex flex-col">
                      <span>{option.name}</span>
                      {option.email && <span className="text-sm text-muted-foreground">{option.email}</span>}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected items */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge key={option.id} color="secondary" className="flex items-center gap-1">
              {option.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemove(option.id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
