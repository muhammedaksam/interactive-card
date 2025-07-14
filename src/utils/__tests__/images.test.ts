import { describe, expect, it } from 'vitest';
import cardImages, { CardImages } from '../images';

describe('images', () => {
  describe('cardImages object', () => {
    it('exports default cardImages object', () => {
      expect(cardImages).toBeDefined();
      expect(typeof cardImages).toBe('object');
    });

    it('contains all required card image properties', () => {
      expect(cardImages).toHaveProperty('placeholder');
      expect(cardImages).toHaveProperty('visa');
      expect(cardImages).toHaveProperty('mastercard');
      expect(cardImages).toHaveProperty('amex');
    });

    it('all image properties are valid base64 data URLs', () => {
      const dataUrlPattern = /^data:image\/(svg\+xml|png|jpg|jpeg);base64,/;

      expect(cardImages.placeholder).toMatch(dataUrlPattern);
      expect(cardImages.visa).toMatch(dataUrlPattern);
      expect(cardImages.mastercard).toMatch(dataUrlPattern);
      expect(cardImages.amex).toMatch(dataUrlPattern);
    });

    it('all image properties are non-empty strings', () => {
      expect(typeof cardImages.placeholder).toBe('string');
      expect(cardImages.placeholder.length).toBeGreaterThan(0);

      expect(typeof cardImages.visa).toBe('string');
      expect(cardImages.visa.length).toBeGreaterThan(0);

      expect(typeof cardImages.mastercard).toBe('string');
      expect(cardImages.mastercard.length).toBeGreaterThan(0);

      expect(typeof cardImages.amex).toBe('string');
      expect(cardImages.amex.length).toBeGreaterThan(0);
    });

    it('contains SVG data URLs specifically', () => {
      const svgDataUrlPattern = /^data:image\/svg\+xml;base64,/;

      expect(cardImages.placeholder).toMatch(svgDataUrlPattern);
      expect(cardImages.visa).toMatch(svgDataUrlPattern);
      expect(cardImages.mastercard).toMatch(svgDataUrlPattern);
      expect(cardImages.amex).toMatch(svgDataUrlPattern);
    });

    it('base64 data can be decoded successfully', () => {
      // Test that the base64 data is valid by attempting to decode it
      const extractBase64Data = (dataUrl: string) => {
        return dataUrl.split(',')[1];
      };

      expect(() => {
        atob(extractBase64Data(cardImages.placeholder));
      }).not.toThrow();

      expect(() => {
        atob(extractBase64Data(cardImages.visa));
      }).not.toThrow();

      expect(() => {
        atob(extractBase64Data(cardImages.mastercard));
      }).not.toThrow();

      expect(() => {
        atob(extractBase64Data(cardImages.amex));
      }).not.toThrow();
    });

    it('decoded SVG content contains expected elements', () => {
      const extractBase64Data = (dataUrl: string) => {
        return dataUrl.split(',')[1];
      };

      const decodedPlaceholder = atob(
        extractBase64Data(cardImages.placeholder)
      );
      expect(decodedPlaceholder).toContain('<svg');
      expect(decodedPlaceholder).toContain('placeholder');

      const decodedVisa = atob(extractBase64Data(cardImages.visa));
      expect(decodedVisa).toContain('<svg');
      expect(decodedVisa).toContain('visa');

      const decodedMastercard = atob(extractBase64Data(cardImages.mastercard));
      expect(decodedMastercard).toContain('<svg');
      expect(decodedMastercard).toContain('mastercard');

      const decodedAmex = atob(extractBase64Data(cardImages.amex));
      expect(decodedAmex).toContain('<svg');
      expect(decodedAmex).toContain('amex');
    });
  });

  describe('CardImages interface', () => {
    it('cardImages object conforms to CardImages interface', () => {
      // TypeScript compilation will ensure this, but we can also test runtime behavior
      const testCardImages: CardImages = cardImages;

      expect(testCardImages.placeholder).toBeDefined();
      expect(testCardImages.visa).toBeDefined();
      expect(testCardImages.mastercard).toBeDefined();
      expect(testCardImages.amex).toBeDefined();
    });

    it('interface requires all expected properties', () => {
      // Test that the interface shape matches our expectations
      const mockCardImages: CardImages = {
        placeholder: 'data:image/svg+xml;base64,test',
        visa: 'data:image/svg+xml;base64,test',
        mastercard: 'data:image/svg+xml;base64,test',
        amex: 'data:image/svg+xml;base64,test',
      };

      expect(mockCardImages).toHaveProperty('placeholder');
      expect(mockCardImages).toHaveProperty('visa');
      expect(mockCardImages).toHaveProperty('mastercard');
      expect(mockCardImages).toHaveProperty('amex');
    });
  });
});
