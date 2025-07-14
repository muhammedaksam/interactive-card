# React Interactive PayCard

[![npm version](https://img.shields.io/npm/v/@muhammedaksam/interactive-card.svg)](https://www.npmjs.com/package/@muhammedaksam/interactive-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/muhammedaksam/interactive-card/workflows/CI/badge.svg)](https://github.com/muhammedaksam/interactive-card/actions)
[![Coverage](https://img.shields.io/badge/Coverage-97.57%25-brightgreen.svg)](https://github.com/muhammedaksam/interactive-card)
[![React](https://img.shields.io/badge/React-19%2B-61dafb.svg)](https://reactjs.org/)

A beautiful, interactive payment card component for React applications.

![Demo](demo.gif)

## Features

- 🎨 Beautiful, realistic card design
- 🔄 Interactive animations and transitions
- 💳 Support for major card types (Visa, Mastercard, Amex, etc.)
- 🌍 Multi-language support (English, Portuguese, Turkish)
- 📱 Responsive design
- 🔒 Card number masking/unmasking
- ✅ Built-in validation
- 🎭 Customizable backgrounds
- 📦 TypeScript support
- 🚀 Zero dependencies (except React)

## Installation

```bash
pnpm add @muhammedaksam/interactive-card
# or
npm install @muhammedaksam/interactive-card
# or
yarn add @muhammedaksam/interactive-card
```

> **Important:** Don't forget to import the CSS styles for the component to work properly!

## Usage

### Basic Usage

```jsx
import React from 'react';
import { InteractivePayCard } from '@muhammedaksam/interactive-card';
import '@muhammedaksam/interactive-card/dist/style.css';

function App() {
  const handleSubmit = (cardData) => {
    console.log('Card data:', cardData);
  };

  return (
    <InteractivePayCard
      onSubmit={handleSubmit}
      locale="en"
    />
  );
}
```

### Advanced Usage

```jsx
import React from 'react';
import { InteractivePayCard } from '@muhammedaksam/interactive-card';
import '@muhammedaksam/interactive-card/dist/style.css';

function App() {
  const handleSubmit = (cardData) => {
    // Handle form submission
    console.log('Card data:', cardData);
  };

  return (
    <InteractivePayCard
      onSubmit={handleSubmit}
      locale="en"
      randomBackgrounds={false}
      backgroundImage="https://your-custom-background.jpg"
      initialData={{
        cardName: 'John Doe',
        cardNumber: '4111 1111 1111 1111'
      }}
      className="my-custom-class"
    />
  );
}
```

### Using Individual Components

```jsx
import React, { useState } from 'react';
import { PayCard } from '@muhammedaksam/interactive-card';
import '@muhammedaksam/interactive-card/dist/style.css';

function CustomForm() {
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: ''
  });

  const fields = {
    cardNumber: 'card-number',
    cardName: 'card-name',
    cardMonth: 'card-month',
    cardYear: 'card-year',
    cardCvv: 'card-cvv'
  };

  return (
    <PayCard
      labels={cardData}
      fields={fields}
      isCardNumberMasked={false}
      locale="en"
    />
  );
}
```

## Props

### InteractivePayCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `(data: CardFormData) => void` | - | Callback function when form is submitted |
| `initialData` | `Partial<CardFormData>` | `{}` | Initial form data |
| `locale` | `'en' \| 'pt' \| 'tr'` | `'en'` | Language for labels and messages |
| `randomBackgrounds` | `boolean` | `true` | Enable random background images |
| `backgroundImage` | `string` | - | Custom background image URL |
| `className` | `string` | `''` | Additional CSS class |

### PayCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `labels` | `CardFormData` | - | Card data to display |
| `fields` | `object` | - | Field ID mapping |
| `isCardNumberMasked` | `boolean` | - | Whether to mask card number |
| `randomBackgrounds` | `boolean` | `true` | Enable random backgrounds |
| `backgroundImage` | `string` | - | Custom background image |
| `focusedField` | `string \| null` | - | Currently focused field |
| `isCardFlipped` | `boolean` | `false` | Whether card is flipped to show CVV |
| `locale` | `'en' \| 'pt' \| 'tr'` | `'en'` | Display language |

## Types

```typescript
interface CardFormData {
  cardName: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
}
```

## Supported Card Types

- Visa
- Mastercard
- American Express
- Discover
- JCB
- Diners Club
- UnionPay
- Troy

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/muhammedaksam/interactive-card.git
cd interactive-card

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Start Storybook for component development
pnpm run storybook

# Build for production
pnpm run build

# Build library
pnpm run build:lib
```

### Building

The library can be built in two modes:

- **Development**: `pnpm run build` - Creates a demo application
- **Library**: `pnpm run build:lib` - Creates the npm package
- **Storybook**: `pnpm run storybook` - Starts Storybook for component development and testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Muhammed Mustafa AKŞAM](https://github.com/muhammedaksam)

## Credits

Inspired by the original Vue.js component by [muhammed](https://github.com/muhammed/interactive-card).
