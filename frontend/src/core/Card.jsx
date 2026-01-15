import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';

// MUI v5 imports
import Button from '@mui/material/Button';
import CardM from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { addItem, updateItem, removeItem } from './cartHelpers';
import { addToWishlist, removeFromWishlist, isInWishlist } from './wishlisthelper';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

// Color palette
const PRIMARY_COLOR = '#0A6A7A';
const SECONDARY_COLOR = '#0A2F68';

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f,
  run = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    setIsFavorite(isInWishlist(product._id));
  }, [product._id]);

  const addToCart = () => {
    addItem(product, () => {
      setSnackbarMessage(`${product.name} added to cart!`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setRun(!run);
    });
  };

  const toggleWishlist = () => {
    if (isFavorite) {
      // Remove from wishlist
      removeFromWishlist(product._id);
      setIsFavorite(false);
      setSnackbarMessage(`${product.name} removed from wishlist!`);
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
    } else {
      // Add to wishlist
      addToWishlist(product, () => {
        setIsFavorite(true);
        setSnackbarMessage(`${product.name} added to wishlist!`);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      });
    }
    
    // Dispatch custom event to update navbar badge
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Navigate to='/cart' />;
    }
  };

  const handleChange = (productId) => (event) => {
    setRun(!run);
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
      setSnackbarMessage('Quantity updated!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <TextField
              type='number'
              label='Quantity'
              variant='outlined'
              value={count}
              onChange={handleChange(product._id)}
              inputProps={{ min: 1, max: product.quantity }}
              size='small'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </FormControl>
        </Box>
      )
    );
  };

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <Button
          onClick={() => {
            removeItem(product._id);
            setRun(!run);
            setSnackbarMessage(`${product.name} removed from cart!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
          }}
          variant='contained'
          color='error'
          startIcon={<DeleteIcon />}
          fullWidth
          sx={{ 
            mt: 2,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Remove from Cart
        </Button>
      )
    );
  };

  return (
    <>
      <CardM
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #E5E8EB',
          transition: 'all 0.3s ease',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderColor: PRIMARY_COLOR,
          },
        }}
      >
        {shouldRedirect(redirect)}
        
        {/* Product Image with Favorite Icon */}
        <Box 
          sx={{ 
            position: 'relative', 
            backgroundColor: '#F8F9FA',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}
        >
          <Box
            component='a'
            href={`/product/${product._id}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              textDecoration: 'none',
            }}
          >
            <ShowImage item={product} url='product' />
          </Box>
          
          {/* Favorite Icon - Top Right */}
          <IconButton
            onClick={toggleWishlist}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'white',
              width: 36,
              height: 36,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'white',
                transform: 'scale(1.1)',
              },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ color: '#EF4444', fontSize: 20 }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
            )}
          </IconButton>

          {/* Out of Stock Overlay */}
          {product.quantity < 1 && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Out of Stock
              </Typography>
            </Box>
          )}
        </Box>

        {/* Card Content */}
        <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          {/* Product Name */}
          <Typography 
            variant='subtitle1'
            component='a'
            href={`/product/${product._id}`}
            sx={{
              fontWeight: 600,
              mb: 1,
              color: SECONDARY_COLOR,
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              '&:hover': {
                color: PRIMARY_COLOR,
              },
            }}
          >
            {product.name}
          </Typography>

          {/* Price and Add to Cart Button */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 'auto',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 700,
                color: SECONDARY_COLOR,
                fontSize: '1.25rem',
              }}
            >
              Rs. {product.price.toFixed(2)}
            </Typography>

            {showAddToCartButton && (
              <Button
                onClick={addToCart}
                variant='contained'
                disabled={product.quantity < 1}
                size='small'
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  backgroundColor: PRIMARY_COLOR,
                  px: 2,
                  py: 0.75,
                  '&:hover': {
                    backgroundColor: '#085862',
                  },
                  '&:disabled': {
                    backgroundColor: '#E5E8EB',
                    color: '#9CA3AF',
                  },
                }}
              >
                Add To Cart
              </Button>
            )}
          </Box>

          {/* Stock Status Chip */}
          {product.quantity > 0 && product.quantity <= 5 && (
            <Chip
              label={`Only ${product.quantity} left`}
              size='small'
              sx={{
                mt: 1,
                height: '20px',
                fontSize: '0.7rem',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                fontWeight: 600,
              }}
            />
          )}

          {/* Cart Update Options */}
          {showCartUpdateOptions(cartUpdate)}
          
          {/* Remove Button */}
          {showRemoveButton(showRemoveProductButton)}
        </CardContent>
      </CardM>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ 
            borderRadius: '8px',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Card;