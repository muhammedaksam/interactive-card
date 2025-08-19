import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { InteractivePayCard } from '../index';
import { CardFormData } from '../types';

const meta: Meta<typeof InteractivePayCard> = {
  title: 'Components/InteractivePayCard/ExternalState',
  component: InteractivePayCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Examples demonstrating external state management with the InteractivePayCard component.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Controlled Component Story
const ControlledCardTemplate = () => {
  const [cardData, setCardData] = useState<CardFormData>({
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
  });

  const handleCardDataChange = (newData: CardFormData) => {
    setCardData(newData);
  };

  const handleSubmit = (submitData: CardFormData) => {
    alert(`Card submitted: ${JSON.stringify(submitData, null, 2)}`);
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
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={resetForm}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset Form
        </button>
        <button
          onClick={fillSampleData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Fill Sample Data
        </button>
      </div>

      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
        }}
      >
        <strong>Current State:</strong>
        <pre>{JSON.stringify(cardData, null, 2)}</pre>
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

export const ControlledCard: Story = {
  render: ControlledCardTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'A controlled card component where the state is managed externally. Use the buttons to reset or fill sample data.',
      },
    },
  },
};

// Real-time Validation Story
const ValidationTemplate = () => {
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

    alert('Card validated and submitted successfully!');
  };

  const isFormValid =
    Object.keys(validationErrors).length === 0 &&
    Object.values(cardData).every(value => String(value).trim() !== '');

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
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
        <h4 style={{ margin: '0 0 10px 0' }}>
          Form Status: {isFormValid ? '✅ Valid' : '❌ Invalid'}
        </h4>
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
      />
    </div>
  );
};

export const RealTimeValidation: Story = {
  render: ValidationTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'A card component with real-time validation. The validation status updates as you type.',
      },
    },
  },
};

// Pre-filled Controlled Component
const PreFilledTemplate = () => {
  const [cardData, setCardData] = useState<CardFormData>({
    cardName: 'Jane Smith',
    cardNumber: '5555 5555 5555 4444',
    cardMonth: '08',
    cardYear: '2026',
    cardCvv: '456',
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <p style={{ marginBottom: '20px', color: '#6c757d' }}>
        This example shows a controlled component with pre-filled data.
      </p>
      <InteractivePayCard
        value={cardData}
        onChange={setCardData}
        onSubmit={data => alert(`Submitted: ${JSON.stringify(data, null, 2)}`)}
        locale="en"
        randomBackgrounds={true}
      />
    </div>
  );
};

export const PreFilledControlled: Story = {
  render: PreFilledTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'A controlled card component with pre-filled data showing how external state can initialize the form.',
      },
    },
  },
};

// Backward Compatibility (Uncontrolled)
export const BackwardCompatibility: Story = {
  args: {
    initialData: {
      cardName: 'Legacy User',
      cardNumber: '4000 0000 0000 0002',
      cardMonth: '03',
      cardYear: '2027',
    },
    locale: 'en',
    randomBackgrounds: true,
    onSubmit: (data: CardFormData) =>
      alert(`Legacy mode: ${JSON.stringify(data, null, 2)}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          'This demonstrates backward compatibility. The component still works with the old initialData prop when value and onChange are not provided.',
      },
    },
  },
};

// Interactive test for controlled mode
export const ControlledInteractiveTest: Story = {
  render: ControlledCardTemplate,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click fill sample data button
    const fillButton = canvas.getByText('Fill Sample Data');
    await userEvent.click(fillButton);

    // Verify the data was filled
    const cardNumberInput = canvas.getByLabelText(/card number/i);
    await expect(cardNumberInput).toHaveValue('4111 1111 1111 1111');

    const cardNameInput = canvas.getByLabelText(/card name/i);
    await expect(cardNameInput).toHaveValue('John Doe');

    // Clear the form
    const resetButton = canvas.getByText('Reset Form');
    await userEvent.click(resetButton);

    // Verify the form is cleared
    await expect(cardNumberInput).toHaveValue('');
    await expect(cardNameInput).toHaveValue('');
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive test demonstrating external state control with automated actions.',
      },
    },
  },
};
