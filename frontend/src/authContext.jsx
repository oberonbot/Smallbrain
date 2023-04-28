import React, { createContext, useEffect, useState } from 'react';
import api from './utils'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const login = async (email, password) => {
    const body = {
      email,
      password
    }
    const res = await api('admin/auth/login', 'POST', body, undefined);
    if (res.status === 200) {
      setCurrentUser(res.data.token);
    }
    return res;
  };

  const logout = async () => {
    const res = await api('admin/auth/logout', 'POST', undefined, currentUser);
    if (res.status === 200) {
      setCurrentUser(null);
    }
    return res;
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
