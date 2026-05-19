import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { MapPin, Calendar, Tag, User, ArrowLeft, MessageCircle, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { apiJson } from '../lib/api';

const Detail = () => {
  const { id } = useParams();
  const { t } = useLanguage();

  const [item, setItem] = useState(null);
  const [reporter, setReporter] = useState(null);
  const [loadingItem, setLoadingItem] = useState(true);

  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoadingItem(true);
    apiJson(`/items/${id}`)
      .then(res => {
        if (!mounted) return;
        if (res.ok && res.data) {
          // backend returns { data: item }
          const payload = res.data && res.data.data ? res.data.data : res.data;
          setItem(payload);
          // set reporter if reporter_id exists
          if (payload && payload.reporter_id) {
            apiJson(`/users/${payload.reporter_id}`)
              .then(u => {
                if (!mounted) return;
                if (u.ok && u.data) setReporter(u.data);
              })
              .catch(() => {});
          }
        } else setItem(null);
      })
      .catch(err => {
        console.error('Failed to fetch item detail', err);
        if (mounted) setItem(null);
      })
      .finally(() => { if (mounted) setLoadingItem(false); });

    return () => { mounted = false; };
  }, [id]);

  if (loadingItem) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const itemImage = item.image && item.image.startsWith('/') ? `${baseUrl}${item.image}` : item.image;
  const displayDate = item?.created_at ? new Date(item.created_at).toLocaleString() : item?.date || '-';
  const displayReporter = reporter?.fullname || item?.reporter || `User #${item?.reporter_id || '-'}`;

  const handleCopy = () => {
    const contact = item.contactInfo || item.reporterPhone || item.reporterEmail || 'No contact info';
    navigator.clipboard.writeText(contact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    const s = (status || '').toLowerCase();
    switch (s) {
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
          {itemImage ? (
            <div className="glass" style={{
              background: 'white',
              borderRadius: '30px',
              overflow: 'hidden',
              marginBottom: '30px',
              boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
            }}>
              <img 
                src={itemImage} 
                alt={item.title} 
                style={{ width: '100%', height: '500px', objectFit: 'cover' }}
              />
            </div>
          ) : null}

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
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{displayDate}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#F4F7FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ipb-blue)' }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px' }}>{t('reporterLabel')}</p>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{displayReporter}</p>
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
                onClick={() => navigate(`/claim/${item.id}`)}
                className="btn btn-gold" 
                style={{ width: '100%', padding: '16px' }}
              >
                {t('claimItem')}
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

    </motion.div>
  );
};

export default Detail;
