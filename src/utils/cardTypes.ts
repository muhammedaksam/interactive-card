export const DEFAULT_CVC_LENGTH = 3;
export const DEFAULT_ZIP_LENGTH = 5;
export const DEFAULT_CARD_FORMAT = /(\d{1,4})/g;

export const CARD_TYPES = {
  amex: {
    name: 'Amex',
    color: 'green',
  },
  visa: {
    name: 'Visa',
    color: 'lime',
  },
  diners: {
    name: 'Diners',
    color: 'orange',
  },
  discover: {
    name: 'Discover',
    color: 'purple',
  },
  jcb: {
    name: 'Jcb',
    color: 'red',
  },
  jcb15: {
    name: 'Jcb',
    color: 'red',
  },
  maestro: {
    name: 'Maestro',
    color: 'yellow',
  },
  mastercard: {
    name: 'Mastercard',
    color: 'lightblue',
  },
  unionpay: {
    name: 'Unipay',
    color: 'cyan',
  },
};

export const getCardType = (number: string): string => {
  let re = new RegExp('^4');
  if (number.match(re) != null) return 'visa';

  re = new RegExp('^(34|37)');
  if (number.match(re) != null) return 'amex';

  re = new RegExp('^5[1-5]');
  if (number.match(re) != null) return 'mastercard';

  re = new RegExp('^6011');
  if (number.match(re) != null) return 'discover';

  re = new RegExp('^62');
  if (number.match(re) != null) return 'unionpay';

  re = new RegExp('^9792');
  if (number.match(re) != null) return 'troy';

  re = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}');
  if (number.match(re) != null) return 'dinersclub';

  re = new RegExp('^35(2[89]|[3-8])');
  if (number.match(re) != null) return 'jcb';

  return '';
};

export const formatCardNumber = (
  value: string
): { formatted: string; maxLength: number } => {
  const cleanValue = value.replace(/\D/g, '');

  // American Express, 15 digits
  if (/^3[47]\d{0,13}$/.test(cleanValue)) {
    return {
      formatted: cleanValue
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{6})/, '$1 $2 '),
      maxLength: 17,
    };
  }
  // Diner's Club, 14 digits
  else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(cleanValue)) {
    return {
      formatted: cleanValue
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{6})/, '$1 $2 '),
      maxLength: 16,
    };
  }
  // Regular CC number, 16 digits
  else if (/^\d{0,16}$/.test(cleanValue)) {
    return {
      formatted: cleanValue
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
        .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 '),
      maxLength: 19,
    };
  }

  return { formatted: value, maxLength: 19 };
};

export const validateCardNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\s/g, '');
  let sum = 0;

  for (let i = 0; i < cleanNumber.length; i++) {
    let intVal = parseInt(cleanNumber.substr(i, 1));
    if (i % 2 === 0) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + (intVal % 10);
      }
    }
    sum += intVal;
  }

  return sum % 10 === 0;
};

export const getCardPlaceholder = (cardType: string): string => {
  switch (cardType) {
    case 'amex':
      return '#### ###### #####';
    case 'dinersclub':
      return '#### ###### ####';
    default:
      return '#### #### #### ####';
  }
};
