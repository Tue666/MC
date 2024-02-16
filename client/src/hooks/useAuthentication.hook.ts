import { useContext } from 'react';
import { AuthenticationContext } from '../contexts/Authentication.context';

const useAuthentication = () => useContext(AuthenticationContext);

export default useAuthentication;
