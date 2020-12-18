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

class Client {
  constructor(username) {
    this.username = username;
  }

  async request(url, method, body = undefined) {
    const resp = await fetch(`${baseUrl}/api/v1${url}`, {
      method,
      headers: {
        ...adminHeaders,
        Sudo: this.username,
      },
      ...(body && {body: JSON.stringify(body)}),
    });
    let respBody
    try {
      respBody = await resp.text();
    } catch (err) {
      respBody = "";
    }
    try {
      respBody = JSON.parse(respBody);
    } catch (err) {
      // ignore
    }
    if (!resp.ok) {
      throw new Error(`Error making request to gitea at '${url}' (${resp.status}): ${JSON.stringify(respBody)}`);
    }
    return respBody;
  }

  async createProject({name}) {
    const project = await this.request('/user/repos', 'POST', {
      name,
      default_branch: 'main',
      auto_init: true,
    });
    return project;
  }
}

module.exports = {
  createUser,
  Client,
};
