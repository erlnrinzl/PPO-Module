import { AlertCircle, AlertTriangle, Clock, Users } from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';

interface MonitoringStatRowProps {
    kritis: number;
    segera: number;
    dalamProses: number;
    perluTindak: number;
    allDataLength: number;
}

export function MonitoringStatRow({ kritis, segera, dalamProses, perluTindak, allDataLength }: MonitoringStatRowProps) {
    return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Pegawai Dipantau" value={allDataLength} sub="Data per hari ini" color="#2563EB" bg="#EFF6FF" />
        <StatCard icon={AlertCircle} label="BUP Kritis (< 3 bln)" value={kritis} sub="Perlu tindak segera" color="#EF4444" bg="#FEF2F2" />
        <StatCard icon={AlertTriangle} label="Segera BUP (3–12 bln)" value={segera} sub="Perlu persiapan" color="#F97316" bg="#FFF7ED" />
        <StatCard icon={Clock} label="Dalam Proses / Perlu Aksi" value={dalamProses + perluTindak} sub={`${dalamProses} proses, ${perluTindak} perlu aksi`} color="#8B5CF6" bg="#F5F3FF" />
      </div>
    );
}

