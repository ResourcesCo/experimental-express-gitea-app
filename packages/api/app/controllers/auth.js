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
        users.getUserSession({userId, sessionId}).then((err, sessionData) => {
          res.session = { ...sessionData, tokenType }
          next();
        }).catch(err => {
          res.status(401).send({error: 'Error getting session.'});
        });
      } else {
        res.status(401).send({error: 'Error getting session.'});
        return
      }
    } else {
      next();
    }
  }
}

exports.authenticate = function authenticate({users, tokens, tokenType = 'access'}) {
  return function authenticateHandler(req, res, next) {
    if (req.session?.tokenType !== tokenType) {
      res.status(401).send({error: 'Error getting session.'});
      return;
    }
    next();
  }
}
