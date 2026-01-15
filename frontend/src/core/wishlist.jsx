import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import ShowImage from './ShowImage';
import { addItem } from './cartHelpers';

import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MuiAlert from '@mui/material/Alert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

// Color palette
const PRIMARY_COLOR = '#0A6A7A';
const SECONDARY_COLOR = '#0A2F68';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const items = localStorage.getItem('wishlist');
    if (items) setWishlist(JSON.parse(items));
  };

  const removeItem = (id, name) => {
    const updated = wishlist.filter(p => p._id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setSnackbarMessage(`${name} removed from wishlist!`);
    setOpenSnackbar(true);
    
    // Dispatch event to update navbar badge
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const moveToCart = (product) => {
    addItem(product, () => {
      setSnackbarMessage(`${product.name} added to cart!`);
      setOpenSnackbar(true);
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Layout title="Wishlist" description="Your saved items">
      <Container sx={{ py: 5, minHeight: '70vh' }}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 1, 
              fontWeight: 700,
              color: SECONDARY_COLOR,
            }}
          >
            My Wishlist
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6B7280',
            }}
          >
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </Typography>
        </Box>

        {wishlist.length === 0 ? (
          <Paper 
            sx={{ 
              p: 8, 
              textAlign: 'center',
              borderRadius: '12px',
              border: '2px dashed #E5E8EB',
            }}
          >
            <FavoriteBorderIcon 
              sx={{ 
                fontSize: 100, 
                color: '#D1D5DB',
                mb: 2,
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1,
                fontWeight: 600,
                color: SECONDARY_COLOR,
              }}
            >
              Your wishlist is empty
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: '#6B7280',
              }}
            >
              Start adding products you love to your wishlist
            </Typography>
            <Button 
              component={Link} 
              to="/shop" 
              variant="contained"
              size="large"
              sx={{
                backgroundColor: PRIMARY_COLOR,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#085862',
                },
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: '12px',
              border: '2px solid #E5E8EB',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      color: '#6B7280',
                      letterSpacing: '0.5px',
                      py: 2,
                    }}
                  >
                    Product
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      color: '#6B7280',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Price
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      color: '#6B7280',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Stock Status
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      color: '#6B7280',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wishlist.map((product) => (
                  <TableRow 
                    key={product._id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#F8F9FA',
                      },
                      '&:last-child td': {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {/* Product Column */}
                    <TableCell sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 60,
                            height: 60,
                            flexShrink: 0,
                            backgroundColor: '#F8F9FA',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            border: '1px solid #E5E8EB',
                          }}
                        >
                          <ShowImage item={product} url="product" />
                        </Box>
                        <Box>
                          <Typography
                            component={Link}
                            to={`/product/${product._id}`}
                            sx={{ 
                              fontWeight: 500,
                              fontSize: '14px',
                              textDecoration: 'none',
                              color: SECONDARY_COLOR,
                              display: 'block',
                              '&:hover': {
                                color: PRIMARY_COLOR,
                              },
                            }}
                          >
                            {product.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Price Column */}
                    <TableCell align="center">
                      <Typography 
                        sx={{ 
                          color: SECONDARY_COLOR,
                          fontWeight: 600,
                          fontSize: '15px',
                        }}
                      >
                        Rs{product.price.toFixed(2)}
                      </Typography>
                    </TableCell>

                    {/* Stock Status Column */}
                    <TableCell align="center">
                      {product.quantity > 0 ? (
                        <Chip
                          label="IN STOCK"
                          size="small"
                          sx={{
                            backgroundColor: '#D1FAE5',
                            color: '#065F46',
                            fontWeight: 600,
                            fontSize: '11px',
                            height: '24px',
                          }}
                        />
                      ) : (
                        <Chip
                          label="OUT OF STOCK"
                          size="small"
                          sx={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            fontWeight: 600,
                            fontSize: '11px',
                            height: '24px',
                          }}
                        />
                      )}
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell align="center">
                      <Box 
                        sx={{ 
                          display: 'flex',
                          gap: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => moveToCart(product)}
                          disabled={product.quantity < 1}
                          sx={{
                            backgroundColor: SECONDARY_COLOR,
                            borderRadius: '6px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '13px',
                            px: 2.5,
                            py: 0.75,
                            minWidth: '110px',
                            '&:hover': {
                              backgroundColor: '#082050',
                            },
                            '&:disabled': {
                              backgroundColor: '#E5E8EB',
                              color: '#9CA3AF',
                            },
                          }}
                        >
                          Add to cart
                        </Button>

                        <IconButton 
                          onClick={() => removeItem(product._id, product.name)}
                          size="small"
                          sx={{
                            color: '#9CA3AF',
                            border: '1px solid #E5E8EB',
                            borderRadius: '6px',
                            width: 32,
                            height: 32,
                            '&:hover': {
                              backgroundColor: '#FEE2E2',
                              borderColor: '#FCA5A5',
                              color: '#DC2626',
                            },
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>

                        <IconButton 
                          component={Link}
                          to={`/product/${product._id}`}
                          size="small"
                          sx={{
                            color: '#9CA3AF',
                            border: '1px solid #E5E8EB',
                            borderRadius: '6px',
                            width: 32,
                            height: 32,
                            '&:hover': {
                              backgroundColor: '#E0F2FE',
                              borderColor: '#7DD3FC',
                              color: PRIMARY_COLOR,
                            },
                          }}
                        >
                          <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='success'
          sx={{ 
            borderRadius: '8px',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Wishlist;