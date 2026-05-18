import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { items } from '../data/mockData';
import { MapPin, Calendar, Tag, User, ArrowLeft, MessageCircle, ShieldCheck, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Detail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const localReported = JSON.parse(localStorage.getItem('reported_items') || '[]');
  const allItems = [...items, ...localReported];
  const item = allItems.find(i => i.id == id);
  
  const [showContactModal, setShowContactModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Guest claim form states
  const [guestName, setGuestName] = useState('');
  const [guestNIK, setGuestNIK] = useState('');
  const [guestAge, setGuestAge] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestKTPFile, setGuestKTPFile] = useState(null);

  if (!item) return <div>Item not found</div>;

  const handleCopy = () => {
    const contact = item.contactInfo || item.reporterPhone || item.reporterEmail || 'No contact info';
    navigator.clipboard.writeText(contact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    setClaimSubmitted(true);
  };

  const getContactLink = (info) => {
    if (!info) return '#';
    const lower = info.toLowerCase();
    
    if (lower.includes('wa:')) {
      const num = info.split(':')[1].trim().replace(/^0/, '62');
      return `https://wa.me/${num}`;
    }
    if (lower.includes('ig:')) {
      const handle = info.split(':')[1].trim().replace('@', '');
      return `https://instagram.com/${handle}`;
    }
    if (lower.includes('email:')) {
      const email = info.split(':')[1].trim();
      return `mailto:${email}`;
    }
    return '#';
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'lost': return 'badge-lost';
      case 'found': return 'badge-found';
      case 'returned': return 'badge-returned';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar title={t('itemDetails')} />

      <Link to="/browse" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', width: 'fit-content' }}>
        <ArrowLeft size={20} />
        {t('backToBrowse')}
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
        {/* Left Column: Image & Description */}
        <div>
          <div className="glass" style={{
            background: 'white',
            borderRadius: '30px',
            overflow: 'hidden',
            marginBottom: '30px',
            boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
          }}>
            <img 
              src={item.image} 
              alt={item.title} 
              style={{ width: '100%', height: '500px', objectFit: 'cover' }}
            />
          </div>

          <div className="glass" style={{ background: 'white', padding: '30px', borderRadius: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>{t('description')}</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{item.description}</p>
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass" style={{ background: 'white', padding: '30px', borderRadius: '30px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span className={`badge ${getStatusClass(item.status)}`} style={{ marginBottom: '12px', display: 'inline-block' }}>
                {item.status}
              </span>
              <h1 style={{ fontSize: '32px' }}>{item.title}</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#F4F7FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ipb-blue)' }}>
                  <Tag size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px' }}>{t('categoryLabel')}</p>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.category}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#F4F7FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ipb-blue)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px' }}>{t('locationLabel')}</p>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.location}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#F4F7FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ipb-blue)' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px' }}>{t('dateLabel')}</p>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.date}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#F4F7FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ipb-blue)' }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px' }}>{t('reporterLabel')}</p>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.reporter || item.reporterName}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => setShowContactModal(true)}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '16px' }}
              >
                <MessageCircle size={20} />
                {item.type === 'lost' ? t('contactOwner') : t('contactFinder')}
              </button>
              <button 
                onClick={() => setShowClaimModal(true)}
                className="btn btn-gold" 
                style={{ width: '100%', padding: '16px' }}
              >
                <ShieldCheck size={20} />
                {item.type === 'lost' ? t('iFoundThis') : t('claimItem')}
              </button>
            </div>
          </div>

          <div className="glass" style={{ background: '#E1F0FE', padding: '24px', borderRadius: '24px', border: '1px solid #BEE3F8' }}>
            <h4 style={{ color: 'var(--ipb-blue)', marginBottom: '8px' }}>{t('securityTipTitle')}</h4>
            <p style={{ fontSize: '14px', color: 'var(--ipb-blue)' }}>{t('securityTipDesc')}</p>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)}
        title={t('contactTitle')}
      >
        <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>{t('contactDesc')}</p>
        <div style={{ 
          background: '#F4F7FE', 
          padding: '20px', 
          borderRadius: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ipb-blue)' }}>{item.contactInfo || item.reporterPhone || item.reporterEmail || 'No contact info'}</span>
          <button 
            onClick={handleCopy}
            style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
          >
            {copied ? <Check size={18} color="#01B574" /> : <Copy size={18} color="var(--text-secondary)" />}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <a 
            href={getContactLink(item.contactInfo || item.reporterPhone || item.reporterEmail)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            {t('openContact')}
          </a>
          <button className="btn" style={{ flex: 1, background: '#F4F7FE', color: 'var(--text-secondary)' }} onClick={() => setShowContactModal(false)}>
            {t('close')}
          </button>
        </div>
      </Modal>

      {/* Claim Modal */}
      <Modal
        isOpen={showClaimModal}
        onClose={() => {
          setShowClaimModal(false);
          setClaimSubmitted(false);
        }}
        title={t('claimTitle')}
      >
        {!claimSubmitted ? (
          <form onSubmit={handleClaimSubmit}>
            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>{t('claimDesc')}</p>

            {/* Guest Identity Verification Block */}
            {!user && (
              <div style={{
                background: '#FFF8F6',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #FFD0C6',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#EE5D50" />
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#EE5D50', fontWeight: 800 }}>
                    {t('guestVerification')}
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {t('guestVerificationDesc')}
                </p>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '12px' }}>{t('nameLabel')} <span style={{ color: '#EE5D50' }}>*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={t('namePlaceholder')} 
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{ padding: '8px 12px', fontSize: '13px' }}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '12px' }}>{t('nikLabel')} <span style={{ color: '#EE5D50' }}>*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      maxLength="16"
                      pattern="\d{16}"
                      placeholder="NIK (16 digit)" 
                      value={guestNIK}
                      onChange={(e) => setGuestNIK(e.target.value.replace(/\D/g, ''))}
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '12px' }}>{t('ageLabel')} <span style={{ color: '#EE5D50' }}>*</span></label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="1"
                      placeholder="Age" 
                      value={guestAge}
                      onChange={(e) => setGuestAge(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '12px' }}>{t('addressLabel')} <span style={{ color: '#EE5D50' }}>*</span></label>
                  <textarea 
                    className="form-input" 
                    placeholder="Address" 
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    style={{ padding: '8px 12px', fontSize: '13px', height: '60px', resize: 'none', minHeight: '60px' }}
                    required
                  ></textarea>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '12px' }}>{t('uploadIdCard')} <span style={{ color: '#EE5D50' }}>*</span></label>
                  <div 
                    onClick={() => document.getElementById('guestKtpClaimInput').click()}
                    style={{
                      border: '1.5px dashed #FFD0C6',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center',
                      background: guestKTPFile ? '#E2F9EB' : 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: guestKTPFile ? '#01B574' : '#EE5D50'
                    }}
                  >
                    {guestKTPFile ? `✓ ${guestKTPFile.name}` : t('uploadIdCard')}
                    <input 
                      type="file" 
                      id="guestKtpClaimInput"
                      style={{ display: 'none' }} 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setGuestKTPFile(e.target.files[0]);
                        }
                      }}
                      required={!user}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label style={{ fontSize: '13px' }}>{language === 'en' ? 'Proof of Ownership' : 'Bukti Kepemilikan'} <span style={{ color: '#EE5D50' }}>*</span></label>
              <textarea 
                className="form-input" 
                placeholder={t('proofPlaceholder')}
                style={{ minHeight: '120px', marginBottom: '24px', paddingTop: '12px' }}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
              {t('submitClaim')}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ background: '#E2F9EB', color: '#01B574', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Check size={40} />
            </div>
            <h3 style={{ marginBottom: '12px' }}>{t('claimSuccess')}</h3>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>{t('claimSuccessDesc')}</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowClaimModal(false)}>
              {t('close')}
            </button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Detail;
