import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffRole } from '../types';

interface AuthContextType {
  isStaffAuthenticated: boolean;
  staffRole: StaffRole | null;
  staffName: string;
  loginAsStaff: (role: StaffRole, name?: string) => void;
  logoutStaff: () => void;
  hasPermission: (requiredRole: StaffRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('finah_staff_auth') === 'true';
    }
    return false;
  });

  const [staffRole, setStaffRole] = useState<StaffRole | null>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('finah_staff_role') as StaffRole) || 'manager';
    }
    return 'manager';
  });

  const [staffName, setStaffName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('finah_staff_name') || 'Lalla Nadia';
    }
    return 'Lalla Nadia';
  });

  const loginAsStaff = (role: StaffRole, name?: string) => {
    const assignedName = name || (role === 'owner' ? 'Lalla Nadia (Owner)' : role === 'manager' ? 'Siham (Manager)' : role === 'reception' ? 'Yasmine (Front Desk)' : 'Kenza (Senior Therapist)');
    setIsStaffAuthenticated(true);
    setStaffRole(role);
    setStaffName(assignedName);
    localStorage.setItem('finah_staff_auth', 'true');
    localStorage.setItem('finah_staff_role', role);
    localStorage.setItem('finah_staff_name', assignedName);
  };

  const logoutStaff = () => {
    setIsStaffAuthenticated(false);
    setStaffRole(null);
    localStorage.removeItem('finah_staff_auth');
    localStorage.removeItem('finah_staff_role');
    localStorage.removeItem('finah_staff_name');
  };

  const hasPermission = (allowedRoles: StaffRole[]): boolean => {
    if (!isStaffAuthenticated || !staffRole) return false;
    if (staffRole === 'owner') return true; // Owner has all permissions
    return allowedRoles.includes(staffRole);
  };

  return (
    <AuthContext.Provider
      value={{
        isStaffAuthenticated,
        staffRole,
        staffName,
        loginAsStaff,
        logoutStaff,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
