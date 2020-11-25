import { useContext, useEffect, FunctionComponent } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UserContext from "../../user-context";
import UserMenu from './user-menu';
import SignupDialog from '../dialogs/signup-dialog';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
  },
  toolbar: {
    flexWrap: 'wrap',
    minHeight: 44,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
  gap: {
    flexGrow: 1,
  },
}));

const MainAppBar: FunctionComponent = ({}) => {
  const classes = useStyles();
  return (
    <AppBar
        position="static"
        color="default"
        elevation={0}
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
            Home
          </Link>
        </NextLink>
        <div className={classes.gap}></div>
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}

const Layout: FunctionComponent = ({children}) => {
  const { state: { loggedIn, user }, dispatch, client } = useContext(UserContext)!;
  const router = useRouter();

  const loadUser = async () => {
    const resp = await client.fetch('/sessions/current');
    if (resp.ok && resp.body.user) {
      dispatch({type: 'userLoaded', user: resp.body.user});
    }
  }

  const logout = () => {
    client.logout();
    router.replace('/login');
  }

  useEffect(() => {
    if (loggedIn) {
      loadUser();
    } else {
      client.logout();
      dispatch({type: 'loggedOut'});
      router.replace('/login');
    }
  }, [loggedIn]);

  return <>
    <MainAppBar />
    { loggedIn && (user?.active === false) && <SignupDialog user={user} onComplete={loadUser} onCancel={logout} /> }
    {children}
  </>
};

export default Layout;