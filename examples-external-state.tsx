// Examples showing external state management with the InteractivePayCard component

import React, { useState } from 'react';
import { CardFormData, InteractivePayCard } from './src/index';
// Don't forget to import the styles
import './src/assets/style.scss';

// Example 1: Controlled Component with External State
export const ControlledCardExample: React.FC = () => {
  const [cardData, setCardData] = useState<CardFormData>({
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
  });

  const handleCardDataChange = (newData: CardFormData) => {
    setCardData(newData);
    console.log('Card data updated:', newData);
  };

  const handleSubmit = (submitData: CardFormData) => {
    console.log('Card submitted:', submitData);
    // Process the card data (send to payment processor, etc.)
  };

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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Controlled Card with External State</h2>

      {/* External Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={resetForm} style={{ padding: '8px 16px' }}>
          Reset Form
        </button>
        <button onClick={fillSampleData} style={{ padding: '8px 16px' }}>
          Fill Sample Data
        </button>
      </div>

      {/* Current State Display */}
      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h4>Current State:</h4>
        <pre>{JSON.stringify(cardData, null, 2)}</pre>
      </div>

      {/* Controlled Card Component */}
      <InteractivePayCard
        value={cardData}
        onChange={handleCardDataChange}
        onSubmit={handleSubmit}
        locale="en"
        randomBackgrounds={true}
        className="controlled-card"
      />
    </div>
  );
};

// Example 2: Multi-step form with external state
export const MultiStepFormExample: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal info
    firstName: '',
    lastName: '',
    email: '',

    // Step 2: Card data
    cardData: {
      cardName: '',
      cardNumber: '',
      cardMonth: '',
      cardYear: '',
      cardCvv: '',
    },

    // Step 3: Billing
    address: '',
    city: '',
    zipCode: '',
  });

  const handleCardDataChange = (newCardData: CardFormData) => {
    setFormData(prev => ({
      ...prev,
      cardData: newCardData,
    }));
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (cardData: CardFormData) => {
    console.log('Complete form data:', {
      ...formData,
      cardData,
    });
    alert('Form submitted successfully!');
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Multi-Step Form with External State</h2>

      {/* Step Indicator */}
      <div
        style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {[1, 2, 3].map(step => (
          <div
            key={step}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              backgroundColor: currentStep === step ? '#007bff' : '#e9ecef',
              color: currentStep === step ? 'white' : '#6c757d',
            }}
          >
            Step {step}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Personal Information</h3>
          <div style={{ display: 'grid', gap: '15px', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={e =>
                handlePersonalInfoChange('firstName', e.target.value)
              }
              style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={e =>
                handlePersonalInfoChange('lastName', e.target.value)
              }
              style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => handlePersonalInfoChange('email', e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Payment Information</h3>
          <InteractivePayCard
            value={formData.cardData}
            onChange={handleCardDataChange}
            onSubmit={handleSubmit}
            locale="en"
            randomBackgrounds={true}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Review & Submit</h3>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <h4>Personal Info:</h4>
            <p>
              Name: {formData.firstName} {formData.lastName}
            </p>
            <p>Email: {formData.email}</p>

            <h4>Card Info:</h4>
            <p>Card Holder: {formData.cardData.cardName}</p>
            <p>Card Number: {formData.cardData.cardNumber}</p>
            <p>
              Expiry: {formData.cardData.cardMonth}/{formData.cardData.cardYear}
            </p>

            <button
              onClick={() => handleSubmit(formData.cardData)}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Complete Order
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
        }}
      >
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{
            padding: '10px 20px',
            backgroundColor: currentStep === 1 ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === 3}
          style={{
            padding: '10px 20px',
            backgroundColor: currentStep === 3 ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentStep === 3 ? 'not-allowed' : 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Example 3: Real-time validation with external state
export const RealTimeValidationExample: React.FC = () => {
  const [cardData, setCardData] = useState<CardFormData>({
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'cardName':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'cardNumber': {
        const cleanNumber = value.replace(/\s/g, '');
        return cleanNumber.length < 13
          ? 'Card number must be at least 13 digits'
          : '';
      }
      case 'cardMonth':
        return !value ? 'Month is required' : '';
      case 'cardYear':
        return !value ? 'Year is required' : '';
      case 'cardCvv':
        return value.length < 3 ? 'CVV must be at least 3 digits' : '';
      default:
        return '';
    }
  };

  const handleCardDataChange = (newData: CardFormData) => {
    setCardData(newData);

    // Real-time validation
    const errors: { [key: string]: string } = {};
    Object.keys(newData).forEach(field => {
      const error = validateField(field, newData[field as keyof CardFormData]);
      if (error) errors[field] = error;
    });
    setValidationErrors(errors);
  };

  const handleSubmit = (submitData: CardFormData) => {
    // Final validation
    const errors: { [key: string]: string } = {};
    Object.keys(submitData).forEach(field => {
      const error = validateField(
        field,
        submitData[field as keyof CardFormData]
      );
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      alert('Please fix validation errors before submitting');
      return;
    }

    console.log('Valid card submitted:', submitData);
    alert('Card validated and submitted successfully!');
  };

  const isFormValid =
    Object.keys(validationErrors).length === 0 &&
    Object.values(cardData).every(value => String(value).trim() !== '');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Real-time Validation Example</h2>

      {/* Validation Status */}
      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: isFormValid ? '#d4edda' : '#f8d7da',
          border: `1px solid ${isFormValid ? '#c3e6cb' : '#f5c6cb'}`,
          color: isFormValid ? '#155724' : '#721c24',
        }}
      >
        <h4>Form Status: {isFormValid ? '✅ Valid' : '❌ Invalid'}</h4>
        {Object.keys(validationErrors).length > 0 && (
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>
                <strong>{field}:</strong> {error}
              </li>
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
        className="validation-card"
      />
    </div>
  );
};

export default ControlledCardExample;
