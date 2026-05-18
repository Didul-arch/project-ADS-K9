import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Languages, LogOut, CheckCircle, Info, Shield, HelpCircle, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ title }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState(() => {
    const defaultNotifs = [
      { id: 1, type: 'match', name: 'iPhone 13 Pro Max', time: '5m ago', read: false },
      { id: 2, type: 'claim', name: 'Black Leather Wallet', time: '1h ago', read: false },
      { id: 3, type: 'approved', name: 'Tumbler Hydro Flask', time: '2h ago', read: false },
    ];
    const local = localStorage.getItem('notifications');
    const parsedLocal = local ? JSON.parse(local) : [];
    return [...parsedLocal, ...defaultNotifs];
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery && location.pathname !== '/browse') {
      navigate('/browse');
    }
  };

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      // Save local ones back to localStorage
      const localOnly = updated.filter(n => n.id > 10);
      localStorage.setItem('notifications', JSON.stringify(localOnly));
      return updated;
    });
  };

  const handleNotifClick = (notif) => {
    // Mark as read
    setNotifications(prev => {
      const updated = prev.map(n => n.id === notif.id ? { ...n, read: true } : n);
      const localOnly = updated.filter(n => n.id > 10);
      localStorage.setItem('notifications', JSON.stringify(localOnly));
      return updated;
    });
    setShowNotif(false);
    
    // Navigate based on type
    if (notif.type === 'match' || notif.type === 'approved') {
      navigate('/browse');
    } else if (notif.type === 'claim') {
      navigate('/dashboard');
    }
  };

  const getNotifText = (n) => {
    if (n.type === 'match') {
      return t('notifMatch').replace('{name}', n.name);
    }
    if (n.type === 'claim') {
      return t('notifClaim').replace('{name}', n.name);
    }
    if (n.type === 'approved') {
      return t('notifApproved').replace('{name}', n.name);
    }
    return '';
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      padding: '0 10px',
      position: 'relative'
    }}>
      <div>
        <p style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
          {t('pages')} / {title}
        </p>
        <h1 style={{ fontSize: '34px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {title}
        </h1>
      </div>

      <div className="glass" style={{
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '30px',
        boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.08)',
        zIndex: 10
      }}>
        {/* Global Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-primary)',
          padding: '8px 16px',
          borderRadius: '20px',
          width: '250px'
        }}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '14px',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          style={{
            background: 'var(--bg-primary)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ipb-blue)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '12px',
            transition: 'all 0.2s ease'
          }}
        >
          <Languages size={18} />
          {language === 'en' ? 'EN' : 'ID'}
        </button>

        {/* Active Notification Bell Button */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
            style={{
              background: showNotif ? 'var(--ipb-light-blue)' : 'var(--bg-primary)',
              border: 'none',
              cursor: 'pointer',
              color: showNotif ? 'var(--ipb-blue)' : 'var(--text-secondary)',
              display: 'flex',
              padding: '10px',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#EE5D50',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px white'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Glassmorphic Notification Dropdown */}
          <AnimatePresence>
            {showNotif && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="glass card-shadow"
                style={{
                  position: 'absolute',
                  top: '55px',
                  right: '0',
                  width: '340px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '16px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '1px solid rgba(6, 18, 92, 0.08)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bell size={16} color="var(--ipb-blue)" />
                    {t('notifications')}
                  </h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--ipb-blue)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {t('markAllAsRead')}
                    </button>
                  )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #E0E5F2', margin: 0 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px 0', fontSize: '14px' }}>
                      {t('noNotifications')}
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: n.read ? 'transparent' : 'rgba(6, 18, 92, 0.04)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderLeft: n.read ? '3px solid transparent' : '3px solid var(--ipb-blue)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 18, 92, 0.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(6, 18, 92, 0.04)'}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: n.type === 'approved' ? '#E2F9EB' : n.type === 'claim' ? '#FFE5E5' : '#E1F0FE',
                          color: n.type === 'approved' ? '#01B574' : n.type === 'claim' ? '#EE5D50' : '#0075FF',
                          flexShrink: 0
                        }}>
                          {n.type === 'approved' ? <CheckCircle size={16} /> : <Info size={16} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: n.read ? 500 : 600, color: 'var(--text-primary)', margin: '0 0 2px 0', lineHeight: 1.4 }}>
                            {getNotifText(n)}
                          </p>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Profile Circle Button */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: showProfile ? 'var(--ipb-gold)' : 'var(--ipb-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showProfile ? 'var(--ipb-blue)' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              boxShadow: showProfile ? '0 0 0 3px rgba(253, 203, 44, 0.4)' : 'none'
            }}
          >
            {user && user.avatar ? (
              <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={20} />
            )}
          </div>

          {/* Glassmorphic Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="glass card-shadow"
                style={{
                  position: 'absolute',
                  top: '55px',
                  right: '0',
                  width: '280px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '20px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  border: '1px solid rgba(6, 18, 92, 0.08)'
                }}
              >
                {/* Header Information */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--ipb-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    overflow: 'hidden'
                  }}>
                    {user && user.avatar ? (
                      <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user ? user.name : t('guest')}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user ? user.email : 'guest@apps.ipb.ac.id'}
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: user && user.role === 'Admin' ? '#FFE5E5' : '#E1F0FE',
                  color: user && user.role === 'Admin' ? '#EE5D50' : '#0075FF',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  alignSelf: 'flex-start',
                  letterSpacing: '0.5px'
                }}>
                  {user ? user.role : t('guest')}
                </div>

                {/* Additional Profile Info (Only shown for logged-in IPB/Civitas/Admin users) */}
                {user && (
                  <>
                    <hr style={{ border: 'none', borderTop: '1px solid #E0E5F2', margin: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t('studentId')}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {user.role === 'Admin' ? 'A24090001' : (user.nim || 'G6401221034')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t('department')}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.role === 'Admin' ? 'Direktorat Sistem Informasi' : (user.department || 'Ilmu Komputer')}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid #E0E5F2', margin: 0 }} />

                {/* Logout Button */}
                <button 
                  onClick={() => {
                    logout();
                    setShowProfile(false);
                    navigate('/login');
                  }}
                  style={{
                    background: '#FFE5E5',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#EE5D50',
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FFD2D2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#FFE5E5'}
                >
                  <LogOut size={16} />
                  {t('signOut')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
