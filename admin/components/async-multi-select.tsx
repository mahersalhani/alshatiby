'use client';

import { X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type React from 'react';
import { useCallback, useState } from 'react';
import {
  ActionMeta,
  type GroupBase,
  MultiValue,
  type MultiValueProps,
  type MultiValueRemoveProps,
  type OptionProps,
  type StylesConfig,
  components,
} from 'react-select';
import AsyncSelect from 'react-select/async';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AsyncMultiSelectOption {
  value: string;
  label: string;
  data: any;
}

interface AsyncMultiSelectProps {
  loadOptions: (inputValue: string, page: number) => Promise<{ options: AsyncMultiSelectOption[]; hasMore: boolean }>;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  formatOptionLabel?: (option: AsyncMultiSelectOption) => React.ReactNode;
  formatSelectedLabel?: (option: AsyncMultiSelectOption) => React.ReactNode;
}

// Custom Option component to show rich content
const CustomOption = (props: OptionProps<AsyncMultiSelectOption, true, GroupBase<AsyncMultiSelectOption>>) => {
  const { formatOptionLabel } = props.selectProps as any;
  return (
    <components.Option {...props}>
      {formatOptionLabel ? formatOptionLabel(props.data) : props.data.label}
    </components.Option>
  );
};

// Custom MultiValue component (hidden since we show custom badges below)
const CustomMultiValue = (props: MultiValueProps<AsyncMultiSelectOption, true, GroupBase<AsyncMultiSelectOption>>) => {
  return null; // We'll render our own badges below the select
};

// Custom MultiValueRemove component (not used since MultiValue is hidden)
const CustomMultiValueRemove = (
  props: MultiValueRemoveProps<AsyncMultiSelectOption, true, GroupBase<AsyncMultiSelectOption>>
) => {
  return null;
};

export function AsyncMultiSelectComponent({
  loadOptions,
  value,
  onChange,
  placeholder,
  isDisabled = false,
  className,
  formatOptionLabel,
  formatSelectedLabel,
}: AsyncMultiSelectProps) {
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState<AsyncMultiSelectOption[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const locale = useLocale();
  const t = useTranslations('ClassroomForm');

  const loadMoreOptions = useCallback(
    async (inputValue: string, loadedOptions: AsyncMultiSelectOption[]) => {
      if (!hasMore) return { options: loadedOptions, hasMore: false };

      try {
        const result = await loadOptions(inputValue, page);
        const newOptions = [...loadedOptions, ...result.options];
        setAllOptions(newOptions);
        setHasMore(result.hasMore);
        setPage((prev) => prev + 1);
        return { options: newOptions, hasMore: result.hasMore };
      } catch (error) {
        console.error('Error loading options:', error);
        return { options: loadedOptions, hasMore: false };
      }
    },
    [loadOptions, page, hasMore]
  );

  const loadOptionsAsync = useCallback(
    async (inputValue: string) => {
      setPage(1);
      setAllOptions([]);
      setHasMore(true);

      try {
        const result = await loadOptions(inputValue, 1);
        setAllOptions(result.options);
        setHasMore(result.hasMore);
        setPage(2);
        return result.options;
      } catch (error) {
        console.error('Error loading options:', error);
        return [];
      }
    },
    [loadOptions]
  );

  const selectedOptions = allOptions.filter((option) => value?.includes(option?.value));

  const handleSelectionChange = (
    selectedOptions: MultiValue<AsyncMultiSelectOption>,
    actionMeta: ActionMeta<AsyncMultiSelectOption>
  ) => {
    const newValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    onChange(newValues);
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter((v) => v !== valueToRemove));
  };

  const customStyles: StylesConfig<AsyncMultiSelectOption, true, GroupBase<AsyncMultiSelectOption>> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'hsl(var(--background))',
      borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))',
      borderRadius: 'calc(var(--radius) - 2px)',
      borderWidth: '1px',
      boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
      minHeight: '40px',
      '&:hover': {
        borderColor: 'hsl(var(--border))',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary))'
        : state.isFocused
        ? 'hsl(var(--accent))'
        : 'hsl(var(--background))',
      color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
      padding: '8px 12px',
      '&:hover': {
        backgroundColor: 'hsl(var(--accent))',
        color: 'hsl(var(--accent-foreground))',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'hsl(var(--popover))',
      border: '1px solid hsl(var(--border))',
      borderRadius: 'calc(var(--radius) - 2px)',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      zIndex: 50,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      maxHeight: '200px',
    }),
    input: (provided) => ({
      ...provided,
      color: 'hsl(var(--foreground))',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'hsl(var(--muted-foreground))',
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: 'hsl(var(--muted-foreground))',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'hsl(var(--muted-foreground))',
      '&:hover': {
        color: 'hsl(var(--foreground))',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      display: 'none', // Hide default multi-value display
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      display: 'none',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      display: 'none',
    }),
  };

  return (
    <div className={className}>
      <AsyncSelect
        isMulti
        styles={customStyles}
        loadOptions={loadOptionsAsync}
        value={selectedOptions}
        onChange={handleSelectionChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable={false}
        isSearchable
        cacheOptions
        defaultOptions
        loadingMessage={() => t('loading')}
        noOptionsMessage={() => t('noOptionsFound')}
        components={{
          Option: CustomOption,
          MultiValue: CustomMultiValue,
          MultiValueRemove: CustomMultiValueRemove,
        }}
        formatOptionLabel={formatOptionLabel}
        // Enable infinite scroll
        onMenuScrollToBottom={() => {
          if (hasMore) {
            loadMoreOptions('', allOptions);
          }
        }}
        // Hide selected options from dropdown
        hideSelectedOptions={true}
        // Close menu on select to allow for better UX
        closeMenuOnSelect={false}
      />

      {/* Custom selected items display */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedOptions.map((option) => (
            <Badge key={option.value} color="secondary" className="flex items-center gap-2 py-1 px-2">
              <div className="flex flex-col">
                {formatSelectedLabel ? formatSelectedLabel(option) : <span>{option.label}</span>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground ml-1 w-fit"
                onClick={() => handleRemove(option.value)}
                disabled={isDisabled}
                type="button"
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
