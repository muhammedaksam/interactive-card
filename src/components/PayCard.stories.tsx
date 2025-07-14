import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import PayCard from '../components/PayCard';
import { CardFormData } from '../types';

const meta: Meta<typeof PayCard> = {
  title: 'Components/PayCard',
  component: PayCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The visual card component that displays payment card information with animations.',
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
    isCardNumberMasked: {
      control: 'boolean',
      description: 'Whether to mask the card number',
    },
    randomBackgrounds: {
      control: 'boolean',
      description: 'Enable random background images',
    },
    backgroundImage: {
      control: 'text',
      description: 'Custom background image URL',
    },
    isCardFlipped: {
      control: 'boolean',
      description: 'Whether the card is flipped to show CVV',
    },
    focusedField: {
      control: 'select',
      options: [null, 'v-card-number', 'v-card-name', 'cardDate', 'v-card-cvv'],
      description: 'Currently focused field',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultLabels: CardFormData = {
  cardName: '',
  cardNumber: '',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
};

const filledLabels: CardFormData = {
  cardName: 'John Doe',
  cardNumber: '4111 1111 1111 1111',
  cardMonth: '12',
  cardYear: '2025',
  cardCvv: '123',
};

const fields = {
  cardNumber: 'v-card-number',
  cardName: 'v-card-name',
  cardMonth: 'v-card-month',
  cardYear: 'v-card-year',
  cardCvv: 'v-card-cvv',
};

export const Empty: Story = {
  args: {
    labels: defaultLabels,
    fields,
    isCardNumberMasked: false,
    randomBackgrounds: true,
    locale: 'en',
  },
};

export const Filled: Story = {
  args: {
    labels: filledLabels,
    fields,
    isCardNumberMasked: false,
    randomBackgrounds: true,
    locale: 'en',
  },
};

export const MaskedCardNumber: Story = {
  args: {
    labels: filledLabels,
    fields,
    isCardNumberMasked: true,
    randomBackgrounds: true,
    locale: 'en',
  },
};

export const Flipped: Story = {
  args: {
    labels: filledLabels,
    fields,
    isCardNumberMasked: false,
    randomBackgrounds: true,
    isCardFlipped: true,
    locale: 'en',
  },
};

export const WithFocus: Story = {
  args: {
    labels: filledLabels,
    fields,
    isCardNumberMasked: false,
    randomBackgrounds: true,
    focusedField: 'v-card-number',
    locale: 'en',
  },
};

export const VisaCard: Story = {
  args: {
    labels: {
      ...filledLabels,
      cardNumber: '4111 1111 1111 1111',
    },
    fields,
    isCardNumberMasked: false,
    randomBackgrounds: true,
    locale: 'en',
  },
};

export const MasterCard: Story = {
  args: {
    labels: {
      ...filledLabels,
      cardNumber: '5555 5555 5555 4444',
    },
    fields,
    isCardNumberMasked: false,
    randomBackgrounds: true,
    locale: 'en',
  },
};

export const AmericanExpress: Story = {
  args: {
    labels: {
      ...filledLabels,
      cardNumber: '3782 822463 10005',
    },
    fields,
    isCardNumberMasked: false,
    randomBackgrounds: true,
    locale: 'en',
  },
};

// Visual test story
export const VisualTest: Story = {
  args: {
    labels: filledLabels,
    fields,
    isCardNumberMasked: false,
    randomBackgrounds: true,
    locale: 'en',
    focusedField: 'card-number',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that card number digits are displayed individually
    const cardNumberElements = canvasElement.querySelectorAll(
      '.card-item__numberItem'
    );
    await expect(cardNumberElements.length).toBeGreaterThan(0);

    // Check that first digit of card number is displayed
    const firstDigit = canvas.getByText('4');
    await expect(firstDigit).toBeInTheDocument();

    // Check that cardholder name elements are displayed individually
    const cardNameElements = canvasElement.querySelectorAll(
      '.card-item__nameItem'
    );
    await expect(cardNameElements.length).toBeGreaterThan(0);

    // Check that first character of name is displayed
    const firstNameChar = canvas.getByText('J');
    await expect(firstNameChar).toBeInTheDocument();

    // Check that expiry is displayed correctly
    const expiryMonth = canvas.getByText('12');
    await expect(expiryMonth).toBeInTheDocument();

    // Check that year is displayed as last 2 digits
    const expiryYear = canvas.getByText('25');
    await expect(expiryYear).toBeInTheDocument();

    // Check that card type image is displayed
    const cardTypeImg = canvasElement.querySelector('.card-item__typeImg');
    await expect(cardTypeImg).toBeInTheDocument();
    await expect(cardTypeImg).toHaveAttribute('alt', 'visa');

    // Check that card number area exists
    const cardNumberLabel = canvasElement.querySelector('.card-item__number');
    await expect(cardNumberLabel).toBeInTheDocument();
  },
};
