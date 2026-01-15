// Helper functions for wishlist management

export const addToWishlist = (product, next = f => f) => {
  let wishlist = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('wishlist')) {
      wishlist = JSON.parse(localStorage.getItem('wishlist'));
    }
    
    // Check if product already exists in wishlist
    const existingProduct = wishlist.find(item => item._id === product._id);
    
    if (!existingProduct) {
      wishlist.push({
        ...product,
      });
      
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      next();
    }
  }
  return wishlist;
};

export const removeFromWishlist = (productId) => {
  let wishlist = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('wishlist')) {
      wishlist = JSON.parse(localStorage.getItem('wishlist'));
    }
    
    wishlist = wishlist.filter(item => item._id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
  return wishlist;
};

export const isInWishlist = (productId) => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('wishlist')) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist'));
      return wishlist.some(item => item._id === productId);
    }
  }
  return false;
};

export const getWishlistTotal = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('wishlist')) {
      return JSON.parse(localStorage.getItem('wishlist')).length;
    }
  }
  return 0;
};