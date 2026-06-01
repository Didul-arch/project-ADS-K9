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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [identityDocumentFile, setIdentityDocumentFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { signUp } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const emailLower = email.trim().toLowerCase();
  const isCivitas = emailLower.endsWith('@apps.ipb.ac.id') || emailLower.endsWith('@ipb.ac.id');
  const identityFieldLabel = language === 'en'
    ? isCivitas
      ? 'Identity (NIM / NIP / KTM / document)'
      : 'Identity (NIK / SIM / passport / document)'
    : isCivitas
      ? 'Identitas (NIM / NIP / KTM / dokumen)'
      : 'Identitas (NIK / SIM / paspor / dokumen)';
  const identityFieldPlaceholder = isCivitas ? 'NIM / NIP / KTM / ID Number' : 'NIK / SIM / Passport Number';
  const identityFieldHint = language === 'en'
    ? isCivitas
      ? 'IPB civitas can use NIM, NIP, KTM, or upload an identity document.'
      : 'General users can use NIK, SIM, passport, or upload an official identity document.'
    : isCivitas
      ? 'Civitas IPB bisa pakai NIM, NIP, KTM, atau unggah dokumen identitas.'
      : 'Pengguna umum bisa pakai NIK, SIM, paspor, atau unggah dokumen identitas resmi.';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg(t('passwordMismatch'));
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMsg(language === 'en' ? 'Phone number is required.' : 'Nomor telepon wajib diisi.');
      return;
    }

    const idNum = (identityNumber || '').toString().trim();
    const idDoc = identityDocumentFile;
    if (!idNum && !idDoc) {
      setErrorMsg(
        language === 'en'
          ? isCivitas
            ? 'Please provide either NIM/NIP/KTM or upload an identity document.'
            : 'Please provide either your identity number or upload an official identity document.'
          : isCivitas
            ? 'Silakan isi NIM/NIP/KTM atau unggah dokumen identitas.'
            : 'Silakan isi nomor identitas atau unggah dokumen identitas resmi.'
      );
      return;
    }

    const success = await signUp(
      name,
      email,
      password,
      phoneNumber,
      identityNumber || null,
      identityDocumentFile || null,
    );
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(
        language === 'en'
          ? 'Registration failed. Email might already be taken.'
          : 'Pendaftaran gagal. Email mungkin sudah terdaftar.'
      );
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
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', color: 'var(--ipb-blue)' }}>
            {isCivitas
              ? language === 'en'
                ? 'Register IPB Civitas'
                : 'Daftar Akun Civitas IPB'
              : language === 'en'
                ? 'Register General Account'
                : 'Daftar Akun Umum'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.4' }}>
            {isCivitas
              ? language === 'en'
                ? 'Exclusively for IPB University students and staff to manage lost and found items.'
                : 'Khusus untuk mahasiswa dan staf IPB University untuk mengelola penemuan barang.'
              : language === 'en'
                ? 'General users can also register, as long as they provide an identity number or official identity document.'
                : 'Pengguna umum juga bisa mendaftar, asalkan menyertakan nomor identitas atau dokumen identitas resmi.'}
          </p>
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
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label style={{ fontSize: '14px' }}>{t('phoneLabel')}<span style={{ color: '#4F46E5' }}>*</span></label>
            <input
              type="tel"
              className="form-input"
              placeholder={t('phonePlaceholder')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          {/* Identity (either number OR upload) */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '14px' }}>{identityFieldLabel}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="text"
                className="form-input"
                placeholder={identityFieldPlaceholder}
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                style={{ flex: 1 }}
              />

              <div style={{ width: '36px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '700' }}>or</div>

              <input
                type="file"
                accept="image/*,application/pdf"
                className="form-input"
                onChange={(e) => setIdentityDocumentFile(e.target.files && e.target.files[0])}
                style={{ flex: 1 }}
              />
            </div>
            <small style={{ color: 'var(--text-secondary)' }}>{identityFieldHint}</small>
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
