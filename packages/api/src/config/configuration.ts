import { generateKeyPairSync } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

function generateTemporaryKeys() {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return { publicKey, privateKey };
}

function getTemporaryKeys() {
  try {
    const data = readFileSync('config/temporary-keys.json', 'utf8');
    return JSON.parse(data);
  } catch (e) {
    const keys = generateTemporaryKeys();
    writeFileSync('config/temporary-keys.json', JSON.stringify(keys), 'utf8');
    return keys;
  }
}

export default () => {
  let auth;
  if (
    ['development', 'test'].includes(process.env.NODE_ENV) &&
    process.env.PUBLIC_KEY &&
    process.env.PRIVATE_KEY
  ) {
    auth = {
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
    };
  } else {
    auth = getTemporaryKeys();
  }
  if (!(auth && auth.publicKey && auth.privateKey)) {
    throw new Error('Missing auth keys');
  }
  return {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      type: 'postgres',
      url:
        process.env.NODE_ENV == 'test'
          ? process.env.TEST_DB_URL ||
            'postgres://localhost:5432/resources_co_api_test'
          : process.env.DB_URL || 'postgres://localhost:5432/resources_co_api',
      migrations: ['src/migrations/*.ts'],
    },
    auth,
  };
};
