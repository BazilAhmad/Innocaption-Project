import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const Logout = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null); // Reset the user state to null
    navigate('/'); // Redirect to homepage
  }, [setUser, navigate]);

  return null; // This component doesn't need to render anything
};

export default Logout;
