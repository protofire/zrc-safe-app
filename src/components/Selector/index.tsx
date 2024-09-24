import * as React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  ScaleFade,
  InputRightElement,
  IconButton,
  InputLeftElement,
} from '@chakra-ui/react';
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import SelectLoading from './Loading';
import useSelect from './useSelect';
import { SelectProps } from './types';
import Option from './Option';

function Select<T>(props: SelectProps<T>) {
  const {
    label,
    placeholder,
    gutter = 2,
    options = [],
    onSearch,
    onChange,
    onFocus,
    onBlur,
    filterWith,
    multiple,
    inputLeftElement,
    optionTemplate,
    emptyTemplate,
    loadingTemplate,
    rightIcon,
    loading,
    isDisabled = false,
  } = props;

  const {
    isOpen,
    handleFocusInput,
    handleBlurInput,
    selectOption,
    selectedOptions,
    filteredOptions,
    handleMouseEnterList,
    handleMouseLeaveList,
    inputRef,
    isSelected,
    setQuery,
    clear,
  } = useSelect<T>({
    options,
    onChange,
    filterWith,
    multiple,
  });

  return (
    <FormControl onBlur={handleBlurInput}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {inputLeftElement && (
          <InputLeftElement>{inputLeftElement()}</InputLeftElement>
        )}
        <Input
          ref={inputRef}
          onFocus={() => {
            handleFocusInput();
            if (onFocus) onFocus();
          }}
          placeholder={placeholder}
          onChange={(e) => {
            if (onSearch) {
              onSearch(e.target.value);
            } else {
              setQuery(e.target.value);
            }

            clear(true);
          }}
          onBlur={onBlur}
          borderColor="gray.400"
          isDisabled={isDisabled}
        />
        <InputRightElement>
          <>
            {selectedOptions?.length ? (
              <IconButton
                size="xs"
                variant="ghost"
                aria-label="Clear selection" // {{ edit_1 }}
                icon={<CloseIcon />}
                onClick={() => clear()}
                bg="#e0e0e0!important"
              />
            ) : (
              <>
                {rightIcon ? (
                  rightIcon()
                ) : (
                  <IconButton
                    size="xs"
                    variant="ghost"
                    aria-label="Clear selection" // {{ edit_1 }}
                    icon={<ChevronDownIcon />}
                    onClick={() => inputRef.current?.focus()}
                    bg="#e0e0e0!important"
                  />
                )}
              </>
            )}
          </>
        </InputRightElement>
      </InputGroup>
      <ScaleFade
        initialScale={0.9}
        in={isOpen}
        unmountOnExit
        style={{
          position: 'absolute',
          zIndex: 999,
          left: 0,
          right: 0,
        }}
      >
        <Box
          p={2}
          color="white"
          mt={gutter}
          rounded="xl"
          border="1px"
          borderColor="gray.400"
          bg="#e0e0e0"
          maxHeight={200}
          onMouseLeave={handleMouseLeaveList}
          onMouseEnter={handleMouseEnterList}
          sx={{
            overflowY: 'scroll',
          }}
        >
          {loading ? (
            <React.Fragment>
              {loadingTemplate ? loadingTemplate() : <SelectLoading />}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {filteredOptions.length ? (
                <React.Fragment>
                  {filteredOptions.map((option, index) => (
                    <Option
                      key={index}
                      value={option.value}
                      selected={isSelected(option)}
                      onClick={() => selectOption(option)}
                      multiple={multiple}
                    >
                      {optionTemplate ? (
                        optionTemplate(option)
                      ) : (
                        <React.Fragment>{option?.label}</React.Fragment>
                      )}
                    </Option>
                  ))}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {emptyTemplate ? (
                    emptyTemplate()
                  ) : (
                    <Option disabled>No results</Option>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Box>
      </ScaleFade>
    </FormControl>
  );
}

export default Select;
