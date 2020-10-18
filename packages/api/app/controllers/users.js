module.exports = function initUserRoutes({app, authenticate, users}) {
  function getUser(req, res) {
    const { userId } = req.session;
    users.getUser(userId).then(user => {
      res.send({user});
    }).catch(err => {
      const error = 'Error updating current user.';
      console.error(error, err);
      res.status(500).send({error});
    });
  }

  function updateUser(req, res) {
    const { userId } = req.session;
    const user = req.body;
    if (user.id && user.id !== userId) {
      res.status(422).send({error: 'ID must match current user ID'});
      return;
    }
    users.updateUser(userId, user).then(() => {
      res.send({});
    }).catch(err => {
      const error = 'Error updating current user.';
      console.error(error, err);
      res.status(500).send({error});
    });
  }

  app.get('/users/current', authenticate(), getUser);
  app.patch('/users/current', authenticate(), updateUser);
};
