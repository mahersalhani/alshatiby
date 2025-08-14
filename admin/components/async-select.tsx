'use client';

import { useTranslations } from 'next-intl';
import type React from 'react';
import { useCallback, useState } from 'react';
import { type GroupBase, type OptionProps, type SingleValueProps, type StylesConfig, components } from 'react-select';
import AsyncSelect from 'react-select/async';

interface AsyncSelectOption {
  value: string;
  label: string;
  data: any;
}

interface AsyncSelectProps {
  loadOptions: (inputValue: string, page: number) => Promise<{ options: AsyncSelectOption[]; hasMore: boolean }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  formatOptionLabel?: (option: AsyncSelectOption) => React.ReactNode;
}

// Custom Option component to show rich content
const CustomOption = (props: OptionProps<AsyncSelectOption, false, GroupBase<AsyncSelectOption>>) => {
  const { formatOptionLabel } = props.selectProps as any;
  return (
    <components.Option {...props}>
      {formatOptionLabel ? formatOptionLabel(props.data) : props.data.label}
    </components.Option>
  );
};

// Custom SingleValue component
const CustomSingleValue = (props: SingleValueProps<AsyncSelectOption, false, GroupBase<AsyncSelectOption>>) => {
  const { formatLabel } = props.selectProps as any;

  return <components.SingleValue {...props}>{props.data.label}</components.SingleValue>;
};

export function AsyncSelectComponent({
  loadOptions,
  value,
  onChange,
  placeholder,
  isDisabled = false,
  className,
  formatOptionLabel,
}: AsyncSelectProps) {
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState<AsyncSelectOption[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const t = useTranslations('ClassroomForm');

  const loadMoreOptions = useCallback(
    async (inputValue: string, loadedOptions: AsyncSelectOption[]) => {
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
      // Reset pagination when search changes
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

  const selectedOption = allOptions.find((option) => option.value === value) || null;

  const customStyles: StylesConfig<AsyncSelectOption, false, GroupBase<AsyncSelectOption>> = {
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
    singleValue: (provided) => ({
      ...provided,
      color: 'hsl(var(--foreground))',
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
  };

  return (
    <AsyncSelect
      className={className}
      styles={customStyles}
      loadOptions={loadOptionsAsync}
      value={selectedOption}
      onChange={(option) => onChange(option?.value || '')}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable
      isSearchable
      cacheOptions
      defaultOptions
      loadingMessage={() => t('loading')}
      noOptionsMessage={() => t('noOptionsFound')}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      formatOptionLabel={formatOptionLabel}
      // Enable infinite scroll
      onMenuScrollToBottom={() => {
        if (hasMore) {
          loadMoreOptions('', allOptions);
        }
      }}
    />
  );
}
