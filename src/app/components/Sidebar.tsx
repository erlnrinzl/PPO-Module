import {
  LayoutDashboard, Users, HeartCrack, DoorOpen, Search,
  FileCheck2, CalendarClock, ShieldCheck
} from 'lucide-react';
import type { View, Role } from '../App';
import { VIEW_ACCESS } from '../App';

interface NavItem {
  id: View;
  icon: React.ElementType;
  flow: string;
  label: string;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'monitoring', icon: LayoutDashboard, flow: 'Flow 1',
    label: 'Monitoring',
  },
  {
    id: 'bup', icon: Users, flow: 'Flow 2',
    label: 'BUP / Meninggal / Uzur',
    badge: '7', badgeColor: '#F97316',
  },
  {
    id: 'tewas', icon: HeartCrack, flow: 'Flow 3',
    label: 'Pemberhentian Tewas',
    badge: '2', badgeColor: '#EF4444',
  },
  {
    id: 'pengunduran-diri', icon: DoorOpen, flow: 'Flow 4',
    label: 'Pengunduran Diri',
    badge: '4', badgeColor: '#8B5CF6',
  },
  {
    id: 'hilang', icon: Search, flow: 'Flow 5',
    label: 'Pegawai Hilang / Ditemukan',
    badge: '1', badgeColor: '#6B7280',
  },
  {
    id: 'verifikasi', icon: FileCheck2, flow: 'Flow 6',
    label: 'Verifikasi & Penetapan SK',
    badge: '5', badgeColor: '#2563EB',
  },
  {
    id: 'mpp', icon: CalendarClock, flow: 'Flow 7',
    label: 'Masa Persiapan Pensiun',
    badge: '9', badgeColor: '#059669',
  },
];

interface SidebarProps {
  currentView: View;
  onNavigate: (v: View) => void;
  currentRole: Role;
}

export function Sidebar({ currentView, onNavigate, currentRole }: SidebarProps) {
  const visible = NAV_ITEMS.filter(n => VIEW_ACCESS[n.id].includes(currentRole));

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full bg-white border-r border-gray-200">
      {/* Branding */}
      <div
        className="px-4 py-3 flex items-center gap-3 shrink-0"
        style={{ background: '#1E3A8A', minHeight: '56px' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: '#F59E0B' }}
        >
          <ShieldCheck size={16} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold leading-tight" style={{ fontSize: '13px' }}>HRIS Kemenkeu</div>
          <div className="text-blue-200/70 leading-tight" style={{ fontSize: '10px' }}>Modul PPO</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        <p className="px-2 py-1.5 text-gray-400 text-[10px] uppercase tracking-widest font-semibold">
          Alur Proses
        </p>
        {visible.map(item => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all group ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                active
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
              }`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] font-medium leading-none mb-0.5 ${active ? 'text-blue-400' : 'text-gray-400'}`}>
                  {item.flow}
                </div>
                <div className={`text-xs font-medium leading-tight truncate ${active ? 'text-blue-700' : ''}`}>
                  {item.label}
                </div>
              </div>
              {item.badge && (
                <span
                  className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  style={{ background: item.badgeColor }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-gray-300 text-[10px] text-center">© 2024 Kemenkeu RI · v2.1.0</p>
      </div>
    </aside>
  );
}
