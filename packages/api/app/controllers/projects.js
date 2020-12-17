module.exports = function initProjectsController({gitea}) {
  async function createProject({name, username}) {
    return await gitea.createProject({
      name,
      username,
    });
  }

  return {
    createProject,
    initRoutes({app, authenticate}) {
      app.post('/projects', authenticate(), (req, res) => {
        const { username } = req.session;
        const { name } = req.body;
        createProject({name, username}).then(project => {
          res.send(project);
        }).catch(err => {
          const error = 'Error creating project.';
          console.error(error, err);
          res.status(500).send({error});
        });
      });
    },
  }
};
