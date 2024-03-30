import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

function Filter({ setSortBy, setCategory, currentSearchTerm }) {
  // Display the current search term, if needed
  console.log('Current Search Term:', currentSearchTerm);

  return (
    <Row className="justify-content-between mb-4">
      <Col md={4}>
        <Form.Select aria-label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="ratingDesc">Recommended</option>
        </Form.Select>
      </Col>
      <Col md={4}>
        <Form.Select aria-label="Filter by category" onChange={(e) => setCategory(e.target.value)}>
          <option value="">Filter by Category</option>
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptops</option>
          <option value="fragrances">Fragrances</option>
          <option value="skincare">Skincare</option>
          <option value="groceries">Groceries</option>
          <option value="home-decoration">Home Decoration</option>
          {/* Add more categories as needed */}
        </Form.Select>
      </Col>
    </Row>
  );
}

export default Filter;
