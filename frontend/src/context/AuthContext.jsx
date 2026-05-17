import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Specific Preset Dummy Profiles as requested
const dummyUsers = [
  {
    email: 'luqman@apps.ipb.ac.id',
    password: 'luqman123',
    name: 'luqman',
    nim: 'g6401231901',
    role: 'Student', // Civitas IPB User
    department: 'Ilmu Komputer'
  },
  {
    email: 'naufal@apps.ipb.ac.id',
    password: 'naufal123',
    name: 'naufal',
    nim: 'g6401231902',
    role: 'Student', // Civitas IPB User
    department: 'Ilmu Komputer'
  },
  {
    email: 'syafiq@apps.ipb.ac.id',
    password: 'syafiq123',
    name: 'syafiq',
    nim: 'g6401231903',
    role: 'Admin', // Admin Profile
    department: 'Keamanan Sistem'
  }
];

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

  const login = (email, password) => {
    const lowerEmail = email.trim().toLowerCase();

    // 1. Check in specific Preset Dummy profiles
    const presetFound = dummyUsers.find(
      (u) => u.email.toLowerCase() === lowerEmail && u.password === password
    );

    if (presetFound) {
      const { password: _, ...userData } = presetFound;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }

    // 2. Check in newly registered users in LocalStorage
    const localUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const localFound = localUsers.find(
      (u) => u.email.toLowerCase() === lowerEmail && u.password === password
    );

    if (localFound) {
      const { password: _, ...userData } = localFound;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }

    return false; // Authentication failed (wrong credentials)
  };

  const loginWithGoogle = (role = 'User') => {
    // Retain legacy simulated Google login safely
    const userData = { 
      email: role === 'Admin' ? 'syafiq@apps.ipb.ac.id' : 'luqman@apps.ipb.ac.id', 
      name: role === 'Admin' ? 'syafiq' : 'luqman', 
      role: role === 'Admin' ? 'Admin' : 'Student', 
      nim: role === 'Admin' ? 'g6401231903' : 'g6401231901',
      department: 'Ilmu Komputer'
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const signUp = (name, email, password, phone) => {
    const lowerEmail = email.trim().toLowerCase();
    
    // Check for duplicates
    const isPreset = dummyUsers.some((u) => u.email.toLowerCase() === lowerEmail);
    const localUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const isLocal = localUsers.some((u) => u.email.toLowerCase() === lowerEmail);

    if (isPreset || isLocal) {
      return false; // Email already taken
    }

    // Register a new General Public (Non-IPB) account
    const newRegister = {
      name,
      email: lowerEmail,
      password,
      phone: phone || '+6281234567890',
      role: 'User', // Exclusively registered as General User
      department: 'Umum / Non-IPB'
    };

    localUsers.push(newRegister);
    localStorage.setItem('registered_users', JSON.stringify(localUsers));

    // Log the user in immediately
    const { password: _, ...userData } = newRegister;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const switchRole = (newRole) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        role: newRole,
        name: newRole === 'Admin' ? 'syafiq' : 'luqman',
        email: newRole === 'Admin' ? 'syafiq@apps.ipb.ac.id' : 'luqman@apps.ipb.ac.id',
        nim: newRole === 'Admin' ? 'g6401231903' : 'g6401231901',
        department: 'Ilmu Komputer'
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
