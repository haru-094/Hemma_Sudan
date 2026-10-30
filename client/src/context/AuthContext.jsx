import React, { createContext, useContext, useState, useEffect } from 'react';

// Demo users specified in SRS §2.3 and §2.7:
// 1 teacher, 3 mentors, multiple learners
export const DEMO_USERS = [
  {
    id: 'usr-teacher-1',
    name: 'Dr. Tariq Ahmed',
    email: 'teacher@hemma.sd',
    role: 'teacher',
    courseTitle: 'Introduction to Computer Science & Python',
    language: 'en',
  },
  {
    id: 'usr-mentor-1',
    name: 'Sarah Ibrahim',
    email: 'sarah.mentor@hemma.sd',
    role: 'mentor',
    university: 'University of Khartoum',
    approvedTopics: ['topic-1', 'topic-2'],
    language: 'en',
  },
  {
    id: 'usr-mentor-2',
    name: 'Omar Farouk',
    email: 'omar.mentor@hemma.sd',
    role: 'mentor',
    university: 'Sudan University of Science and Technology',
    approvedTopics: ['topic-2', 'topic-3'],
    language: 'ar',
  },
  {
    id: 'usr-mentor-3',
    name: 'Mona Elhassan',
    email: 'mona.mentor@hemma.sd',
    role: 'mentor',
    university: 'Al-Neelain University',
    approvedTopics: ['topic-1'],
    language: 'en',
  },
  {
    id: 'usr-learner-1',
    name: 'Ahmed Osman',
    email: 'ahmed.student@hemma.sd',
    role: 'learner',
    university: 'University of Khartoum',
    ageConfirmed: true,
    language: 'en',
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('hemma_registered_users');
      return saved ? JSON.parse(saved) : DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hemma_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[4];
      }
    }
    return DEMO_USERS[4]; // Default to learner
  });

  useEffect(() => {
    localStorage.setItem('hemma_registered_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hemma_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hemma_user');
    }
  }, [currentUser]);

  // Authentication: Login with email & password simulation
  const login = (email, password) => {
    const found = usersList.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      throw new Error('Account not found with this email address.');
    }
    setCurrentUser(found);
    return found;
  };

  // Quick switch for demo testing
  const loginAs = (userId) => {
    const found = usersList.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Registration strictly as Learner (SRS FR-1.1 & BR-1)
  const registerLearner = ({ name, email, university, ageConfirmed }) => {
    if (!ageConfirmed) {
      throw new Error('You must confirm that you are 18 years of age or older (BR-1).');
    }
    const existing = usersList.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account is already registered with this email address.');
    }

    const newLearner = {
      id: `usr-learner-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'learner', // Role is strictly learner, cannot be self-selected per FR-1.1
      university: university.trim(),
      ageConfirmed: true,
      language: 'en',
    };

    setUsersList((prev) => [...prev, newLearner]);
    setCurrentUser(newLearner);
    return newLearner;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isTeacher = currentUser?.role === 'teacher';
  const isMentor = currentUser?.role === 'mentor';
  const isLearner = currentUser?.role === 'learner' || currentUser?.role === 'mentor';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        usersList,
        login,
        loginAs,
        registerLearner,
        logout,
        isTeacher,
        isMentor,
        isLearner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
