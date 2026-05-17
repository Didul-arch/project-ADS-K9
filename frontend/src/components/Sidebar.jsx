import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, Layout, Clock, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { icon: <Home size={20} />, label: t('home'), path: '/' },
    { icon: <Search size={20} />, label: t('browse'), path: '/browse' },
    { icon: <PlusCircle size={20} />, label: t('report'), path: '/report' },
    { icon: <Layout size={20} />, label: t('dashboard'), path: '/dashboard' },
    { icon: <Clock size={20} />, label: t('history'), path: '/history' },
  ];

  const adminMenuItems = [
    { icon: <Layout size={20} />, label: 'Admin Dashboard', path: '/dashboard' },
    { icon: <Search size={20} />, label: 'All Items', path: '/browse' },
    { icon: <PlusCircle size={20} />, label: 'Manage Claims', path: '/claims' },
    { icon: <Clock size={20} />, label: 'System Logs', path: '/history' },
    { icon: <Home size={20} />, label: 'User Management', path: '/users' },
  ];

  const menuItems = user?.role === 'Admin' ? adminMenuItems : userMenuItems;

  return (
    <aside className="glass" style={{
      width: 'var(--sidebar-width)',
      height: 'calc(100vh - 40px)',
      position: 'fixed',
      top: '20px',
      left: '20px',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px', paddingLeft: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'var(--ipb-blue)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ipb-gold)',
          fontWeight: 'bold',
          fontSize: '20px'
        }}>I</div>
        <h2 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>LnF IPB</h2>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '500',
                  background: isActive ? 'white' : 'transparent',
                  transition: 'var(--transition)',
                  boxShadow: isActive ? '0px 10px 20px rgba(112, 144, 176, 0.12)' : 'none',
                })}
              >
                <span style={{ color: 'var(--ipb-blue)' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
        <button onClick={handleLogout} className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: '#EE5D50' }}>
          <LogOut size={20} />
          {t('signOut')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
