# External State Management Guide

The InteractivePayCard component now supports both controlled and uncontrolled patterns for maximum flexibility in state management.

## Overview

### Controlled Mode (Recommended for most use cases)
When you provide both `value` and `onChange` props, the component becomes controlled, and you manage the state externally.

### Uncontrolled Mode (Backward compatible)
When you only provide `initialData` (or nothing), the component manages its own internal state.

## API Reference

### Props for External State Management

```typescript
interface InteractivePayCardProps {
  // Controlled mode props
  value?: CardFormData;
  onChange?: (data: CardFormData) => void;
  
  // Uncontrolled mode props (backward compatibility)
  initialData?: Partial<CardFormData>;
  
  // Common props
  backgroundImage?: string;
  randomBackgrounds?: boolean;
  onSubmit?: (data: CardFormData) => void;
  locale?: 'en' | 'pt' | 'tr';
  className?: string;
}
```

## Usage Examples

### 1. Basic Controlled Component

```typescript
import React, { useState } from 'react';
import { InteractivePayCard, CardFormData } from '@muhammedaksam/interactive-card';

const MyPaymentForm: React.FC = () => {
  const [cardData, setCardData] = useState<CardFormData>({
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
  });

  const handleCardDataChange = (newData: CardFormData) => {
    setCardData(newData);
    // You can add custom logic here
    console.log('Card data updated:', newData);
  };

  const handleSubmit = (submitData: CardFormData) => {
    // Process the card data
    console.log('Card submitted:', submitData);
  };

  return (
    <InteractivePayCard
      value={cardData}
      onChange={handleCardDataChange}
      onSubmit={handleSubmit}
      locale="en"
      randomBackgrounds={true}
    />
  );
};
```

### 2. Multi-Step Form Integration

```typescript
import React, { useState } from 'react';
import { InteractivePayCard, CardFormData } from '@muhammedaksam/interactive-card';

const CheckoutProcess: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: { firstName: '', lastName: '', email: '' },
    cardData: {
      cardName: '',
      cardNumber: '',
      cardMonth: '',
      cardYear: '',
      cardCvv: '',
    },
    billingAddress: { address: '', city: '', zipCode: '' },
  });

  const handleCardDataChange = (newCardData: CardFormData) => {
    setFormData(prev => ({
      ...prev,
      cardData: newCardData,
    }));
  };

  return (
    <div>
      {currentStep === 2 && (
        <InteractivePayCard
          value={formData.cardData}
          onChange={handleCardDataChange}
          onSubmit={(cardData) => {
            // Move to next step or complete order
            console.log('Complete order:', { ...formData, cardData });
          }}
          locale="en"
          randomBackgrounds={true}
        />
      )}
    </div>
  );
};
```

### 3. Real-time Validation

```typescript
import React, { useState, useEffect } from 'react';
import { InteractivePayCard, CardFormData } from '@muhammedaksam/interactive-card';

const ValidatedPaymentForm: React.FC = () => {
  const [cardData, setCardData] = useState<CardFormData>({
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateCardData = (data: CardFormData) => {
    const errors: {[key: string]: string} = {};
    
    if (data.cardName.length < 2) {
      errors.cardName = 'Name must be at least 2 characters';
    }
    
    const cleanNumber = data.cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 13) {
      errors.cardNumber = 'Card number must be at least 13 digits';
    }
    
    if (!data.cardMonth) {
      errors.cardMonth = 'Month is required';
    }
    
    if (!data.cardYear) {
      errors.cardYear = 'Year is required';
    }
    
    if (data.cardCvv.length < 3) {
      errors.cardCvv = 'CVV must be at least 3 digits';
    }
    
    return errors;
  };

  useEffect(() => {
    const errors = validateCardData(cardData);
    setValidationErrors(errors);
  }, [cardData]);

  const handleCardDataChange = (newData: CardFormData) => {
    setCardData(newData);
  };

  const handleSubmit = (submitData: CardFormData) => {
    const errors = validateCardData(submitData);
    
    if (Object.keys(errors).length > 0) {
      alert('Please fix validation errors before submitting');
      return;
    }
    
    // Process valid card data
    console.log('Valid card submitted:', submitData);
  };

  const isFormValid = Object.keys(validationErrors).length === 0 && 
    Object.values(cardData).every(value => value.trim() !== '');

  return (
    <div>
      <div style={{ 
        backgroundColor: isFormValid ? '#d4edda' : '#f8d7da',
        padding: '10px',
        marginBottom: '20px',
        borderRadius: '4px'
      }}>
        Form Status: {isFormValid ? '✅ Valid' : '❌ Invalid'}
        {Object.keys(validationErrors).length > 0 && (
          <ul>
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}><strong>{field}:</strong> {error}</li>
            ))}
          </ul>
        )}
      </div>

      <InteractivePayCard
        value={cardData}
        onChange={handleCardDataChange}
        onSubmit={handleSubmit}
        locale="en"
        randomBackgrounds={true}
      />
    </div>
  );
};
```

### 4. External Controls

```typescript
import React, { useState } from 'react';
import { InteractivePayCard, CardFormData } from '@muhammedaksam/interactive-card';

const PaymentFormWithControls: React.FC = () => {
  const [cardData, setCardData] = useState<CardFormData>({
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
  });

  const resetForm = () => {
    setCardData({
      cardName: '',
      cardNumber: '',
      cardMonth: '',
      cardYear: '',
      cardCvv: '',
    });
  };

  const fillSampleData = () => {
    setCardData({
      cardName: 'John Doe',
      cardNumber: '4111 1111 1111 1111',
      cardMonth: '12',
      cardYear: '2025',
      cardCvv: '123',
    });
  };

  const loadUserData = () => {
    // Load from localStorage, API, etc.
    const savedData = localStorage.getItem('savedCardData');
    if (savedData) {
      setCardData(JSON.parse(savedData));
    }
  };

  const saveUserData = () => {
    localStorage.setItem('savedCardData', JSON.stringify(cardData));
    alert('Card data saved!');
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={resetForm}>Reset Form</button>
        <button onClick={fillSampleData}>Fill Sample Data</button>
        <button onClick={loadUserData}>Load Saved Data</button>
        <button onClick={saveUserData}>Save Data</button>
      </div>

      <InteractivePayCard
        value={cardData}
        onChange={setCardData}
        onSubmit={(data) => console.log('Submitted:', data)}
        locale="en"
        randomBackgrounds={true}
      />
    </div>
  );
};
```

### 5. Backward Compatibility (Uncontrolled Mode)

```typescript
// This still works exactly as before
<InteractivePayCard
  initialData={{
    cardName: 'Legacy User',
    cardNumber: '4000 0000 0000 0002',
  }}
  onSubmit={(data) => console.log('Submitted:', data)}
  locale="en"
  randomBackgrounds={true}
/>
```

## Benefits of External State Management

1. **Better Control**: Full control over when and how state updates
2. **Validation**: Implement custom validation logic
3. **Persistence**: Save/load card data from localStorage, APIs, etc.
4. **Multi-step Forms**: Integrate seamlessly with complex form flows
5. **Real-time Updates**: React to state changes immediately
6. **Testing**: Easier to test with predictable state management
7. **Integration**: Works well with state management libraries (Redux, Zustand, etc.)

## Migration Guide

### From Uncontrolled to Controlled

**Before (Uncontrolled):**
```typescript
<InteractivePayCard
  initialData={{ cardName: 'John Doe' }}
  onSubmit={handleSubmit}
/>
```

**After (Controlled):**
```typescript
const [cardData, setCardData] = useState({
  cardName: 'John Doe',
  cardNumber: '',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
});

<InteractivePayCard
  value={cardData}
  onChange={setCardData}
  onSubmit={handleSubmit}
/>
```

## Best Practices

1. **Always provide initial values** for all fields in controlled mode
2. **Use TypeScript** for better type safety with CardFormData
3. **Validate on change** for real-time feedback
4. **Debounce API calls** if syncing with external services
5. **Handle loading states** when pre-filling data from APIs
6. **Sanitize data** before saving or submitting

## State Management Libraries

The controlled component pattern works perfectly with popular state management libraries:

### With Redux Toolkit

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { updateCardData } from './cardSlice';

const PaymentForm: React.FC = () => {
  const cardData = useSelector(state => state.card.data);
  const dispatch = useDispatch();

  return (
    <InteractivePayCard
      value={cardData}
      onChange={(newData) => dispatch(updateCardData(newData))}
      onSubmit={handleSubmit}
    />
  );
};
```

### With Zustand

```typescript
import { useCardStore } from './cardStore';

const PaymentForm: React.FC = () => {
  const { cardData, setCardData } = useCardStore();

  return (
    <InteractivePayCard
      value={cardData}
      onChange={setCardData}
      onSubmit={handleSubmit}
    />
  );
};
```
