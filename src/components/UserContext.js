import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [checkedOut, setCheckedOut] = useState(false);

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
    }
  }, []);

  useEffect(() => {
    // Save the current user's cart to localStorage when it changes
    if (user && user.username) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    }else {
        localStorage.setItem('cart_nonUser', JSON.stringify(cart));
      }
  }, [cart, user]);

 
  const login = (username) => {
    // Load the user's cart if it exists or create an empty one
    let userCart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    // Load the non-user cart if it exists or create an empty one
    const nonUserCart = JSON.parse(localStorage.getItem('cart_nonUser')) || [];
    console.log("Attempting login, non-user cart:", nonUserCart);

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

  const checkout = () => {
    if (user && user.username) {
        // Clear the user's cart in localStorage
        localStorage.setItem(`cart_${user.username}`, JSON.stringify([]));
    } else {
        // Clear the non-user cart in localStorage
        localStorage.removeItem('cart_nonUser');
    }
    // Clear the cart in state
    setCart([]);
    setCheckedOut(true);
};
  return (
    <UserContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart, checkout, checkedOut, resetCheckout, updateQuantity }}>
      {children}
    </UserContext.Provider>
  );
};
