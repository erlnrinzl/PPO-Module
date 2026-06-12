import { FileText, Clock, AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { StatusProses, Pegawai } from '../data/mockData';
import { getStatusColor } from '../data/mockData';

interface MiniDashboardProps {
  data: Pegawai[];
  onFilterClick: (status: StatusProses | '') => void;
  currentFilter: StatusProses | '';
}

interface StatusCardProps {
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
  bg: string;
  status: StatusProses | '';
  isActive: boolean;
  onClick: () => void;
}

function StatusCard({ icon: Icon, label, count, color, bg, isActive, onClick }: StatusCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-white rounded-xl p-4 border-2 transition-all hover:shadow-md ${
        isActive ? 'border-blue-500 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {isActive && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <CheckCircle size={12} className="text-white" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: bg }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide truncate">{label}</p>
          <p className="text-xl font-bold text-gray-800 leading-tight">{count}</p>
        </div>
      </div>
    </button>
  );
}

export function MiniDashboard({ data, onFilterClick, currentFilter }: MiniDashboardProps) {
  const stats = [
    {
      status: 'Belum Diproses' as StatusProses,
      label: 'Belum Diproses',
      icon: FileText,
      color: '#6B7280',
      bg: '#F9FAFB',
      count: data.filter(p => p.statusProses === 'Belum Diproses').length,
    },
    {
      status: 'Dalam Proses' as StatusProses,
      label: 'Dalam Proses',
      icon: Clock,
      color: '#3B82F6',
      bg: '#EFF6FF',
      count: data.filter(p => p.statusProses === 'Dalam Proses').length,
    },
    {
      status: 'Menunggu Verifikasi' as StatusProses,
      label: 'Menunggu Verifikasi',
      icon: AlertCircle,
      color: '#F59E0B',
      bg: '#FFF7ED',
      count: data.filter(p => p.statusProses === 'Menunggu Verifikasi').length,
    },
    {
      status: 'Menunggu Persetujuan' as StatusProses,
      label: 'Menunggu Persetujuan',
      icon: AlertTriangle,
      color: '#8B5CF6',
      bg: '#F5F3FF',
      count: data.filter(p => p.statusProses === 'Menunggu Persetujuan').length,
    },
    {
      status: 'Perlu Tindak Lanjut' as StatusProses,
      label: 'Perlu Tindak Lanjut',
      icon: XCircle,
      color: '#F97316',
      bg: '#FFF7ED',
      count: data.filter(p => p.statusProses === 'Perlu Tindak Lanjut').length,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Status Dokumen</h3>
          <p className="text-xs text-gray-500 mt-0.5">Klik card untuk filter otomatis</p>
        </div>
        {currentFilter && (
          <button
            onClick={() => onFilterClick('')}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset Filter
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map(stat => (
          <StatusCard
            key={stat.status}
            icon={stat.icon}
            label={stat.label}
            count={stat.count}
            color={stat.color}
            bg={stat.bg}
            status={stat.status}
            isActive={currentFilter === stat.status}
            onClick={() => onFilterClick(currentFilter === stat.status ? '' : stat.status)}
          />
        ))}
      </div>
    </div>
  );
}
