import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Languages } from 'lucide-react';
import ipbLogoWhite from '../assets/ipb-logo-white.png';

const Login = () => {
  // Prefill with Luqman's credentials by default for perfect developer experience
  const [email, setEmail] = useState('luqman@apps.ipb.ac.id');
  const [password, setPassword] = useState('luqman123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(t('invalidCredentials'));
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
        padding: '40px 60px', 
        justifyContent: 'center',
        height: '100%',
        overflowY: 'auto',
        minHeight: 0
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>{t('signIn')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{t('signInDesc')}</p>
        </div>

        {/* Beautiful Warning Alert Block on Failed Authentication */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#EF4444',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ fontSize: '14px' }}>{t('emailLabel')}<span style={{ color: '#4F46E5' }}>*</span></label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="mail@apps.ipb.ac.id" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} />
              {t('keepLoggedIn')}
            </label>
            <a href="#" style={{ fontSize: '14px', color: '#4F46E5', fontWeight: '600' }}>{t('forgetPassword')}</a>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
            {t('signIn')}
          </button>

          <button 
            type="button"
            onClick={() => navigate('/')} 
            style={{ 
              width: '100%', 
              padding: '16px', 
              fontSize: '16px', 
              marginTop: '12px',
              borderRadius: '16px',
              border: '1.5px solid #4F46E5',
              backgroundColor: 'transparent',
              color: '#4F46E5',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {t('browseAsGuest')}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {t('notRegistered')} <Link to="/signup" style={{ color: '#4F46E5', fontWeight: '700' }}>{t('createAccount')}</Link>
        </p>

        {/* Discreet Dev Tools Autofill */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Dev Autofills: 
          <button type="button" onClick={() => { setEmail('luqman@apps.ipb.ac.id'); setPassword('luqman123'); }} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', margin: '0 6px', fontWeight: 600, textDecoration: 'underline' }}>Luqman (Student)</button> |
          <button type="button" onClick={() => { setEmail('syafiq@apps.ipb.ac.id'); setPassword('syafiq123'); }} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', margin: '0 6px', fontWeight: 600, textDecoration: 'underline' }}>Syafiq (Admin)</button>
        </div>
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
          {t('authTagline')}
        </p>
      </div>
    </div>
  );
};

export default Login;
