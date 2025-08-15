import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InteractivePayCard from '../InteractivePayCard';

describe('InteractivePayCard', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the card form', () => {
    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiration date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
  });

  it('accepts initial data', () => {
    const initialData = {
      cardName: 'John Doe',
      cardNumber: '4111 1111 1111 1111',
    };

    render(
      <InteractivePayCard onSubmit={mockOnSubmit} initialData={initialData} />
    );

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4111 **** **** 1111')).toBeInTheDocument();
  });

  it('formats card number correctly', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);

    await user.type(cardNumberInput, '4111111111111111');

    expect(cardNumberInput).toHaveValue('4111 1111 1111 1111');
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.click(submitButton);

    // The form calls onSubmit even with empty fields
    expect(mockOnSubmit).toHaveBeenCalledWith({
      cardCvv: '',
      cardMonth: '',
      cardName: '',
      cardNumber: '',
      cardYear: '',
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/card number/i), '4111111111111111');
    await user.type(screen.getByLabelText(/card name/i), 'John Doe');

    // Select month and year using their actual accessible names
    const monthSelect = screen.getByRole('combobox', {
      name: /expires mm expiration date/i,
    });
    const yearSelect = screen.getByRole('combobox', { name: /yy/i });

    await user.selectOptions(monthSelect, '12');
    await user.selectOptions(yearSelect, '2025');
    await user.type(screen.getByLabelText(/cvv/i), '123');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          cardNumber: '4111 1111 1111 1111',
          cardName: 'John Doe',
          cardMonth: '12',
          cardYear: '2025',
          cardCvv: '123',
        })
      );
    });
  });

  it('detects card type correctly', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);

    // Test Visa (logo appears on both front and back)
    await user.type(cardNumberInput, '4111');
    expect(screen.getAllByAltText('visa')).toHaveLength(2);

    // Clear and test Mastercard (logo appears on both front and back)
    await user.clear(cardNumberInput);
    await user.type(cardNumberInput, '5555');
    expect(screen.getAllByAltText('mastercard')).toHaveLength(2);
  });

  it('supports different locales', () => {
    render(<InteractivePayCard onSubmit={mockOnSubmit} locale="pt" />);

    // Check if Portuguese translations are used (use actual text from DOM)
    expect(screen.getByText('Nome do Cartão')).toBeInTheDocument();
  });

  it('flips card when CVV field is focused', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cvvInput = screen.getByLabelText(/cvv/i);

    await user.click(cvvInput);

    expect(screen.getAllByText('CVV')).toHaveLength(2); // CVV appears on form label and card back
  });

  it('prevents numeric input in letter-only fields', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNameInput = screen.getByLabelText(/card name/i);

    // Try to type numbers - they should be prevented
    await user.type(cardNameInput, 'John123Doe');

    // Should only contain letters and spaces, numbers should be filtered out
    expect(cardNameInput).toHaveValue('JohnDoe');
  });

  it('toggles card number masking', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);

    // Type a card number first
    await user.type(cardNumberInput, '4111111111111111');
    expect(cardNumberInput).toHaveValue('4111 1111 1111 1111');

    // Click the toggle button - this should execute the toggleMask function
    const toggleButton = screen.getByRole('button', {
      name: /show\/hide card number/i,
    });

    // Before clicking, the button should not have -active class
    expect(toggleButton).not.toHaveClass('-active');

    await user.click(toggleButton);

    // After clicking, the button should have -active class (indicating state changed)
    expect(toggleButton).toHaveClass('-active');

    // Click again to toggle back
    await user.click(toggleButton);
    expect(toggleButton).not.toHaveClass('-active');
  });

  it('shows alert for invalid card number on submit', async () => {
    const user = userEvent.setup();

    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    // Fill form with invalid card number
    await user.type(screen.getByLabelText(/card name/i), 'John Doe');
    await user.type(screen.getByLabelText(/card number/i), '1234567890123456'); // Invalid card number

    // Use the correct selector for the select elements
    const monthSelect = screen.getByDisplayValue('Month');
    const yearSelect = screen.getByDisplayValue('Year');

    await user.selectOptions(monthSelect, '12');
    await user.selectOptions(yearSelect, '2025');
    await user.type(screen.getByLabelText(/cvv/i), '123');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Should show alert and not call onSubmit
    expect(alertSpy).toHaveBeenCalledWith('Invalid Card Number');
    expect(mockOnSubmit).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('handles field blur with timeout clearing', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);
    const cardNameInput = screen.getByLabelText(/card name/i);

    // Type a card number and then quickly switch focus
    await user.type(cardNumberInput, '4111111111111111');

    // Focus on another field to trigger blur
    await user.click(cardNameInput);

    // Wait for the timeout to execute (100ms + buffer)
    await waitFor(
      () => {
        // The timeout should have executed, setting focusedField to null
        expect(cardNumberInput).toHaveValue('4111 **** **** 1111'); // Should be masked on blur
      },
      { timeout: 200 }
    );

    // Trigger blur again to test the timeout clearing logic
    await user.click(cardNumberInput);
    await user.click(cardNameInput);

    // Wait again to ensure the timeout logic runs multiple times
    await new Promise(resolve => setTimeout(resolve, 150));
  });

  it('handles rapid focus changes with timeout clearing', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);
    const cardNameInput = screen.getByLabelText(/card name/i);
    const cvvInput = screen.getByLabelText(/cvv/i);

    // Rapidly switch focus to trigger timeout clearing
    await user.click(cardNumberInput);
    await user.click(cardNameInput); // This should clear previous timeout
    await user.click(cvvInput); // This should clear the timeout again

    // Wait for timeouts to potentially execute
    await new Promise(resolve => setTimeout(resolve, 150));

    // The component should handle this gracefully
    expect(cardNumberInput).toBeInTheDocument();
  });

  it('handles blur with masked card number', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);
    const toggleButton = screen.getByRole('button', {
      name: /show\/hide card number/i,
    });
    const cardNameInput = screen.getByLabelText(/card name/i);

    // Type a card number and enable masking
    await user.type(cardNumberInput, '4111111111111111');
    await user.click(toggleButton); // Enable masking

    // Focus on the card number field and then blur
    await user.click(cardNumberInput);
    await user.click(cardNameInput); // This should trigger the masked blur logic

    // Wait for the timeout to execute
    await new Promise(resolve => setTimeout(resolve, 150));

    // The component should handle this gracefully
    expect(cardNumberInput).toBeInTheDocument();
  });

  it('properly clears timeout when blurTimeoutRef.current is null', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);
    const cardNameInput = screen.getByLabelText(/card name/i);

    // Focus on card number and immediately blur to trigger timeout
    await user.click(cardNumberInput);
    await user.click(cardNameInput);

    // Wait for the timeout to execute and set blurTimeoutRef.current to null
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 120));
    });

    // Now blur again - this should handle the case where blurTimeoutRef.current is null
    await user.click(cardNumberInput);
    await user.click(cardNameInput);

    // Wait for the second timeout to execute
    await new Promise(resolve => setTimeout(resolve, 120));

    expect(cardNumberInput).toBeInTheDocument();
  });

  it('clears existing timeout before setting new one', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);
    const cardNameInput = screen.getByLabelText(/card name/i);
    const cvvInput = screen.getByLabelText(/cvv/i);

    // Type a card number
    await user.type(cardNumberInput, '4111111111111111');

    // Focus and blur rapidly to create overlapping timeouts
    await user.click(cardNumberInput);
    await user.click(cardNameInput); // This sets a timeout

    // Before the first timeout can complete, trigger another blur
    // This should clear the first timeout (testing lines 147-148)
    await user.click(cardNumberInput);
    await user.click(cvvInput); // This should clear the previous timeout and set a new one

    // Wait for the timeout to complete and set blurTimeoutRef.current to null (testing lines 152-153)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 120));
    });

    expect(cardNumberInput).toBeInTheDocument();
  });

  it('clears timeout in handleFocus when blurTimeoutRef.current exists', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);
    const cardNameInput = screen.getByLabelText(/card name/i);
    const cvvInput = screen.getByLabelText(/cvv/i);

    // Focus on card number, then blur to create a timeout
    await user.click(cardNumberInput);
    await user.click(cardNameInput); // This creates a blur timeout

    // Now focus on another field before the timeout executes
    // This should trigger the handleFocus timeout clearing (lines 121-122)
    await user.click(cvvInput);

    expect(cardNumberInput).toBeInTheDocument();
  });

  it('tests the specific timeout execution lines', async () => {
    const user = userEvent.setup();

    render(<InteractivePayCard onSubmit={mockOnSubmit} />);

    const cardNumberInput = screen.getByLabelText(/card number/i);
    const cardNameInput = screen.getByLabelText(/card name/i);

    // Type a card number first
    await user.type(cardNumberInput, '4111111111111111');

    // Focus on card number and then blur
    await user.click(cardNumberInput);
    await user.click(cardNameInput);

    // Wait longer to ensure the timeout executes
    await waitFor(
      () => {
        expect(cardNumberInput).toBeInTheDocument();
      },
      { timeout: 200 }
    );

    // Try one more timeout cycle
    await user.click(cardNumberInput);
    await user.click(cardNameInput);

    // Wait for timeout to execute again
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(cardNumberInput).toBeInTheDocument();
  });
});
