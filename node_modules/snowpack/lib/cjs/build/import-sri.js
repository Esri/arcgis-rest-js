"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSRI = void 0;
const crypto_1 = require("crypto");
const DEFAULT_CRYPTO_HASH = 'sha384';
const EMPTY_BUFFER = Buffer.from('');
const generateSRI = (buffer = EMPTY_BUFFER, hashAlgorithm = DEFAULT_CRYPTO_HASH) => `${hashAlgorithm}-${crypto_1.createHash(hashAlgorithm).update(buffer).digest('base64')}`;
exports.generateSRI = generateSRI;
