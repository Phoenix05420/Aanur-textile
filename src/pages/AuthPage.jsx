import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api.js';
import { authStorage, isAdminUser } from '../utils/storage.js';
import { Icon } from '../components/common/Icon.jsx';

export function AuthPage({
  signup,
  setToast,
  navigate,
  redirect = '/profile',
  currentUser,
  setCurrentUser,
  notice = '',
}) {
  const [isSignUp, setIsSignUp] = useState(signup);
  const [otpStep, setOtpStep] = useState(1); // 1: Enter email, 2: Enter 6-digit code
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsSignUp(signup);
    setErrorMsg('');
    setOtpStep(1);
    setOtpCode('');
  }, [signup]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer = null;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [otpCountdown]);

  // Handle Send 6-Digit OTP to Gmail
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (isSignUp && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/auth/send-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: fullName.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setOtpStep(2);
        setOtpCountdown(60);
        if (setToast) setToast(`Verification code sent to ${email.trim()}`);
      } else {
        setErrorMsg(data.error || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error sending verification code. Please check your connection.');
    }
  };

  // Handle Verify 6-Digit OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otpCode.trim(),
          name: fullName.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        const user = data.user;
        if (data.token) {
          authStorage.setToken(data.token);
          user.token = data.token;
        }
        authStorage.setUser(user);

        try {
          const raw = localStorage.getItem('aanur_registered_users');
          const users = raw ? JSON.parse(raw) : [];
          if (!users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
            localStorage.setItem('aanur_registered_users', JSON.stringify([...users, user]));
          }
        } catch {}

        if (setCurrentUser) setCurrentUser(user);
        setIsSuccess(true);

        const isAdmin = isAdminUser(user) || Boolean(data.isAdmin);

        if (setToast) {
          setToast(
            isAdmin
              ? 'Admin verified! Entering Artisan Control Center...'
              : `Welcome, ${user.name}!`
          );
        }

        const targetDestination = data.redirect || (isAdmin ? '/admin' : (redirect || '/profile'));

        setTimeout(() => {
          navigate(targetDestination);
        }, 800);
      } else {
        setErrorMsg(data.error || 'Invalid verification code. Please check your email and try again.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error verifying code. Please try again.');
    }
  };

  return (
    <div className="auth-page page-pad">
      <div className="auth-image">
        <img src="/products/olive-check-bed-set.jpg" alt="Olive and rust patterned bedding" />
        <div>
          <span>AANUR TEXTILE</span>
          <h2>
            A softer home
            <br />
            starts here.
          </h2>
        </div>
      </div>

      <div className="auth-form-card">
        {isSuccess ? (
          <div className="auth-form auth-done-view">
            <div className="auth-done-icon">
              <Icon name="check" size={32} />
            </div>
            <span className="eyebrow">SUCCESS</span>
            <h1>{isSignUp ? 'Account Created!' : 'Signed In Successfully!'}</h1>
            <p>Taking you directly to your personal account profile...</p>
          </div>
        ) : (
          <div className="auth-form">
            <span className="eyebrow">{isSignUp ? 'NEW ARTISAN MEMBER' : 'AANUR TEXTILE SIGN IN'}</span>
            <h1>{isSignUp ? 'Create your account.' : 'Welcome back.'}</h1>
            <p>
              {isSignUp
                ? 'Sign up with your email to receive a secure one-time verification code.'
                : 'Enter your email to receive a secure 6-digit one-time verification code.'}
            </p>

            {notice && !currentUser && (
              <div className="auth-gate-notice">
                <Icon name="lock" size={15} />
                <span>{notice}</span>
              </div>
            )}

            {currentUser && (
              <div
                className="auth-already-logged"
                style={{
                  background: 'rgba(183, 107, 82, 0.08)',
                  border: '1px solid rgba(183, 107, 82, 0.25)',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  marginBottom: '1.25rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <span>
                  Signed in as <strong>{currentUser.name}</strong>
                </span>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontWeight: 600,
                    color: 'var(--clay, #b76b52)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => navigate('/profile')}
                >
                  Go to Profile &rarr;
                </button>
              </div>
            )}

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            {otpStep === 1 ? (
              <form onSubmit={handleSendOtp}>
                {isSignUp && (
                  <>
                    <label>
                      Full name
                      <input
                        required
                        autoComplete="name"
                        placeholder="e.g. Priya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </label>

                    <label>
                      Mobile number <span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>(Optional)</span>
                      <div className="auth-phone-wrap">
                        <span className="auth-country-prefix">+91</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                        />
                      </div>
                    </label>
                  </>
                )}

                <label>
                  Gmail / Email Address
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <button type="submit" className="button button-dark full-width" disabled={loading}>
                  <span>{loading ? 'Sending Verification Code...' : 'Send 6-Digit OTP to Gmail'}</span>
                  <Icon name="arrow" size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="auth-otp-badge">
                  <span>
                    Code sent to <strong>{email}</strong>
                  </span>
                  <button
                    type="button"
                    className="auth-change-email-btn"
                    onClick={() => {
                      setOtpStep(1);
                      setErrorMsg('');
                      setOtpCode('');
                    }}
                  >
                    Change
                  </button>
                </div>

                <label>
                  Enter 6-Digit Verification Code
                  <input
                    type="text"
                    required
                    autoFocus
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    className="auth-otp-input"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                  />
                </label>

                <button
                  type="submit"
                  className="button button-dark full-width"
                  disabled={loading || otpCode.length !== 6}
                >
                  <span>{loading ? 'Verifying...' : 'Verify & Enter Account'}</span>
                  <Icon name="arrow" size={16} />
                </button>

                <div className="auth-resend-row">
                  {otpCountdown > 0 ? (
                    <span className="auth-countdown">Resend code in {otpCountdown}s</span>
                  ) : (
                    <button type="button" className="auth-resend-btn" onClick={handleSendOtp} disabled={loading}>
                      Resend OTP Code
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="auth-change">
              {isSignUp ? 'Already have an account?' : 'New to Aanur Textile?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setOtpStep(1);
                  setOtpCode('');
                  setIsSignUp(!isSignUp);
                  navigate(!isSignUp ? '/signup' : '/login');
                }}
              >
                {isSignUp ? 'Sign in with Gmail' : 'Create an account'}
              </button>
            </div>

            <small>
              By continuing, you agree to our{' '}
              <a
                href="/faq"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/faq');
                }}
              >
                Terms & Privacy.
              </a>
            </small>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px dashed #e5e1d8',
                textAlign: 'center',
              }}
            >
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8B1E0F',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onClick={() => navigate('/admin')}
              >
                <Icon name="shield" size={12} />
                <span>Store Administrator Portal &rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
