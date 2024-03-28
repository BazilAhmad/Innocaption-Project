import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Our Products</h2>
      <ListGroup>
        {products.map((product) => (
          <ListGroup.Item key={product.id} className="mb-3">
            <Row className="align-items-center">
              <Col md={3}>
                <Link to={`/products/${product.id}`}>
                  <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
                </Link>
              </Col>
              <Col md={6}>
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h5>{product.title}</h5>
                  <p>{product.description}</p>
                </Link>
              </Col>
              <Col md={3} className="text-md-right">
                <p className="text-muted">${product.price}</p>
                <Button variant="primary" onClick={(e) => {e.stopPropagation(); addToCart(product);}}>
                  Add to Cart
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default ProductList;
