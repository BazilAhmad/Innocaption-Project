import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const { login, signUp } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleSignUp = (e) => {
    e.preventDefault();
    const taken = signUp(username);
    if (!taken) {
        navigate('/signup')
    } else {
    navigate('/')
    }
  };

  return (
    <Container className="mt-5">
      <h2>Sign Up</h2>
      <Form onSubmit={handleSignUp}>
        <Form.Group>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            id="username"
            placeholder="Choose your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <div className='mt-3'>
          <Button type="submit" variant="primary">Sign Up</Button>
        </div>
      </Form>
    </Container>
  );
};

export default SignUp;
