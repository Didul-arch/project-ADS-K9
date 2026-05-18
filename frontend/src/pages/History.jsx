import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Clock, CheckCircle, MoreVertical, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // 1. Get items from localStorage
    const stored = localStorage.getItem('reported_items');
    let itemsList = stored ? JSON.parse(stored) : [];

    // 2. If completely empty, let's pre-populate some premium mock records for a perfect initial state!
    if (itemsList.length === 0) {
      itemsList = [
        {
          id: 1,
          title: "iPhone 13 Pro Max",
          category: "Electronics",
          location: "LSI Library",
          date: "2024-05-15",
          type: "lost",
          image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400",
          reporterEmail: "luqman@apps.ipb.ac.id",
          activityDate: "2024-05-15",
          activityType: "Reported Lost",
          activityStatus: "Active"
        },
        {
          id: 2,
          title: "Black Leather Wallet",
          category: "Personal Item",
          location: "Faperta",
          date: "2024-05-14",
          type: "lost",
          image: "https://images.unsplash.com/photo-1627123430984-7151107d3bca?auto=format&fit=crop&q=80&w=400",
          reporterEmail: "luqman@apps.ipb.ac.id",
          activityDate: "2024-05-14",
          activityType: "Reported Lost",
          activityStatus: "Completed"
        },
        {
          id: 3,
          title: "Hydro Flask Yellow",
          category: "Accessories",
          location: "Gymnasium",
          date: "2024-05-13",
          type: "found",
          image: "https://images.unsplash.com/photo-1602143307185-83e312e4466d?auto=format&fit=crop&q=80&w=400",
          reporterEmail: "syafiq@apps.ipb.ac.id",
          activityDate: "2024-05-13",
          activityType: "Reported Found",
          activityStatus: "Completed"
        }
      ];
      localStorage.setItem('reported_items', JSON.stringify(itemsList));
    }

    // 3. Filter based on the currently logged-in user!
    if (user) {
      const userFiltered = itemsList.filter(item => item.reporterEmail === user.email);
      setHistory(userFiltered);
    } else {
      // For public guests, show any items reported by guests (no reporterEmail, or marked public)
      const guestFiltered = itemsList.filter(item => !item.reporterEmail || item.reporterEmail.includes('@') === false || item.reporterEmail === 'Guest');
      setHistory(guestFiltered);
    }
  }, [user]);

  // Labels based on active language
  const titleText = language === 'en' ? 'My Activity History' : 'Riwayat Aktivitas Saya';
  const headerText = language === 'en' ? 'Recent Activity' : 'Aktivitas Terbaru';
  const descText = language === 'en' ? 'Track your reported items and claims.' : 'Pantau barang yang Anda laporkan dan klaim Anda.';
  const colItem = language === 'en' ? 'ITEM' : 'BARANG';
  const colType = language === 'en' ? 'TYPE' : 'JENIS';
  const colDate = language === 'en' ? 'DATE' : 'TANGGAL';
  const colStatus = language === 'en' ? 'STATUS' : 'STATUS';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar title={titleText} />

      <div className="glass" style={{ background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2>{headerText}</h2>
          <p>{descText}</p>
        </div>

        {history.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #E0E5F2' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>{colItem}</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>{colType}</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>{colDate}</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>{colStatus}</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}></th>
                </tr>
              </thead>
              <tbody>
                {history.map((activity, index) => (
                  <tr key={activity.id || index} style={{ borderBottom: index !== history.length - 1 ? '1px solid #F4F7FE' : 'none' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img 
                          src={activity.image} 
                          alt={activity.title} 
                          style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }}
                        />
                        <div>
                          <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{activity.title}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{activity.category}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: activity.activityType?.includes('Lost') || activity.type === 'lost' ? '#EE5D50' : '#01B574'
                      }}>
                        {activity.activityType || (activity.type === 'lost' ? 'Reported Lost' : 'Reported Found')}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>{activity.activityDate || activity.date}</p>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {activity.activityStatus === 'Completed' ? (
                          <CheckCircle size={18} color="#01B574" />
                        ) : (
                          <Clock size={18} color="var(--ipb-gold)" />
                        )}
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{activity.activityStatus || 'Active'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <HelpCircle size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '16px' }} />
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              {language === 'en' ? 'No activity history found' : 'Tidak ada riwayat aktivitas'}
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {language === 'en' 
                ? 'Start reporting lost or found items to populate your history!' 
                : 'Mulai laporkan barang hilang atau temuan untuk mengisi riwayat Anda!'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default History;
