import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../constants/financeTypes';
import { MMKV } from 'react-native-mmkv';
import { DeviceEventEmitter } from 'react-native';

const storage = new MMKV();

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, grade: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on initial load and listen for auth changes
  useEffect(() => {
    const loadUser = () => {
      const user = storage.getString('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };

    loadUser();

    const subscription = DeviceEventEmitter.addListener('authChange', loadUser);
    return () => subscription.remove();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(storage.getString('users') || '[]') as StoredUser[];
      const user = users.find((u) => u.email === email);
      
      if (user && user.password === password) {
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        setIsAuthenticated(true);
        storage.set('currentUser', JSON.stringify(userWithoutPassword));
        DeviceEventEmitter.emit('authChange');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, grade: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(storage.getString('users') || '[]') as StoredUser[];
      
      if (users.some((u) => u.email === email)) {
        return false;
      }
      
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name,
        grade,
        email,
        password,
      };
      
      users.push(newUser);
      storage.set('users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      storage.set('currentUser', JSON.stringify(userWithoutPassword));
      DeviceEventEmitter.emit('authChange');
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    storage.delete('currentUser');
    storage.delete('finance_tracker_transactions');
    DeviceEventEmitter.emit('authChange');
  };
  
};