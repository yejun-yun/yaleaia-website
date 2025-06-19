// contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
        } catch (error) {
          console.error("Error getting ID token:", error);
          setIdToken(null); // Ensure token is cleared on error
        }
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setIdToken(null);
    } catch (error) {
      console.error("Error signing out: ", error);
      // Optionally, notify the user of the error
    }
  };

  const value = {
    currentUser,
    idToken,
    loadingAuth: loading,
    logout,
    refreshIdToken: async () => { // Function to manually refresh token if needed
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken(true); // true forces refresh
          setIdToken(token);
          return token;
        } catch (error) {
          console.error("Error refreshing ID token:", error);
          // Handle token refresh error, possibly by logging out the user
          await logout(); 
          return null;
        }
      }
      return null;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 