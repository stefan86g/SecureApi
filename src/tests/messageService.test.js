import { encryptMessage, decryptMessage } from '../utils/crypto.js';

describe('Message Encryption/Decryption', () => {
  test('should encrypt and decrypt a message correctly', () => {
    const originalText = 'Hello, secure world!';

    // Шифруем сообщение
    const { encrypted, iv } = encryptMessage(originalText);

    expect(typeof encrypted).toBe('string');
    expect(typeof iv).toBe('string');
    expect(encrypted).not.toBe(originalText); // зашифрованный текст не должен быть равен оригиналу

    // Дешифруем сообщение
    const decrypted = decryptMessage(encrypted, iv);

    expect(decrypted).toBe(originalText); // после дешифрования текст должен совпадать с исходным
  });

  test('should fail to decrypt with wrong IV', () => {
    const originalText = 'Test message';
    const { encrypted } = encryptMessage(originalText);

    // Передаём неверный IV
    expect(() => decryptMessage(encrypted, 'wrong-iv')).toThrow();
  });

  test('should fail to decrypt with corrupted encrypted text', () => {
    const originalText = 'Another message';
    const { iv } = encryptMessage(originalText);

    // Передаём повреждённый зашифрованный текст
    expect(() => decryptMessage('corrupted-text', iv)).toThrow();
  });
});
