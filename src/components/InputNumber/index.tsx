import { useState, useEffect } from 'react';
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';

interface InputNumberProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  isInvalid?: boolean;
  validation?: (value: number) => boolean;
  min?: number;
  max?: number;
  isDisabled?: boolean;
}

const InputNumber: React.FC<InputNumberProps> = ({
  label,
  value,
  onChange,
  isInvalid,
  validation,
  min = 0,
  max,
  isDisabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = event.target.value.replace(/^0+(\d)/, '$1');
    event.target.value = trimmedValue;
    const newValue = Number(trimmedValue);

    if (isNaN(newValue)) {
      setError('Please enter a valid number');
    } else if (max && newValue > max) {
      setError(`Please enter a number less than ${max}`);
    } else if (newValue < min) {
      setError(`Please enter a number greater than ${min}`);
    } else if (validation && !validation(newValue)) {
      setError('Please enter a valid number');
    } else {
      setError(null);
    }

    onChange(newValue);
  };

  return (
    <FormControl isInvalid={isInvalid || !!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step="any"
        borderColor="gray.400"
        backgroundColor="#e0e0e0"
        isDisabled={isDisabled}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputNumber;
