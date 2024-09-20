import * as React from 'react';
import { CircularProgress, Flex } from '@chakra-ui/react';

export default function SelectLoading() {
  return (
    <React.Fragment>
      <Flex p={2} alignItems="center" justifyContent="center">
        <CircularProgress size={8} trackColor="transparent" isIndeterminate />
      </Flex>
    </React.Fragment>
  );
}
