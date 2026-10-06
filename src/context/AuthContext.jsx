import React, { createContext, useContext, useState, useEffect } from 'react';

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
    role: 'Student Researcher / ML Developer',
    roleType: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav',
    badge: 'ML Student',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    key: 'meera',
    name: 'Dr. Meera Rao',
    email: 'meera@proofweave.io',
    password: 'meera123',
    role: 'Domain Mentor / Senior Researcher',
    roleType: 'expert',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
    badge: 'Mentor',
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
    name: 'ProofWeave Admin',
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
    if (savedEmail) {
      const match = DEMO_CREDENTIALS.find(c => c.email === savedEmail);
      if (match) {
        setUser(match);
        setIsAuthenticated(true);
      }
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /*  login — flexible: handles (email, password) OR a user object     */
  /* ---------------------------------------------------------------- */
  const login = async (emailOrObj, password) => {
    // Called with a user object directly (e.g., from demo quick-select)
    if (emailOrObj && typeof emailOrObj === 'object' && emailOrObj.email) {
      setUser(emailOrObj);
      setIsAuthenticated(true);
      localStorage.setItem('pw_user_email', emailOrObj.email);
      return { success: true, user: emailOrObj };
    }
    // Called with (email, password) strings
    const email = String(emailOrObj || '').toLowerCase().trim();
    const matched = DEMO_CREDENTIALS.find(
      c => c.email.toLowerCase() === email && c.password === password
    );
    if (matched) {
      setUser(matched);
      setIsAuthenticated(true);
      localStorage.setItem('pw_user_email', matched.email);
      return { success: true, user: matched };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  /* Legacy alias */
  const loginWithCredentials = login;

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pw_user_email');
    localStorage.removeItem('pw_token');
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
