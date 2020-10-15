import { useContext, useEffect } from 'react';
import UserContext from '../src/user-context';

const IndexPage = () => {
  const { state: { loggedIn }, client } = useContext(UserContext)!;
  useEffect(() => {
    (async () => {
      await client.fetch('/sessions/current');
    })();
  }, [loggedIn])
  return (
    <div>Logged In: {JSON.stringify(loggedIn)}</div>
  );
};

export default IndexPage;
