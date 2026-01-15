import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { getProducts } from './apiCore.js';
import { API } from '../config';
import Card from './Card.jsx';
import Footer from './Footer';
import { Box, Container, Typography, Button, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Color palette
const PRIMARY_COLOR = '#8B4513'; // Brownish color for the badge
const SECONDARY_COLOR = '#0A2F68'; // Dark blue for buttons
const BG_LIGHT = '#EBEBEB'; // Light gray background for hero
const IMAGE_BG = '#C4C4C4'; // Gray background for image container

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: BG_LIGHT,
  padding: theme.spacing(10, 0),
  marginBottom: theme.spacing(6),
  minHeight: '600px',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 0),
  },
}));

const HeroContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'left',
  },
}));

const HeroTextWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  zIndex: 1,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '50%',
  },
}));

const HeroImageWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '100%',
}));

const CategoryBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 0),
  marginBottom: theme.spacing(2),
  fontSize: '0.95rem',
  fontWeight: 500,
  color: PRIMARY_COLOR,
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 400,
  lineHeight: 1.1,
  marginBottom: theme.spacing(4),
  color: '#1A1A1A',
  [theme.breakpoints.down('lg')]: {
    fontSize: '3.5rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

const HeroDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  lineHeight: 1.5,
  marginBottom: theme.spacing(5),
  color: '#333',
  fontWeight: 400,
  maxWidth: '500px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '14px 40px',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 500,
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&.primary': {
    background: SECONDARY_COLOR,
    color: 'white',
    '&:hover': {
      background: '#082554',
      transform: 'translateY(-2px)',
    },
  },
}));

const MainImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '550px',
  aspectRatio: '1 / 1',
  backgroundColor: IMAGE_BG,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'visible',
  border: '1px solid rgba(0,0,0,0.05)',
}));

const MainImage = styled('img')(({ theme }) => ({
  maxWidth: '85%',
  maxHeight: '85%',
  objectFit: 'contain',
  zIndex: 1,
  transition: 'opacity 0.8s ease-in-out',
}));

const TryOnBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '40px',
  right: '-30px',
  width: '160px',
  height: '160px',
  backgroundColor: 'white',
  borderRadius: '50%',
  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '15px',
  zIndex: 10,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  textDecoration: 'none',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '120px',
    height: '120px',
    right: '-10px',
    bottom: '20px',
  },
}));

const BadgeText = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#333',
  marginBottom: '8px',
  textAlign: 'center',
});

const BadgeImage = styled('img')({
  width: '85%',
  height: 'auto',
  objectFit: 'contain',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: SECONDARY_COLOR,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

// Placeholder for slideImages (keeping for state if needed, though using local image)
const slideImages = [
  '/images/hero-glasses.png',
  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop',
];

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const loadProductsBySell = () => {
    getProducts('sold').then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data || []);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data || []);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  // Slideshow logic
  useEffect(() => {
    if (productsByArrival.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % productsByArrival.length);
      }, 5000); // Change image every 5 seconds
      return () => clearInterval(timer);
    }
  }, [productsByArrival]);

  return (
    <Layout
      title='Home'
      description='Your online one stop shop for eyewear'
      className='container-fluid'
    >
      {/* Hero Section */}
      <HeroSection>
        <HeroContainer maxWidth='lg'>
          <HeroTextWrapper>
            <CategoryBadge>
              <VisibilityIcon sx={{ fontSize: '1.2rem', mr: 1 }} />
              optix - Glasses & Eyewear
            </CategoryBadge>

            <HeroTitle>
              Perfect Glasses for Your Unique Style
            </HeroTitle>

            <HeroDescription>
              Find eyewear that matches your look and lifestyle, with a virtual try-on so you can see the fit before you buy.
            </HeroDescription>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
              <StyledButton
                className='primary'
                variant='contained'
                component={Link}
                to='/shop'
              >
                Browse Woman
              </StyledButton>
              <StyledButton
                className='primary'
                variant='contained'
                component={Link}
                to='/shop'
              >
                
                Browse Man
              </StyledButton>
            </Box>
          </HeroTextWrapper>

          <HeroImageWrapper>
            <MainImageContainer>
              <MainImage
                src={productsByArrival.length > 0
                  ? `${API}/product/photo/${productsByArrival[currentSlide]._id}`
                  : "/images/hero-glasses.png"}
                alt={productsByArrival[currentSlide]?.name || "Main Glasses"}
                key={currentSlide} // Key helps with re-triggering animations/transitions
              />

              <TryOnBadge component={Link} to="/shop">
                <BadgeText>Try-on Virtually</BadgeText>
                <BadgeImage
                  src={productsBySell.length > 1
                    ? `${API}/product/photo/${productsBySell[1]._id}`
                    : "https://images.unsplash.com/photo-1577803645773-f96470509666?w=200&h=200&fit=crop"}
                  alt="Secondary Glasses"
                />
              </TryOnBadge>
            </MainImageContainer>
          </HeroImageWrapper>
        </HeroContainer>
      </HeroSection>

      {/* Top Picks Section */}
      <Container maxWidth='lg' sx={{ mb: 8 }}>
        <SectionTitle variant='h4'>Top Picks</SectionTitle>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {productsBySell.slice(0, 4).map((product, i) => (
            <Card key={i} product={product} />
          ))}
        </Box>
      </Container>

      <Footer />
    </Layout>
  );
};
//nowd done
export default Home;
