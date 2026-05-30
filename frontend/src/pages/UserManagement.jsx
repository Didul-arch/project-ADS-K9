import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiJson } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Search, Trash2, Eye, ShieldCheck, CircleCheckBig } from 'lucide-react';
import { motion } from 'framer-motion';

const getDocumentFileName = (value) => {
  if (!value) {
    return '-';
  }

  const normalizedValue = value.split('?')[0].split('#')[0].replace(/\\/g, '/');
  const lastSegment = normalizedValue.split('/').filter(Boolean).pop();

  return decodeURIComponent(lastSegment || normalizedValue || value);
};

const getApiBaseUrl = () => (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const getDocumentUrl = (value) => {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${getApiBaseUrl()}${value}`;
};

const isPreviewableDocument = (value) => /\.(png|jpe?g|webp|gif)$/i.test(getDocumentFileName(value));

const UserManagement = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  // Fetch users on mount
  useEffect(() => {
    if (token) {
      fetchUsers();
      return;
    }

    setUsers([]);
    setFilteredUsers([]);
    setLoading(false);
  }, [token]);

  // Filter users when search or filters change
  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await apiJson('/users/', { token });
      if (result.ok && result.data) {
        setUsers(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          (user.fullname || '').toLowerCase().includes(query) ||
          (user.email || '').toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => {
        const userRole = (user.role || '').toLowerCase();
        return userRole === roleFilter.toLowerCase();
      });
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((user) => user.is_active);
    } else if (statusFilter === 'suspended') {
      filtered = filtered.filter((user) => !user.is_active);
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setDeleting(userId);
    try {
      const result = await apiJson(`/users/${userId}`, {
        method: 'DELETE',
        token,
      });
      if (result.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        console.error('Failed to delete user:', result.data);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleting(null);
    }
  };

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const adminCount = users.filter((u) => (u.role || '').toLowerCase() === 'admin').length;
  const suspendedCount = users.filter((u) => !u.is_active).length;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Active Users', value: activeUsers, icon: '✓', color: 'from-green-500 to-green-600' },
    { label: 'Admins', value: adminCount, icon: '🛡️', color: 'from-purple-500 to-purple-600' },
    { label: 'Suspended', value: suspendedCount, icon: '⊘', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div style={{ padding: '40px', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px' }}>User Management</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Manage system users and permissions</p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: `linear-gradient(135deg, var(--${stat.color}))`,
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 8px' }}>{stat.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{ fontSize: '24px' }}>{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 40px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="civitas">Civitas</option>
              <option value="umum">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Cards */}
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No users found</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredUsers.map((user, index) => {
                const isAdmin = (user.role || '').toLowerCase() === 'admin';
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '18px',
                      padding: '18px',
                      background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>{user.fullname}</h3>
                          {isAdmin ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: '#eef2ff', color: '#4338ca', fontSize: '12px', fontWeight: '700' }}>
                              <ShieldCheck size={14} />
                              Admin
                            </span>
                          ) : null}
                        </div>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{user.email}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: user.is_active ? '#dcfce7' : '#fef3c7', color: user.is_active ? '#166534' : '#92400e', fontSize: '12px', fontWeight: '700' }}>
                          <CircleCheckBig size={14} />
                          {user.is_active ? 'Active' : 'Suspended'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Role</span>
                        <strong style={{ color: '#111827', fontSize: '13px' }}>{user.role}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Identity</span>
                        <div style={{ textAlign: 'right', maxWidth: '180px' }}>
                          {user.identity_document && isPreviewableDocument(user.identity_document) ? (
                            <img
                              src={getDocumentUrl(user.identity_document)}
                              alt={`${user.fullname || 'User'} identity document`}
                              style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'block', marginLeft: 'auto', marginBottom: '8px' }}
                            />
                          ) : null}
                          <strong style={{ color: '#111827', fontSize: '13px' }}>{user.identity_number || getDocumentFileName(user.identity_document) || '-'}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => navigate(`/users/${user.id}`)}
                        style={{
                          flex: 1,
                          background: '#0f172a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontWeight: '700',
                        }}
                      >
                        <Eye size={16} />
                        Open Form
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleting === user.id}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          color: '#dc2626',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontWeight: '700',
                          opacity: deleting === user.id ? 0.6 : 1,
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
          Showing {filteredUsers.length} of {totalUsers} users
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
