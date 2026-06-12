import { FileText, Clock, AlertCircle, CheckCircle, Stamp } from 'lucide-react';

type NDStatus = 'Menunggu Verifikasi' | 'Dalam Proses' | 'Menunggu Pertek' | 'Menunggu Verifikasi Pertek' | 'Verifikasi Ditolak' | 'Siap TTE' | 'Selesai';

interface NotaDinas {
  id: string;
  nomor: string;
  tanggal: string;
  perihal: string;
  dari: string;
  kepada: string;
  jenisPemberhentian: string;
  status: NDStatus;
  pegawaiIds: string[];
}

interface MiniDashboardNDProps {
  data: NotaDinas[];
  onFilterClick: (status: NDStatus | '') => void;
  currentFilter: NDStatus | '';
}

interface StatusCardProps {
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
  bg: string;
  status: NDStatus | '';
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

export function MiniDashboardND({ data, onFilterClick, currentFilter }: MiniDashboardNDProps) {
  const stats = [
    {
      status: 'Menunggu Pertek' as NDStatus,
      label: 'Menunggu Pertek',
      icon: Clock,
      color: '#EA580C',
      bg: '#FFF7ED',
      count: data.filter(nd => nd.status === 'Menunggu Pertek').length,
    },
    {
      status: 'Menunggu Verifikasi Pertek' as NDStatus,
      label: 'Menunggu Verifikasi Pertek',
      icon: AlertCircle,
      color: '#CA8A04',
      bg: '#FFFBEB',
      count: data.filter(nd => nd.status === 'Menunggu Verifikasi Pertek').length,
    },
    {
      status: 'Siap TTE' as NDStatus,
      label: 'Siap TTE',
      icon: Stamp,
      color: '#7C3AED',
      bg: '#F5F3FF',
      count: data.filter(nd => nd.status === 'Siap TTE').length,
    },
    {
      status: 'Menunggu Verifikasi' as NDStatus,
      label: 'Menunggu Verifikasi',
      icon: FileText,
      color: '#D97706',
      bg: '#FEF3C7',
      count: data.filter(nd => nd.status === 'Menunggu Verifikasi').length,
    },
  ].filter(s => s.count > 0 || ['Menunggu Pertek', 'Menunggu Verifikasi Pertek', 'Siap TTE'].includes(s.status));

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Status Nota Dinas</h3>
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
      <div className={`grid grid-cols-1 gap-3 ${stats.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
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
