export interface CardFormData {
  cardName: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
}

export interface CardProps {
  labels: CardFormData;
  fields: {
    cardNumber: string;
    cardName: string;
    cardMonth: string;
    cardYear: string;
    cardCvv: string;
  };
  isCardNumberMasked: boolean;
  randomBackgrounds?: boolean;
  backgroundImage?: string;
  focusedField?: string | null;
  isCardFlipped?: boolean;
}

export interface InteractivePayCardProps {
  initialData?: Partial<CardFormData>;
  backgroundImage?: string;
  randomBackgrounds?: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (data: CardFormData) => void;
  locale?: 'en' | 'pt' | 'tr';
  className?: string;
}

export interface CardType {
  name: string;
  color: string;
}

export interface Translations {
  card: {
    cardHolder: string;
    fullName: string;
    expires: string;
    MM: string;
    YY: string;
  };
  cardForm: {
    cardNumber: string;
    cardName: string;
    expirationDate: string;
    month: string;
    year: string;
    CVV: string;
    submit: string;
    invalidCardNumber: string;
  };
}
