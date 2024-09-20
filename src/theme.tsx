import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    background: '#f0f0f0',
    foreground: '#333333',
  },
  fonts: {
    heading: 'Arial, Helvetica, sans-serif',
    body: 'Arial, Helvetica, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'background',
        color: 'foreground',
      },
    },
  },
});

export default theme;

