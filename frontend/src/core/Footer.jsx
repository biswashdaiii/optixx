import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Color palette
const PRIMARY_COLOR = '#0A6A7A';
const SECONDARY_COLOR = '#0A2F68';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: PRIMARY_COLOR,
  color: 'white',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(3),
  marginTop: theme.spacing(8),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  display: 'block',
  marginBottom: theme.spacing(1),
  transition: 'color 0.3s ease',
  '&:hover': {
    color: 'white',
    paddingLeft: theme.spacing(0.5),
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-3px)',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '0.9rem',
}));

const Footer = () => {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={18}>
          {/* Brand Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: '1.75rem',
              }}
            >
              Optix
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
              }}
            >
              The clarity you trust
            </Typography>
            
            {/* Social Media Icons */}
            <Box>
              <SocialIconButton size="small">
                <FacebookIcon fontSize="small" />
              </SocialIconButton>
              <SocialIconButton size="small">
                <TwitterIcon fontSize="small" />
              </SocialIconButton>
              <SocialIconButton size="small">
                <InstagramIcon fontSize="small" />
              </SocialIconButton>
              <SocialIconButton size="small">
                <YouTubeIcon fontSize="small" />
              </SocialIconButton>
            </Box>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Navigation
            </Typography>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>

            <FooterLink to="/shop">Products</FooterLink>
            <FooterLink to="/shop">Services</FooterLink>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Services
            </Typography>
            <FooterLink to="/shop">Find Frame</FooterLink>
            <FooterLink to="/shop">Virtual Try-On</FooterLink>
            <FooterLink to="/shop">Frame Recommendation</FooterLink>
            <FooterLink to="/shop">Easy Return & Exchange</FooterLink>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Contact Us
            </Typography>
            
            <ContactItem>
              <LocationOnIcon sx={{ fontSize: '1.2rem' }} />
              <Typography variant="body2">
                Our support team is available
              </Typography>
            </ContactItem>

            <ContactItem>
              <PhoneIcon sx={{ fontSize: '1.2rem' }} />
              <Typography variant="body2">
                24/7 to answer your queries
              </Typography>
            </ContactItem>

            <ContactItem>
              <EmailIcon sx={{ fontSize: '1.2rem' }} />
              <Typography variant="body2">
                optix@gmail.com
              </Typography>
            </ContactItem>

            <ContactItem>
              <PhoneIcon sx={{ fontSize: '1.2rem' }} />
              <Typography variant="body2">
                +977 9800000000
              </Typography>
            </ContactItem>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.85rem',
            }}
          >
            © {new Date().getFullYear()} Optix. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              component={Link}
              to="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              component={Link}
              to="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Terms of Service
            </Typography>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;