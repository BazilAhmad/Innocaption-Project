import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { UserContext } from './UserContext';
import { FaHeart, FaCheck } from 'react-icons/fa';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [editingReview, setEditingReview] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const {
    addToCart,
    toggleWishlistItem,
    isItemInWishlist,
    user,
    addReview,
    hasPurchasedItem,
    findReviewForProduct,
    deleteUserReview
  } = useContext(UserContext);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await axios.get(`https://dummyjson.com/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (user && hasPurchasedItem(productId)) {
      const existingReview = findReviewForProduct(productId);
      if (existingReview) {
        setReviewText(existingReview);
        setEditingReview(true);
      }
    }
    const globalReviews = JSON.parse(localStorage.getItem('globalReviews')) || [];
    const productReviews = globalReviews.filter(review => review.productId.toString() === productId);
    setAllReviews(productReviews);
    // Only set userHasReviewed based on productReviews change or if the user changes.
    const userReviewed = productReviews.some(review => review.reviewer === user?.username);
    setUserHasReviewed(userReviewed);
    setEditingReview(userReviewed); // Adjust based on whether the user has reviewed.
  }, [productId, user, hasPurchasedItem, findReviewForProduct]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    await addReview(productId, reviewText, user.username);
    setEditingReview(false);
    setReviewText(''); // Clear review text after submission
  };

  const initiateReviewEditing = () => {
    setEditingReview(true);
  };

  const handleDeleteReview = (reviewProductId) => {
    deleteUserReview(reviewProductId);
    // Refresh reviews from global storage after deletion
    const updatedGlobalReviews = JSON.parse(localStorage.getItem('globalReviews')) || [];
    const productReviews = updatedGlobalReviews.filter(review => review.productId.toString() === productId);
    setAllReviews(productReviews);
    setUserHasReviewed(false); // Allow user to add a new review
    setEditingReview(false);
  };



  const hasPurchased = user && hasPurchasedItem(productId);
  const currentReview = findReviewForProduct(productId);

  console.log('all reviews:', allReviews)
  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="d-flex justify-content-center mb-3">
          {product && <img src={product.thumbnail} alt={product.title} style={{ maxWidth: '100%', height: 'auto' }} />}
        </Col>
        <Col md={6}>
          {product && (
            <>
              <h2>{product.title}</h2>
              <p>Description: {product.description}</p>
              <h4>Price: ${product.price}</h4>
              <StarRatings
                rating={product.rating}
                starRatedColor="gold"
                numberOfStars={5}
                name="rating"
                starDimension="20px"
                starSpacing="2px"
              />
              <div style={{ marginTop: '10px' }}>
                {user && (
                  <>
                    <Button variant="primary" onClick={() => addToCart(product)}>Add to Cart</Button>
                    <Button variant="link" onClick={() => toggleWishlistItem(product)} style={{ marginRight: '5px', border: 'none', background: 'transparent' }}>
                      {isItemInWishlist(product.id) ? <FaCheck className="wishlist-icon" /> : <FaHeart className="wishlist-icon" />}
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
          {hasPurchased && !editingReview && !userHasReviewed && (
            <Button variant="secondary" onClick={() => setEditingReview(true)} style={{ marginTop: '20px' }}>Leave a Review</Button>
          )}
          {editingReview && !userHasReviewed && (
            <Form onSubmit={handleReviewSubmit} style={{ marginTop: '20px' }}>
              <Form.Group controlId="reviewText">
                <Form.Label>Review:</Form.Label>
                <Form.Control as="textarea" rows="3" value={reviewText} onChange={(e) => setReviewText(e.target.value)} required />
              </Form.Group>
              <Button className='mt-2' variant="primary" type="submit">Submit Review</Button>
            </Form>
          )}
        </Col>
      </Row>
      <>
        <h3>Reviews</h3>
        {allReviews.length > 0 ? (
          allReviews.map((review, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{review.reviewer}</Card.Title>
                <Card.Text>{review.text}</Card.Text>
                {user?.username === review.reviewer && (
                  <Button variant="danger" onClick={() => handleDeleteReview(productId)}>Delete My Review</Button>
                )}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </>
    </Container>
  );
}

export default ProductDetail;
