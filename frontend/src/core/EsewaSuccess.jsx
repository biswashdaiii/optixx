import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { createOrder } from './apiCore';
import { isAuthenticated } from '../auth';
import { emptyCart } from './cartHelpers';
import Layout from './Layout';

const EsewaSuccess = () => {
    const [values, setValues] = useState({
        success: false,
        error: '',
        loading: true
    });
    const location = useLocation();
    const { success, error, loading } = values;

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const data = query.get('data');

        if (data) {
            try {
                const decodedData = JSON.parse(atob(data));
                console.log("eSewa Decoded Data:", decodedData);

                if (decodedData.status === 'COMPLETE') {
                    const pendingOrder = JSON.parse(localStorage.getItem('pending_order'));
                    if (pendingOrder && pendingOrder.transaction_uuid === decodedData.transaction_uuid) {
                        const userId = isAuthenticated() && isAuthenticated().user._id;
                        const token = isAuthenticated() && isAuthenticated().token;

                        const createOrderData = {
                            products: pendingOrder.products,
                            transaction_id: decodedData.transaction_id,
                            amount: decodedData.total_amount,
                            address: pendingOrder.address,
                        };

                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                emptyCart(() => {
                                    localStorage.removeItem('pending_order');
                                    setValues({ ...values, success: true, loading: false });
                                });
                            })
                            .catch(err => {
                                setValues({ ...values, error: "Failed to create order after payment", loading: false });
                            });
                    } else {
                        setValues({ ...values, error: "Order session not found or mismatch", loading: false });
                    }
                } else {
                    setValues({ ...values, error: "Payment was not completed successfully", loading: false });
                }
            } catch (err) {
                setValues({ ...values, error: "Invalid payment data received", loading: false });
            }
        } else {
            setValues({ ...values, error: "No payment data found", loading: false });
        }
    }, [location]);

    return (
        <Layout title="Payment Status" description="Processing your eSewa payment">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 4 }}>
                {loading && (
                    <>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Verifying your payment, please wait...</Typography>
                    </>
                )}

                {success && (
                    <Alert severity="success" sx={{ width: '100%', maxWidth: 500 }}>
                        <Typography variant="h5">Payment Successful! 🎉</Typography>
                        <Typography>Your order has been placed successfully.</Typography>
                        <Button component={Link} to="/user/dashboard" variant="contained" sx={{ mt: 2 }}>
                            Go to Dashboard
                        </Button>
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
                        <Typography variant="h5">Payment Error</Typography>
                        <Typography>{error}</Typography>
                        <Button component={Link} to="/cart" variant="contained" color="error" sx={{ mt: 2 }}>
                            Back to Cart
                        </Button>
                    </Alert>
                )}
            </Box>
        </Layout>
    );
};

export default EsewaSuccess;
