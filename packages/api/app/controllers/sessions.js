module.exports = function initSessionRoutes({app, authenticate, users, tokens}) {
  async function currentSession({userId}) {
    const user = await users.getUser(userId);
    const projects = [];
    return {user, projects};
  }

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
    const { userId } = req.session;
    currentSession({userId}).then(({user, projects}) => {
      res.send({user, projects});
    }).catch(err => {
      res.status(500).send({error: 'Error getting current session.'});
    });
  }

  app.post('/sessions', loginHandler);
  app.get('/sessions/current', authenticate(), currentSessionHandler);
};
