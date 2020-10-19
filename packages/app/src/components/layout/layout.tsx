import { useContext, useEffect, FunctionComponent, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Link, Avatar } from '@material-ui/core';
import UserContext from "../../user-context";
import User from '../../models/user';
import SignupDialog from '../dialogs/signup-dialog';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
    minHeight: 36,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
  gap: {
    flexGrow: 1,
  },
  avatar: {
    height: 24,
    width: 24,
    fontSize: '14px',
    backgroundColor: 'teal',
  }
}));

interface MainAppBarProps {
  initials: string;
}

const MainAppBar: FunctionComponent<MainAppBarProps> = ({initials}) => {
  const classes = useStyles();
  return (
    <AppBar
        position="static"
        color="default"
        elevation={1}
        className={classes.appBar}
    >
      <Toolbar className={classes.toolbar}>
        <NextLink href="/">
          <Link
            href="/"
            variant="h6"
            color="inherit"
            noWrap
          >
            RESOURCES.CO
          </Link>
        </NextLink>
        <div className={classes.gap}></div>
        <Avatar className={classes.avatar}>{initials}</Avatar>
      </Toolbar>
    </AppBar>
  )
}

const Layout: FunctionComponent = ({children}) => {
  const { state: { loggedIn }, client } = useContext(UserContext)!;
  const [user, setUser] = useState<User|undefined>(undefined);
  const router = useRouter();

  const loadUser = async () => {
    const resp = await client.fetch('/sessions/current');
    if (resp.ok && resp.body.user) {
      setUser(resp.body.user);
    }
  }

  const logout = () => {
    client.logout();
    setUser(undefined);
    router.replace('/login');
  }

  useEffect(() => {
    if (loggedIn) {
      loadUser();
    } else {
      client.logout();
      setUser(undefined);
      router.replace('/login');
    }
  }, [loggedIn]);

  const initials = (
    (user?.firstName && user?.lastName) ?
    [user.firstName, user.lastName].map(s => s.substr(0, 1).toLocaleUpperCase()).join('') : 'YN'
  )

  return <>
    { loggedIn && <MainAppBar initials={initials} /> }
    { loggedIn && (user?.active === false) && <SignupDialog user={user} onComplete={loadUser} onCancel={logout} /> }
    {children}
  </>
};

export default Layout;