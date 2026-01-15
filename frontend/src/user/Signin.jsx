import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Layout from '../core/Layout.jsx';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
import Copyright from '../core/Copyright.jsx';
import { signin, authenticate, isAuthenticated } from '../auth/index.js';
import { Player } from '@lottiefiles/react-lottie-player';
import loginAnimation from '../assets/login_animation.json';
import { useRef, useEffect } from 'react';

// Animation Frame Constants (Placeholder - Adjust these to match your file)
const FRAME_IDLE_START = 0;
const FRAME_IDLE_END = 30; // IDLE loop
const FRAME_TRACK_START = 31; // Start of tracking head movement
const FRAME_TRACK_END = 90; // End of tracking head movement (full range)
const FRAME_COVER_START = 95; // Hands moving to cover eyes
const FRAME_COVER_END = 120; // Hands covering eyes (loop or hold)
const FRAME_UNCOVER_START = 120;
const FRAME_UNCOVER_END = 145; // Hands moving away

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '500px',
    height: '500px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    top: '-200px',
    left: '-200px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    bottom: '-100px',
    right: '-100px',
  },
}));

const IllustrationBox = styled(Box)({
  maxWidth: '500px',
  width: '100%',
  position: 'relative',
  zIndex: 1,
  '& img': {
    width: '100%',
    height: 'auto',
    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
  },
});

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FormCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '450px',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: '#667eea',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6c757d',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '14px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  backgroundColor: '#0A2F68',
  color: '#ffffff',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#07214a',
    boxShadow: 'none',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  },
}));

const StyledLink = styled(Link)({
  color: '#667eea',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#764ba2',
    textDecoration: 'underline',
  },
});

const DividerText = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: '1px solid #dee2e6',
  },
  '&::before': {
    marginRight: theme.spacing(2),
  },
  '&::after': {
    marginLeft: theme.spacing(2),
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 500,
  border: '1px solid #ced4da',
  color: '#212529',
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#adb5bd',
    boxShadow: 'none',
  },
}));

export default function Signin() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    success: false,
    loading: false,
    redirectToReferrer: false,
    rememberMe: false,
    showPassword: false,
    open: false,
  });

  // Animation State
  const lottieRef = useRef(null);
  const [emailLength, setEmailLength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Animation Control Logic
  useEffect(() => {
    // Access the internal Lottie instance
    // Note: @lottiefiles/react-lottie-player exposes the instance differently in some versions.
    // We try to access it safely.
    const player = lottieRef.current;
    if (!player) return;

    // In some versions, playSegments is directly on the ref. In others, it's on state.instance
    // We'll check both or just use the instance if available.
    // Safe lookup:
    const animator = player.state?.instance || player;

    if (!animator || typeof animator.playSegments !== 'function') {
      // Fallback or debug
      // console.log("Lottie instance not ready or method missing", player);
      return;
    }

    if (isPasswordFocused) {
      // 1. Password Focused: Cover Eyes
      animator.playSegments([FRAME_COVER_START, FRAME_COVER_END], true);
    } else {
      // 2. Password Unfocused: Check Email tracking
      if (emailLength > 0 && emailLength < 30) {
        // Map email length to tracking frames
        // Simple mapping: 1 char = 2 frames (adjust tracking speed)
        // Ensure we stay within tracking range
        const targetFrame = Math.min(
          FRAME_TRACK_START + emailLength * 2,
          FRAME_TRACK_END
        );
        // animator.setPlayerSpeed(1); // Might not be needed or exposed same way
        animator.playSegments(
          [targetFrame - 5, targetFrame],
          true
        );
      } else if (emailLength === 0) {
        // Back to Idle
        animator.playSegments([FRAME_IDLE_START, FRAME_IDLE_END], true);
      }
    }
  }, [isPasswordFocused, emailLength]);

  const {
    email,
    password,
    loading,
    error,
    success,
    redirectToReferrer,
    rememberMe,
    showPassword,
    open,
  } = values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    const value =
      name === 'rememberMe' ? event.target.checked : event.target.value;

    // Update length for animation tracking
    if (name === 'email') {
      setEmailLength(value.length);
    }

    setValues({ ...values, error: '', [name]: value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !showPassword });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    signin({ email, password, rememberMe }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false, open: true });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            success: true,
            open: true,
            loading: false,
          });
          // Delay redirect to show toast
          setTimeout(() => {
            setValues((prev) => ({
              ...prev,
              redirectToReferrer: true,
            }));
          }, 1500);
        });
      }
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setValues({ ...values, open: false });
  };

  const showSuccess = () => (
    <Snackbar
      open={open && success}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity='success' sx={{ width: '100%', borderRadius: '12px' }}>
        Login successful! Redirecting...
      </Alert>
    </Snackbar>
  );

  const showError = () => (
    <Snackbar
      open={open && !!error}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity='error' sx={{ width: '100%', borderRadius: '12px' }}>
        {error}
      </Alert>
    </Snackbar>
  );

  const showLoading = () =>
    loading && (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Navigate to='/admin/dashboard' />;
      } else {
        return <Navigate to='/user/dashboard' />;
      }
    }
    if (isAuthenticated()) {
      return <Navigate to='/' />;
    }
  };

  return (
    <>
      <CssBaseline />
      <PageWrapper>
        {redirectUser()}

        {/* Left Panel with Illustration */}
        <LeftPanel>
          <IllustrationBox>
            <Player
              ref={lottieRef}
              autoplay
              loop
              src={loginAnimation}
              style={{ height: '100%', width: '100%' }}
            />
          </IllustrationBox>
        </LeftPanel>

        {/* Right Panel with Form */}
        <RightPanel>
          <FormCard>
            {showSuccess()}
            {showError()}
            {showLoading()}

            <Typography
              component='h1'
              variant='h4'
              sx={{
                fontWeight: 700,
                color: '#212529',
                mb: 1,
              }}
            >
              Log in
            </Typography>

            <Typography
              variant='body2'
              sx={{
                color: '#6c757d',
                mb: 4,
              }}
            >
              Welcome back! Please enter your details.
            </Typography>

            <Box component='form' onSubmit={clickSubmit} noValidate>
              <StyledTextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email address or user name'
                name='email'
                autoComplete='email'
                onChange={handleChange('email')}
                type='email'
                value={email}
                autoFocus
              />

              <StyledTextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                id='password'
                onChange={handleChange('password')}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                value={password}
                autoComplete='current-password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={handleChange('rememberMe')}
                      sx={{
                        color: '#667eea',
                        '&.Mui-checked': {
                          color: '#667eea',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant='body2' sx={{ color: '#495057' }}>
                      Remember me
                    </Typography>
                  }
                />
              </Box>

              <StyledButton
                type='submit'
                fullWidth
                variant='contained'
                disabled={loading}
              >
                Login
              </StyledButton>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <StyledLink to='/forgot-password'>
                  Forgot your password?
                </StyledLink>
              </Box>

              <DividerText>
                <Typography
                  variant='body2'
                  sx={{ color: '#6c757d', fontSize: '14px' }}
                >
                  Or continue with
                </Typography>
              </DividerText>

              <GoogleButton fullWidth startIcon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.879 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4" />
                  <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853" />
                  <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05" />
                  <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33718L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335" />
                </svg>
              }>
                Google
              </GoogleButton>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant='body2' sx={{ color: '#6c757d' }}>
                  Don't have an account?{' '}
                  <StyledLink to='/signup'>Sign up</StyledLink>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography
                  variant='caption'
                  sx={{ color: '#adb5bd', fontSize: '12px' }}
                >
                  By continuing, you agree to the{' '}
                  <StyledLink to='/terms' style={{ fontSize: '12px' }}>
                    Terms of use
                  </StyledLink>{' '}
                  and{' '}
                  <StyledLink to='/privacy' style={{ fontSize: '12px' }}>
                    Privacy Policy
                  </StyledLink>
                </Typography>
              </Box>
            </Box>

            <Box mt={4}>
              <Copyright />
            </Box>
          </FormCard>
        </RightPanel>
      </PageWrapper>
    </>
  );
}