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
    approvedTopics: ['topic-1', 'topic-2'], // e.g. Python Basics, Control Flow
    language: 'en',
  },
  {
    id: 'usr-mentor-2',
    name: 'Omar Farouk',
    email: 'omar.mentor@hemma.sd',
    role: 'mentor',
    university: 'Sudan University of Science and Technology',
    approvedTopics: ['topic-2', 'topic-3'], // Functions, Data Structures
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
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hemma_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[4]; // Default to learner
      }
    }
    return DEMO_USERS[4]; // Ahmed Osman (Learner)
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hemma_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hemma_user');
    }
  }, [currentUser]);

  const loginAs = (userId) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isTeacher = currentUser?.role === 'teacher';
  const isMentor = currentUser?.role === 'mentor';
  const isLearner = currentUser?.role === 'learner' || currentUser?.role === 'mentor'; // Mentors can also participate as learners per SRS §2.3

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAs,
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

