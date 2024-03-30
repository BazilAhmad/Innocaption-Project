import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { UserContext } from './UserContext';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(UserContext); // Correctly use addToCart from UserContext

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) return <div>Loading product details...</div>;

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="d-flex justify-content-center mb-3">
          <img src={product.thumbnail} alt={product.title} style={{ maxWidth: '100%', height: 'auto' }} />
        </Col>
        <Col md={6}>
          <h2>{product.title}</h2>
          <p>Description: {product.description}</p>
          <h4>Price: ${product.price}</h4>
          <StarRatings
            rating={product.rating}
            starRatedColor="gold"
            numberOfStars={5}
            name='rating'
            starDimension="15px"
            starSpacing="1px"
          />
          <div className="mt-4">
            <Button variant="primary" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;
