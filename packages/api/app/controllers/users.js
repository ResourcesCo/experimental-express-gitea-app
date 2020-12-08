const gitea = require('../services/gitea');

module.exports = function initUserRoutes({app, authenticate, users}) {
  async function updateUser(userId, user) {
    await users.updateUser(userId, user);
    const resp = await gitea.createUser({
      username: user.username,
      email: user.email,
    });
    console.log('gitea create user response', resp);
    if (!resp.ok) {
      throw new Error('Error creating gitea user');
    }
  }

  function handleGetUser(req, res) {
    const { userId } = req.session;
    users.getUser(userId).then(user => {
      res.send({user});
    }).catch(err => {
      const error = 'Error updating current user.';
      console.error(error, err);
      res.status(500).send({error});
    });
  }

  function handleUpdateUser(req, res) {
    const { userId } = req.session;
    const user = req.body;
    if (user.id && user.id !== userId) {
      res.status(422).send({error: 'ID must match current user ID'});
      return;
    }
    updateUser(userId, user).then(() => {
      res.send({});
    }).catch(err => {
      const error = 'Error updating current user.';
      console.error(error, err);
      res.status(500).send({error});
    });
  }

  app.get('/users/current', authenticate(), handleGetUser);
  app.patch('/users/current', authenticate(), handleUpdateUser);
};
