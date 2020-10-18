import { FunctionComponent } from 'react';
import { DialogContentText, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import User from '../../models/user';

interface DialogProps {
  user: User;
  error?: string;
  onChange: (user: User) => void;
}

const SignupDialog: FunctionComponent<DialogProps> = ({user, error, onChange}) => {
  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <DialogContentText>
        Welcome! To complete signup, please enter some information:
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Email Address"
        type="email"
        value={user.email}
        onChange={({target: {value}}) => onChange({...user, email: value})}
        required
        fullWidth
      />
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="First Name"
        value={user.firstName || ''}
        onChange={({target: {value}}) => onChange({...user, firstName: value})}
        required
        fullWidth
      />
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Last Name"
        value={user.lastName || ''}
        onChange={({target: {value}}) => onChange({...user, lastName: value})}
        required
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!!user.acceptedTermsAt}
            onChange={({target: {checked}}) => onChange({...user, acceptedTermsAt: checked ? new Date() : undefined})}
            name="termsAndConditions"
            color="primary"
          />
        }
        label={<span>I agree to the <a href="https://resources.co/terms" target="_blank">Terms and Conditions</a>.</span>}
      />
    </>
  )
}

export default SignupDialog;