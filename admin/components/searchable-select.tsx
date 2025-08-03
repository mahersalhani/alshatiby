'use client';

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SearchableSelectOption {
  id: string;
  name: string;
  description?: string;
  subtitle?: string;
  metadata?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  selected: string;
  onSelectionChange: (selected: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loadingText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = 'Select item...',
  searchPlaceholder = 'Search...',
  emptyText = 'No items found',
  loadingText = 'Loading...',
  isLoading = false,
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.id === selected);

  const handleSelect = (optionId: string) => {
    onSelectionChange(optionId === selected ? '' : optionId);
    setOpen(false);
  };

  return (
    <div className={cn('', className)}>
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
            ) : selectedOption ? (
              <div className="flex flex-col items-start">
                <span>{selectedOption.name}</span>
                {selectedOption.subtitle && (
                  <span className="text-sm text-muted-foreground">{selectedOption.subtitle}</span>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{isLoading ? loadingText : emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.id} onSelect={() => handleSelect(option.id)}>
                    <Check className={cn('mr-2 h-4 w-4', selected === option.id ? 'opacity-100' : 'opacity-0')} />
                    <div className="flex flex-col w-full">
                      <span>{option.name}</span>
                      {option.description && (
                        <span className="text-sm text-muted-foreground">{option.description}</span>
                      )}
                      {option.subtitle && <span className="text-sm text-muted-foreground">{option.subtitle}</span>}
                      {option.metadata && <span className="text-xs text-muted-foreground">{option.metadata}</span>}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
