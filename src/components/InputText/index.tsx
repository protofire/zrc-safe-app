import { useState } from 'react';
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';

interface InputTextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  validation?: (value: string) => boolean;
  isHexAddress?: boolean;
  isDisabled?: boolean;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  value,
  onChange,
  validation,
  isHexAddress = false,
  isDisabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (isHexAddress && !/^0x[0-9a-fA-F]{40}$/.test(newValue)) {
      setError('Please enter a valid hex address');
    } else if (validation && !validation(newValue)) {
      setError('Please enter a valid text');
    } else {
      setError(null);
    }
    onChange(newValue);
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        borderColor="gray.400"
        backgroundColor="#e0e0e0"
        isDisabled={isDisabled}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputText;
