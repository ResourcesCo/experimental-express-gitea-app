import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import UserContext from '../src/user-context';

const authStatesKey = 'rco-app-authStates';
const oauthBaseUrl = process.env.NEXT_PUBLIC_API_BASE_OAUTH || process.env.NEXT_PUBLIC_API_BASE;

function randomChars(length: number) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz" + 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const arr = new Uint8Array(length);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map(n => chars[n % chars.length]).join('');
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
    const authStates = JSON.parse(window.localStorage.getItem(authStatesKey) || '[]');
    const state = randomChars(32);
    window.localStorage.setItem(authStatesKey, JSON.stringify([...authStates, state]));
    window.location.href = `${oauthBaseUrl}/auth/${provider}?state=${state}`;
  };

  useEffect(() => {
    (async () => {
      const { token, state } = router.query;
      console.log({token, state});
      if (typeof token === 'string') {
        const authStates: string[] = JSON.parse(window.localStorage.getItem(authStatesKey) || '[]');
        if (typeof state === 'string') {
          if (authStates.includes(state)) {
            const newAuthStates = authStates.filter(st => st !== state);
            if (newAuthStates.length > 0) {
              window.localStorage.setItem(authStatesKey, JSON.stringify(newAuthStates));
            } else {
              window.localStorage.removeItem(authStatesKey);
            }
            const resp = await client.login({ token });
            console.log('logged in');
            router.replace('/');
          } else {
            console.warn('Invalid auth state', state);
            router.replace('/login');
          }
        }
      }
    })();
  }, [router.query]);

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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => redirectToSignIn("github")}
          >
            Sign In with GitHub
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => redirectToSignIn("gitlab")}
          >
            Sign In with GitLab
          </Button>
        </form>
      </div>
    </Container>
  );
}
