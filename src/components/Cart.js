import React, { useContext, useEffect } from 'react';
import { Container, ListGroup, ListGroupItem, Button, FormControl, Row, Col, Badge } from 'react-bootstrap';
import { UserContext } from './UserContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, checkout, checkedOut, resetCheckout } = useContext(UserContext);

  useEffect(() => {
    resetCheckout(); // Ensure to define or handle resetCheckout inside UserContext if needed
  }, [resetCheckout]);

  // Compute the total price
  const totalPrice = cart.reduce((total, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    return total + itemTotal;
  }, 0);
  
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Cart Items</h2>
      {checkedOut && <h4 className="text-success">Thank you for your purchase!</h4>}
      <ListGroup variant="flush">
        {cart.length > 0 ? (
          cart.map(item => (
            <ListGroupItem key={item.id} className="d-flex justify-content-between align-items-center">
              <div className="me-auto">
                <Badge bg="info" className="me-3">{item.quantity}x</Badge>
                {item.title}
              </div>
              <FormControl
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                style={{ width: '80px', marginRight: '10px' }}
              />
              <span className="me-2">${(item.quantity * item.price).toFixed(2)}</span>
              <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>
                Remove
              </Button>
            </ListGroupItem>
          ))
        ) : (
          <ListGroupItem>Your cart is empty.</ListGroupItem>
        )}
      </ListGroup>
      {cart.length > 0 && (
        <Row className="justify-content-end mt-3">
          <Col md={4}>
            <ListGroup>
              <ListGroupItem className="d-flex justify-content-between align-items-center">
                <strong>Total Price:</strong>
                <span>${totalPrice}</span>
              </ListGroupItem>
            </ListGroup>
            <Button onClick={checkout} variant="success" className="mt-3 w-100">Checkout</Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Cart;
