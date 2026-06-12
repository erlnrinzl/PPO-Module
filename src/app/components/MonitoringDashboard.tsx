import { useState } from 'react';
import {
  Users, AlertTriangle, Clock, CheckCircle, TrendingUp,
  Search, ChevronDown, Eye, ArrowRight, AlertCircle,
  BarChart3, Filter, RefreshCw, Download
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts';
import type { Role, View } from '../App';
import {
  MOCK_PEGAWAI, getStatusColor, getKasusColor, getKasusLabel,
  getSisaBulanColor, getSisaBulanLabel, type Pegawai, type JenisKasus
} from '../data/mockData';

const CHART_DATA = [
  { bulan: 'Jul 2024', BUP: 1, MPP: 0, PengunduranDiri: 0, Lainnya: 0 },
  { bulan: 'Agu 2024', BUP: 0, MPP: 1, PengunduranDiri: 1, Lainnya: 0 },
  { bulan: 'Sep 2024', BUP: 2, MPP: 0, PengunduranDiri: 0, Lainnya: 1 },
  { bulan: 'Okt 2024', BUP: 1, MPP: 2, PengunduranDiri: 1, Lainnya: 0 },
  { bulan: 'Nov 2024', BUP: 3, MPP: 0, PengunduranDiri: 0, Lainnya: 1 },
  { bulan: 'Des 2024', BUP: 2, MPP: 1, PengunduranDiri: 2, Lainnya: 0 },
];

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  bg: string;
}
function StatCard({ icon: Icon, label, value, sub, color, bg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color }}>{sub}</p>}
      </div>
    </div>
  );
}

interface BadgeProps { label: string; color: string; }
function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
      style={{ background: color }}
    >
      {label}
    </span>
  );
}

const JENIS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Semua Jenis Kasus' },
  { value: 'BUP', label: 'BUP' },
  { value: 'Meninggal', label: 'Meninggal' },
  { value: 'Uzur', label: 'Uzur' },
  { value: 'Tewas', label: 'Tewas' },
  { value: 'PengunduranDiri', label: 'Pengunduran Diri' },
  { value: 'Hilang', label: 'Hilang' },
  { value: 'MPP', label: 'MPP' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'Belum Diproses', label: 'Belum Diproses' },
  { value: 'Dalam Proses', label: 'Dalam Proses' },
  { value: 'Menunggu Verifikasi', label: 'Menunggu Verifikasi' },
  { value: 'Menunggu Persetujuan', label: 'Menunggu Persetujuan' },
  { value: 'Selesai', label: 'Selesai' },
  { value: 'Perlu Tindak Lanjut', label: 'Perlu Tindak Lanjut' },
];

function getFlowForKasus(k: JenisKasus): View | null {
  if (k === 'BUP' || k === 'Meninggal' || k === 'Uzur') return 'bup';
  if (k === 'Tewas') return 'tewas';
  if (k === 'PengunduranDiri') return 'pengunduran-diri';
  if (k === 'Hilang' || k === 'Ditemukan') return 'hilang';
  if (k === 'MPP') return 'mpp';
  return null;
}

interface MonitoringDashboardProps {
  role: Role;
  onNavigate: (v: View) => void;
}

export function MonitoringDashboard({ role, onNavigate }: MonitoringDashboardProps) {
  const [search, setSearch] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);

  const allData = role === 'pegawai'
    ? MOCK_PEGAWAI.filter(p => p.id === '8')
    : role === 'atasan'
    ? MOCK_PEGAWAI.filter(p => ['8', '14', '9'].includes(p.id))
    : MOCK_PEGAWAI;

  const filtered = allData.filter(p => {
    const matchSearch =
      !search ||
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nip.includes(search) ||
      p.satker.toLowerCase().includes(search.toLowerCase());
    const matchJenis = !jenisFilter || p.jenisKasus === jenisFilter;
    const matchStatus = !statusFilter || p.statusProses === statusFilter;
    return matchSearch && matchJenis && matchStatus;
  });

  const kritis = allData.filter(p => p.sisaBulan <= 3 && p.sisaBulan > 0).length;
  const segera = allData.filter(p => p.sisaBulan > 3 && p.sisaBulan <= 12).length;
  const dalamProses = allData.filter(p => p.statusProses === 'Dalam Proses' || p.statusProses === 'Menunggu Verifikasi' || p.statusProses === 'Menunggu Persetujuan').length;
  const perluTindak = allData.filter(p => p.statusProses === 'Perlu Tindak Lanjut' || p.statusProses === 'Belum Diproses').length;

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Pegawai Dipantau" value={allData.length} sub="Data per hari ini" color="#2563EB" bg="#EFF6FF" />
        <StatCard icon={AlertCircle} label="BUP Kritis (< 3 bln)" value={kritis} sub="Perlu tindak segera" color="#EF4444" bg="#FEF2F2" />
        <StatCard icon={AlertTriangle} label="Segera BUP (3–12 bln)" value={segera} sub="Perlu persiapan" color="#F97316" bg="#FFF7ED" />
        <StatCard icon={Clock} label="Dalam Proses / Perlu Aksi" value={dalamProses + perluTindak} sub={`${dalamProses} proses, ${perluTindak} perlu aksi`} color="#8B5CF6" bg="#F5F3FF" />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Tren Kasus per Bulan</h3>
              <p className="text-xs text-gray-500">Jul 2024 – Des 2024</p>
            </div>
            <BarChart3 size={18} className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={180} key="chart-container">
            <BarChart data={CHART_DATA} barSize={12} barGap={4} key="main-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" key="grid" />
              <XAxis dataKey="bulan" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} key="xaxis" />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} key="yaxis" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} key="tooltip" />
              <Legend wrapperStyle={{ fontSize: 11 }} key="legend" />
              <Bar dataKey="BUP" fill="#3B82F6" radius={[3, 3, 0, 0]} key="bar-bup" />
              <Bar dataKey="MPP" fill="#0891B2" radius={[3, 3, 0, 0]} key="bar-mpp" />
              <Bar dataKey="PengunduranDiri" fill="#8B5CF6" radius={[3, 3, 0, 0]} key="bar-pgd" />
              <Bar dataKey="Lainnya" fill="#6B7280" radius={[3, 3, 0, 0]} key="bar-lainnya" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Distribusi Jenis Kasus</h3>
          <div className="space-y-3">
            {[
              { label: 'BUP', count: 7, color: '#3B82F6' },
              { label: 'MPP', count: 2, color: '#0891B2' },
              { label: 'Pengunduran Diri', count: 2, color: '#8B5CF6' },
              { label: 'Meninggal', count: 1, color: '#6B7280' },
              { label: 'Tewas', count: 1, color: '#991B1B' },
              { label: 'Uzur', count: 1, color: '#7C3AED' },
              { label: 'Hilang', count: 1, color: '#374151' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-800">{item.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(item.count / 7) * 100}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 mr-auto">Daftar Pemantauan Pegawai</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari NIP / Nama / Satker..."
                className="bg-transparent text-xs focus:outline-none w-44 text-gray-700 placeholder-gray-400"
              />
            </div>
            <select
              value={jenisFilter}
              onChange={e => setJenisFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none"
            >
              {JENIS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">NIP / Nama</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jabatan / Satker</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Gol / Pangkat</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl BUP</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Sisa Waktu</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jenis Kasus</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tahapan</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    <Search size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Tidak ada data yang sesuai filter</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const sisaColor = getSisaBulanColor(p.sisaBulan);
                  const kasusColor = getKasusColor(p.jenisKasus);
                  const statusColor = getStatusColor(p.statusProses);
                  const targetFlow = getFlowForKasus(p.jenisKasus);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedPegawai(p)}
                    >
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{p.nama}</p>
                        <p className="text-gray-400 mt-0.5">{p.nip}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">{p.jabatan}</p>
                        <p className="text-gray-400 mt-0.5">{p.satker}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.pangkatGolongan}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.tanggalBUP}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold" style={{ color: sisaColor }}>
                          {getSisaBulanLabel(p.sisaBulan, p.jenisKasus)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge label={getKasusLabel(p.jenisKasus)} color={kasusColor} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge label={p.statusProses} color={statusColor} />
                      </td>
                      <td className="px-4 py-3">
                        {p.totalTahapan > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(p.tahapanSaat / p.totalTahapan) * 100}%`,
                                  background: statusColor
                                }}
                              />
                            </div>
                            <span className="text-gray-500 text-[10px]">{p.tahapanSaat}/{p.totalTahapan}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedPegawai(p); }}
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Eye size={13} />
                            <span>Detail</span>
                          </button>
                          {targetFlow && role !== 'pegawai' && (
                            <button
                              onClick={e => { e.stopPropagation(); onNavigate(targetFlow); }}
                              className="flex items-center gap-1 text-white px-2 py-1 rounded-lg transition-colors"
                              style={{ background: kasusColor }}
                            >
                              <span>Proses</span>
                              <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Menampilkan {filtered.length} dari {allData.length} pegawai</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${n === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPegawai && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPegawai(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: '#162D54' }}>
              <div>
                <p className="text-white font-semibold">{selectedPegawai.nama}</p>
                <p className="text-white/60 text-xs">{selectedPegawai.nip} · {selectedPegawai.jabatan}</p>
              </div>
              <button onClick={() => setSelectedPegawai(null)} className="text-white/60 hover:text-white">
                <ArrowRight size={18} className="rotate-180" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Unit Kerja', value: selectedPegawai.unitKerja },
                  { label: 'Satker', value: selectedPegawai.satker },
                  { label: 'Pangkat / Golongan', value: selectedPegawai.pangkatGolongan },
                  { label: 'Tanggal Lahir', value: selectedPegawai.tanggalLahir },
                  { label: 'Tanggal BUP', value: selectedPegawai.tanggalBUP },
                  { label: 'Nomor Kasus', value: selectedPegawai.nomorKasus },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2">Jenis & Status Kasus</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label={getKasusLabel(selectedPegawai.jenisKasus)} color={getKasusColor(selectedPegawai.jenisKasus)} />
                  <Badge label={selectedPegawai.statusProses} color={getStatusColor(selectedPegawai.statusProses)} />
                </div>
                {selectedPegawai.keterangan && (
                  <p className="text-xs text-gray-600 mt-2">{selectedPegawai.keterangan}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ background: '#162D54' }}
                  onClick={() => {
                    const flow = getFlowForKasus(selectedPegawai.jenisKasus);
                    if (flow) { onNavigate(flow); setSelectedPegawai(null); }
                  }}
                >
                  Proses di Flow Terkait
                </button>
                <button
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
                  onClick={() => setSelectedPegawai(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
