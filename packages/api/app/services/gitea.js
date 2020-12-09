const fetch = require('node-fetch');
const randomBytes = require('crypto').randomBytes;

let users;

const baseUrl = process.env.GITEA_BACKEND_BASE_URL;
const token = process.env.GITEA_BACKEND_ADMIN_TOKEN;

const getHeaders = {
  Accept: 'application/json',
};

const headers = {
  ...getHeaders,
  'Content-Type': 'application/json',
};

const adminGetHeaders = {
  ...getHeaders,
  Authorization: `token ${token}`,
};

const adminHeaders = {
  ...headers,
  Authorization: `token ${token}`,
};

function basicAuth(username, password) {
  return 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
}

async function createUser({username}) {
  const password = randomBytes(24).toString('base64');
  const email = 'rco_' + randomBytes(24).toString('hex') + '@example.com';
  const resp = await fetch(`${baseUrl}/api/v1/admin/users`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      username,
      email,
      password,
      must_change_password: false,
    }),
  });
  const user = await resp.json();
  if (!resp.ok) {
    throw new Error('Error creating gitea user: ' + JSON.stringify(user));
  }
  const tokenResp = await fetch(`${baseUrl}/api/v1/users/${username}/tokens`, {
    method: 'POST',
    headers: {
      ...headers,
      Authorization: basicAuth(username, password),
    },
    body: JSON.stringify({
      name: 'Resources.co app',
    }),
  });
  const token = await tokenResp.json();
  if (!tokenResp.ok) {
    throw new Error('Error creating gitea token: ' + tokenResp.status + ", " + JSON.stringify(token));
  }
  return {
    ok: resp.ok,
    user,
    token: {
      ...token,
      token: token.sha1,
    },
  };
}

module.exports = {
  createUser,
};
