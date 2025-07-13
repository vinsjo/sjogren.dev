const canGenerateSecureUUID =
  typeof window !== 'undefined' &&
  window.isSecureContext === true &&
  typeof window.crypto?.randomUUID === 'function';

/**
 * Generate UUID using `window.crypto.randomUUID` if available,
 * otherwise fallback to a custom implementation
 * (which is not cryptographically secure).
 */
export const randomUUID: () => string = canGenerateSecureUUID
  ? () => window.crypto.randomUUID()
  : () => {
      let uuid = '';
      const hexDigits = '0123456789abcdef';

      for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
          uuid += '-';
        } else if (i === 14) {
          uuid += '4'; // UUID version 4
        } else if (i === 19) {
          uuid += hexDigits[(Math.random() * 4) | 8]; // bits 6-7 of clock_seq_hi_and_reserved to 01x
        } else {
          uuid += hexDigits[Math.floor(Math.random() * 16)];
        }
      }
      return uuid;
    };
