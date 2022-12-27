import { createHash } from 'crypto';
const DEFAULT_CRYPTO_HASH = 'sha384';
const EMPTY_BUFFER = Buffer.from('');
export const generateSRI = (buffer = EMPTY_BUFFER, hashAlgorithm = DEFAULT_CRYPTO_HASH) => `${hashAlgorithm}-${createHash(hashAlgorithm).update(buffer).digest('base64')}`;
