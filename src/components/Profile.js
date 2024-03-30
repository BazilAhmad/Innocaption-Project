import React, { useContext } from 'react';
import { Container, Card } from 'react-bootstrap';
import { UserContext } from './UserContext'; // Ensure this path is correct

const Profile = () => {
  const { user } = useContext(UserContext);

  // Redirect or show a message if there is no user
  if (!user) {
    return (
      <Container className="mt-5">
        <Card>
          <Card.Header as="h5">No User Logged In</Card.Header>
          <Card.Body>
            <Card.Text>Please log in to view profile details.</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // If there's a user, show the profile details
  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Profile Details</Card.Header>
        <Card.Body>
          <Card.Title>{user.username}</Card.Title>
          {/* Assuming the user object has an email property; otherwise, adjust as necessary */}
          <Card.Text>
            Email: {user.email || 'Not provided'}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
