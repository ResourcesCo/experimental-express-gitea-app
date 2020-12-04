const fetch = require('node-fetch');

class GiteaService {
  constructor() {
    this.adminEmail = process.env.GITEA_ADMIN_EMAIL;
    this.adminUserId = undefined;
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }

  async configureAuth(users) {
    this.users = users;
    await this.loadToken();
  }

  async loadToken() {
    if (!this.adminUserId) {
      await this.users.getUserByEmail(this.adminEmail);
    }
  }

  async createUser({email}) {
  }
}

module.exports = new GiteaService();