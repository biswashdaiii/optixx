import React from 'react';
import Layout from './Layout';
import { Box, Typography, Container, Paper } from '@mui/material';

const PrivacyPolicy = () => {
    return (
        <Layout
            title="Privacy Policy"
            description="Learn how we collect and use your data"
            className="container-fluid"
        >
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#0A2F68' }}>
                        Privacy Policy
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Last Updated: January 15, 2026
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            1. Information We Collect
                        </Typography>
                        <Typography paragraph>
                            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, shipping address, and payment information.
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            2. How We Use Your Information
                        </Typography>
                        <Typography paragraph>
                            We use the information we collect to provide, maintain, and improve our services, including processing transactions, sending order confirmations, and providing customer support.
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            3. Virtual Try-On Data
                        </Typography>
                        <Typography paragraph>
                            Our Virtual Try-On feature uses your camera to overlay products on your live video feed. We do **not** record, store, or transmit your facial data or video feed to our servers. All processing happens locally on your device properly secured.
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            4. Contact Us
                        </Typography>
                        <Typography paragraph>
                            If you have any questions about this Privacy Policy, please contact us at support@optix.com.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
};

export default PrivacyPolicy;
