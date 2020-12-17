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
  return user;
}

async function createProject({name, username}) {
  const resp = await fetch(`${baseUrl}/api/v1/user/repos`, {
    method: 'POST',
    headers: {
      ...adminHeaders,
      Sudo: username,
    },
    body: JSON.stringify({
      name,
    }),
  });
  if (!resp.ok) {
    const respBody = await resp.json();
    throw new Error('Error creating project' + JSON.stringify(respBody));
  }
  const project = await resp.json();
  return project;
}

module.exports = {
  createUser,
  createProject,
};
