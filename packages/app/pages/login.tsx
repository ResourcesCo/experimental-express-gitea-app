import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { titleCase } from 'title-case';
import UserContext from '../src/user-context';
import { AUTH_STATES_STORAGE_KEY } from '../src/constants';

const oauthBaseUrl = process.env.NEXT_PUBLIC_API_BASE_OAUTH || process.env.NEXT_PUBLIC_API_BASE;

function randomChars(length: number) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz" + 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const arr = new Uint8Array(length);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map(n => chars[n % chars.length]).join('');
}

function formatProviderName(providerName: string): string {
  const specialCases: {[key: string]: string} = {
    Github: 'GitHub',
    Gitlab: 'GitLab'
  }
  const result = titleCase(providerName);
  return specialCases[result] || result
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(0.5, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const router = useRouter();

  const { client } = useContext(UserContext)!;

  const redirectToSignIn = (provider: string) => {
    const authStates = JSON.parse(window.localStorage.getItem(AUTH_STATES_STORAGE_KEY) || '[]');
    const state = randomChars(32);
    window.localStorage.setItem(AUTH_STATES_STORAGE_KEY, JSON.stringify([...authStates, state]));
    window.location.href = `${oauthBaseUrl}/auth/${provider}?state=${state}`;
  };

  useEffect(() => {
    (async () => {
      const { token, state } = router.query;
      if (typeof token === 'string') {
        const authStates: string[] = JSON.parse(window.localStorage.getItem(AUTH_STATES_STORAGE_KEY) || '[]');
        if (typeof state === 'string') {
          if (authStates.includes(state)) {
            const newAuthStates = authStates.filter(st => st !== state);
            if (newAuthStates.length > 0) {
              window.localStorage.setItem(AUTH_STATES_STORAGE_KEY, JSON.stringify(newAuthStates));
            } else {
              window.localStorage.removeItem(AUTH_STATES_STORAGE_KEY);
            }
            await client.login({ token });
            router.replace('/');
          } else {
            console.warn('Invalid auth state', state);
            router.replace('/login');
          }
        }
      }
    })();
  }, [router.query]);

  const oauthProviders = (
    process.env.NEXT_PUBLIC_OAUTH_PROVIDERS || ''
  ).split(',').map(s => s.trim()).filter(s => s.length > 0)

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          {oauthProviders.map(providerName => (
            <Button
              key={providerName}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => redirectToSignIn(providerName)}
            >
              Sign In with {formatProviderName(providerName)}
            </Button>
          ))}
        </form>
      </div>
    </Container>
  );
}
