// Authentication context and utilities
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile,
  updateUserProfile,
  onAuthStateChanged,
  auth 
} from './firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get user-friendly error messages
const getFriendlyErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        const errorCode = error.code || (error.message.match(/auth\/[^)]+/)?.[0]);
        setError(getFriendlyErrorMessage(errorCode || error.message));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, name, role) => {
    try {
      setError(null);
      const user = await registerUser(email, password, name, role);
      return user;
    } catch (error) {
      const errorCode = error.code || (error.message.match(/auth\/[^)]+/)?.[0]);
      setError(getFriendlyErrorMessage(errorCode || error.message));
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      setError(null);
      const user = await loginUser(email, password);
      return user;
    } catch (error) {
      const errorCode = error.code || (error.message.match(/auth\/[^)]+/)?.[0]);
      setError(getFriendlyErrorMessage(errorCode || error.message));
      throw error;
    }
  };

  const signout = async () => {
    try {
      setError(null);
      await logoutUser();
    } catch (error) {
      const errorCode = error.code || (error.message.match(/auth\/[^)]+/)?.[0]);
      setError(getFriendlyErrorMessage(errorCode || error.message));
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      setError(null);
      if (user) {
        await updateUserProfile(user.uid, data);
        const updatedProfile = await getUserProfile(user.uid);
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      const errorCode = error.code || (error.message.match(/auth\/[^)]+/)?.[0]);
      setError(getFriendlyErrorMessage(errorCode || error.message));
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    register,
    signin,
    signout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
