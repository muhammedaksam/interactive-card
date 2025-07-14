import React, { useEffect, useRef, useState } from 'react';
import '../assets/style.scss';
import { CardFormData, InteractivePayCardProps } from '../types';
import { formatCardNumber, validateCardNumber } from '../utils/cardTypes';
import { translate } from '../utils/translations';
import PayCard from './PayCard';

const InteractivePayCard: React.FC<InteractivePayCardProps> = ({
  initialData = {},
  backgroundImage,
  randomBackgrounds = true,
  onSubmit,
  locale = 'en',
  className = '',
}) => {
  const [formData, setFormData] = useState<CardFormData>({
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
    ...initialData,
  });

  const [isCardNumberMasked, setIsCardNumberMasked] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardNumberMaxLength, setCardNumberMaxLength] = useState(19);
  const [mainCardNumber, setMainCardNumber] = useState('');
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fields = {
    cardNumber: 'react-card-number',
    cardName: 'react-card-name',
    cardMonth: 'react-card-month',
    cardYear: 'react-card-year',
    cardCvv: 'react-card-cvv',
  };

  const minCardYear = new Date().getFullYear();
  const minCardMonth =
    formData.cardYear === minCardYear.toString()
      ? new Date().getMonth() + 1
      : 1;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  // Input validation functions
  const handleNumberOnly = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
  };

  const handleLetterOnly = (e: React.KeyboardEvent): void => {
    if (e.charCode >= 48 && e.charCode <= 57) {
      e.preventDefault();
    }
  };

  // Masking functions
  const maskCardNumber = (number: string): string => {
    const arr = number.split('');
    arr.forEach((element, index) => {
      if (index > 4 && index < 14 && element.trim() !== '') {
        arr[index] = '*';
      }
    });
    return arr.join('');
  };

  const unMaskCardNumber = (): void => {
    setFormData(prev => ({ ...prev, cardNumber: mainCardNumber }));
  };

  // Event handlers
  const handleCardNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, cardName: value }));
  };

  const handleCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { formatted, maxLength } = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
    setCardNumberMaxLength(maxLength);
    setMainCardNumber(formatted);
  };

  const handleCardMonthChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setFormData(prev => ({ ...prev, cardMonth: e.target.value }));
  };

  const handleCardYearChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setFormData(prev => ({ ...prev, cardYear: e.target.value }));
  };

  const handleCardCvvChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = handleNumberOnly(e.target.value);
    setFormData(prev => ({ ...prev, cardCvv: value }));
  };

  // Focus handlers
  const handleFocus = (fieldName: string): void => {
    // Clear any pending blur timeout when focusing on a new field
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    // Map month and year fields to the same focus area (date)
    let mappedField = fieldName;
    if (fieldName === fields.cardMonth || fieldName === fields.cardYear) {
      mappedField = 'cardDate'; // Use a common identifier for date fields
    }

    setFocusedField(mappedField);

    if (fieldName === fields.cardNumber) {
      unMaskCardNumber();
    }

    if (fieldName === fields.cardCvv) {
      setIsCardFlipped(true);
    } else {
      setIsCardFlipped(false);
    }
  };

  const handleBlur = (fieldName: string): void => {
    // Clear any existing timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    // Set a new timeout to clear focus
    blurTimeoutRef.current = setTimeout(() => {
      setFocusedField(null);
      blurTimeoutRef.current = null;
    }, 100);

    if (fieldName === fields.cardNumber && isCardNumberMasked) {
      setFormData(prev => ({
        ...prev,
        cardNumber: maskCardNumber(mainCardNumber),
      }));
    }

    if (fieldName === fields.cardCvv) {
      setIsCardFlipped(false);
    }
  };

  const toggleMask = (): void => {
    setIsCardNumberMasked(!isCardNumberMasked);
    if (!isCardNumberMasked) {
      setFormData(prev => ({
        ...prev,
        cardNumber: maskCardNumber(mainCardNumber),
      }));
    } else {
      unMaskCardNumber();
    }
  };

  const handleSubmit = (): void => {
    const cleanNumber = mainCardNumber.replace(/\s/g, '');
    if (!validateCardNumber(cleanNumber)) {
      alert(translate('cardForm.invalidCardNumber', {}, locale));
      return;
    }

    if (onSubmit) {
      onSubmit({
        ...formData,
        cardNumber: mainCardNumber,
      });
    }
  };

  const generateMonthValue = (n: number): string => {
    return n < 10 ? `0${n}` : n.toString();
  };

  // Initialize masking
  useEffect(() => {
    if (formData.cardNumber && isCardNumberMasked) {
      setMainCardNumber(formData.cardNumber);
      setFormData(prev => ({
        ...prev,
        cardNumber: maskCardNumber(formData.cardNumber),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`wrapper ${className}`}>
      <div className="card-form">
        <div className="card-list">
          <PayCard
            fields={fields}
            labels={formData}
            isCardNumberMasked={isCardNumberMasked}
            randomBackgrounds={randomBackgrounds}
            backgroundImage={backgroundImage}
            focusedField={focusedField}
            isCardFlipped={isCardFlipped}
            locale={locale}
          />
        </div>
        <div className="card-form__inner">
          <div className="card-input">
            <label htmlFor={fields.cardNumber} className="card-input__label">
              {translate('cardForm.cardNumber', {}, locale)}
            </label>
            <input
              type="tel"
              id={fields.cardNumber}
              className="card-input__input"
              value={formData.cardNumber}
              maxLength={cardNumberMaxLength}
              onChange={handleCardNumberChange}
              onFocus={() => handleFocus(fields.cardNumber)}
              onBlur={() => handleBlur(fields.cardNumber)}
              autoComplete="off"
              data-card-field
            />
            <button
              className={`card-input__eye ${!isCardNumberMasked ? '-active' : ''}`}
              title="Show/Hide card number"
              tabIndex={-1}
              disabled={formData.cardNumber === ''}
              onClick={toggleMask}
              type="button"
            />
          </div>

          <div className="card-input">
            <label htmlFor={fields.cardName} className="card-input__label">
              {translate('cardForm.cardName', {}, locale)}
            </label>
            <input
              type="text"
              id={fields.cardName}
              className="card-input__input"
              value={formData.cardName}
              onChange={handleCardNameChange}
              onFocus={() => handleFocus(fields.cardName)}
              onBlur={() => handleBlur(fields.cardName)}
              onKeyPress={handleLetterOnly}
              autoComplete="off"
              data-card-field
            />
          </div>

          <div className="card-form__row">
            <div className="card-form__col">
              <div className="card-form__group">
                <label htmlFor={fields.cardMonth} className="card-input__label">
                  {translate('cardForm.expirationDate', {}, locale)}
                </label>
                <select
                  className="card-input__input -select"
                  id={fields.cardMonth}
                  value={formData.cardMonth}
                  onChange={handleCardMonthChange}
                  onFocus={() => handleFocus(fields.cardMonth)}
                  onBlur={() => handleBlur(fields.cardMonth)}
                  data-card-field
                >
                  <option value="" disabled>
                    {translate('cardForm.month', {}, locale)}
                  </option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                    <option
                      key={n}
                      value={generateMonthValue(n)}
                      disabled={n < minCardMonth}
                    >
                      {generateMonthValue(n)}
                    </option>
                  ))}
                </select>
                <select
                  className="card-input__input -select"
                  id={fields.cardYear}
                  value={formData.cardYear}
                  onChange={handleCardYearChange}
                  onFocus={() => handleFocus(fields.cardYear)}
                  onBlur={() => handleBlur(fields.cardYear)}
                  data-card-field
                >
                  <option value="" disabled>
                    {translate('cardForm.year', {}, locale)}
                  </option>
                  {Array.from({ length: 12 }, (_, i) => minCardYear + i).map(
                    year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            <div className="card-form__col -cvv">
              <div className="card-input">
                <label htmlFor={fields.cardCvv} className="card-input__label">
                  {translate('cardForm.CVV', {}, locale)}
                </label>
                <input
                  type="tel"
                  className="card-input__input"
                  id={fields.cardCvv}
                  maxLength={4}
                  value={formData.cardCvv}
                  onChange={handleCardCvvChange}
                  onFocus={() => handleFocus(fields.cardCvv)}
                  onBlur={() => handleBlur(fields.cardCvv)}
                  autoComplete="off"
                  data-card-field
                />
              </div>
            </div>
          </div>

          <button
            className="card-form__button"
            onClick={handleSubmit}
            type="button"
          >
            {translate('cardForm.submit', {}, locale)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractivePayCard;
