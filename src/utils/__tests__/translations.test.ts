import { describe, expect, it } from 'vitest';
import { t, translate, translations } from '../translations';

describe('translations', () => {
  describe('translate', () => {
    it('returns translation for existing nested keys in English', () => {
      expect(translate('cardForm.cardNumber', {}, 'en')).toBe('Card Number');
      expect(translate('cardForm.cardName', {}, 'en')).toBe('Card Name');
      expect(translate('cardForm.expirationDate', {}, 'en')).toBe(
        'Expiration Date'
      );
      expect(translate('cardForm.CVV', {}, 'en')).toBe('CVV');
      expect(translate('cardForm.submit', {}, 'en')).toBe('Submit');
    });

    it('returns translation for existing nested keys in Portuguese', () => {
      expect(translate('cardForm.cardNumber', {}, 'pt')).toBe(
        'Número do Cartão'
      );
      expect(translate('cardForm.cardName', {}, 'pt')).toBe('Nome do Cartão');
      expect(translate('cardForm.expirationDate', {}, 'pt')).toBe(
        'Data de Expiração'
      );
      expect(translate('cardForm.CVV', {}, 'pt')).toBe('CVV');
      expect(translate('cardForm.submit', {}, 'pt')).toBe('Enviar');
    });

    it('returns translation for existing nested keys in Turkish', () => {
      expect(translate('cardForm.cardNumber', {}, 'tr')).toBe('Kart Numarası');
      expect(translate('cardForm.cardName', {}, 'tr')).toBe('Kart Adı');
      expect(translate('cardForm.expirationDate', {}, 'tr')).toBe(
        'Son Kullanma Tarihi'
      );
      expect(translate('cardForm.CVV', {}, 'tr')).toBe('CVV');
      expect(translate('cardForm.submit', {}, 'tr')).toBe('Gönder');
    });

    it('uses English as default locale', () => {
      expect(translate('cardForm.cardNumber')).toBe('Card Number');
      expect(translate('cardForm.submit')).toBe('Submit');
    });

    it('returns key for non-existent translation key', () => {
      expect(translate('nonExistentKey', {}, 'en')).toBe('nonExistentKey');
      expect(translate('anotherMissingKey', {}, 'pt')).toBe(
        'anotherMissingKey'
      );
    });

    it('handles empty key', () => {
      expect(translate('', {}, 'en')).toBe('');
    });

    it('handles nested object navigation with dot notation', () => {
      // Test with nested keys
      expect(translate('cardForm.cardNumber', {}, 'en')).toBe('Card Number');
      expect(translate('card.cardHolder', {}, 'en')).toBe('Card Holder');
      expect(translate('card.expires', {}, 'en')).toBe('Expires');
    });

    it('returns key when value is not a string', () => {
      // This tests the case where a key points to an object instead of a string
      expect(translate('card', {}, 'en')).toBe('card'); // Points to object, not string
      expect(translate('cardForm', {}, 'en')).toBe('cardForm'); // Points to object, not string
    });
  });

  describe('t (shorthand function)', () => {
    it('returns translation for existing key in English (default)', () => {
      expect(t('cardForm.cardNumber')).toBe('Card Number');
      expect(t('cardForm.submit')).toBe('Submit');
    });

    it('returns translation for existing key with specified locale', () => {
      expect(t('cardForm.cardNumber', 'pt')).toBe('Número do Cartão');
      expect(t('cardForm.submit', 'tr')).toBe('Gönder');
    });

    it('handles non-existent keys', () => {
      expect(t('missingKey')).toBe('missingKey');
      expect(t('missingKey', 'pt')).toBe('missingKey');
    });
  });

  describe('translations object', () => {
    it('contains all required locales', () => {
      expect(translations).toHaveProperty('en');
      expect(translations).toHaveProperty('pt');
      expect(translations).toHaveProperty('tr');
    });

    it('has consistent structure across all locales', () => {
      const locales = ['en', 'pt', 'tr'] as const;

      locales.forEach(locale => {
        expect(translations[locale]).toHaveProperty('card');
        expect(translations[locale]).toHaveProperty('cardForm');
      });
    });

    it('contains expected translation keys', () => {
      const expectedCardKeys = [
        'cardHolder',
        'fullName',
        'expires',
        'MM',
        'YY',
      ];
      const expectedCardFormKeys = [
        'cardNumber',
        'cardName',
        'expirationDate',
        'month',
        'year',
        'CVV',
        'submit',
        'invalidCardNumber',
      ];

      expectedCardKeys.forEach(key => {
        expect(translations.en.card).toHaveProperty(key);
        expect(translations.pt.card).toHaveProperty(key);
        expect(translations.tr.card).toHaveProperty(key);
      });

      expectedCardFormKeys.forEach(key => {
        expect(translations.en.cardForm).toHaveProperty(key);
        expect(translations.pt.cardForm).toHaveProperty(key);
        expect(translations.tr.cardForm).toHaveProperty(key);
      });
    });
  });
});
