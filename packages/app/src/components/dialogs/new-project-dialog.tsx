import { FunctionComponent, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import Haikunator from 'haikunator';
import Project from '../../models/project';
import UserContext from "../../user-context";
import NewProjectForm from '../forms/new-project-form';

const haikunator = new Haikunator();

interface DialogProps {
  onComplete: (project: Project) => void;
  onCancel: () => void;
}

const NewProjectDialog: FunctionComponent<DialogProps> = ({onComplete, onCancel}) => {
  const {client} = useContext(UserContext)!;
  const [project, setProject] = useState({name: haikunator.haikunate()});
  const [error, setError] = useState<string | undefined>(undefined);
  const valid = (
    ((project.name || '').trim().length > 0)
  )
  const handleSubmit = async () => {
    setError(undefined);
    const resp = await client.fetch(`/projects`, {
      method: 'POST',
      body: project,
    });
    if (resp.ok) {
      onComplete(project);
      return;
    }
    setError('Error creating a new project. Please try again.');
  }
  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>New Project</DialogTitle>
      <DialogContent>
        <NewProjectForm project={project} error={error} onChange={project => setProject(project)} />
      </DialogContent>
      <DialogActions>
        <Button type="submit" onClick={handleSubmit} color="primary" disabled={!valid}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewProjectDialog;