import { FunctionComponent } from 'react';
import { Avatar, Button, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';

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

interface UserMenuProps {
  initials: string;
}

const UserMenu: FunctionComponent<UserMenuProps> = ({initials}) => {
  const classes = useStyles();
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'userMenu',
  });
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
        Test
      </Popover>
    </>
  )
}

export default UserMenu;