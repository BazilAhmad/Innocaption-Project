import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, Form, FormControl, Button, Badge, NavDropdown } from 'react-bootstrap';
import { UserContext } from './UserContext';

function Header({ defaultSearchTerm = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const { user, logout, cart } = useContext(UserContext);
  

  useEffect(() => {
    setSearchTerm(searchParams.get('query') || '');
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);


  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container fluid>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          E-Commerce Site
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex flex-grow-1 mx-5" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search for products..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>
          <Nav className="ms-auto">
            {user ? (
              <NavDropdown title={`Hello, ${user.username}`} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => navigate('/profile')}>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button variant="outline-info" onClick={() => navigate('/login')}>Login</Button>
            )}
            <Button variant="outline-info" className="ms-2" onClick={() => navigate('/cart')}>
              <i className="fas fa-shopping-cart"></i>
              <span> Cart </span>
              {cartItemCount > 0 && (
                <Badge pill bg="success">{cartItemCount}</Badge>
              )}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
