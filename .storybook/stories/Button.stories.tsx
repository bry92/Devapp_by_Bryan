import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../src/components/Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The text displayed on the button',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'The visual style of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onClick: {
      action: 'clicked',
      description: 'Handler called when the button is clicked',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    label: 'Disabled Secondary',
    variant: 'secondary',
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    label: 'Click me!',
    variant: 'primary',
    disabled: false,
  },
  render: (args) => (
    <div>
      <Button {...args} />
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Try hovering, focusing, or clicking the button above!
      </p>
    </div>
  ),
};
