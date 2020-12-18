const Session = require('../models/session');

exports.sessionLoader = function sessionLoader({users, tokens}) {
  return function sessionLoaderHandler(req, res, next) {
    if (req.header('Authorization')) {
      if (req.cookies.access_token) {
        res.status(422).send({error: 'Authorization must not be provided as a cookie.'})
        return
      }
      const tokenData = tokens.parseHeader(req.header('Authorization'));
      if (tokenData) {
        const {userId, sessionId, tokenType} = tokenData;
        users.getUserSession({userId, sessionId}).then(sessionData => {
          req.session = new Session({ ...sessionData, tokenType });
          next();
        }).catch(err => {
          console.error('Error getting session', err);
          res.status(401).send({error: 'Error getting session.'});
        });
      } else {
        res.status(401).send({error: 'Error getting session.'});
        return;
      }
    } else {
      next();
    }
  }
}

exports.authenticate = function authenticate({tokenType = 'access'} = {}) {
  return function authenticateHandler(req, res, next) {
    if (req.session && req.session.tokenType !== tokenType) {
      res.status(401).send({error: 'Error getting session.'});
      return;
    }
    next();
  }
}
