import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { getDefaultView, type Role, type View } from '../routes/routeConfig';

interface RoleStoreValue {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  changeRole: (role: Role, currentView: View) => View | null;
}

const RoleStoreContext = createContext<RoleStoreValue | null>(null);

export function RoleStoreProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('sdm-satker-1');

  const value = useMemo<RoleStoreValue>(() => ({
    currentRole,
    setCurrentRole,
    changeRole: (role: Role, currentView: View) => {
      setCurrentRole(role);
      return getDefaultView(role) === currentView ? null : getDefaultView(role);
    },
  }), [currentRole]);

  return <RoleStoreContext.Provider value={value}>{children}</RoleStoreContext.Provider>;
}

export function useRoleStore() {
  const context = useContext(RoleStoreContext);

  if (!context) {
    throw new Error('useRoleStore must be used within a RoleStoreProvider');
  }

  return context;
}