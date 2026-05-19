import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ItemCard from '../components/ItemCard';
import { Search, AlertCircle, CheckCircle, Package, ShieldCheck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useItems } from '../context/ItemsContext';
import { apiJson } from '../lib/api';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const { items } = useItems();
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);

  const isAdmin = user?.role === 'Admin';

  const userName = user?.name
    ? user.name.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'User';

  const itemById = useMemo(() => {
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  const recentItems = items.slice(0, 3);
  const userReports = user ? items.filter((item) => item.reporterId === user.id) : [];

  const pendingClaims = claims.filter((claim) => claim.status === 'pending');
  const approvedClaims = claims.filter((claim) => claim.status === 'approved');
  const rejectedClaims = claims.filter((claim) => claim.status === 'rejected');

  const fetchClaims = async () => {
    if (!token) return;
    setClaimsLoading(true);
    try {
      const res = await apiJson('/claims/?limit=100', { token });
      if (res.ok && res.data?.data) {
        setClaims(res.data.data);
      } else {
        setClaims([]);
      }
    } catch (error) {
      console.error('Failed to fetch claims:', error);
      setClaims([]);
    } finally {
      setClaimsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchClaims();
    }
  }, [isAdmin, token]);

  const reviewClaim = async (claimId, status) => {
    if (!token) return;
    setReviewingId(claimId);
    try {
      const res = await apiJson(`/claims/${claimId}/review`, {
        method: 'PATCH',
        body: { status },
        token,
      });
      if (res.ok) {
        await fetchClaims();
      } else {
        console.error('Failed to review claim:', res);
      }
    } catch (error) {
      console.error('Failed to review claim:', error);
    } finally {
      setReviewingId(null);
    }
  };

  const getClaimImageUrl = (proofImage) => {
    if (!proofImage) return '';
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    return `${baseUrl}${proofImage}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar title={isAdmin ? 'Admin Dashboard' : t('dashboard')} />

      {isAdmin ? (
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
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{t('welcomeBack')}, {userName}! 👋</h1>
              <p>{pendingClaims.length} pending claims require your review.</p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <StatCard label="Total Reports" value={items.length.toString()} icon={<Package size={24} />} />
            <StatCard label="Pending Claims" value={pendingClaims.length.toString()} icon={<ShieldCheck size={24} />} color="#0075FF" />
            <StatCard label="Approved Claims" value={approvedClaims.length.toString()} icon={<CheckCircle size={24} />} color="#01B574" />
            <StatCard label="Rejected Claims" value={rejectedClaims.length.toString()} icon={<XCircle size={24} />} color="#EE5D50" />
          </div>

          <div className="glass card-shadow" style={{ background: 'white', padding: '30px', borderRadius: '24px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Claims Queue</h2>
              <button className="btn" onClick={fetchClaims} disabled={claimsLoading}>
                {claimsLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {claimsLoading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading claims...</p>
            ) : claims.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No claims yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {claims.map((claim) => {
                  const relatedItem = itemById.get(claim.item_id);
                  const imageUrl = getClaimImageUrl(claim.proof_image);
                  return (
                    <div key={claim.id} style={{ border: '1px solid #E0E5F2', borderRadius: '18px', padding: '18px', background: '#FDFEFF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ margin: 0, marginBottom: '6px' }}>{relatedItem?.title || `Item #${claim.item_id}`}</h3>
                          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
                            Claim by user #{claim.claimer_id} · Status: {claim.status}
                          </p>
                        </div>
                        <span className="badge badge-found" style={{ alignSelf: 'start' }}>{claim.status}</span>
                      </div>

                      <p style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>{claim.proof_text}</p>

                      {imageUrl && (
                        <a href={imageUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginBottom: '12px' }}>
                          <img
                            src={imageUrl}
                            alt="claim proof"
                            style={{ width: '100%', maxWidth: '280px', borderRadius: '14px', border: '1px solid #E0E5F2', objectFit: 'cover' }}
                          />
                        </a>
                      )}

                      {claim.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-primary"
                            disabled={reviewingId === claim.id}
                            onClick={() => reviewClaim(claim.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn"
                            style={{ background: '#F4F7FE', color: 'var(--text-secondary)' }}
                            disabled={reviewingId === claim.id}
                            onClick={() => reviewClaim(claim.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
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
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{t('welcomeBack')}, {userName}! 👋</h1>
              <p>{t('activeReportsMsg', { count: userReports.length, notif: 0 })}</p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <StatCard label={t('yourReports')} value={userReports.length.toString()} icon={<Package size={24} />} />
            <StatCard label={t('foundItems')} value={userReports.filter((item) => item.type === 'found').length.toString()} icon={<CheckCircle size={24} />} color="#01B574" />
            <StatCard label={t('matchesFound')} value={items.filter((item) => item.type === 'found').length.toString()} icon={<AlertCircle size={24} />} color="#0075FF" />
            <StatCard label={t('profileCompletion')} value="85%" icon={<Search size={24} />} color="#EE5D50" />
          </div>
        </>
      )}

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
