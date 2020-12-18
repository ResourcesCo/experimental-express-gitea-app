const GiteaClient = require('../services/gitea').Client;

class Session {
  constructor({userId, sessionId, tokenType, expiresAt, username, giteaUserId}) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.tokenType = tokenType;
    this.expiresAt = expiresAt;
    this.username = username;
    this.giteaUserId = giteaUserId;
    this.gitea = new GiteaClient(username);
  }
}

module.exports = Session;