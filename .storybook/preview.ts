// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import React from 'react';  // ← Fixes JSX errors

// Import your global CSS (adjust path if your main styles are elsewhere, like 'src/styles/main.css' or remove if no CSS yet)
// import '../src/index.css';

// If you use a theme provider (e.g., for styled-components, MUI, Chakra – uncomment and replace below)
// import { ThemeProvider } from 'styled-components';  // Replace with your actual library (install if needed)
// import { defaultTheme } from '../src/themes';  // Replace with your theme import/path

const preview: Preview = {
  decorators: [
    // (Story) => (
    //   <ThemeProvider theme={defaultTheme}>
    //     <Story />
    //   </ThemeProvider>
    // ),
  ],
  parameters: {
    layout: 'centered',  // Centers components nicely
    actions: { argTypesRegex: '^on[A-Z].*' },  // Auto-detects click handlers etc.
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;