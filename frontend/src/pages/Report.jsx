import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Upload, CheckCircle, FileText } from 'lucide-react';
import { categories, locations } from '../data/mockData';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Report = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
        <button className="btn btn-primary" onClick={() => setSubmitted(false)}>{t('createAnother')}</button>
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
              <input type="text" className="form-input" placeholder={t('itemNamePlaceholder')} required />
            </div>

            <div className="form-group">
              <label>{t('description')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <input type="text" className="form-input" placeholder={t('descriptionPlaceholder')} required />
            </div>

            <div className="form-group">
              <label>{t('category')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <select className="form-input" required>
                <option value="">{t('selectCategory')}</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>{t('location')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <select className="form-input" required>
                <option value="">{t('selectLocation')}</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>{t('locationDetail')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <input type="text" className="form-input" placeholder={t('locationDetailPlaceholder')} required />
            </div>

            <div className="form-group">
              <label>{t('contactInfo')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <input type="text" className="form-input" placeholder={t('contactInfoPlaceholder')} required />
            </div>

            <div className="form-group">
              <label>{t('date')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <input type="date" className="form-input" required />
            </div>

            <div className="form-group">
              <label>{t('type')} <span style={{ color: '#EE5D50' }}>*</span></label>
              <select className="form-input" required>
                <option value="lost">{t('lostSomething')}</option>
                <option value="found">{t('foundSomething')}</option>
              </select>
            </div>
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
