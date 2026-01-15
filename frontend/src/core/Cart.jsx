import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { getCart, removeItem, updateItem } from './cartHelpers.js';
import ShowImage from './ShowImage';
import Checkout from './Checkout';
import Copyright from './Copyright.jsx';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Container,
  Button,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

// Color palette
const PRIMARY_COLOR = '#0A6A7A';
const SECONDARY_COLOR = '#0A2F68';
const LIGHT_BG = '#F5F7FA';
const BORDER_COLOR = '#E5E8EB';

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#EEF2F6',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const CartCard = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${BORDER_COLOR}`,
  backgroundColor: '#FFFFFF',
  boxShadow: 'none',
}));

const CartHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${BORDER_COLOR}`,
}));

const CartItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  borderBottom: `1px solid ${BORDER_COLOR}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${BORDER_COLOR}`,
  borderRadius: '8px',
  overflow: 'hidden',
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  padding: '8px',
  '&:hover': {
    backgroundColor: LIGHT_BG,
  },
}));

const QuantityInput = styled(TextField)(({ theme }) => ({
  width: '60px',
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      textAlign: 'center',
      padding: '8px 4px',
      fontWeight: 600,
    },
  },
}));

const SummaryRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '14px 24px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&.primary': {
    backgroundColor: SECONDARY_COLOR,
    color: 'white',
    '&:hover': {
      backgroundColor: '#082554',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(10,47,104,0.3)',
    },
  },
  '&.secondary': {
    color: PRIMARY_COLOR,
    '&:hover': {
      backgroundColor: `${PRIMARY_COLOR}10`,
    },
  },
}));

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateItem(productId, newQuantity);
      setRun(!run);
    }
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    setRun(!run);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.count, 0);
  };

  const calculateShipping = () => {
    return 0; // Free shipping
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.13);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const showItems = (items) => (
    <CartCard>
      <CartHeader>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ fontWeight: 700, color: SECONDARY_COLOR }}>
            Shopping Cart
          </Typography>
          <Typography variant='body2' sx={{ color: '#6B7280' }}>
            {items.length} items
          </Typography>
        </Box>
      </CartHeader>

      {items.map((product, i) => (
        <CartItem key={i}>
          {/* Product Image */}
          <Box
            sx={{
              width: '80px',
              height: '80px',
              backgroundColor: LIGHT_BG,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <ShowImage item={product} url='product' />
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 600, color: SECONDARY_COLOR, mb: 0.5 }}
            >
              {product.name}
            </Typography>
            <Typography variant='body2' sx={{ color: '#6B7280', mb: 0.5 }}>
              {product.category?.name}
            </Typography>
            <Typography variant='caption' sx={{ color: '#9CA3AF' }}>
              Color: Black
            </Typography>
          </Box>

          {/* Quantity Control */}
          <QuantityControl>
            <QuantityButton
              size='small'
              onClick={() => handleQuantityChange(product._id, product.count - 1)}
            >
              <RemoveIcon fontSize='small' />
            </QuantityButton>
            <QuantityInput
              value={product.count}
              onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 1)}
              type='number'
              inputProps={{ min: 1, max: product.quantity }}
            />
            <QuantityButton
              size='small'
              onClick={() => handleQuantityChange(product._id, product.count + 1)}
              disabled={product.count >= product.quantity}
            >
              <AddIcon fontSize='small' />
            </QuantityButton>
          </QuantityControl>

          {/* Price */}
          <Typography
            variant='h6'
            sx={{ fontWeight: 700, color: SECONDARY_COLOR, minWidth: '100px', textAlign: 'right' }}
          >
            Rs {((product.price * product.count).toLocaleString())}
          </Typography>

          {/* Remove Button */}
          <IconButton
            onClick={() => handleRemoveItem(product._id)}
            sx={{
              color: '#EF4444',
              '&:hover': {
                backgroundColor: '#FEE2E2',
              },
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </CartItem>
      ))}

      {/* Cart Footer */}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <StyledButton
          component={Link}
          to='/shop'
          className='secondary'
          startIcon={<ArrowBackIcon />}
        >
          Continue Shopping
        </StyledButton>
        <StyledButton
          color='error'
          onClick={() => {
            items.forEach(item => removeItem(item._id));
            setRun(!run);
          }}
        >
          Clear Cart
        </StyledButton>
      </Box>
    </CartCard>
  );

  const orderSummary = () => (
    <CartCard>
      <CartHeader>
        <Typography variant='h6' sx={{ fontWeight: 700, color: SECONDARY_COLOR }}>
          Order Summary
        </Typography>
      </CartHeader>

      <Box sx={{ p: 3 }}>
        <SummaryRow>
          <Typography variant='body2' sx={{ color: '#6B7280' }}>
            Subtotal ({items.length} items)
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 600, color: SECONDARY_COLOR }}>
            Rs {calculateSubtotal().toLocaleString()}
          </Typography>
        </SummaryRow>

        <SummaryRow>
          <Typography variant='body2' sx={{ color: '#6B7280' }}>
            Shipping
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 600, color: '#10B981' }}>
            FREE
          </Typography>
        </SummaryRow>

        <SummaryRow>
          <Typography variant='body2' sx={{ color: '#6B7280' }}>
            Tax (13%)
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 600, color: SECONDARY_COLOR }}>
            Rs {calculateTax().toLocaleString()}
          </Typography>
        </SummaryRow>

        <Divider sx={{ my: 2 }} />

        <SummaryRow>
          <Typography variant='h6' sx={{ fontWeight: 700, color: SECONDARY_COLOR }}>
            Total
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: 800, color: SECONDARY_COLOR }}>
            Rs {calculateTotal().toLocaleString()}
          </Typography>
        </SummaryRow>

        <Checkout products={items} setRun={setRun} run={run} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mt: 2,
          }}
        >
          <Box
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          <Typography variant='caption' sx={{ color: '#6B7280' }}>
            Secure Checkout
          </Typography>
        </Box>
      </Box>

      {/* Coupon Section */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${BORDER_COLOR}`,
        }}
      >
        <Typography
          variant='subtitle2'
          sx={{ fontWeight: 700, color: SECONDARY_COLOR, mb: 2 }}
        >
          Apply Coupon Code
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder='Enter coupon code'
            size='small'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <StyledButton className='primary' sx={{ minWidth: '80px' }}>
            Apply
          </StyledButton>
        </Box>
      </Box>
    </CartCard>
  );

  const noItemsMessage = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
      }}
    >
      <CartCard sx={{ p: 6, maxWidth: 500, mx: 'auto' }}>
        <ShoppingCartOutlinedIcon
          sx={{ fontSize: 80, color: '#D1D5DB', mb: 2 }}
        />
        <Typography
          variant='h5'
          sx={{ fontWeight: 700, color: SECONDARY_COLOR, mb: 2 }}
        >
          Your cart is empty
        </Typography>
        <Typography variant='body2' sx={{ color: '#6B7280', mb: 3 }}>
          Looks like you haven't added anything to your cart yet
        </Typography>
        <StyledButton
          component={Link}
          to='/shop'
          className='primary'
          size='large'
        >
          Start Shopping
        </StyledButton>
      </CartCard>
    </Box>
  );

  return (
    <Layout
      title='Shopping Cart'
      description='Manage your cart items'
    >
      <PageWrapper>
        <Container maxWidth='lg'>
          <Typography
            variant='h3'
            sx={{
              fontWeight: 700,
              color: SECONDARY_COLOR,
              mb: 4,
              textAlign: 'center',
            }}
          >
            Cart
          </Typography>

          {items.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Cart Items - Left Side */}
              <Box sx={{ flex: 1 }}>
                {showItems(items)}
              </Box>

              {/* Order Summary - Right Side */}
              <Box sx={{ width: { xs: '100%', md: '400px' }, flexShrink: 0 }}>
                {orderSummary()}
              </Box>
            </Box>
          ) : (
            noItemsMessage()
          )}
        </Container>
      </PageWrapper>
      <Copyright />
    </Layout>
  );
};

export default Cart;