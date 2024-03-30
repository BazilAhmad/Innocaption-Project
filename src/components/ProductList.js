import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import Filter from './Filter';
import StarRatings from 'react-star-ratings';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [category, setCategory] = useState('');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response = await axios.get('https://dummyjson.com/products');
        let filteredProducts = response.data.products;

        if (category) {
          filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
        }

        switch (sortBy) {
          case 'priceAsc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'priceDesc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'ratingDesc':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [sortBy, category]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Our Products</h2>
      <Filter setSortBy={setSortBy} setCategory={setCategory} />
      <ListGroup>
        {products.map((product) => (
          <ListGroup.Item key={product.id} className="mb-3">
            <Row className="align-items-center">
              <Col md={12}>
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card className="mb-3" style={{ width: '100%' }}>
                    <Row noGutters>
                      <Col md={4}>
                        <Card.Img src={product.thumbnail} style={{ width: '100%', height: 'auto' }} />
                      </Col>
                      <Col md={8}>
                        <Card.Body>
                          <Card.Title>{product.title}</Card.Title>
                          <Card.Text>{product.description}</Card.Text>
                          <Card.Text>${product.price}</Card.Text>
                          <StarRatings rating={product.rating} 
                          starRatedColor="gold"
                          numberOfStars={5}
                          name='rating'
                          starDimension="15px"
                          starSpacing="1px"
                          />
                         {/*<div className="mt-3"> 
                            <Button variant="primary" onClick={() => addToCart(product)}>
                              Add to Cart
                              </Button>
                              </div> */} 
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Link>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default ProductList;
