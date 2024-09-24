import React from 'react';

export type Option<T> = {
  label: string;
  value?: T;
  disabled?: boolean;
};

export type SelectProps<T> = {
  label?: string;
  placeholder?: string;
  gutter?: number;
  options?: Option<T>[];
  multiple?: boolean;
  onSearch?(query: string): unknown;
  onChange?(value: T | T[]): unknown;
  onFocus?(): unknown;
  onBlur?(): unknown;
  onClear(): void;
  filterWith?(option: Option<T>, query: string): boolean;
  optionTemplate?(option?: Option<T>): React.ReactNode;
  inputLeftElement?(): React.ReactNode;
  emptyTemplate?(): React.ReactNode;
  loadingTemplate?(): React.ReactNode;
  rightIcon?(): React.ReactNode;
  loading?: boolean;
  isDisabled?: boolean;
};
