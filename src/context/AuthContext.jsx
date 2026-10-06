import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

/* ------------------------------------------------------------------ */
/*  Demo user roster (email + password pairs for login screen)         */
/* ------------------------------------------------------------------ */
export const DEMO_CREDENTIALS = [
  {
    key: 'bhumikaa',
    name: 'Bhumikaa B',
    email: 'bhumikaa@proofweave.io',
    password: 'bhumikaa123',
    role: 'Student Researcher / Data Engineer',
    roleType: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bhumikaa',
    badge: 'Student Lead',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    key: 'aarav',
    name: 'Aarav Patel',
    email: 'aarav@proofweave.io',
    password: 'aarav123',
    role: 'Mentor / ML Advisor',
    roleType: 'mentor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav',
    badge: 'Mentor',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    key: 'meera',
    name: 'Dr. Meera Rao',
    email: 'meera@proofweave.io',
    password: 'meera123',
    role: 'Domain Expert / Senior Researcher',
    roleType: 'expert',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
    badge: 'Expert',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    key: 'sponsor',
    name: 'AquaNova Research Labs',
    email: 'sponsor@aquanova.io',
    password: 'sponsor123',
    role: 'Project Sponsor & Director',
    roleType: 'sponsor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aquanova',
    badge: 'Sponsor',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    key: 'admin',
    name: 'Verixa Admin',
    email: 'admin@proofweave.io',
    password: 'admin123',
    role: 'Platform Security & Governance',
    roleType: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=adminuser',
    badge: 'Admin',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Contribution Validated',   message: 'Dr. Meera Rao validated your dataset cleaning pipeline.', time: '10m ago', read: false },
    { id: 2, title: 'Charter Locked',           message: 'Project PW-1042 Charter has been accepted by all participants.', time: '1h ago', read: false },
    { id: 3, title: 'Milestone Escrow Released', message: 'Milestone 1 payout of ₹40,000 has been released.', time: '3h ago', read: true  },
  ]);

  /* Persist session across page refreshes */
  useEffect(() => {
    const savedEmail = localStorage.getItem('pw_user_email');
    const savedToken = localStorage.getItem('pw_token');
    if (savedEmail && savedToken) {
      const match = DEMO_CREDENTIALS.find(c => c.email === savedEmail);
      if (match) {
        // Restore user with the saved backend ID
        const savedId = localStorage.getItem('pw_user_id');
        setUser({ ...match, id: savedId ? parseInt(savedId) : null });
        setIsAuthenticated(true);
      }
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /*  login — calls the REAL backend API to get a JWT token            */
  /* ---------------------------------------------------------------- */
  const login = async (emailOrObj, password) => {
    let email, pwd;

    // Called with a user object directly (e.g., from demo quick-select)
    if (emailOrObj && typeof emailOrObj === 'object' && emailOrObj.email) {
      email = emailOrObj.email;
      pwd = emailOrObj.password;
    } else {
      // Called with (email, password) strings
      email = String(emailOrObj || '').toLowerCase().trim();
      pwd = password;
    }

    // Match against demo credentials for role/avatar info
    const matched = DEMO_CREDENTIALS.find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === pwd
    );
    if (!matched) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Call the REAL backend API to get a JWT token
    try {
      const backendRes = await api.login(email, pwd);
      if (backendRes && backendRes.access_token) {
        // Store the JWT token — this is CRITICAL for all authenticated API calls
        localStorage.setItem('pw_token', backendRes.access_token);
        localStorage.setItem('pw_user_email', email);

        // Merge backend user data (has numeric id) with demo credential display data
        const backendUser = backendRes.user || {};
        const mergedUser = {
          ...matched,
          id: backendUser.id,
          full_name: backendUser.full_name || matched.name,
        };
        localStorage.setItem('pw_user_id', String(backendUser.id || ''));

        setUser(mergedUser);
        setIsAuthenticated(true);
        return { success: true, user: mergedUser };
      } else {
        // Backend login failed but credentials matched demo — use fallback
        console.warn('Backend login returned no token, using fallback auth');
        localStorage.setItem('pw_user_email', email);
        localStorage.removeItem('pw_token');
        setUser(matched);
        setIsAuthenticated(true);
        return { success: true, user: matched };
      }
    } catch (err) {
      console.warn('Backend API offline, using fallback auth', err);
      localStorage.setItem('pw_user_email', email);
      localStorage.removeItem('pw_token');
      setUser(matched);
      setIsAuthenticated(true);
      return { success: true, user: matched };
    }
  };

  /* Legacy alias */
  const loginWithCredentials = login;

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pw_user_email');
    localStorage.removeItem('pw_token');
    localStorage.removeItem('pw_user_id');
  };

  const markNotificationsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const addNotification = (notif) =>
    setNotifications(prev => [{ id: Date.now(), read: false, time: 'Just now', ...notif }, ...prev]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      activeRole: user?.roleType || 'student',
      login,
      loginWithCredentials,
      logout,
      notifications,
      markNotificationsRead,
      addNotification,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
