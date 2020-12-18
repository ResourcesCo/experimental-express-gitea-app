module.exports = ({app, authenticate}) => {
  app.post('/projects', authenticate(), async (req, res) => {
    const { gitea } = req.session;
    const { name } = req.body;
    try {
      const project = await gitea.createProject({
        name,
      });
      res.send(project);
    } catch (err) {
      const error = 'Error creating project.';
      console.error(error, err);
      res.status(500).send({error});
    }
  });
}