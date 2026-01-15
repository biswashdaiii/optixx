import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import { signin, signup, authenticate, isAuthenticated } from '../auth/index.js';
import loginAnimation from '../assets/login_animation.json';
import signupAnimation from '../assets/signup_animation.json';
import './AuthPage.css';

// MUI Icons
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Snackbar, Alert } from '@mui/material';

// Animation Constants for Yeti
const FRAME_IDLE_START = 0;
const FRAME_IDLE_END = 30;
const FRAME_TRACK_START = 31;
const FRAME_TRACK_END = 90;
const FRAME_COVER_START = 95;
const FRAME_COVER_END = 120;

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mode State: false = Sign In, true = Sign Up
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    // Initial Mode Check based on URL
    useEffect(() => {
        if (location.pathname === '/signup') {
            setIsSignUpMode(true);
        } else {
            setIsSignUpMode(false);
        }
    }, [location.pathname]);

    const toggleMode = () => {
        setIsSignUpMode(!isSignUpMode);
        // Optional: Update URL without full reload
        window.history.pushState(null, '', !isSignUpMode ? '/signup' : '/signin');
    };

    // --- SHARED STATE ---
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false, // For Signup success
        loading: false,
        redirectToReferrer: false,
        rememberMe: false, // For Signin
    });

    const { name, email, password, error, success, loading, redirectToReferrer, rememberMe } = values;
    const { user } = isAuthenticated();

    // --- ANIMATION REFS ---
    const loginLottieRef = useRef(null);
    const [loginEmailLength, setLoginEmailLength] = useState(0);
    const [isLoginPasswordFocused, setIsLoginPasswordFocused] = useState(false);

    // --- HANDLERS ---
    const handleChange = name => event => {
        const val = name === 'rememberMe' ? event.target.checked : event.target.value;

        if (name === 'email' && !isSignUpMode) {
            setLoginEmailLength(val.length);
        }

        setValues({ ...values, error: '', [name]: val });
    };

    // --- SUBMIT HANDLERS ---

    const handleSigninSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, error: '', loading: true });
        signin({ email, password, rememberMe }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                authenticate(data, () => {
                    setValues({ ...values, redirectToReferrer: true, loading: false });
                });
            }
        });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, error: '', loading: true });
        signup({ name, email, password }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: true,
                    loading: false
                });
            }
        });
    };

    // --- REDIRECT LOGIC ---
    const performRedirect = () => {
        if (redirectToReferrer) {
            if (user && user.role === 1) {
                return <Navigate to="/admin/dashboard" />;
            } else {
                return <Navigate to="/" />;
            }
        }
        if (isAuthenticated()) {
            return <Navigate to="/" />;
        }
    };
    // --- LOTTIE LOGIC (Signin) ---
    useEffect(() => {
        const player = loginLottieRef.current;
        if (!player || isSignUpMode) return;

        const animator = player.state?.instance || player;
        if (!animator || typeof animator.playSegments !== 'function') return;

        if (isLoginPasswordFocused) {
            animator.playSegments([FRAME_COVER_START, FRAME_COVER_END], true);
        } else {
            if (loginEmailLength > 0 && loginEmailLength < 30) {
                const targetFrame = Math.min(FRAME_TRACK_START + loginEmailLength * 2, FRAME_TRACK_END);
                animator.playSegments([targetFrame - 5, targetFrame], true);
            } else if (loginEmailLength === 0) {
                animator.playSegments([FRAME_IDLE_START, FRAME_IDLE_END], true);
            }
        }
    }, [isLoginPasswordFocused, loginEmailLength, isSignUpMode]);

    // --- TOASTS ---
    const [openSnack, setOpenSnack] = useState(false);
    useEffect(() => {
        if (error || success) setOpenSnack(true);
    }, [error, success]);

    return (
        <div className="auth-page-wrapper">
            {performRedirect()}
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={() => setOpenSnack(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={error ? "error" : "success"} onClose={() => setOpenSnack(false)}>
                    {error ? error : "Account created successfully! Please sign in."}
                </Alert>
            </Snackbar>

            <div className={`auth-container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
                <div className="auth-forms-container">
                    <div className="signin-signup">

                        {/* SIGN IN FORM */}
                        <form action="#" className="auth-form sign-in-form" onSubmit={handleSigninSubmit}>
                            <h2 className="auth-title">Sign in</h2>
                            <div className="auth-input-field">
                                <i><PersonIcon /></i>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange('email')}
                                />
                            </div>
                            <div className="auth-input-field">
                                <i><LockIcon /></i>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange('password')}
                                    onFocus={() => setIsLoginPasswordFocused(true)}
                                    onBlur={() => setIsLoginPasswordFocused(false)}
                                />
                            </div>
                            <button type="submit" className="auth-btn">
                                {loading ? 'Loading...' : 'Sign In'}
                            </button>

                            <p className="social-text">Or continue with</p>
                            <div className="social-media">
                                <a href="#" className="social-icon"><GoogleIcon /></a>

                            </div>
                        </form>

                        {/* SIGN UP FORM */}
                        <form action="#" className="auth-form sign-up-form" onSubmit={handleSignupSubmit}>
                            <h2 className="auth-title">Sign up</h2>
                            <div className="auth-input-field">
                                <i><PersonIcon /></i>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    name="name"
                                    value={name}
                                    onChange={handleChange('name')}
                                />
                            </div>
                            <div className="auth-input-field">
                                <i><EmailIcon /></i>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange('email')}
                                />
                            </div>
                            <div className="auth-input-field">
                                <i><LockIcon /></i>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange('password')}
                                />
                            </div>

                            <button type="submit" className="auth-btn">
                                {loading ? 'Creating...' : 'Sign Up'}
                            </button>

                            <p className="social-text">Or sign up with</p>
                            <div className="social-media">
                                <a href="#" className="social-icon"><GoogleIcon /></a>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content">
                            <h3>New here?</h3>
                            <p>
                                Join Optix today and experience the future of eyewear with our Virtual Try-On!
                            </p>
                            <button className="btn transparent" onClick={toggleMode}>
                                Sign up
                            </button>
                        </div>
                        {/* Lottie Animation for Left Panel */}
                        <div className="image">
                            <Player
                                ref={loginLottieRef}
                                autoplay
                                loop
                                src={loginAnimation}
                                style={{ height: '300px', width: '300px' }}
                            />
                        </div>
                    </div>
                    <div className="panel right-panel">
                        <div className="content">
                            <h3>One of us?</h3>
                            <p>
                                Welcome back! Sign in to access your saved styles and history.
                            </p>
                            <button className="btn transparent" onClick={toggleMode}>
                                Sign in
                            </button>
                        </div>
                        {/* Lottie Animation for Right Panel */}
                        <div className="image">
                            <Player
                                autoplay
                                loop
                                src={signupAnimation}
                                style={{ height: '300px', width: '300px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
