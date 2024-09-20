import * as React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Option } from './types';
import isString from '@/utils/isString';
import isNumber from '@/utils/isNumber';

type UseSelectProps<T = unknown> = {
  options: Option<T>[];
  multiple?: boolean;
  onChange?(value: T | T[]): void;
  filterWith?(option: Option<T>, query: string): boolean;
};

type UseSelectReturn<T = unknown> = {
  isOpen: boolean;
  onOpen(): void;
  onClose(): void;
  setQuery: React.Dispatch<string>;
  handleFocusInput(): void;
  handleBlurInput(): void;
  selectOption(option: Option<T>): void;
  selectedOptions: Option<T>[];
  handleMouseEnterList(): void;
  handleMouseLeaveList(): void;
  filteredOptions: Option<T>[];
  inputRef: React.RefObject<HTMLInputElement>;
  isSelected(option: Option<T>): boolean;
  clear(keepFieldValue?: boolean): void;
};

function useSelect<T = unknown>(props: UseSelectProps<T>): UseSelectReturn<T> {
  const { options, onChange, filterWith, multiple } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [focusOnList, setFocusOnList] = React.useState(false);

  const [query, setQuery] = React.useState<string | null>(null);

  const innerOptions = React.useMemo(() => {
    return options;
  }, [options]);

  const filteredOptions = React.useMemo(() => {
    if (query) {
      return innerOptions.filter((option) => {
        if (isString(option.value)) {
          return option.value.startsWith(query);
        } else if (isNumber(option.value)) {
          return +option.value === +query;
        } else {
          if (!filterWith) {
            console.warn(
              `If you provide value like Object or Array, please provide filterWith function`
            );
            return true;
          }
          return filterWith(option, query);
        }
      });
    }
    return options;
  }, [options, query, filterWith, innerOptions]);

  const [selectedOptions, setSelectedOptions] = React.useState<Option<T>[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  function selectOption(option: Option<T>) {
    if (!inputRef.current) return;

    if (multiple) {
      const newOptions = isSelected(option)
        ? selectedOptions.filter((opt) => opt.value !== option.value)
        : [...selectedOptions, option];
      setSelectedOptions(newOptions);
      inputRef.current.value = newOptions.map((opt) => opt.label).join(', ');
    } else {
      setSelectedOptions([option]);
      onClose();
      inputRef.current.value = option.label;
    }
  }

  function handleFocusInput() {
    onOpen();
  }

  function handleBlurInput() {
    if (focusOnList) return;
    onClose();
  }

  function handleMouseEnterList() {
    setFocusOnList(true);
  }

  function handleMouseLeaveList() {
    setFocusOnList(false);
  }

  function isSelected(option: Option<T>) {
    return selectedOptions?.some((opt) => {
      return option.value === opt.value;
    });
  }

  function clear(keepFieldValue = false) {
    if (!inputRef.current) return;

    setSelectedOptions([]);
    if (!keepFieldValue) {
      inputRef.current.value = '';
      setQuery('');
    }
  }

  React.useEffect(() => {
    if (!onChange) return;
    if (multiple) {
      onChange(selectedOptions.map((opt) => opt.value) as T[]);
    } else {
      onChange(selectedOptions[0]?.value as T);
    }
  }, [selectedOptions, multiple, onChange]);

  return {
    isOpen,
    onOpen,
    onClose,
    setQuery,
    handleFocusInput,
    handleBlurInput,
    selectOption,
    selectedOptions,
    handleMouseEnterList,
    handleMouseLeaveList,
    filteredOptions,
    inputRef,
    isSelected,
    clear,
  };
}

export default useSelect;
