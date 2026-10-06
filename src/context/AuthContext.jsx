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
  /*  login(userObject) — accepts a full user object or just email+pw  */
  /* ---------------------------------------------------------------- */
  const login = (userObj) => {
    setUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('pw_user_email', userObj.email);
  };

  /* Legacy helper (email + password) – used by old LoginForm if any */
  const loginWithCredentials = async (email, password) => {
    const matched = DEMO_CREDENTIALS.find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (matched) {
      login(matched);
      return { success: true, user: matched };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pw_user_email');
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
