import { useContext, useEffect } from 'react';
import UserContext from '../src/user-context';

const IndexPage = () => {
  const { state: { loggedIn }, client } = useContext(UserContext)!;
  useEffect(() => {
    (async () => {
      const res = await client.fetch('/sessions/current');
      console.log(res);
    })();
  }, [loggedIn])
  return (
    <div>Logged In: {JSON.stringify(loggedIn)}</div>
  );
};

export default IndexPage;
