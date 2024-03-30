import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate=useNavigate();
  const { login } = useContext(UserContext);


  const handleLogin = (e) => {
    e.preventDefault();
    login(username); // Now login handles everything internally
    navigate('/'); // Navigate to home or desired page after login
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <div className='mt-3'>
        <Button type="submit" variant="primary">Login</Button>
        </div>
      </Form>
      
    </Container>
  );
};

export default Login;
