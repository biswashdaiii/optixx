import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Checkout from './Checkout';
import { getCart } from './cartHelpers';
import ShowImage from './ShowImage';
import { Container, Typography, Box, Grid, Paper, Divider, Avatar, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const OrderItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    boxShadow: 'none',
}));

const SummaryBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#F8F9FA',
    padding: theme.spacing(3),
    borderRadius: '16px',
    border: '1px solid #eee',
}));

const CheckoutPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(getCart());
    }, []);

    const getTotal = () =>
        products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);

    return (
        <Layout title="Checkout" description="Complete your secure order">
            <Box sx={{ backgroundColor: '#F5F5F7', minHeight: '90vh', py: 6 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: '#1D1D1F',
                            textAlign: 'left'
                        }}
                    >
                        Checkout
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ mb: 5, color: '#86868B', textAlign: 'left' }}
                    >
                        Confirm your order and provide delivery details.
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Summary Column */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Order Summary ({products.length} {products.length === 1 ? 'item' : 'items'})
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    {products.map((p, i) => (
                                        <OrderItem key={i}>
                                            <Box sx={{ width: 80, height: 80 }}>
                                                <ShowImage item={p} url="product" />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {p.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Qty: {p.count}
                                                </Typography>
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                Rs {(p.price * p.count).toLocaleString()}
                                            </Typography>
                                        </OrderItem>
                                    ))}
                                </List>
                            </Box>
                        </Grid>

                        {/* Checkout Logic Column */}
                        <Grid item xs={12} md={5}>
                            <SummaryBox>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Payment Details
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography color="text.secondary">Subtotal</Typography>
                                        <Typography sx={{ fontWeight: 500 }}>Rs {getTotal().toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography color="text.secondary">Delivery Charge</Typography>
                                        <Typography color="success.main">FREE</Typography>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A2F68' }}>
                                            Rs {getTotal().toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Checkout products={products} />
                            </SummaryBox>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default CheckoutPage;
