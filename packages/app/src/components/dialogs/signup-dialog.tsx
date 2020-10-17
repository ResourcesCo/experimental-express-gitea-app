import { FunctionComponent, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import User from '../../models/user';
import UserContext from "../../user-context";
import SignupForm from '../forms/signup-form';

interface DialogProps {
  user: User;
}

const SignupDialog: FunctionComponent<DialogProps> = ({user: initialUser}) => {
  const {client} = useContext(UserContext)!;
  const [user, setUser] = useState(initialUser);
  const valid = (
    ((user.email || '').trim().length > 0) &&
    ((user.firstName || '').trim().length > 0) &&
    ((user.lastName || '').trim().length > 0) &&
    user.acceptedTermsAt
  )
  const handleSignUp = async () => {
    const resp = await client.fetch(`/users/${user.id}`, {
      method: 'post',
      body: user
    });
    if (resp.ok) {
      console.log('Completed signup!');
    }
  }
  return (
    <Dialog open={true}>
      <DialogTitle>Sign Up</DialogTitle>
      <DialogContent>
        <SignupForm user={user} onChange={user => setUser(user)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSignUp} color="primary" disabled={!valid}>
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SignupDialog;