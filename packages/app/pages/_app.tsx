import React, { useReducer } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import UserContext, { Client, userReducer, initialState } from "../src/user-context";
import Layout from '../src/components/layout/layout';

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const client = new Client();
  client.loadTokens();
  const [state, dispatch] = useReducer(userReducer, {...initialState, loggedIn: client.loggedIn});

  client.onLoggedInStatusChanged = ({loggedIn}) => {
    if (loggedIn) {
      dispatch({type: 'loggedIn'});
    } else {
      dispatch({type: 'loggedOut'});
    }
  }

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Resources.co</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <UserContext.Provider value={{ client, state, dispatch }}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </UserContext.Provider>
    </React.Fragment>
  );
}
