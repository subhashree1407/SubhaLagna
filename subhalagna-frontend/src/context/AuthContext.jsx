import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Rehydrate on load
  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            // Store hasProfile state flag alongside the union of data
            setUser({ ...data.user, profile: data.profile, hasProfile: data.hasProfile });
          } else {
            setToken(null);
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error("Token verification failed", err);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role, profile: data.profile, hasProfile: data.hasProfile });
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const register = async (userData) => {
     // userData holds email, password
     const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser({ _id: data._id, name: data.name, email: data.email, role: data.role, hasProfile: false });
        return { success: true };
      }
      return { success: false, message: data.message };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfileContext = (newProfileObj) => {
    // Calling this means the profile setup finished successfully
    setUser(prev => ({ ...prev, profile: newProfileObj, hasProfile: true }));
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfileContext }}>
      {children}
    </AuthContext.Provider>
  );
};
