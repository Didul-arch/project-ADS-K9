import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (simulation)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role = 'User') => {
    // Simulated login
    const userData = { email, name: role === 'Admin' ? 'Admin IPB' : 'Budi Santoso', role };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const loginWithGoogle = (role = 'User') => {
    // Simulated Google login
    const userData = { 
      email: role === 'Admin' ? 'admin@apps.ipb.ac.id' : 'budi@apps.ipb.ac.id', 
      name: role === 'Admin' ? 'Admin System' : 'Budi Santoso', 
      role, 
      avatar: 'https://i.pravatar.cc/150?u=ipb' 
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const signUp = (name, email, password) => {
    // Simulated signUp
    const userData = { name, email, role: 'Student' };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const switchRole = (newRole) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        role: newRole,
        name: newRole === 'Admin' ? 'Admin System' : 'Budi Santoso',
        email: newRole === 'Admin' ? 'admin@apps.ipb.ac.id' : 'budi@apps.ipb.ac.id'
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, loginWithGoogle, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
