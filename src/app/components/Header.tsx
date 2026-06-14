import { useState } from 'react';
import { Bell, ChevronRight, Settings, X, ChevronDown } from 'lucide-react';
import { PAGE_LABELS, ROLE_LABELS, type Role, type View } from '../routes/routeConfig';

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type: 'warning' | 'info' | 'success' | 'error';
  roles: Role[];
}

const ALL_NOTIFS: Notification[] = [
  {
    id: '1', title: 'Mendesak: BUP < 1 Bulan',
    body: 'Gunawan Wibowo (NIP: 197207151995031003) akan mencapai BUP dalam 28 hari.',
    time: '5 menit lalu', unread: true, type: 'error',
    roles: ['sdm-satker', 'sdm-ue1', 'biro-sdm'],
  },
  {
    id: '2', title: 'Berkas Belum Lengkap',
    body: 'Pemberhentian atas nama Ahmad Subarjo memerlukan clearance BMN.',
    time: '1 jam lalu', unread: true, type: 'warning',
    roles: ['sdm-satker', 'sdm-ue1', 'biro-sdm'],
  },
  {
    id: '3', title: 'Permohonan MPP Baru',
    body: 'Indah Pertiwi mengajukan MPP mulai 01 Februari 2025.',
    time: '3 jam lalu', unread: true, type: 'info',
    roles: ['atasan', 'sdm-satker', 'sdm-ue1', 'biro-sdm'],
  },
  {
    id: '4', title: 'SK Pemberhentian Terbit',
    body: 'SK Pemberhentian Sri Rahayu telah diterbitkan dan siap diunduh.',
    time: 'Kemarin', unread: false, type: 'success',
    roles: ['sdm-satker', 'sdm-ue1', 'biro-sdm'],
  },
  {
    id: '5', title: 'Usulan Pengunduran Diri',
    body: 'Hendra Kusuma mengajukan pengunduran diri. Menunggu review Anda.',
    time: 'Kemarin', unread: false, type: 'info',
    roles: ['atasan', 'sdm-satker', 'sdm-ue1', 'biro-sdm'],
  },
  {
    id: '6', title: 'Status Pengajuan MPP Anda',
    body: 'Pengajuan MPP Anda sedang dalam proses review oleh Atasan Langsung.',
    time: '2 jam lalu', unread: true, type: 'info',
    roles: ['pegawai'],
  },
  {
    id: '7', title: 'Dokumen Perlu Dilengkapi',
    body: 'Harap melengkapi dokumen surat keterangan sehat untuk proses MPP.',
    time: 'Kemarin', unread: true, type: 'warning',
    roles: ['pegawai'],
  },
  {
    id: '8', title: 'Usulan Menunggu Review Anda',
    body: 'Terdapat 2 usulan pengunduran diri dari bawahan yang menunggu persetujuan Anda.',
    time: '30 menit lalu', unread: true, type: 'warning',
    roles: ['atasan'],
  },
];

const NOTIF_COLORS: Record<Notification['type'], string> = {
  error: '#EF4444', warning: '#F97316', info: '#60A5FA', success: '#10B981',
};

const NOTIF_DOT_COLORS: Record<Notification['type'], string> = {
  error: 'bg-red-400', warning: 'bg-orange-400', info: 'bg-blue-400', success: 'bg-emerald-400',
};

// User profiles per role for display in header
const ROLE_USER_PROFILES: Record<Role, { name: string; nip: string; initials: string }> = {
  'pegawai':    { name: 'Indah Pertiwi',      nip: 'NIP: 197809152005012002', initials: 'IP' },
  'atasan':     { name: 'Dr. Bambang Susilo',  nip: 'NIP: 196504201990031001', initials: 'BS' },
  'sdm-satker': { name: 'Reni Agustina',       nip: 'NIP: 198206102006042003', initials: 'RA' },
  'sdm-ue1':    { name: 'Hadi Purnomo',        nip: 'NIP: 197112251997031004', initials: 'HP' },
  'biro-sdm':   { name: 'Dra. Sri Wahyuni',    nip: 'NIP: 196808131993032001', initials: 'SW' },
};

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (r: Role) => void;
  currentView: View;
  onNavigate: (v: View) => void;
}

const roles: Role[] = ['pegawai', 'atasan', 'sdm-satker', 'sdm-ue1', 'biro-sdm'];

export function Header({ currentRole, onRoleChange, currentView }: HeaderProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const notifs = ALL_NOTIFS.filter(n => n.roles.includes(currentRole));
  const unreadCount = notifs.filter(n => n.unread).length;
  const userProfile = ROLE_USER_PROFILES[currentRole];

  const viewParts = PAGE_LABELS[currentView].split(':');
  const flowLabel = viewParts[0].trim();
  const viewTitle = viewParts[1]?.trim() ?? viewParts[0].trim();

  return (
    <header
      className="shrink-0 px-6 py-0 flex items-center justify-between z-20"
      style={{ background: '#1E40AF', height: '56px' }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-blue-200/70" style={{ fontSize: '11px' }}>
          <span>HRIS Kemenkeu</span>
          <ChevronRight size={11} />
          <span>Modul PPO</span>
          <ChevronRight size={11} />
          <span className="text-blue-100 font-medium">{flowLabel}</span>
        </div>
        <span className="text-blue-300/50 mx-1">|</span>
        <span className="text-white font-semibold" style={{ fontSize: '13px' }}>{viewTitle}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => { setShowRoleMenu(s => !s); setShowNotif(false); }}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-white/10 border border-white/20"
            style={{ fontSize: '12px' }}
          >
            <span className="text-blue-200 font-medium">Peran:</span>
            <span className="text-white font-semibold">{ROLE_LABELS[currentRole]}</span>
            <ChevronDown size={13} className="text-blue-200" />
          </button>
          {showRoleMenu && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => { onRoleChange(r); setShowRoleMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    r === currentRole
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(s => !s); setShowRoleMenu(false); }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Bell size={17} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-sm">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                <button onClick={() => setShowNotif(false)}>
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              {notifs.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">Tidak ada notifikasi</div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifs.map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${n.unread ? 'bg-blue-50/40' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: NOTIF_COLORS[n.type] }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                        {n.unread && <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${NOTIF_DOT_COLORS[n.type]}`} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Settings size={17} className="text-white" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/20">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: '#1D4ED8' }}
          >
            {userProfile.initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-white font-semibold leading-tight" style={{ fontSize: '12px' }}>{userProfile.name}</p>
            <p className="text-blue-200/70 leading-tight" style={{ fontSize: '10px' }}>{userProfile.nip}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
