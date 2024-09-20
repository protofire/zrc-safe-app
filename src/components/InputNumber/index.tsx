import { useState } from 'react';
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
}

const InputNumber: React.FC<InputNumberProps> = ({
  label,
  value,
  onChange,
  isInvalid,
  validation,
  min,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    if (validation && !validation(newValue)) {
      setError('Please enter a valid number');
    } else {
      setError(null);
      onChange(newValue);
    }
  };

  return (
    <FormControl isInvalid={isInvalid || !!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        step="any"
        borderColor="gray.400"
        backgroundColor="#e0e0e0"
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputNumber;
