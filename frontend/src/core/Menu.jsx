import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { itemTotal } from './cartHelpers';
import { getWishlistTotal } from './wishlisthelper';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  Person,
  Menu as MenuIcon,
  LocalShipping,
  ExitToApp,
  Dashboard,
  FavoriteBorder,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Color palette
const PRIMARY_COLOR = '#0A6A7A';
const SECONDARY_COLOR = '#0A2F68';

// Styled Components
const TopBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#F8F9FA',
  borderBottom: '1px solid #E5E8EB',
  padding: '8px 0',
}));

const MainAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: PRIMARY_COLOR,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '6px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&.active': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    fontWeight: 600,
  },
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const DropdownMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: '8px',
    minWidth: '180px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
}));

const MaterialAppBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  const [productsAnchorEl, setProductsAnchorEl] = React.useState(null);
  const [wishlistCount, setWishlistCount] = React.useState(0);
  const currentPath = window.location.pathname;

  const isMobileMenuOpen = Boolean(mobileAnchorEl);
  const isProductsMenuOpen = Boolean(productsAnchorEl);

  // Update wishlist count on mount and when storage changes
  React.useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getWishlistTotal());
    };

    updateWishlistCount();

    // Listen for storage changes
    window.addEventListener('storage', updateWishlistCount);
    // Custom event for wishlist updates in same window
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, []);

  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleProductsMenuOpen = (event) => {
    setProductsAnchorEl(event.currentTarget);
  };

  const handleProductsMenuClose = () => {
    setProductsAnchorEl(null);
  };

  const handleSignout = () => {
    signout(() => {
      navigate('/');
    });
    handleMobileMenuClose();
  };

  const isActive = (path) => currentPath === path;

  const renderDesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <NavButton
        component={Link}
        to='/'
        className={isActive('/') ? 'active' : ''}
      >
        Home
      </NavButton>

      {/* Products Dropdown */}
      <NavButton
        onClick={handleProductsMenuOpen}
        endIcon={<KeyboardArrowDown />}
        className={isActive('/shop') ? 'active' : ''}
        sx={{
          backgroundColor: isProductsMenuOpen ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
        }}
      >
        Products
      </NavButton>
      <DropdownMenu
        anchorEl={productsAnchorEl}
        open={isProductsMenuOpen}
        onClose={handleProductsMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          component={Link}
          to='/shop?gender=Men'
          onClick={handleProductsMenuClose}
          sx={{
            py: 1.5,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(10, 106, 122, 0.08)',
            },
          }}
        >
          Men
        </MenuItem>
        <MenuItem
          component={Link}
          to='/shop?gender=Women'
          onClick={handleProductsMenuClose}
          sx={{
            py: 1.5,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(10, 106, 122, 0.08)',
            },
          }}
        >
          Women
        </MenuItem>
      </DropdownMenu>
    </Box>
  );

  const renderMobileMenu = () => (
    <Menu
      anchorEl={mobileAnchorEl}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          width: 250,
          mt: 1,
        },
      }}
    >
      <MenuItem
        component={Link}
        to='/'
        onClick={handleMobileMenuClose}
        sx={{
          backgroundColor: isActive('/') ? 'rgba(10, 106, 122, 0.1)' : 'transparent',
          fontWeight: isActive('/') ? 600 : 400,
          '&:hover': {
            backgroundColor: 'rgba(10, 106, 122, 0.05)',
          },
        }}
      >
        <ListItemText primary='Home' />
      </MenuItem>

      <MenuItem
        component={Link}
        to='/shop?gender=Men'
        onClick={handleMobileMenuClose}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(10, 106, 122, 0.05)',
          },
        }}
      >
        <ListItemText primary='Men' />
      </MenuItem>

      <MenuItem
        component={Link}
        to='/shop?gender=Women'
        onClick={handleMobileMenuClose}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(10, 106, 122, 0.05)',
          },
        }}
      >
        <ListItemText primary='Women' />
      </MenuItem>

      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <MenuItem
          component={Link}
          to='/user/dashboard'
          onClick={handleMobileMenuClose}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </MenuItem>
      )}
      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <MenuItem
          component={Link}
          to='/admin/dashboard'
          onClick={handleMobileMenuClose}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary='Admin Dashboard' />
        </MenuItem>
      )}
      {isAuthenticated() ? (
        <MenuItem onClick={handleSignout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary='Sign Out' />
        </MenuItem>
      ) : (
        <>
          <MenuItem component={Link} to='/signin' onClick={handleMobileMenuClose}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary='Sign In' />
          </MenuItem>
          <MenuItem component={Link} to='/signup' onClick={handleMobileMenuClose}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary='Sign Up' />
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <>
      {/* Top Announcement Bar */}
      <TopBar>
        <Box
          sx={{
            maxWidth: '1400px',
            margin: '0 auto',
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping sx={{ fontSize: '18px', color: PRIMARY_COLOR }} />
            <Typography
              variant='body2'
              sx={{
                fontSize: '13px',
                color: '#4B5563',
                fontWeight: 500,
              }}
            >
              Free Shipping and Free Return
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography
              variant='body2'
              sx={{
                fontSize: '13px',
                color: '#4B5563',
                fontWeight: 500,
              }}
            >
              +977 9800000000
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontSize: '13px',
                color: '#4B5563',
                fontWeight: 500,
              }}
            >
              optix@gmail.com
            </Typography>
          </Box>
        </Box>
      </TopBar>

      {/* Main Navigation Bar */}
      <MainAppBar position='sticky' elevation={0}>
        <Toolbar
          sx={{
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            px: { xs: 2, md: 3 },
            py: 1,
          }}
        >
          {/* Logo */}
          <Typography
            variant='h5'
            component={Link}
            to='/'
            sx={{
              fontWeight: 700,
              textDecoration: 'none',
              color: 'white',
              fontSize: '28px',
              letterSpacing: '0.5px',
              mr: 'auto',
            }}
          >
            Optix
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
              {renderDesktopNav()}
            </Box>
          )}

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButtonStyled
              component={Link}
              to='/shop'
              aria-label='search'
            >
              <Search />
            </IconButtonStyled>

            <IconButtonStyled
              component={Link}
              to='/wishlist'
              aria-label='wishlist'
            >
              <Badge badgeContent={wishlistCount} color='error'>
                <FavoriteBorder />
              </Badge>
            </IconButtonStyled>

            <IconButtonStyled
              component={Link}
              to='/cart'
              aria-label='shopping cart'
            >
              <Badge badgeContent={itemTotal()} color='error'>
                <ShoppingCart />
              </Badge>
            </IconButtonStyled>

            {!isMobile && (
              <>
                {isAuthenticated() ? (
                  <>
                    <IconButtonStyled
                      component={Link}
                      to={
                        isAuthenticated().user.role === 1
                          ? '/admin/dashboard'
                          : '/user/dashboard'
                      }
                      aria-label='dashboard'
                    >
                      <Dashboard />
                    </IconButtonStyled>
                    <IconButtonStyled onClick={handleSignout} aria-label='sign out'>
                      <ExitToApp />
                    </IconButtonStyled>
                  </>
                ) : (
                  <IconButtonStyled
                    component={Link}
                    to='/signin'
                    aria-label='account'
                  >
                    <Person />
                  </IconButtonStyled>
                )}
              </>
            )}

            {isMobile && (
              <IconButtonStyled
                aria-label='open menu'
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButtonStyled>
            )}
          </Box>
        </Toolbar>
      </MainAppBar>

      {isMobile && renderMobileMenu()}
    </>
  );
};

export default MaterialAppBar;