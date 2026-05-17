import React from 'react';
import Navbar from '../components/Navbar';
import { items } from '../data/mockData';
import { Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  // Simulating user's history
  const userHistory = [
    { ...items[1], activityDate: '2024-05-14', activityType: 'Reported Lost', activityStatus: 'Active' },
    { ...items[2], activityDate: '2024-05-13', activityType: 'Reported Found', activityStatus: 'Completed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar title="My Activity History" />

      <div className="glass" style={{ background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2>Recent Activity</h2>
          <p>Track your reported items and claims.</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #E0E5F2' }}>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>ITEM</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>TYPE</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>DATE</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>STATUS</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}></th>
              </tr>
            </thead>
            <tbody>
              {userHistory.map((activity, index) => (
                <tr key={index} style={{ borderBottom: index !== userHistory.length - 1 ? '1px solid #F4F7FE' : 'none' }}>
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
                      color: activity.activityType.includes('Lost') ? '#EE5D50' : '#01B574'
                    }}>
                      {activity.activityType}
                    </span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>{activity.activityDate}</p>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {activity.activityStatus === 'Completed' ? (
                        <CheckCircle size={18} color="#01B574" />
                      ) : (
                        <Clock size={18} color="var(--ipb-gold)" />
                      )}
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{activity.activityStatus}</span>
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
      </div>
    </motion.div>
  );
};

export default History;
