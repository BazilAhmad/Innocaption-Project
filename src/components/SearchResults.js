import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, ListGroup, Row, Col, Card, Button} from 'react-bootstrap';
import Filter from './Filter'; // Ensure this path is correct
import StarRatings from 'react-star-ratings';
import { UserContext } from './UserContext';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('query');
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useContext(UserContext);
  const navigate=useNavigate();
  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`); // This will navigate to the product detail page
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        let products = response.data.products;
  
        // Filter products based on searchTerm matching with title, description, category, or brand
        if (searchTerm) {
          products = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
  
        // Further filtering and sorting as per category and sortBy
        if (category) {
          products = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
        }
  
        switch (sortBy) {
          case 'priceAsc':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'priceDesc':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'ratingDesc':
            products.sort((a, b) => b.rating - a.rating);
            break;
          // Additional sorting options can be added here
        }
  
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [searchTerm, sortBy, category]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Search Results</h2>
      <Filter setSortBy={setSortBy} setCategory={setCategory} currentSearchTerm={searchTerm} />
      <ListGroup>
        {products.length > 0 ? products.map((product) => (
          <ListGroup.Item key={product.id} className="mb-3">
            <Row className="align-items-center">
              <Col md={12}>
                <Card className="mb-3" style={{ width: '100%', cursor: 'pointer' }}
                  onClick={() => handleCardClick(product.id)}
                >
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img src={product.thumbnail} style={{ width: '100%', height: 'auto' }} />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{product.title}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        <Card.Text>${product.price}</Card.Text>
                        <StarRatings
                          rating={product.rating}
                          starRatedColor="gold"
                          numberOfStars={5}
                          name='rating'
                          starDimension="15px"
                          starSpacing="1px"
                        />
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </ListGroup.Item>
        )) : <p>No products found.</p>}
      </ListGroup>
    </Container>
  );
}

export default SearchResults;
