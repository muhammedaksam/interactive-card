// Example usage of the @muhammedaksam/interactive-card npm package

import {
  CardFormData,
  InteractivePayCard,
  PayCard,
} from '@muhammedaksam/interactive-card';
import React from 'react';
// Don't forget to import the styles
import '@muhammedaksam/interactive-card/dist/style.css';

// Example 1: Full interactive card with form
export const ExampleWithForm: React.FC = () => {
  const handleSubmit = (cardData: CardFormData) => {
    console.log('Card submitted:', cardData);
    // Process the card data (send to payment processor, etc.)
  };

  const initialData: Partial<CardFormData> = {
    cardName: 'John Doe',
    cardNumber: '',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Interactive Payment Card</h2>
      <InteractivePayCard
        initialData={initialData}
        onSubmit={handleSubmit}
        locale="en"
        randomBackgrounds={true}
        className="my-custom-card"
      />
    </div>
  );
};

// Example 2: Card display only (no form)
export const ExampleCardOnly: React.FC = () => {
  const cardData: CardFormData = {
    cardNumber: '4111111111111111',
    cardName: 'Jane Smith',
    cardMonth: '12',
    cardYear: '2025',
    cardCvv: '123',
  };

  const fields = {
    cardNumber: 'cardNumber',
    cardName: 'cardName',
    cardMonth: 'cardMonth',
    cardYear: 'cardYear',
    cardCvv: 'cardCvv',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Card Display Only</h2>
      <PayCard
        labels={cardData}
        fields={fields}
        locale="en"
        isCardFlipped={false}
        focusedField={null}
        isCardNumberMasked={false}
        randomBackgrounds={true}
      />
    </div>
  );
};

// Example 3: Different locales
export const ExampleMultiLanguage: React.FC = () => {
  const handleSubmit = (cardData: CardFormData) => {
    console.log('Card submitted:', cardData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Multi-language Support</h2>

      <div style={{ marginBottom: '40px' }}>
        <h3>English</h3>
        <InteractivePayCard onSubmit={handleSubmit} locale="en" />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3>Portuguese</h3>
        <InteractivePayCard onSubmit={handleSubmit} locale="pt" />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3>Turkish</h3>
        <InteractivePayCard onSubmit={handleSubmit} locale="tr" />
      </div>
    </div>
  );
};

export default ExampleWithForm;
