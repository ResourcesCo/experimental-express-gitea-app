const fetch = require('node-fetch');
const randomBytes = require('crypto').randomBytes;

let users;

const baseUrl = process.env.GITEA_BACKEND_BASE_URL;
const token = process.env.GITEA_BACKEND_ADMIN_TOKEN;
const prefix = process.env.GITEA_BACKEND_PREFIX;

async function createUser({username}) {
  const password = randomBytes(24).toString('base64');
  const email = prefix + randomBytes(24).toString('hex') + '@example.com';
  const resp = await fetch(`${baseUrl}/api/v1/admin/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: `${prefix}${username}`,
      email,
      password,
    }),
  });
  return {
    ok: resp.ok,
    body: await resp.json(),
  };
}

module.exports = {
  createUser,
};
