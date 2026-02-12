// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

// Extend the type to recognize 'features'
interface ExtendedStorybookConfig extends StorybookConfig {
  features?: {
    onboarding?: boolean;
  };
}

const config: ExtendedStorybookConfig = {
  stories: [
    './stories/**/*.mdx',
    './stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials'
  ],
  features: {
    onboarding: false
  },
  framework: '@storybook/react-vite'
};

export default config;