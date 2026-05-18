import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', email.trim());
      params.append('password', password);

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!response.ok) {
        return false;
      }

      const tokenData = await response.json();
      const token = tokenData.access_token;
      localStorage.setItem('token', token);

      // Fetch user profile info
      const meResponse = await fetch('http://localhost:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!meResponse.ok) {
        logout();
        return false;
      }

      const dbUser = await meResponse.json();
      
      // Map backend role enum to frontend roles:
      // Backend: 'admin', 'civitas', 'umum'
      // Frontend expects: 'Admin', 'Student'
      const mappedRole = dbUser.role === 'admin' ? 'Admin' : 'Student';

      const userData = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.fullname,
        role: mappedRole,
        nim: dbUser.email.endsWith('@apps.ipb.ac.id') 
          ? 'G64' + Math.floor(1000000 + Math.random() * 9000000)
          : '',
        department: dbUser.role === 'admin' ? 'Direktorat Sistem Informasi' : 'Ilmu Komputer'
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const signUp = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          fullname: name,
          password: password
        }),
      });

      if (!response.ok) {
        return false;
      }

      // Automatically log the user in after successful sign up
      return await login(email, password);
    } catch (error) {
      console.error('SignUp error:', error);
      return false;
    }
  };

  // Backward compatible stub
  const switchRole = () => {};

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
