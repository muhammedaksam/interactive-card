import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { InteractivePayCard } from '../index';

const meta: Meta<typeof InteractivePayCard> = {
  title: 'Components/InteractivePayCard',
  component: InteractivePayCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A beautiful, interactive payment card component with form validation and animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'pt', 'tr'],
      description: 'Language for labels and messages',
    },
    randomBackgrounds: {
      control: 'boolean',
      description: 'Enable random background images for the card',
    },
    backgroundImage: {
      control: 'text',
      description: 'Custom background image URL for the card',
    },
    onSubmit: {
      action: 'submitted',
      description: 'Callback function when form is submitted',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    locale: 'en',
    randomBackgrounds: true,
  },
};

export const Portuguese: Story = {
  args: {
    locale: 'pt',
    randomBackgrounds: true,
  },
};

export const Turkish: Story = {
  args: {
    locale: 'tr',
    randomBackgrounds: true,
  },
};

export const WithCustomBackground: Story = {
  args: {
    locale: 'en',
    randomBackgrounds: false,
    backgroundImage:
      'https://images.unsplash.com/photo-1572336183013-960c3e1a0b54?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
  },
};

export const WithInitialData: Story = {
  args: {
    locale: 'en',
    randomBackgrounds: true,
    initialData: {
      cardName: 'John Doe',
      cardNumber: '4111 1111 1111 1111',
      cardMonth: '12',
      cardYear: '2025',
      cardCvv: '123',
    },
  },
};

export const NoRandomBackground: Story = {
  args: {
    locale: 'en',
    randomBackgrounds: false,
  },
};

// Interactive test story
export const InteractiveTest: Story = {
  args: {
    locale: 'en',
    randomBackgrounds: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test filling out the form - using more specific selectors
    const cardNumberInput = canvas.getByLabelText(/card number/i);
    const cardNameInput = canvas.getByLabelText(/card name/i);
    const monthSelect = canvasElement.querySelector(
      '#react-card-month'
    ) as HTMLSelectElement;
    const yearSelect = canvasElement.querySelector(
      '#react-card-year'
    ) as HTMLSelectElement;
    const cvvInput = canvas.getByLabelText(/cvv/i);

    // Fill card number
    await userEvent.type(cardNumberInput, '4111111111111111');
    await expect(cardNumberInput).toHaveValue('4111 1111 1111 1111');

    // Fill cardholder name
    await userEvent.type(cardNameInput, 'John Doe');
    await expect(cardNameInput).toHaveValue('John Doe');

    // Select month
    await userEvent.selectOptions(monthSelect, '12');
    await expect(monthSelect).toHaveValue('12');

    // Select year
    await userEvent.selectOptions(yearSelect, '2025');
    await expect(yearSelect).toHaveValue('2025');

    // Fill CVV (this should flip the card)
    await userEvent.type(cvvInput, '123');
    await expect(cvvInput).toHaveValue('123');

    // Check if card flipped
    const cardElement = canvasElement.querySelector('.card-item');
    await expect(cardElement).toHaveClass('-active');

    // Click away from CVV to flip card back
    await userEvent.click(cardNameInput);
    await expect(cardElement).not.toHaveClass('-active');
  },
};
