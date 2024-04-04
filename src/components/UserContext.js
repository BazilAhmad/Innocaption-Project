import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [checkedOut, setCheckedOut] = useState(false);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load user and their cart from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      setUser({ username });
      const userCart = localStorage.getItem(`cart_${username}`);
      if (userCart) {
        setCart(JSON.parse(userCart));
      }
      const userOrders = localStorage.getItem(`orders_${username}`); // Load orders
      if (userOrders) {
        setOrders(JSON.parse(userOrders));
      }
    }
  }, []);

  useEffect(() => {
    // Save the current user's cart to localStorage when it changes
    if (user && user.username) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
      localStorage.setItem(`orders_${user.username}`, JSON.stringify(orders));
      localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(wishlist));
    } else {
      localStorage.setItem('cart_nonUser', JSON.stringify(cart));
    }
  }, [cart, user, orders, wishlist]);

  // Function to toggle wishlist item
  const toggleWishlistItem = (product) => {
    setWishlist((currentWishlist) => {
      const isProductInWishlist = currentWishlist.some((item) => item.id === product.id);
      const newWishlist = isProductInWishlist
        ? currentWishlist.filter((item) => item.id !== product.id)
        : [...currentWishlist, product];

      // Update local storage
      if (user && user.username) {
        localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(newWishlist));
      }

      return newWishlist;
    });
  };

  const findReviewForProduct = (productId) => {
    // Flatten all items from all orders to search through them easily
    const allItems = orders.flatMap(order => order.items);

    // Find the item that matches the productId and has a review
    const itemWithReview = allItems.find(item => item.id === productId && item.review);

    return itemWithReview ? itemWithReview.review : null;
  };


  const hasPurchasedItem = (productId) => {
    const targetProductId = Number(productId);
    const productPurchased = orders.some(order => {
      return order.items.some(item => {
        return item.id === targetProductId;
      });
    });
    return productPurchased;
  };





  // Function to check if an item is in the wishlist
  const isItemInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };



  const login = (username) => {
    if (!username.trim()) {
      alert('Username cannot be empty');
      return; // Stop the login process
    }
    const storedUsernames = JSON.parse(localStorage.getItem('users') || '[]');
    if (!storedUsernames.includes(username)) {
      alert('This username does not exist. Please sign up.');
      return; // Stop the login process if the username is not found
    }

    // Load the user's cart if it exists or create an empty one
    let userCart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    // Load the non-user cart if it exists or create an empty one
    const nonUserCart = JSON.parse(localStorage.getItem('cart_nonUser')) || [];
    const userWishlist = localStorage.getItem(`wishlist_${username}`);
    const userOrders = localStorage.getItem(`orders_${username}`);

    console.log("Attempting login, non-user cart:", nonUserCart);
    if (userWishlist) {
      setWishlist(JSON.parse(userWishlist));
    } else {
      setWishlist([]);
    }

    if (userOrders) {
      setOrders(JSON.parse(userOrders));
    } else {
      setOrders([]);
    }

    let finalCart;
    if (nonUserCart.length > 0) {
      // If the non-user cart is not empty, prompt the user for a merge
      const mergeCarts = window.confirm('You have items in your cart. Would you like to merge this cart with your existing user cart?');

      if (mergeCarts) {
        // Merge carts and remove duplicates
        finalCart = [...userCart, ...nonUserCart].reduce((acc, item) => {
          const existingItem = acc.find((i) => i.id === item.id);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
      } else {
        // Use existing user cart, discard non-user cart
        finalCart = userCart;
      }
    } else {
      // Non-user cart is empty, just use the user cart
      finalCart = userCart;
    }

    // Update state and localStorage
    setUser({ username });
    setCart(finalCart);
    localStorage.setItem('currentUser', JSON.stringify({ username }));
    localStorage.setItem(`cart_${username}`, JSON.stringify(finalCart));
    localStorage.removeItem('cart_nonUser'); // Clear non-user cart regardless of the merge
  };

    // Function to handle user sign-up
    const signUp = (username) => {
      // Check for empty username
      if (!username) {
        alert("Username cannot be empty.");
        return;
      }
      // Check if username is already taken
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const isUsernameTaken = storedUsers.includes(username);
      if (isUsernameTaken) {
        alert("Username is already taken. Choose a different one.");
        return;
      }
      // Save new username
      storedUsers.push(username);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      // Set the user state
      setUser({ username });
      // Additional sign-up logic (if any)
    };
  
    // Context provider value
    const value = {
      user,
      login,
      signUp,
      // other context properties
    };



  const logout = () => {
    if (user && user.username) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    }
    localStorage.removeItem('currentUser');
    setUser(null);
    setCart([]);
    // Optionally clear non-user cart as well
    localStorage.removeItem('cart_nonUser');
  };

  const addToCart = (productToAdd) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...productToAdd, quantity: 1 }];
    });
    console.log("Added to non-user cart", productToAdd);
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((currentCart) => {
      return currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity >= 0 ? newQuantity : 0 }
          : item
      );
    });
  };



  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    if (user && user.username) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(updatedCart));
    } else {
      localStorage.setItem('cart_nonUser', JSON.stringify(updatedCart));
    }
  };

  const resetCheckout = () => {
    setCheckedOut(false);
  };

  const addReview = (productId, reviewText, reviewer) => {
    // Ensure productId is treated as a number for strict equality comparison
    const numericProductId = Number(productId);

    // Update orders with the review, including the reviewer's username
    const updatedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item =>
        item.id === numericProductId ?
          { ...item, review: { text: reviewText, reviewer } } : // Include reviewer information
          item
      ),
    }));

    setOrders(updatedOrders);

    // Persist updated orders in localStorage
    if (user && user.username) {
      localStorage.setItem(`orders_${user.username}`, JSON.stringify(updatedOrders));
      const globalReviews = JSON.parse(localStorage.getItem('globalReviews')) || [];
      const newReview = { productId, text: reviewText, reviewer };
      globalReviews.push(newReview);
      localStorage.setItem('globalReviews', JSON.stringify(globalReviews));
    }
  };



  const deleteUserReview = (productId) => {
    // Assuming `globalReviews` is stored in localStorage
    const globalReviews = JSON.parse(localStorage.getItem('globalReviews')) || [];
    const updatedReviews = globalReviews.filter(review => !(review.productId === productId && review.reviewer === user.username));
    localStorage.setItem('globalReviews', JSON.stringify(updatedReviews));

    // Optionally, update the user's orders to remove the review from there as well
    const updatedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => {
        if (item.id === productId) {
          const newItem = { ...item };
          delete newItem.review; // Remove review from the item
          return newItem;
        }
        return item;
      }),
    }));

    setOrders(updatedOrders);
    localStorage.setItem(`orders_${user.username}`, JSON.stringify(updatedOrders));
  };



  const checkout = () => {
    const order = {
      date: new Date().toISOString(),
      items: [...cart],
    };
    setOrders([...orders, order]); // Add the current cart as a new order

    if (user && user.username) {
      // Clear the user's cart in localStorage
      localStorage.setItem(`cart_${user.username}`, JSON.stringify([]));
      localStorage.setItem(`orders_${user.username}`, JSON.stringify([...orders, order])); // Update orders in localStorage
    } else {
      // Clear the non-user cart in localStorage
      localStorage.removeItem('cart_nonUser');
    }
    // Clear the cart in state
    setCart([]);
    setCheckedOut(true);
  };


  return (
    <UserContext.Provider value={{signUp, value, user, login, logout, cart, addToCart, removeFromCart, checkout, checkedOut, resetCheckout, updateQuantity, orders, wishlist, toggleWishlistItem, isItemInWishlist, addReview, deleteUserReview, hasPurchasedItem, findReviewForProduct }}>
      {children}
    </UserContext.Provider>
  );
};
