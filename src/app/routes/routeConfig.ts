import type { Role } from '../types/role.types';
import type { View } from '../types/view.types';

export type { Role, View };

export const ROLE_LABELS: Record<Role, string> = {
  'pegawai': 'Pegawai',
  'atasan': 'Atasan Langsung',
  'sdm-satker-1': 'Unit SDM Satker 1',
  'sdm-satker-2': 'Unit SDM Satker 2',
  'sdm-ue1': 'Unit SDM UE1',
  'biro-sdm': 'Biro SDM',
};

export const PAGE_LABELS: Record<View, string> = {
  'monitoring': 'Flow 1: Monitoring Pemberhentian & Pensiun',
  'bup': 'Flow 2: Usulan Pemberhentian karena BUP, Meninggal, Uzur',
  'tewas': 'Flow 3: Usulan Pemberhentian karena Tewas',
  'pengunduran-diri': 'Flow 4: Usulan Pengunduran Diri',
  'hilang': 'Flow 5: Usulan Pegawai Hilang atau Ditemukan',
  'verifikasi': 'Flow 6: Verifikasi, Usul Pertek & Penetapan SK',
  'mpp': 'Flow 7: Pengajuan Masa Persiapan Pensiun (MPP)',
};

export const VIEW_LABELS = PAGE_LABELS;

export const VIEW_ACCESS: Record<View, Role[]> = {
  'monitoring': ['sdm-satker-1', 'sdm-satker-2', 'sdm-ue1', 'biro-sdm'],
  'bup': ['sdm-satker-1', 'sdm-satker-2', 'sdm-ue1', 'biro-sdm'],
  'tewas': ['sdm-satker-1', 'sdm-satker-2', 'sdm-ue1', 'biro-sdm'],
  'pengunduran-diri': ['pegawai', 'atasan', 'sdm-satker-1', 'sdm-satker-2', 'sdm-ue1', 'biro-sdm'],
  'hilang': ['sdm-satker-1', 'sdm-satker-2', 'sdm-ue1', 'biro-sdm'],
  'verifikasi': ['biro-sdm'],
  'mpp': ['pegawai', 'atasan', 'sdm-satker-1', 'sdm-satker-2', 'sdm-ue1', 'biro-sdm'],
};

export const VIEW_PATHS: Record<View, string> = {
  'monitoring': '/monitoring',
  'bup': '/bup',
  'tewas': '/tewas',
  'pengunduran-diri': '/pengunduran-diri',
  'hilang': '/hilang',
  'verifikasi': '/verifikasi',
  'mpp': '/mpp',
};

export function canAccess(role: Role, view: View): boolean {
  return VIEW_ACCESS[view].includes(role);
}

export function getDefaultView(role: Role): View {
  switch (role) {
    case 'pegawai':
    case 'atasan':
      return 'pengunduran-diri';
    case 'biro-sdm':
    case 'sdm-satker-1':
    case 'sdm-satker-2':
    case 'sdm-ue1':
    default:
      return 'monitoring';
  }
}

export function getPathForView(view: View): string {
  return VIEW_PATHS[view];
}

export function getViewFromPath(pathname: string): View | null {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  for (const [view, path] of Object.entries(VIEW_PATHS) as [View, string][]) {
    if (normalizedPath === path) {
      return view;
    }
  }

  return null;
}