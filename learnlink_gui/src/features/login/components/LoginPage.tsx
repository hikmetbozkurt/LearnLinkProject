import React, { useState, useEffect } from "react";
import "./signin_style.css";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from "../../../api/axiosConfig";

console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

const GOOGLE_CLIENT_ID = "69975858042-qg58t1vmhplr463opgmg4dca01jdaal4.apps.googleusercontent.com";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Toggle between sign-in and sign-up views
  const toggleView = () => {
    setIsSignUp(!isSignUp);
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.post('/api/auth/google', {
        credential: credentialResponse.credential
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was unsuccessful. Please try again.');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", {
        email: email,
        password: password,
      });
      if (response.data.success) {
        alert("Login successful");
        navigate("/dashboard");
      } else {
        alert(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {}
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // First check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await api.post("/api/auth/signup", {
        username: username, // This will be stored as 'name' in the database
        email: email,
        password: password
      });

      if (response.data.success) {
        alert("Account created successfully!");
        setIsSignUp(false); // Switch back to login view
        // Clear the form
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        alert(response.data.message || "Failed to create account. Please try again.");
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || "An error occurred during signup");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        // Handle successful login
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404 && data.error === 'EMAIL_NOT_FOUND') {
          // Just show the error message without switching to signup
          setError('Email is not registered. Please sign up.');
          // Pre-fill the signup form but don't switch automatically
          setUsername('');
          setEmail(email); // Keep the email they tried to login with
          setPassword('');
          setConfirmPassword('');
        } else if (status === 401 && data.error === 'INVALID_CREDENTIALS') {
          setError('Invalid email or password');
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={`container ${isSignUp ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form id="signUpForm" onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="input-group">
              <PersonIcon className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <EmailIcon className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <PasswordIcon className="input-icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`fa-solid ${
                  passwordVisible ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={togglePasswordVisibility}
                id="togglePassword"
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <div className="input-group">
              <PasswordIcon className="input-icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            
            {error && (
              <div className="error-message" style={{ 
                color: '#ff3333',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <div className="social-icons">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                useOneTap={false}
                ux_mode="popup"
              />
            </div>

            <div className="divider">
              <span>or use your email and password</span>
            </div>

            <div className="input-group">
              <EmailIcon className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(''); // Clear error when user starts typing
                }}
                required
              />
            </div>
            <div className="input-group">
              <PasswordIcon className="input-icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`fa-solid ${
                  passwordVisible ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={togglePasswordVisibility}
                id="togglePassword"
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <div className="forgot">
              <span onClick={handleForgotPasswordClick} className="forgot-link">
                Forget Your Password?
              </span>
            </div>
            <button type="submit">SIGN IN</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back to LearnLink!</h1>
              <p>Enter your personal details to sign in.</p>
              <button className="hidden" onClick={toggleView}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Start Learning with LearnLink !</h1>
              <p>
                Register now and become part of our growing learning community.
              </p>
              <button className="hidden" onClick={toggleView}>
                Join LearnLink
              </button>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
