import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { read, listRelated } from './apiCore';
import Card from './Card';
import ShowImage from './ShowImage';
import Checkout from './Checkout';
import { addItem } from './cartHelpers';
import moment from 'moment';
import VirtualTryOn from './../components/VirtualTryOn.jsx';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CameraIcon from '@mui/icons-material/PhotoCamera';

// Color palette
const PRIMARY_COLOR = '#0A6A7A';
const SECONDARY_COLOR = '#0A2F68';
const LIGHT_BG = '#F5F7FA';
const BORDER_COLOR = '#E5E8EB';

// Styled Components
const ProductImageContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  backgroundColor: '#F8F9FA',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '500px',
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${BORDER_COLOR}`,
  boxShadow: 'none',
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  left: 20,
  backgroundColor: '#FF4444',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '0.875rem',
  zIndex: 2,
  boxShadow: '0 4px 12px rgba(255,68,68,0.3)',
}));

const ProductInfoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
}));

const PriceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 800,
  color: '#FF4444',
  letterSpacing: '-1px',
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  color: '#9CA3AF',
  textDecoration: 'line-through',
  fontWeight: 500,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '14px 40px',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  boxShadow: 'none',
  '&.primary': {
    backgroundColor: SECONDARY_COLOR,
    color: 'white',
    '&:hover': {
      backgroundColor: '#082554',
      boxShadow: '0 8px 16px rgba(10,47,104,0.2)',
      transform: 'translateY(-2px)',
    },
  },
  '&.secondary': {
    backgroundColor: SECONDARY_COLOR,
    color: 'white',
    '&:hover': {
      backgroundColor: '#082554',
      boxShadow: '0 8px 16px rgba(10,47,104,0.2)',
      transform: 'translateY(-2px)',
    },
  },
  '&.tryon': {
    backgroundColor: SECONDARY_COLOR,
    color: 'white',
    '&:hover': {
      backgroundColor: '#082554',
      boxShadow: '0 8px 16px rgba(10,47,104,0.2)',
      transform: 'translateY(-2px)',
    },
  },
  '&:disabled': {
    backgroundColor: '#E5E8EB',
    color: '#A0A6B1',
  },
}));

const InfoSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: '#FFFFFF',
  border: `1px solid ${BORDER_COLOR}`,
  marginBottom: theme.spacing(3),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${BORDER_COLOR}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  flex: '0 0 180px',
  fontWeight: 600,
  color: SECONDARY_COLOR,
  fontSize: '0.9rem',
}));

const InfoValue = styled(Box)(({ theme }) => ({  // Changed from Typography to Box
  flex: 1,
  color: '#4B5563',
  fontSize: '0.9rem',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.875rem',
  fontWeight: 700,
  color: SECONDARY_COLOR,
  marginBottom: theme.spacing(4),
  position: 'relative',
  paddingBottom: theme.spacing(2),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '80px',
    height: '4px',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: '2px',
  },
}));

const StockBadge = styled(Chip)(({ theme, instock }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: instock ? '#E8F5E9' : '#FFEBEE',
  color: instock ? '#2E7D32' : '#C62828',
  border: `1px solid ${instock ? '#C8E6C9' : '#FFCDD2'}`,
  '& .MuiChip-icon': {
    color: instock ? '#2E7D32' : '#C62828',
  },
}));

const DirectCheckoutBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  backgroundColor: '#F8F9FA',
  border: `1px solid ${BORDER_COLOR}`,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  animation: 'slideDown 0.4s ease-out',
  '@keyframes slideDown': {
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}));

const FloatingTryOnBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  left: '20px',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const CameraCircle = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '60px',
  backgroundColor: '#1A1A1A',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  color: 'white',
}));

const TryOnLabel = styled(Typography)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#1A1A1A',
  padding: '6px 16px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '1px',
  marginTop: '-12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  textTransform: 'uppercase',
  border: '1px solid #EEEEEE',
}));

const Product = () => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { productId } = useParams();
  const navigate = useNavigate();

  const loadSingleProduct = (productId) => {
    setLoading(true);
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setProduct(data);
        setError('');
        listRelated(data._id).then((relatedData) => {
          if (relatedData.error) {
            setError(relatedData.error);
          } else {
            setRelatedProducts(relatedData);
          }
          setLoading(false);
        });
      }
    });
  };

  useEffect(() => {
    loadSingleProduct(productId);
  }, [productId]);

  const handleAddToCart = () => {
    addItem(product, () => {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    });
  };

  const handleBuyNow = () => {
    setShowCheckout(!showCheckout);
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (product?.price) {
      const originalPrice = product.price * 1.15;
      return Math.round(((originalPrice - product.price) / originalPrice) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <Layout title='Loading...' description='' className='container-fluid'>
        <Container maxWidth='lg'>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '70vh',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <CircularProgress size={60} sx={{ color: PRIMARY_COLOR }} />
            <Typography variant='body1' color='text.secondary'>
              Loading product details...
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout
      title={product?.name || 'Product'}
      description={product?.description?.substring(0, 100) || ''}
      className='container-fluid'
    >
      <Box sx={{ backgroundColor: LIGHT_BG, minHeight: '100vh', py: 4 }}>
        <Container maxWidth='xl'>
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            sx={{ mb: 3, py: 2 }}
          >
            <Link
              href='/'
              underline='hover'
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#6B7280',
                fontWeight: 500,
                '&:hover': { color: PRIMARY_COLOR },
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
              Home
            </Link>
            <Link
              href='/shop'
              underline='hover'
              sx={{
                color: '#6B7280',
                fontWeight: 500,
                '&:hover': { color: PRIMARY_COLOR },
              }}
            >
              Shop
            </Link>
            <Typography sx={{ color: '#6B7280', fontWeight: 500 }}>
              {product?.category?.name}
            </Typography>
            <Typography sx={{ color: SECONDARY_COLOR, fontWeight: 600 }}>
              {product?.name}
            </Typography>
          </Breadcrumbs>

          {error && (
            <Alert
              severity='error'
              sx={{ mb: 3, borderRadius: '12px' }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {addedToCart && (
            <Alert
              severity='success'
              icon={<CheckCircleIcon />}
              sx={{ mb: 3, borderRadius: '12px' }}
              onClose={() => setAddedToCart(false)}
            >
              <strong>{product?.name}</strong> has been added to your cart!
            </Alert>
          )}

          {/* Product Details Section */}
          {product && (
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {/* Left Side - Product Images */}
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Thumbnail Images on the Left */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      width: '100px',
                    }}
                  >
                    {[1, 2, 3, 4].map((index) => (
                      <Paper
                        key={index}
                        sx={{
                          aspectRatio: '1/1',
                          borderRadius: '8px',
                          backgroundColor: '#F8F9FA',
                          border: `2px solid ${BORDER_COLOR}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          overflow: 'hidden',
                          padding: '8px',
                          '&:hover': {
                            borderColor: PRIMARY_COLOR,
                            boxShadow: '0 2px 8px rgba(10,106,122,0.2)',
                          },
                        }}
                      >
                        <ShowImage item={product} url='product' />
                      </Paper>
                    ))}
                  </Box>

                  {/* Main Product Image on the Right */}
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    <ProductImageContainer elevation={0}>
                      <FloatingTryOnBadge onClick={() => setShowTryOn(!showTryOn)}>
                        <CameraCircle>
                          <CameraIcon sx={{ fontSize: '30px' }} />
                        </CameraCircle>
                        <TryOnLabel>TRY-ON</TryOnLabel>
                      </FloatingTryOnBadge>
                      {calculateDiscount() > 0 && (
                        <DiscountBadge>{calculateDiscount()}%</DiscountBadge>
                      )}
                      <ShowImage item={product} url='product' />
                    </ProductImageContainer>
                  </Box>
                </Box>
              </Grid>

              {/* Right Side - Product Info */}
              <Grid item xs={12} md={7}>
                <ProductInfoSection>
                  {/* Brand/Category */}
                  <Typography
                    variant='overline'
                    sx={{
                      color: PRIMARY_COLOR,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      letterSpacing: '1.5px',
                    }}
                  >
                    {product.category?.name}
                  </Typography>

                  {/* Product Name */}
                  <Typography
                    variant='h3'
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: SECONDARY_COLOR,
                      fontSize: { xs: '1.75rem', md: '2rem' },
                      lineHeight: 1.3,
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Price */}
                  <PriceBox>
                    <CurrentPrice>Rs {product.price.toLocaleString()}</CurrentPrice>
                    {calculateDiscount() > 0 && (
                      <OriginalPrice>
                        Rs {(product.price * 1.15).toLocaleString()}
                      </OriginalPrice>
                    )}
                  </PriceBox>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} sx={{ fontSize: '1.2rem', color: '#FFC107' }} />
                    ))}
                    <Typography variant='body2' sx={{ color: '#6B7280', ml: 1 }}>
                      (1 customer review)
                    </Typography>
                  </Box>

                  {/* Technical Information */}
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 700,
                      color: SECONDARY_COLOR,
                      mb: 2,
                      fontSize: '1.125rem',
                    }}
                  >
                    Technical Information:
                  </Typography>

                  <InfoSection elevation={0}>
                    <InfoRow>
                      <InfoLabel>Description:</InfoLabel>
                      <InfoValue>{product.description}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Category:</InfoLabel>
                      <InfoValue>{product.category?.name}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Model No.:</InfoLabel>
                      <InfoValue>{product._id?.substring(0, 12)}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Added:</InfoLabel>
                      <InfoValue>{moment(product.createdAt).format('MMMM DD, YYYY')}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Availability:</InfoLabel>
                      <InfoValue>
                        {product.quantity > 0 ? (
                          <StockBadge
                            label={`${product.quantity} in stock`}
                            icon={<CheckCircleIcon />}
                            instock={1}
                            size='small'
                          />
                        ) : (
                          <StockBadge label='Out of Stock' instock={0} size='small' />
                        )}
                      </InfoValue>
                    </InfoRow>
                  </InfoSection>

                  {/* Categories */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Typography variant='body2' fontWeight={600} color={SECONDARY_COLOR}>
                        Categories:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          label={product.category?.name}
                          size='small'
                          sx={{
                            backgroundColor: `${PRIMARY_COLOR}15`,
                            color: PRIMARY_COLOR,
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Action Buttons - UPDATED WITH VIRTUAL TRY-ON */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'nowrap' }}>
                    <StyledButton
                      className='primary'
                      startIcon={<ShoppingCartIcon />}
                      disabled={product.quantity < 1}
                      onClick={handleAddToCart}
                      sx={{ flex: 1, minWidth: '160px', height: '56px' }}
                    >
                      {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </StyledButton>
                    <StyledButton
                      className='secondary'
                      disabled={product.quantity < 1}
                      onClick={handleBuyNow}
                      sx={{ flex: 1, minWidth: '160px', height: '56px' }}
                    >
                      {showCheckout ? 'Cancel Buy Now' : 'Buy Now'}
                    </StyledButton>
                    <StyledButton
                      className='tryon'
                      startIcon={<CameraIcon />}
                      onClick={() => setShowTryOn(!showTryOn)}
                      sx={{
                        flex: 1,
                        minWidth: '160px',
                        height: '56px',
                        backgroundColor: '#1A1A1A',
                        '&:hover': {
                          backgroundColor: '#333',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        }
                      }}
                    >
                      TRY ON
                    </StyledButton>
                  </Box>

                  {/* DIRECT CHECKOUT SECTION - NEW */}
                  {showCheckout && product && (
                    <DirectCheckoutBox elevation={0}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: SECONDARY_COLOR }}>
                        Direct Checkout
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        You are purchasing <strong>{product.name}</strong> for <strong>Rs {product.price.toLocaleString()}</strong>. Please enter your address below to proceed with eSewa.
                      </Typography>
                      <Checkout products={[{ ...product, count: 1 }]} />
                    </DirectCheckoutBox>
                  )}

                  {/* Features Grid */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 2,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: '8px',
                        }}
                      >
                        <LocalShippingIcon sx={{ color: PRIMARY_COLOR }} />
                        <Box>
                          <Typography variant='caption' fontWeight={600} display='block'>
                            Free Delivery
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            Orders over $50
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 2,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: '8px',
                        }}
                      >
                        <VerifiedUserIcon sx={{ color: PRIMARY_COLOR }} />
                        <Box>
                          <Typography variant='caption' fontWeight={600} display='block'>
                            Secure Payment
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            100% protected
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 2,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: '8px',
                        }}
                      >
                        <ReplayIcon sx={{ color: PRIMARY_COLOR }} />
                        <Box>
                          <Typography variant='caption' fontWeight={600} display='block'>
                            Easy Returns
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            30-day policy
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 2,
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: '8px',
                        }}
                      >
                        <CheckCircleIcon sx={{ color: PRIMARY_COLOR }} />
                        <Box>
                          <Typography variant='caption' fontWeight={600} display='block'>
                            Quality Assured
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            Verified authentic
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </ProductInfoSection>
              </Grid>
            </Grid>
          )}

          {/* VIRTUAL TRY-ON SECTION - NEW */}
          {showTryOn && product && (
            <Box sx={{ mb: 6 }}>
              <VirtualTryOn product={product} />
            </Box>
          )}

          {/* Related Products Section */}
          <Box>
            <SectionTitle>Related Products</SectionTitle>

            {relatedProducts.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {relatedProducts.map((relatedProduct, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: `1px solid ${BORDER_COLOR}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(10,106,122,0.1)',
                        borderColor: PRIMARY_COLOR,
                      },
                    }}
                  >
                    <Grid container>
                      {/* Left - Product Image */}
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            height: '100%',
                            minHeight: '250px',
                            backgroundColor: '#F8F9FA',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                            position: 'relative',
                          }}
                        >
                          <Link
                            href={`/product/${relatedProduct._id}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                            }}
                          >
                            <ShowImage item={relatedProduct} url='product' />
                          </Link>
                        </Box>
                      </Grid>

                      {/* Right - Product Description */}
                      <Grid item xs={12} md={8}>
                        <Box sx={{ p: 3 }}>
                          {/* Category Badge */}
                          <Chip
                            label={relatedProduct.category?.name}
                            size='small'
                            sx={{
                              mb: 1.5,
                              backgroundColor: `${PRIMARY_COLOR}15`,
                              color: PRIMARY_COLOR,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />

                          {/* Product Name */}
                          <Typography
                            variant='h5'
                            component={Link}
                            href={`/product/${relatedProduct._id}`}
                            sx={{
                              fontWeight: 700,
                              color: SECONDARY_COLOR,
                              textDecoration: 'none',
                              display: 'block',
                              mb: 1.5,
                              '&:hover': {
                                color: PRIMARY_COLOR,
                              },
                            }}
                          >
                            {relatedProduct.name}
                          </Typography>

                          {/* Description */}
                          <Typography
                            variant='body2'
                            sx={{
                              color: '#6B7280',
                              mb: 2,
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {relatedProduct.description}
                          </Typography>

                          {/* Price and Stock */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant='h5'
                              sx={{
                                fontWeight: 800,
                                color: '#FF4444',
                                fontSize: '1.75rem',
                              }}
                            >
                              ₹ {relatedProduct.price.toLocaleString()}
                            </Typography>

                            {relatedProduct.quantity > 0 ? (
                              <StockBadge
                                label='In Stock'
                                icon={<CheckCircleIcon />}
                                instock={1}
                                size='small'
                              />
                            ) : (
                              <StockBadge
                                label='Out of Stock'
                                instock={0}
                                size='small'
                              />
                            )}
                          </Box>

                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <StyledButton
                              className='secondary'
                              startIcon={<ShoppingCartIcon />}
                              disabled={relatedProduct.quantity < 1}
                              onClick={() => addItem(relatedProduct, () => {
                                setAddedToCart(true);
                                setTimeout(() => setAddedToCart(false), 3000);
                              })}
                              sx={{ width: '150px', height: '40px', padding: 0, fontSize: '0.875rem' }}
                            >
                              Add to Cart
                            </StyledButton>
                            <Button
                              component={Link}
                              href={`/product/${relatedProduct._id}`}
                              variant='outlined'
                              sx={{
                                width: '150px',
                                height: '40px',
                                padding: 0,
                                fontSize: '0.875rem',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: PRIMARY_COLOR,
                                color: PRIMARY_COLOR,
                                '&:hover': {
                                  borderColor: PRIMARY_COLOR,
                                  backgroundColor: `${PRIMARY_COLOR}10`,
                                },
                              }}
                            >
                              View Details
                            </Button>
                          </Box>

                          {/* Added Date */}
                          <Typography
                            variant='caption'
                            sx={{
                              color: '#9CA3AF',
                              display: 'block',
                              mt: 2,
                            }}
                          >
                            Added {moment(relatedProduct.createdAt).fromNow()}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  py: 8,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: `1px solid ${BORDER_COLOR}`,
                }}
              >
                <Typography variant='h6' color='text.secondary' sx={{ fontWeight: 500 }}>
                  No related products available
                </Typography>
              </Paper>
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Product;