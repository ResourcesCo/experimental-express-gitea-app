module.exports = function initSessionRoutes({app, users, tokens}) {
  function loginHandler(req, res) {
    let userId;
    users
      .getLoginToken({ token: req.body.token })
      .then((token) => {
        if (token && token.active && new Date() < token.expires_at) {
          userId = token.user_id;
          return users.createUserSession({ userId });
        }

        throw new Error("Invalid token");
      })
      .then(({ id: sessionId }) => {
        res.send(tokens.makeTokens({ userId, sessionId }));
      })
      .catch((error) => {
        console.error(error);
        res.status(422).send({ error: "Invalid token" });
      });
  };

  function currentSessionHandler(req, res) {
    console.log('authorization header', req.header('Authorization'));
    res.send({});
  }

  app.post('/sessions', loginHandler);
  app.get('/sessions/current', currentSessionHandler);
};
