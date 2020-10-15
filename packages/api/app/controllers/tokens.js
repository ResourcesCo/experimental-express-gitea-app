module.exports = function initTokenRoutes({app, authenticate, tokens}) {
  function refreshTokenHandler(req, res) {
    const { userId, sessionId } = req.session;
    res.send(tokens.makeTokens({ userId, sessionId }));
  };

  app.post('/tokens/refresh', authenticate({tokenType: 'refresh'}), refreshTokenHandler);
};
