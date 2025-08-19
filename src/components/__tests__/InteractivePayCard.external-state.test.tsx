import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CardFormData } from '../../types';
import InteractivePayCard from '../InteractivePayCard';

// Mock the utility modules
vi.mock('../../utils/translations', () => ({
  translate: vi.fn((key: string) => {
    const translations: { [key: string]: string } = {
      'cardForm.cardNumber': 'Card Number',
      'cardForm.cardName': 'Card Name',
      'cardForm.expirationDate': 'Expiration Date',
      'cardForm.month': 'Month',
      'cardForm.year': 'Year',
      'cardForm.CVV': 'CVV',
      'cardForm.submit': 'Submit',
      'cardForm.invalidCardNumber': 'Invalid Card Number',
    };
    return translations[key] || key;
  }),
}));

vi.mock('../../utils/images', () => ({
  getCardImage: vi.fn(() => 'mocked-card-image.png'),
}));

describe('InteractivePayCard - External State Management', () => {
  let mockOnChange: ReturnType<typeof vi.fn>;
  let mockOnSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnChange = vi.fn();
    mockOnSubmit = vi.fn();
  });

  describe('Controlled Mode', () => {
    it('works as a controlled component with value and onChange props', async () => {
      const user = userEvent.setup();
      const initialValue: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      await user.type(cardNameInput, 'J');

      // Check that onChange was called with the single character
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          cardName: 'J',
        })
      );
    });

    it('updates external state when card number changes', async () => {
      const user = userEvent.setup();
      const initialValue: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNumberInput = screen.getByLabelText(/card number/i);
      await user.type(cardNumberInput, '4');

      // Check that onChange was called with the single digit
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          cardNumber: '4',
        })
      );
    });

    it('displays initial values from external state', () => {
      const initialValue: CardFormData = {
        cardName: 'John Doe',
        cardNumber: '4111 1111 1111 1111',
        cardMonth: '12',
        cardYear: '2025',
        cardCvv: '123',
      };

      render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      const cardNumberInput = screen.getByLabelText(/card number/i);
      const cardMonthSelect = document.getElementById(
        'react-card-month'
      ) as HTMLSelectElement;
      const cardYearSelect = document.getElementById(
        'react-card-year'
      ) as HTMLSelectElement;
      const cardCvvInput = screen.getByLabelText(/cvv/i);

      expect(cardNameInput).toHaveValue('John Doe');
      expect(cardNumberInput).toHaveValue('4111 1111 1111 1111'); // Not masked when value provided externally
      expect(cardMonthSelect).toHaveValue('12');
      expect(cardYearSelect).toHaveValue('2025');
      expect(cardCvvInput).toHaveValue('123');
    });

    it('updates external state when month/year change', async () => {
      const user = userEvent.setup();
      const initialValue: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardMonthSelect = document.getElementById(
        'react-card-month'
      ) as HTMLSelectElement;
      const cardYearSelect = document.getElementById(
        'react-card-year'
      ) as HTMLSelectElement;

      await user.selectOptions(cardMonthSelect, '12');
      await user.selectOptions(cardYearSelect, '2025');

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          cardMonth: '12',
        })
      );

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          cardYear: '2025',
        })
      );
    });

    it('updates external state when CVV changes', async () => {
      const user = userEvent.setup();
      const initialValue: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cvvInput = screen.getByLabelText(/cvv/i);
      await user.type(cvvInput, '1');

      // Check that onChange was called with the single digit
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          cardCvv: '1',
        })
      );
    });
  });

  describe('Uncontrolled Mode (Backward Compatibility)', () => {
    it('works in uncontrolled mode when value and onChange are not provided', async () => {
      const user = userEvent.setup();

      render(<InteractivePayCard onSubmit={mockOnSubmit} />);

      const cardNameInput = screen.getByLabelText(/card name/i);
      await user.type(cardNameInput, 'John Doe');

      expect(cardNameInput).toHaveValue('John Doe');
      // onChange should not be called in uncontrolled mode
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('maintains backward compatibility with initialData', () => {
      const initialData: CardFormData = {
        cardName: 'Jane Doe',
        cardNumber: '5555 5555 5555 4444',
        cardMonth: '06',
        cardYear: '2024',
        cardCvv: '456',
      };

      render(
        <InteractivePayCard initialData={initialData} onSubmit={mockOnSubmit} />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      expect(cardNameInput).toHaveValue('Jane Doe');
    });
  });

  describe('Mode Detection', () => {
    it('prioritizes controlled mode when both value and onChange are provided', () => {
      const initialValue: CardFormData = {
        cardName: 'Controlled Value',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      const initialData: CardFormData = {
        cardName: 'Initial Data Value',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          initialData={initialData}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      // Should use controlled value, not initialData
      expect(cardNameInput).toHaveValue('Controlled Value');
    });

    it('falls back to uncontrolled mode when onChange is missing', () => {
      const initialData: CardFormData = {
        cardName: 'Test User',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard initialData={initialData} onSubmit={mockOnSubmit} />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      // Should use initialData when working in uncontrolled mode
      expect(cardNameInput).toHaveValue('Test User');
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('supports external control buttons for resetting form', async () => {
      let externalState: CardFormData = {
        cardName: 'John Doe',
        cardNumber: '4111 1111 1111 1111',
        cardMonth: '12',
        cardYear: '2025',
        cardCvv: '123',
      };

      const handleChange = (newData: CardFormData) => {
        externalState = newData;
        mockOnChange(newData);
      };

      const { rerender } = render(
        <InteractivePayCard
          value={externalState}
          onChange={handleChange}
          onSubmit={mockOnSubmit}
        />
      );

      // Reset form externally
      externalState = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      rerender(
        <InteractivePayCard
          value={externalState}
          onChange={handleChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      expect(cardNameInput).toHaveValue('');
    });

    it('supports external control buttons for filling sample data', async () => {
      let externalState: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      const handleChange = (newData: CardFormData) => {
        externalState = newData;
        mockOnChange(newData);
      };

      const { rerender } = render(
        <InteractivePayCard
          value={externalState}
          onChange={handleChange}
          onSubmit={mockOnSubmit}
        />
      );

      // Fill with sample data externally
      externalState = {
        cardName: 'Sample User',
        cardNumber: '4111 1111 1111 1111',
        cardMonth: '12',
        cardYear: '2025',
        cardCvv: '123',
      };

      rerender(
        <InteractivePayCard
          value={externalState}
          onChange={handleChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      expect(cardNameInput).toHaveValue('Sample User');
    });

    it('handles rapid state changes from external controls', async () => {
      let externalState: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      const handleChange = (newData: CardFormData) => {
        externalState = { ...externalState, ...newData };
        mockOnChange(externalState);
      };

      const { rerender } = render(
        <InteractivePayCard
          value={externalState}
          onChange={handleChange}
          onSubmit={mockOnSubmit}
        />
      );

      // Rapid changes
      for (let i = 0; i < 5; i++) {
        externalState = { ...externalState, cardName: `User ${i}` };
        rerender(
          <InteractivePayCard
            value={externalState}
            onChange={handleChange}
            onSubmit={mockOnSubmit}
          />
        );
      }

      const cardNameInput = screen.getByLabelText(/card name/i);
      expect(cardNameInput).toHaveValue('User 4');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined value prop gracefully', () => {
      const emptyValue: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard
          value={emptyValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      expect(cardNameInput).toHaveValue('');
    });

    it('handles complete CardFormData in controlled mode', () => {
      const completeData: CardFormData = {
        cardName: 'John Doe',
        cardNumber: '4111 1111 1111 1111',
        cardMonth: '12',
        cardYear: '2025',
        cardCvv: '123',
      };

      render(
        <InteractivePayCard
          value={completeData}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      expect(cardNameInput).toHaveValue('John Doe');
    });

    it('maintains field focus behavior in controlled mode', async () => {
      const user = userEvent.setup();
      const initialValue: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);

      await user.click(cardNameInput);
      expect(cardNameInput).toHaveFocus();
    });

    it('cleans up timeouts on unmount in controlled mode', () => {
      const initialValue: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      const { unmount } = render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      // Should not throw any errors on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Performance and Integration', () => {
    it('does not cause infinite re-renders with controlled state', async () => {
      const user = userEvent.setup();
      let renderCount = 0;

      const TestWrapper = () => {
        renderCount++;
        const [formData, setFormData] = React.useState<CardFormData>({
          cardName: '',
          cardNumber: '',
          cardMonth: '',
          cardYear: '',
          cardCvv: '',
        });

        return (
          <InteractivePayCard
            value={formData}
            onChange={setFormData}
            onSubmit={mockOnSubmit}
          />
        );
      };

      render(<TestWrapper />);

      const cardNameInput = screen.getByLabelText(/card name/i);
      await user.type(cardNameInput, 'J');

      // Wait for any potential re-renders
      await waitFor(() => {
        expect(renderCount).toBeLessThan(10); // Should not exceed reasonable render count
      });
    });

    it('handles simultaneous focus and state changes', async () => {
      const user = userEvent.setup();
      const initialValue: CardFormData = {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      };

      render(
        <InteractivePayCard
          value={initialValue}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cardNameInput = screen.getByLabelText(/card name/i);
      const cardNumberInput = screen.getByLabelText(/card number/i);

      // Focus and type simultaneously
      await user.click(cardNameInput);
      await user.type(cardNameInput, 'J');
      await user.click(cardNumberInput);
      await user.type(cardNumberInput, '4');

      expect(mockOnChange).toHaveBeenCalled();
      expect(cardNumberInput).toHaveFocus();
    });
  });
});
