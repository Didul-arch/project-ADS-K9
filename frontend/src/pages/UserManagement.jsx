import React, { useState, useEffect } from 'react';
import { apiJson } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Search, Trash2, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search or filters change
  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await apiJson('/v1/users/', { token });
      if (result.ok && result.data) {
        setUsers(result.data);
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
          user.fullname.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => {
        const userRole = user.role.toLowerCase();
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

  const handleUpdateRole = async (userId, newRole) => {
    setUpdating(userId);
    try {
      const result = await apiJson(`/v1/users/${userId}`, {
        method: 'PATCH',
        body: { role: newRole },
        token,
      });
      if (result.ok) {
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
        );
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    setUpdating(userId);
    try {
      const result = await apiJson(`/v1/users/${userId}`, {
        method: 'PATCH',
        body: { is_active: newStatus },
        token,
      });
      if (result.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, is_active: newStatus } : user
          )
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setDeleting(userId);
    try {
      const result = await apiJson(`/v1/users/${userId}`, {
        method: 'DELETE',
        token,
      });
      if (result.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
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
  const adminCount = users.filter((u) => u.role.toLowerCase() === 'admin').length;
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

        {/* Users Table */}
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No users found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>User</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Role</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <p style={{ fontWeight: '600', margin: '0 0 4px', color: '#111827' }}>{user.fullname}</p>
                          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>{user.email}</p>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          disabled={updating === user.id}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: user.role.toLowerCase() === 'admin' ? '#fee2e2' : '#dcfce7',
                            color: user.role.toLowerCase() === 'admin' ? '#dc2626' : '#16a34a',
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="civitas">Civitas</option>
                          <option value="umum">User</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={user.is_active ? 'active' : 'suspended'}
                          onChange={(e) => handleUpdateStatus(user.id, e.target.value === 'active')}
                          disabled={updating === user.id}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: user.is_active ? '#dcfce7' : '#fef3c7',
                            color: user.is_active ? '#16a34a' : '#d97706',
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleting === user.id}
                          style={{
                            background: '#fee2e2',
                            border: 'none',
                            color: '#dc2626',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            opacity: deleting === user.id ? 0.6 : 1,
                          }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
