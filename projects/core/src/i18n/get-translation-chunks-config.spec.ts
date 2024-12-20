import { getTranslationChunksConfig } from './get-translation-chunks-config';

describe('getTranslationChunksConfig', () => {
  it('should transform translation object into chunks config', () => {
    const translationsEn = {
      common: {
        greetings: {
          hello: 'Hello',
          welcome: 'Welcome',
        },
        errors: {
          notFound: 'Not found',
        },
      },
      auth: {
        userActions: {
          login: 'Login',
          register: 'Register',
        },
        account: {
          close: 'Close',
        },
      },
    };

    const result = getTranslationChunksConfig(translationsEn);

    expect(result).toEqual({
      common: ['greetings', 'errors'],
      auth: ['userActions', 'account'],
    });
  });

  it('should handle empty translation object', () => {
    const translations = {};

    const result = getTranslationChunksConfig(translations);

    expect(result).toEqual({});
  });

  it('should handle chunks that contain just 1 key', () => {
    const translations = {
      common: { hello: 'Hello' },
      auth: { login: 'Login' },
    };

    const result = getTranslationChunksConfig(translations);

    expect(result).toEqual({
      common: ['hello'],
      auth: ['login'],
    });
  });

  it('should return empty array for a chunk without keys (edge case)', () => {
    const translations = {
      emptyChunk: {},
      nonEmptyChunk: { key: 'value' },
    };

    const result = getTranslationChunksConfig(translations);

    expect(result).toEqual({
      emptyChunk: [],
      nonEmptyChunk: ['key'],
    });
  });
});
