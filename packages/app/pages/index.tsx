import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Grid, Typography, Button } from '@material-ui/core';
import NewProjectDialog from '../src/components/dialogs/new-project-dialog';
import UserContext from "../src/user-context";
import Project from '../src/models/project';

const IndexPage = () => {
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const router = useRouter();
  const {state} = useContext(UserContext)!;
  const {user} = state;

  const handleNewProject = () => {
    setNewProjectOpen(true);
  }

  const handleNewProjectComplete = (project: Project) => {
    setNewProjectOpen(false);
    if (user) {
      router.push({
        pathname: '/[username]/[project]',
        query: {username: user.username, project: project.name},
      });
    }
  }

  return <Grid container>
    <Grid item xs={12}>
      <Typography variant="h2">Projects</Typography>
    </Grid>
    <Grid item xs={12}>
      <Button type="submit" onClick={handleNewProject} color="primary">
        New Project
      </Button>
    </Grid>
    { newProjectOpen && <NewProjectDialog onComplete={handleNewProjectComplete} onCancel={() => setNewProjectOpen(false)} /> }
  </Grid>
};

export default IndexPage;
