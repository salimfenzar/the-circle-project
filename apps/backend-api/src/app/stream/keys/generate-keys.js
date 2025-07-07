// Script to generate RSA key pair for signing chat messages
const { generateKeyPairSync } = require('crypto');
const { writeFileSync } = require('fs');
const path = require('path');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

const dir = __dirname;
writeFileSync(path.join(dir, 'private.pem'), privateKey);
writeFileSync(path.join(dir, 'public.pem'), publicKey);

console.log('RSA key pair generated in', dir);
