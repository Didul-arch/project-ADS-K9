import React from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ItemCard from '../components/ItemCard';
import { Search, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { items, stats } from '../data/mockData';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const recentItems = items.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar title={isAdmin ? 'Admin Dashboard' : t('dashboard')} />

      {isAdmin ? (
        /* Admin Dashboard View */
        <>
          <div className="glass card-shadow" style={{
            background: 'white',
            padding: '40px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'var(--ipb-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ipb-blue)'
            }}>
               <AlertCircle size={40} />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>System Overview</h1>
              <p>There are <strong>12 pending claims</strong> that require your immediate verification.</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary">Review All Claims</button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <StatCard label="Total Reports" value="142" icon={<Package size={24} />} />
            <StatCard label="Active Items" value="45" icon={<Search size={24} />} color="#0075FF" />
            <StatCard label="Resolved" value="97" icon={<CheckCircle size={24} />} color="#01B574" />
            <StatCard label="Total Users" value="1,204" icon={<AlertCircle size={24} />} color="#EE5D50" />
          </div>
        </>
      ) : (
        /* User Dashboard View (Existing) */
        <>
          <div className="glass card-shadow" style={{
            background: 'white',
            padding: '40px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'var(--ipb-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
               <CheckCircle size={40} />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{t('welcomeBack')}, Budi! 👋</h1>
              <p>{t('activeReportsMsg', { count: 2, notif: 1 })}</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary">{t('manageReports')}</button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <StatCard label={t('yourReports')} value="3" icon={<Package size={24} />} />
            <StatCard label={t('foundItems')} value="1" icon={<CheckCircle size={24} />} color="#01B574" />
            <StatCard label={t('matchesFound')} value="2" icon={<AlertCircle size={24} />} color="#0075FF" />
            <StatCard label={t('profileCompletion')} value="85%" icon={<Search size={24} />} color="#EE5D50" />
          </div>
        </>
      )}

      {/* Recent Items */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Recently Reported</h2>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--ipb-blue)', fontWeight: '700', cursor: 'pointer' }}>
            See all
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
