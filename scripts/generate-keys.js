import { randomBytes } from 'node:crypto';

const hex = () => randomBytes(32).toString('hex');
console.log('APP_KEYS=' + [hex(), hex()].join(','));
console.log('API_TOKEN_SALT=' + hex());
console.log('ADMIN_JWT_SECRET=' + hex());
console.log('STRAPI_JWT_SECRET=' + hex());
console.log('TRANSFER_TOKEN_SALT=' + hex());
