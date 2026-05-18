import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Upload, CheckCircle, FileText, ShieldCheck } from 'lucide-react';
import { categories, locations } from '../data/mockData';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Report = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  
  // Public user fields
  const [publicName, setPublicName] = useState('');
  const [publicEmail, setPublicEmail] = useState('');
  const [publicWhatsApp, setPublicWhatsApp] = useState('');

  // Item form fields
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [date, setDate] = useState('');
  const [reportType, setReportType] = useState('lost');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create new reported item object for localStorage persistence
    const newItem = {
      id: Date.now(),
      title: itemName,
      description: description || 'No description provided.',
      category,
      location,
      locationDetail,
      date,
      type: reportType,
      status: reportType === 'lost' ? 'Lost' : 'Found',
      image: file 
        ? URL.createObjectURL(file) 
        : 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&q=80&w=400',
      reporterEmail: user ? user.email : publicEmail,
      reporterName: user ? user.name : publicName,
      reporterPhone: user ? '' : publicWhatsApp,
      activityDate: date,
      activityType: reportType === 'lost' ? 'Reported Lost' : 'Reported Found',
      activityStatus: 'Active'
    };

    // 1. Post to actual FastAPI backend!
    try {
      const endpoint = reportType === 'lost' 
        ? 'http://localhost:8080/items/report-lost' 
        : 'http://localhost:8080/items/report-found';
      
      const payload = {
        title: itemName,
        description: description || 'No description provided.',
        location: location + (locationDetail ? ` - ${locationDetail}` : ''),
        latitude: null,
        longitude: null,
        image: file ? file.name : null,
        reporter_id: user && user.id ? parseInt(user.id) : 2 // Fallback to user with ID 2 if guest
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('Successfully posted reported item to backend DB!');
      } else {
        console.error('Failed to post to backend DB:', await response.text());
      }
    } catch (err) {
      console.error('Error reporting to backend DB:', err);
    }

    // 2. Retrieve existing items, add new one, and save back to localStorage
    const existing = localStorage.getItem('reported_items');
    const itemsList = existing ? JSON.parse(existing) : [];
    itemsList.unshift(newItem);
    localStorage.setItem('reported_items', JSON.stringify(itemsList));

    console.log('Saved Report to LocalStorage:', newItem);
    setSubmitted(true);
  };

  const resetForm = () => {
    setItemName('');
    setDescription('');
    setCategory('');
    setLocation('');
    setLocationDetail('');
    setDate('');
    setReportType('lost');
    setFile(null);
    setPublicName('');
    setPublicEmail('');
    setPublicWhatsApp('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          style={{ background: '#E2F9EB', color: '#01B574', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}
        >
          <CheckCircle size={48} />
        </motion.div>
        <h2 style={{ marginBottom: '12px' }}>{t('successMsg')}</h2>
        <p style={{ marginBottom: '30px', textAlign: 'center' }}>{t('successDesc')}</p>
        <button className="btn btn-primary" onClick={resetForm}>{t('createAnother')}</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar title={t('report')} />

      <div className="glass" style={{
        background: 'white',
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px' }}>{t('tellUs')}</h2>
          <p>{t('reportDesc')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
            <div className="form-group">
              <label>{t('itemName')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={t('itemNamePlaceholder')} 
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>{t('description')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={t('descriptionPlaceholder')} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>{t('category')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <select 
                className="form-input" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">{t('selectCategory')}</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>{t('location')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <select 
                className="form-input" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                <option value="">{t('selectLocation')}</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>{t('locationDetail')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={t('locationDetailPlaceholder')} 
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>{t('date')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <input 
                type="date" 
                className="form-input" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required 
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>{t('type')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <select 
                className="form-input" 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
              >
                <option value="lost">{t('lostSomething')}</option>
                <option value="found">{t('foundSomething')}</option>
              </select>
            </div>

            {/* Conditional Frictionless Contact Block */}
            {user ? (
              <div style={{
                gridColumn: '1 / -1',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
                border: '1.5px solid rgba(79, 70, 229, 0.15)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '10px'
              }}>
                <div style={{ background: '#4F46E5', color: 'white', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#4F46E5', fontWeight: 700 }}>
                    {language === 'en' ? 'Verified Session Active' : 'Sesi Terverifikasi Aktif'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {language === 'en' 
                      ? `Reporting as ${user.name} (${user.role === 'Admin' ? 'Administrator' : 'IPB Student'})`
                      : `Melaporkan sebagai ${user.name} (${user.role === 'Admin' ? 'Administrator' : 'Mahasiswa IPB'})`}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                gridColumn: '1 / -1',
                background: '#F4F7FE',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #E0E5F2',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '10px'
              }}>
                <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--ipb-blue)', fontWeight: 700 }}>
                  {language === 'en' ? 'Reporter Contact Details (Public / Non-IPB)' : 'Detail Kontak Pelapor (Umum / Non-IPB)'}
                </h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {language === 'en' 
                    ? 'No account needed! Fill out your contact details to receive claim updates.'
                    : 'Tidak perlu akun! Isi detail kontak Anda agar dapat menerima pembaruan klaim.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '13px' }}>{t('nameLabel')} <span style={{ color: '#EE5D50' }}>*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder={t('namePlaceholder')} 
                      value={publicName}
                      onChange={(e) => setPublicName(e.target.value)}
                      required={!user} 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '13px' }}>{t('emailLabel')} <span style={{ color: '#EE5D50' }}>*</span></label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="mail@example.com" 
                      value={publicEmail}
                      onChange={(e) => setPublicEmail(e.target.value)}
                      required={!user} 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '13px' }}>{t('phoneLabel')} <span style={{ color: '#EE5D50' }}>*</span></label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="+62..." 
                      value={publicWhatsApp}
                      onChange={(e) => setPublicWhatsApp(e.target.value)}
                      required={!user} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '40px' }}>
            <label>{t('uploadTitle')}</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*,.pdf,.doc,.docx"
            />
            <div 
              onClick={triggerFileInput}
              style={{
                border: '2px dashed #E0E5F2',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                background: file ? '#E2F9EB' : '#F4F7FE',
                cursor: 'pointer',
                transition: 'var(--transition)',
                borderStyle: file ? 'solid' : 'dashed',
                borderColor: file ? '#01B574' : '#E0E5F2'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                <Upload size={32} color={file ? '#01B574' : 'var(--text-secondary)'} />
                <FileText size={32} color={file ? '#01B574' : 'var(--text-secondary)'} />
              </div>
              <p style={{ fontWeight: '600', color: file ? '#01B574' : 'var(--text-primary)' }}>
                {file ? file.name : t('uploadTitle')}
              </p>
              <p style={{ fontSize: '12px' }}>{t('uploadLimit')}</p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px' }}>
            {t('submitReport')}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Report;
