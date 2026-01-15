import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Stack,
} from '@mui/material';
import {
  createOrder,
  getEsewaSignature,
} from './apiCore';
import { emptyCart } from './cartHelpers';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '14px 40px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  boxShadow: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  }
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fff',
  },
});

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: '',
    address: '',
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  const getTotal = () =>
    products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);

  const payWithEsewa = () => {
    if (!data.address) {
      setData({ ...data, error: 'Please provide a delivery address' });
      return;
    }
    setData({ ...data, loading: true });

    const transaction_uuid = uuidv4();
    const amount = getTotal().toString();
    const product_code = 'EPAYTEST';

    getEsewaSignature(userId, token, { amount, transaction_uuid, product_code })
      .then((res) => {
        if (res.error) {
          setData({ ...data, error: res.error, loading: false });
        } else {
          const orderData = {
            products: products,
            amount: amount,
            address: data.address,
            transaction_uuid: transaction_uuid,
          };
          localStorage.setItem('pending_order', JSON.stringify(orderData));

          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

          const fields = {
            amount: amount,
            tax_amount: '0',
            total_amount: amount,
            transaction_uuid: transaction_uuid,
            product_code: product_code,
            product_service_charge: '0',
            product_delivery_charge: '0',
            success_url: `${window.location.origin}/esewa/success`,
            failure_url: `${window.location.origin}/esewa/failure`,
            signed_field_names: 'total_amount,transaction_uuid,product_code',
            signature: res.signature,
          };

          for (const key in fields) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
          }

          document.body.appendChild(form);
          form.submit();
        }
      })
      .catch((err) => setData({ ...data, error: err.message, loading: false }));
  };

  const showEsewaCheckout = () =>
    products.length > 0 && (
      <Box sx={{ mt: 2 }}>
        <TextField
          label='Delivery Address'
          placeholder='Type your delivery address...'
          fullWidth
          multiline
          minRows={3}
          value={data.address}
          onChange={handleAddress}
          sx={{ mb: 2 }}
        />

        <Button
          onClick={payWithEsewa}
          variant='contained'
          color='success'
          fullWidth
          sx={{ mt: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Pay Rs {getTotal().toLocaleString()} via eSewa
        </Button>
      </Box>
    );

  return (
    <Box>
      <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>
        Total Amount: Rs {getTotal().toLocaleString()}
      </Typography>

      {data.loading && (
        <Stack alignItems='center' sx={{ mb: 3, p: 3, backgroundColor: 'rgba(76, 175, 80, 0.05)', borderRadius: '16px' }}>
          <CircularProgress color='success' size={40} />
          <Typography sx={{ mt: 2, fontWeight: 600, color: 'success.dark' }}>
            Preparing your secure payment...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be redirected to eSewa in a moment
          </Typography>
        </Stack>
      )}

      {data.success && (
        <Alert severity='success' sx={{ mb: 2, borderRadius: '12px' }}>
          🎉 Thanks! Your payment was successful.
        </Alert>
      )}

      {data.error && (
        <Alert severity='error' sx={{ mb: 2, borderRadius: '12px' }}>
          {data.error}
        </Alert>
      )}

      {isAuthenticated() ? (
        products.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <StyledTextField
              label='Delivery Address'
              placeholder='Enter your full delivery address...'
              fullWidth
              multiline
              minRows={3}
              value={data.address}
              onChange={handleAddress}
              sx={{ mb: 3 }}
            />

            <StyledButton
              onClick={payWithEsewa}
              variant='contained'
              color='success'
              fullWidth
              disabled={data.loading}
              sx={{
                backgroundColor: '#0A2F68',
                height: '56px',
                '&:hover': { backgroundColor: '#07214a' }
              }}
            >
              {data.loading ? 'Processing...' : `Pay Rs ${getTotal().toLocaleString()} via eSewa`}
            </StyledButton>
          </Box>
        )
      ) : (
        <StyledButton
          component={Link}
          to='/signin'
          variant='contained'
          color='primary'
          fullWidth
          sx={{ backgroundColor: '#0A2F68' }}
        >
          Sign in to checkout
        </StyledButton>
      )}
    </Box>
  );
};

export default Checkout;
