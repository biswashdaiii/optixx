import React from 'react';
import Layout from './Layout';
import { Box, Typography, Container, Paper } from '@mui/material';

const TermsOfUse = () => {
    return (
        <Layout
            title="Terms of Use"
            description="Rules and regulations for using Optix"
            className="container-fluid"
        >
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#0A2F68' }}>
                        Terms of Use
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Last Updated: January 15, 2026
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            1. Acceptance of Terms
                        </Typography>
                        <Typography paragraph>
                            By accessing or using Optix, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            2. Use License
                        </Typography>
                        <Typography paragraph>
                            Permission is granted to temporarily download one copy of the materials (information or software) on Optix's website for personal, non-commercial transitory viewing only.
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            3. Disclaimer
                        </Typography>
                        <Typography paragraph>
                            The materials on Optix's website are provided on an 'as is' basis. Optix makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            4. Limitations
                        </Typography>
                        <Typography paragraph>
                            In no event shall Optix or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Optix's website.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
};

export default TermsOfUse;
