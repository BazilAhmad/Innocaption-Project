import React, { useContext } from 'react';
import { Container, Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { UserContext } from './UserContext'; 
import { FaTimes } from 'react-icons/fa'; // Importing X (close) icon from react-icons



const Profile = () => {
  const { user, orders, wishlist, toggleWishlistItem } = useContext(UserContext);

  if (!user) {
    return (
      <Container className="mt-5">
        <Card>
          <Card.Header as="h5">No User Logged In</Card.Header>
          <Card.Body>
            <Card.Text>Please log in to view profile details and order history.</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h2">Profile Details</Card.Header>
        <Card.Body>
          <Card.Title as="h3">{user.username}</Card.Title>
          <h5>Wishlist</h5>
          {wishlist.length > 0 ? (
            <ListGroup>
              {wishlist.map((item) => (
                <ListGroupItem key={item.id} className="d-flex justify-content-between align-items-center">
                  {item.title}
                  <FaTimes style={{ cursor: 'pointer' }} onClick={() => toggleWishlistItem(item)} />                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p>Your wishlist is empty.</p>
          )}
          <h5>Order History</h5>
          {orders.map((order, index) => (
            <div key={index}>
              <p>Order placed on: {new Date(order.date).toLocaleDateString()}</p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>{item.title} - Quantity: {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};
export default Profile;