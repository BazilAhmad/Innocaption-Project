import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

function ProductDetail({ addToCart }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const response = await axios.get(`https://dummyjson.com/products/${productId}`);
      setProduct(response.data);
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="d-flex justify-content-center mb-3">
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={product.thumbnail} />
          </Card>
        </Col>
        <Col md={6}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <h4>${product.price}</h4>
          <Button variant="primary" onClick={() => addToCart(product)}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;
