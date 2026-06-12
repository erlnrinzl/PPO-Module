import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MonitoringDashboard } from './components/MonitoringDashboard';
import { FlowBUP } from './components/FlowBUP';
import { FlowTewas } from './components/FlowTewas';
import { FlowPengunduranDiri } from './components/FlowPengunduranDiri';
import { FlowHilang } from './components/FlowHilang';
import { FlowVerifikasi } from './components/FlowVerifikasi';
import { FlowMPP } from './components/FlowMPP';

export type Role = 'pegawai' | 'atasan' | 'sdm-satker' | 'sdm-ue1' | 'biro-sdm';
export type View = 'monitoring' | 'bup' | 'tewas' | 'pengunduran-diri' | 'hilang' | 'verifikasi' | 'mpp';

export const ROLE_LABELS: Record<Role, string> = {
  'pegawai': 'Pegawai',
  'atasan': 'Atasan Langsung',
  'sdm-satker': 'Unit SDM Satker',
  'sdm-ue1': 'Unit SDM UE1',
  'biro-sdm': 'Biro SDM',
};

export const VIEW_LABELS: Record<View, string> = {
  'monitoring': 'Flow 1: Monitoring Pemberhentian & Pensiun',
  'bup': 'Flow 2: Usulan Pemberhentian karena BUP, Meninggal, Uzur',
  'tewas': 'Flow 3: Usulan Pemberhentian karena Tewas',
  'pengunduran-diri': 'Flow 4: Usulan Pengunduran Diri',
  'hilang': 'Flow 5: Usulan Pegawai Hilang atau Ditemukan',
  'verifikasi': 'Flow 6: Verifikasi, Usul Pertek & Penetapan SK',
  'mpp': 'Flow 7: Pengajuan Masa Persiapan Pensiun (MPP)',
};

// Access control matrix — source of truth for all role-based restrictions
export const VIEW_ACCESS: Record<View, Role[]> = {
  'monitoring':       ['sdm-satker', 'sdm-ue1', 'biro-sdm'],
  'bup':              ['sdm-satker', 'sdm-ue1', 'biro-sdm'],
  'tewas':            ['sdm-satker', 'sdm-ue1', 'biro-sdm'],
  'pengunduran-diri': ['pegawai', 'atasan', 'sdm-satker', 'sdm-ue1', 'biro-sdm'],
  'hilang':           ['sdm-satker', 'sdm-ue1', 'biro-sdm'],
  'verifikasi':       ['biro-sdm'],
  'mpp':              ['pegawai', 'atasan', 'sdm-satker', 'sdm-ue1', 'biro-sdm'],
};

export function canAccess(role: Role, view: View): boolean {
  return VIEW_ACCESS[view].includes(role);
}

// Get default view for each role
export function getDefaultView(role: Role): View {
  switch (role) {
    case 'pegawai':
    case 'atasan':
      return 'pengunduran-diri'; // Pegawai dan atasan default ke Flow 4
    case 'biro-sdm':
    case 'sdm-satker':
    case 'sdm-ue1':
    default:
      return 'monitoring'; // SDM roles default ke Flow 1
  }
}

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('sdm-satker');
  const [currentView, setCurrentView] = useState<View>('monitoring');

  // When role changes, redirect to default view if current view is no longer accessible
  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    if (!canAccess(newRole, currentView)) {
      setCurrentView(getDefaultView(newRole));
    }
  };

  // Guard: if somehow view is inaccessible for current role, fall back to role's default view
  useEffect(() => {
    if (!canAccess(currentRole, currentView)) {
      setCurrentView(getDefaultView(currentRole));
    }
  }, [currentRole, currentView]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#EEF2F7]">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} currentRole={currentRole} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          currentView={currentView}
          onNavigate={setCurrentView}
        />
        <main className="flex-1 overflow-auto">
          {currentView === 'monitoring' && <MonitoringDashboard role={currentRole} onNavigate={setCurrentView} />}
          {currentView === 'bup' && canAccess(currentRole, 'bup') && <FlowBUP role={currentRole} />}
          {currentView === 'tewas' && canAccess(currentRole, 'tewas') && <FlowTewas role={currentRole} />}
          {currentView === 'pengunduran-diri' && canAccess(currentRole, 'pengunduran-diri') && <FlowPengunduranDiri role={currentRole} />}
          {currentView === 'hilang' && canAccess(currentRole, 'hilang') && <FlowHilang role={currentRole} />}
          {currentView === 'verifikasi' && canAccess(currentRole, 'verifikasi') && <FlowVerifikasi role={currentRole} />}
          {currentView === 'mpp' && canAccess(currentRole, 'mpp') && <FlowMPP role={currentRole} />}
        </main>
      </div>
    </div>
  );
}
