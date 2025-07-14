import React, { useEffect, useRef, useState } from 'react';
import { CardProps } from '../types';
import { getCardPlaceholder, getCardType } from '../utils/cardTypes';
import { Locales, translate } from '../utils/translations';

interface PayCardProps extends CardProps {
  locale?: Locales;
}

const PayCard: React.FC<PayCardProps> = ({
  labels,
  fields,
  isCardNumberMasked,
  randomBackgrounds = true,
  backgroundImage,
  focusedField,
  isCardFlipped = false,
  locale = 'en',
}) => {
  const [focusElementStyle, setFocusElementStyle] =
    useState<React.CSSProperties | null>(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    '#### #### #### ####'
  );
  const focusElementRef = useRef<HTMLDivElement>(null);
  const cardNumberRef = useRef<HTMLLabelElement>(null);
  const cardNameRef = useRef<HTMLLabelElement>(null);
  const cardDateRef = useRef<HTMLDivElement>(null);

  const cardType = getCardType(labels.cardNumber);

  const currentCardBackground = React.useMemo(() => {
    if (randomBackgrounds && !backgroundImage) {
      const random = Math.floor(Math.random() * 25 + 1);
      return `https://raw.githubusercontent.com/muhammedaksam/interactive-card/main/src/assets/images/${random}.jpeg`;
    }
    return backgroundImage || null;
  }, [randomBackgrounds, backgroundImage]);

  useEffect(() => {
    setCurrentPlaceholder(getCardPlaceholder(cardType));
    // Recalculate focus when card type changes
    if (focusedField) {
      const timer = setTimeout(() => {
        changeFocus();
      }, 50);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardType, focusedField]);

  // Add window resize listener to recalculate focus position
  useEffect(() => {
    const handleResize = () => {
      if (focusedField) {
        changeFocus();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedField]);

  useEffect(() => {
    if (focusedField) {
      // Use a small delay to ensure refs are properly set
      const timer = setTimeout(() => {
        changeFocus();
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setFocusElementStyle(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedField]);

  const changeFocus = () => {
    let target: HTMLElement | null = null;

    // Map field IDs to their corresponding elements
    if (focusedField === 'react-card-number' && cardNumberRef.current) {
      target = cardNumberRef.current;
    } else if (focusedField === 'react-card-name' && cardNameRef.current) {
      target = cardNameRef.current;
    } else if (focusedField === 'cardDate' && cardDateRef.current) {
      // Handle mapped date focus
      target = cardDateRef.current;
    } else if (
      (focusedField === 'react-card-month' ||
        focusedField === 'react-card-year') &&
      cardDateRef.current
    ) {
      target = cardDateRef.current;
    }

    if (target && target.offsetWidth > 0 && target.offsetHeight > 0) {
      const style = {
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
        transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
        transition: 'all 0.35s cubic-bezier(0.71, 0.03, 0.56, 0.85)',
      };
      setFocusElementStyle(style);
    } else {
      setFocusElementStyle(null);
    }
  };

  const getIsNumberMasked = (index: number, char: string): boolean => {
    return (
      index > 4 &&
      index < 14 &&
      labels.cardNumber.length > index &&
      char.trim() !== '' &&
      isCardNumberMasked
    );
  };

  const renderCardNumber = () => {
    return currentPlaceholder.split('').map((char, index) => {
      const shouldShowMask = getIsNumberMasked(index, char);
      const hasValue = labels.cardNumber.length > index;
      const isActive = char.trim() === '';

      if (shouldShowMask) {
        return (
          <div key={index} className="card-item__numberItem">
            *
          </div>
        );
      } else if (hasValue) {
        return (
          <div
            key={index}
            className={`card-item__numberItem ${isActive ? '-active' : ''}`}
          >
            {labels.cardNumber[index]}
          </div>
        );
      } else {
        return (
          <div
            key={index}
            className={`card-item__numberItem ${isActive ? '-active' : ''}`}
          >
            {char}
          </div>
        );
      }
    });
  };

  const renderCardName = () => {
    if (labels.cardName.length) {
      return (
        <div className="card-item__name">
          {labels.cardName
            .replace(/\s\s+/g, ' ')
            .split('')
            .map((char, index) => (
              <span key={index} className="card-item__nameItem">
                {char}
              </span>
            ))}
        </div>
      );
    }
    return (
      <div className="card-item__name">
        {translate('card.fullName', {}, locale)}
      </div>
    );
  };

  return (
    <div className={`card-item ${isCardFlipped ? '-active' : ''}`}>
      <div className="card-item__side -front">
        <div
          ref={focusElementRef}
          className={`card-item__focus ${focusElementStyle ? '-active' : ''}`}
          style={focusElementStyle || {}}
        />
        <div className="card-item__cover">
          {currentCardBackground && (
            <img
              src={currentCardBackground}
              className="card-item__bg"
              alt="Card background"
            />
          )}
        </div>
        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img
              src="https://raw.githubusercontent.com/muhammedaksam/interactive-card/main/src/assets/images/chip.png"
              className="card-item__chip"
              alt="Card chip"
            />
            <div className="card-item__type">
              {cardType && (
                <img
                  src={`https://raw.githubusercontent.com/muhammedaksam/interactive-card/main/src/assets/images/${cardType}.png`}
                  alt={cardType}
                  className="card-item__typeImg"
                />
              )}
            </div>
          </div>
          <label
            htmlFor={fields.cardNumber}
            className="card-item__number"
            ref={cardNumberRef}
          >
            {renderCardNumber()}
          </label>
          <div className="card-item__content">
            <label
              htmlFor={fields.cardName}
              className="card-item__info"
              ref={cardNameRef}
            >
              <div className="card-item__holder">
                {translate('card.cardHolder', {}, locale)}
              </div>
              {renderCardName()}
            </label>
            <div className="card-item__date" ref={cardDateRef}>
              <label
                htmlFor={fields.cardMonth}
                className="card-item__dateTitle"
              >
                {translate('card.expires', {}, locale)}
              </label>
              <label htmlFor={fields.cardMonth} className="card-item__dateItem">
                <span>
                  {labels.cardMonth || translate('card.MM', {}, locale)}
                </span>
              </label>
              /
              <label htmlFor={fields.cardYear} className="card-item__dateItem">
                <span>
                  {labels.cardYear
                    ? String(labels.cardYear).slice(2, 4)
                    : translate('card.YY', {}, locale)}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="card-item__side -back">
        <div className="card-item__cover">
          {currentCardBackground && (
            <img
              src={currentCardBackground}
              className="card-item__bg"
              alt="Card background"
            />
          )}
        </div>
        <div className="card-item__band" />
        <div className="card-item__cvv">
          <div className="card-item__cvvTitle">CVV</div>
          <div className="card-item__cvvBand">
            {labels.cardCvv.split('').map((_, index) => (
              <span key={index}>*</span>
            ))}
          </div>
          <div className="card-item__type">
            {cardType && (
              <img
                src={`https://raw.githubusercontent.com/muhammedaksam/interactive-card/main/src/assets/images/${cardType}.png`}
                alt={cardType}
                className="card-item__typeImg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayCard;
