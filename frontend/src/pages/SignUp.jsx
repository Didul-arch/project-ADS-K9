import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Languages, Phone } from 'lucide-react';
import ipbLogoWhite from '../assets/ipb-logo-white.png';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { signUp } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous error
    setErrorMsg('');

    // Password matching validation
    if (password !== confirmPassword) {
      setErrorMsg(t('passwordMismatch'));
      return;
    }

    if (signUp(name, email, password, phone)) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: 'white', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Language Switcher */}
      <button 
        onClick={toggleLanguage}
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          zIndex: 1001,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '10px 20px',
          borderRadius: '15px',
          color: 'white',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Languages size={18} />
        {language === 'en' ? 'EN' : 'ID'}
      </button>

      {/* Left Column: Form */}
      <div style={{ 
        flex: '0 0 45%', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '30px 50px', 
        justifyContent: 'center',
        height: '100%',
        overflowY: 'auto',
        minHeight: 0
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>{t('signUpGeneralTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.4' }}>{t('signUpGeneralDesc')}</p>
        </div>

        {/* Error Warning Block */}
        {errorMsg && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label style={{ fontSize: '14px' }}>{t('nameLabel')}<span style={{ color: '#4F46E5' }}>*</span></label>
            <input 
              type="text" 
              className="form-input" 
              placeholder={t('namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          {/* General Email */}
          <div className="form-group">
            <label style={{ fontSize: '14px' }}>{t('emailLabel')}<span style={{ color: '#4F46E5' }}>*</span></label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="budi@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {/* WhatsApp / Phone Number */}
          <div className="form-group">
            <label style={{ fontSize: '14px' }}>{t('phoneLabel')}<span style={{ color: '#4F46E5' }}>*</span></label>
            <input 
              type="tel" 
              className="form-input" 
              placeholder={t('phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label style={{ fontSize: '14px' }}>{t('passwordLabel')}<span style={{ color: '#4F46E5' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-input" 
                placeholder="Min. 8 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label style={{ fontSize: '14px' }}>{t('confirmPasswordLabel')}<span style={{ color: '#4F46E5' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                className="form-input" 
                placeholder={t('confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '12px' }}>
            {t('createAccount')}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {t('alreadyHaveAccount')} <Link to="/login" style={{ color: '#4F46E5', fontWeight: '700' }}>{t('signIn')}</Link>
        </p>
      </div>

      {/* Right Column: Visual */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        margin: '20px',
        borderRadius: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(30px)',
          borderRadius: '30px',
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: '80%',
          maxWidth: '420px',
          marginBottom: '30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
        }}>
          <img 
            src={ipbLogoWhite} 
            alt="IPB University" 
            style={{ 
              width: '100%', 
              maxHeight: '75px', 
              objectFit: 'contain',
              marginBottom: '20px'
            }} 
          />
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
            Lost & Found
          </h2>
        </div>
        <p style={{ marginTop: '10px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '400px', textAlign: 'center', fontSize: '15px', lineHeight: '1.6' }}>
          {t('joinCommunity')}
        </p>
      </div>
    </div>
  );
};

export default SignUp;
