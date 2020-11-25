import { FunctionComponent, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import User from '../../models/user';
import UserContext from "../../user-context";
import SignupForm from '../forms/signup-form';

interface DialogProps {
  user: User;
  onComplete: () => void;
  onCancel: () => void;
}

const SignupDialog: FunctionComponent<DialogProps> = ({user: initialUser, onComplete, onCancel}) => {
  const {client} = useContext(UserContext)!;
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState<string | undefined>(undefined);
  const valid = (
    ((user.email || '').trim().length > 0) &&
    ((user.firstName || '').trim().length > 0) &&
    ((user.lastName || '').trim().length > 0) &&
    user.acceptedTermsAt
  )
  const handleSignUp = async () => {
    setError(undefined);
    const resp = await client.fetch(`/users/current`, {
      method: 'PATCH',
      body: {
        ...user,
        active: !!user.acceptedTermsAt,
        acceptedTermsAt: user.acceptedTermsAt ? new Date() : null,
        signedUpAt: user.acceptedTermsAt ? new Date() : null,
      }
    });
    if (resp.ok) {
      onComplete();
    } else {
      setError('Error saving your account. Please try again.');
    }
  }
  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>Sign Up</DialogTitle>
      <DialogContent>
        <SignupForm user={user} error={error} onChange={user => setUser(user)} />
      </DialogContent>
      <DialogActions>
        <Button type="submit" onClick={handleSignUp} color="primary" disabled={!valid}>
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SignupDialog;