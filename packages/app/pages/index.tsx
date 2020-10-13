import { useContext } from 'react';
import UserContext from '../src/user-context';

const IndexPage = () => {
  const { state: { loggedIn } } = useContext(UserContext)!;
  return (
    <div>Logged In: {JSON.stringify(loggedIn)}</div>
  );
};

export default IndexPage;
