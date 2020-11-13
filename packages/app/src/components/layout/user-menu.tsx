import { useContext, FunctionComponent } from 'react';
import { Avatar, Button, Link, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import UserContext from "../../user-context";

const useStyles = makeStyles((theme) => ({
  avatarButton: {
    minWidth: 0,
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    }
  },
  avatar: {
    height: 32,
    width: 32,
    fontSize: '18px',
    backgroundColor: teal[600],
    '&:hover': {
      backgroundColor: teal[700],
    }
  }
}));

const UserMenu: FunctionComponent = ({}) => {
  const classes = useStyles();
  const { state: { loggedIn, user }, client, dispatch } = useContext(UserContext)!;
  
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'userMenu',
  });

  const initials = (
    (user?.firstName && user?.lastName) ?
    [user.firstName, user.lastName].map(s => s.substr(0, 1).toLocaleUpperCase()).join('') : null
  );

  const logout = () => {
    popupState.close();
    client.logout();
    dispatch({type: 'loggedOut'});
  }

  return (
    <>
      <Button
        className={classes.avatarButton}
        disableRipple
        {...bindTrigger(popupState)}
      >
        <Avatar className={classes.avatar}>{initials}</Avatar>
      </Button>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        elevation={2}
      >
        { loggedIn && <Link onClick={logout}>Log Out</Link> }
      </Popover>
    </>
  )
}

export default UserMenu;