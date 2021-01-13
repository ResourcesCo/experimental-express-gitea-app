import { FunctionComponent } from 'react';
import { TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Project from '../../models/project';

interface NewProjectFormProps {
  project: Project;
  error?: string;
  onChange: (project: Project) => void;
}

const NewProjectForm: FunctionComponent<NewProjectFormProps> = ({project, error, onChange}) => {
  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        margin="dense"
        id="username"
        label="Username"
        value={project.name}
        onChange={({target: {value}}) => onChange({...project, name: value})}
        required
        fullWidth
      />
    </>
  )
}

export default NewProjectForm;