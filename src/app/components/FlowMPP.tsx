import { useState } from 'react';
import { CalendarClock, X, Check, AlertCircle, Calendar, User, Building2, ShieldCheck, ChevronRight, Search, ArrowLeft } from 'lucide-react';
import type { Role } from '../routes/routeConfig';
// import { MOCK_PEGAWAI, getStatusColor, type Pegawai, type StatusProses } from '../data/mockData';

import { getStatusColor, getKasusColor, getKasusLabel, getSisaBulanColor, getSisaBulanLabel  } from '../utils/case.util';
import { type Pegawai, StatusProses } from '../types/employee.types';
import { MOCK_PEGAWAI } from '../data/mockData';

import { WorkflowStepper, type Step } from './WorkflowStepper';
import { BerkasSection, type BerkasFile } from './BerkasSection';
import { MiniDashboard } from './MiniDashboard';

const BERKAS_MPP: BerkasFile[] = [
  { id: 'm1', nama: 'Surat Permohonan MPP', tipe: 'PDF', tanggal: '01 Apr 2024', ukuran: '167 KB', status: 'uploaded' },
  { id: 'm2', nama: 'SK Pengangkatan / Kepangkatan Terakhir', tipe: 'PDF', tanggal: '02 Apr 2024', ukuran: '392 KB', status: 'uploaded' },
  { id: 'm3', nama: 'Fotokopi KTP yang masih berlaku', tipe: 'JPG', tanggal: '01 Apr 2024', ukuran: '84 KB', status: 'uploaded' },
  { id: 'm4', nama: 'Formulir Pengajuan MPP (F-MPP)', tipe: 'PDF', tanggal: '03 Apr 2024', ukuran: '256 KB', status: 'uploaded' },
  { id: 'm5', nama: 'Surat Persetujuan Atasan Langsung', tipe: 'PDF', tanggal: '-', ukuran: '-', status: 'pending' },
  { id: 'm6', nama: 'Data Riwayat Kepangkatan (HRIS)', tipe: 'PDF', tanggal: '03 Apr 2024', ukuran: '488 KB', status: 'verified' },
];

const STEPS: Step[] = [
  { id: 1, label: 'Pengajuan MPP', actor: 'Pegawai' },
  { id: 2, label: 'Review Atasan', actor: 'Atasan Langsung' },
  { id: 3, label: 'Review SDM Satker', actor: 'SDM Satker/UE1' },
  { id: 4, label: 'Review SDM UE1', actor: 'SDM UE1' },
  { id: 5, label: 'Review Biro SDM', actor: 'Biro SDM' },
];

const DATA = MOCK_PEGAWAI.filter(p => p.jenisKasus === 'MPP');

interface MPPFormProps {
  pegawai: Pegawai;
  role: Role;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  isArchived?: boolean;
}

interface ReviewNode {
  role: string;
  label: string;
  status: 'approved' | 'rejected' | 'pending';
  name: string;
  tanggal?: string;
  catatan?: string;
  icon: React.ElementType;
}

function MPPForm({ pegawai, role, onClose, onSubmit, isArchived = false }: MPPFormProps) {
  const [formData, setFormData] = useState({
    tanggalMulai: isArchived ? '2023-08-01' : '2024-08-01',
    tanggalSelesai: isArchived ? '2024-01-31' : '2025-01-31',
    keterangan: isArchived ? 'MPP telah selesai dilaksanakan. Pegawai telah menjalani masa persiapan pensiun selama 6 bulan dan akan memasuki masa BUP.' : 'Mengajukan MPP untuk mempersiapkan diri menghadapi masa pensiun.',
  });
  const [catatan, setCatatan] = useState('');

  const isPegawai = !isArchived && role === 'pegawai';
  const canReview = !isArchived && ['atasan', 'sdm-satker-1', 'sdm-ue1', 'biro-sdm'].includes(role);

  const getCurrentStep = () => {
    switch (role) {
      case 'pegawai': return 1;
      case 'atasan': return 2;
      case 'sdm-satker-1': return 3;
      case 'sdm-ue1': return 4;
      case 'biro-sdm': return 5;
      default: return 1;
    }
  };

  const getInitialReviews = (): ReviewNode[] => {
    const baseReviews: ReviewNode[] = [
      { role: 'atasan', label: 'Atasan Langsung', status: 'pending', name: '-', icon: User },
      { role: 'sdm-satker-1', label: 'SDM Satker', status: 'pending', name: '-', icon: Building2 },
      { role: 'sdm-ue1', label: 'SDM UE1', status: 'pending', name: '-', icon: Building2 },
      { role: 'biro-sdm', label: 'Biro SDM', status: 'pending', name: '-', icon: ShieldCheck },
    ];

    if (role === 'sdm-satker-1') {
      baseReviews[0] = { ...baseReviews[0], status: 'approved', name: 'Dra. Sari Hastuti, M.Si', tanggal: '05 Apr 2024', catatan: 'Disetujui. Pegawai memenuhi syarat MPP.' };
    } else if (role === 'sdm-ue1') {
      baseReviews[0] = { ...baseReviews[0], status: 'approved', name: 'Dra. Sari Hastuti, M.Si', tanggal: '05 Apr 2024', catatan: 'Disetujui. Pegawai memenuhi syarat MPP.' };
      baseReviews[1] = { ...baseReviews[1], status: 'approved', name: 'Feri Andrianto', tanggal: '07 Apr 2024', catatan: 'Administrasi lengkap. Memenuhi syarat.' };
    } else if (role === 'biro-sdm') {
      baseReviews[0] = { ...baseReviews[0], status: 'approved', name: 'Dra. Sari Hastuti, M.Si', tanggal: '05 Apr 2024', catatan: 'Disetujui. Pegawai memenuhi syarat MPP.' };
      baseReviews[1] = { ...baseReviews[1], status: 'approved', name: 'Feri Andrianto', tanggal: '07 Apr 2024', catatan: 'Administrasi lengkap. Memenuhi syarat.' };
      baseReviews[2] = { ...baseReviews[2], status: 'approved', name: 'Bambang Sutrisno', tanggal: '09 Apr 2024', catatan: 'Telah diverifikasi dan disetujui.' };
    }

    return baseReviews;
  };

  const [reviews, setReviews] = useState<ReviewNode[]>(getInitialReviews());
  const currentStep = getCurrentStep();
  const durasi = 6;

  const mppSyarat = [
    { label: 'Pegawai tidak sedang dalam proses hukuman disiplin', met: true },
    { label: 'Pengajuan minimal 1 bulan sebelum MPP dimulai', met: true },
    { label: 'Sisa masa kerja mencukupi (BUP dalam 1-12 bulan ke depan)', met: true },
    { label: 'Belum ada kasus pemberhentian aktif lainnya', met: true },
  ];

  const doApprove = () => {
    setReviews(prev => prev.map(r => r.role === role
      ? { ...r, status: 'approved', name: 'Demo User', tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), catatan: catatan || 'Disetujui' }
      : r
    ));
  };
  const doReject = () => {
    setReviews(prev => prev.map(r => r.role === role
      ? { ...r, status: 'rejected', name: 'Demo User', tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), catatan: catatan || 'Ditolak' }
      : r
    ));
  };

  const handleSubmit = () => {
    if (isPegawai && onSubmit) {
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      onSubmit({ ...formData, tanggalPengajuan: today, durasi });
      onClose();
    }
  };

  return (
    <div className="p-6 space-y-5">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        {isPegawai ? 'Kembali' : 'Kembali ke Daftar Permohonan'}
      </button>

      {/* Header Card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#065F46' }}>
        <div className="px-6 py-4">
          <p className="text-white font-semibold">{pegawai.nama}</p>
          <p className="text-white/60 text-xs">{pegawai.nip} · {pegawai.jabatan} · {pegawai.satker}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full">Masa Persiapan Pensiun</span>
            <span className="text-[10px] text-white/60">{pegawai.nomorKasus}</span>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
        <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 7: MPP)</p>
        <WorkflowStepper steps={STEPS} currentStep={currentStep} />
      </div>

      {/* MPP Info */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide">BUP</p>
          <p className="text-sm font-bold text-emerald-700">{pegawai.tanggalBUP}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-blue-600 font-medium uppercase tracking-wide">Durasi MPP</p>
          <p className="text-sm font-bold text-blue-700">{durasi} Bulan</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wide">Sisa BUP</p>
          <p className="text-sm font-bold text-amber-700">{pegawai.sisaBulan} Bulan</p>
        </div>
      </div>

      {/* Form atau Info */}
      {isPegawai ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700">Formulir Pengajuan MPP</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">
                <Calendar size={11} className="inline mr-1" />
                Tanggal Mulai MPP
              </label>
              <input
                type="date"
                value={formData.tanggalMulai}
                onChange={e => setFormData(f => ({ ...f, tanggalMulai: e.target.value }))}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">
                <Calendar size={11} className="inline mr-1" />
                Tanggal Selesai MPP
              </label>
              <input
                type="date"
                value={formData.tanggalSelesai}
                onChange={e => setFormData(f => ({ ...f, tanggalSelesai: e.target.value }))}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 font-medium block mb-1">Keterangan</label>
              <textarea
                value={formData.keterangan}
                onChange={e => setFormData(f => ({ ...f, keterangan: e.target.value }))}
                rows={3}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none resize-none"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Persyaratan MPP</p>
            {mppSyarat.map((s, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <Check size={13} className="text-green-600 shrink-0" />
                <p className="text-xs text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700">Detail Pengajuan MPP</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Mulai MPP', value: '01 Agustus 2024' },
              { label: 'Selesai MPP', value: '31 Januari 2025' },
              { label: 'Durasi', value: '6 Bulan' },
              { label: 'Diajukan', value: pegawai.tanggalKasus },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          {pegawai.keterangan && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="text-xs text-emerald-700">{pegawai.keterangan}</p>
            </div>
          )}
        </div>
      )}

      {/* Berkas Terlampir */}
      <BerkasSection berkas={BERKAS_MPP} canUpload={isPegawai} />

      {/* Approval chain */}
      {canReview && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700">Rantai Persetujuan MPP</p>
          <div className="space-y-2">
            {reviews.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.role} className={`flex items-start gap-3 p-3 rounded-xl border ${
                  r.status === 'approved' ? 'bg-green-50 border-green-200' :
                  r.status === 'rejected' ? 'bg-red-50 border-red-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    r.status === 'approved' ? 'bg-green-500' :
                    r.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                  }`}>
                    <Icon size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-800">{r.label}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                        r.status === 'approved' ? 'bg-green-100 text-green-700' :
                        r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </div>
                    {r.name !== '-' && <p className="text-[10px] text-gray-500 mt-0.5">{r.name} · {r.tanggal}</p>}
                    {r.catatan && <p className="text-[10px] text-gray-600 mt-0.5 italic">"{r.catatan}"</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Catatan</label>
            <textarea
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              placeholder="Catatan persetujuan/penolakan..."
              rows={2}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none resize-none placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
        >
          {isArchived ? 'Kembali' : 'Batal'}
        </button>
        {!isArchived && isPegawai && (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white ml-auto"
            style={{ background: '#065F46' }}
          >
            Ajukan Permohonan MPP
          </button>
        )}
        {!isArchived && canReview && (
          <>
            <button
              onClick={doReject}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600"
            >
              <X size={13} /> Tolak
            </button>
            <button
              onClick={doApprove}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white ml-auto"
              style={{ background: '#065F46' }}
            >
              <Check size={13} /> Setujui
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface SubmittedMPPRequest {
  id: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tanggalPengajuan: string;
  durasi: number;
  keterangan: string;
  statusProses: StatusProses;
  tahapanSaat: number;
}

function ViewingRequestPage({ req, onClose }: { req: SubmittedMPPRequest; onClose: () => void }) {
  return (
    <div className="p-6 space-y-5">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Permohonan
      </button>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#065F46' }}>
        <div className="px-6 py-4">
          <p className="text-white font-semibold">Detail Permohonan MPP</p>
          <p className="text-white/70 text-xs mt-0.5">Status: {req.statusProses}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
        <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 7: MPP)</p>
        <WorkflowStepper steps={STEPS} currentStep={req.tahapanSaat} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-sm font-semibold text-gray-700">Detail Pengajuan MPP</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Tgl Mulai</p>
            <p className="text-xs font-semibold text-gray-800 mt-0.5">{req.tanggalMulai}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Tgl Selesai</p>
            <p className="text-xs font-semibold text-gray-800 mt-0.5">{req.tanggalSelesai}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Durasi</p>
            <p className="text-xs font-semibold text-gray-800 mt-0.5">{req.durasi} Bulan</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Tgl Pengajuan</p>
            <p className="text-xs font-semibold text-gray-800 mt-0.5">{req.tanggalPengajuan}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Status</p>
            <p className="text-xs font-semibold text-gray-800 mt-0.5">{req.statusProses}</p>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <p className="text-xs text-emerald-700">{req.keterangan}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

interface FlowMPPProps { role: Role; }

export function FlowMPP({ role }: FlowMPPProps) {
  const [mainTab, setMainTab] = useState<'aktif' | 'arsip'>('aktif');
  const [selected, setSelected] = useState<Pegawai | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusProses | ''>('');
  const [satkerFilter, setSatkerFilter] = useState('');
  const [submittedRequests, setSubmittedRequests] = useState<SubmittedMPPRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<SubmittedMPPRequest | null>(null);

  const myData = role === 'pegawai' ? DATA.filter(p => p.id === '9') : DATA;
  const dataAktif = myData.filter(p => p.statusProses !== 'Selesai');
  const dataArsip = myData.filter(p => p.statusProses === 'Selesai');

  const filtered = (mainTab === 'aktif' ? dataAktif : dataArsip).filter(p => {
    const matchSearch = !search ||
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nip.includes(search) ||
      p.satker.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.statusProses === statusFilter;
    const matchSatker = !satkerFilter || p.satker.toLowerCase().includes(satkerFilter.toLowerCase());
    return matchSearch && matchStatus && matchSatker;
  });

  const handleSubmitRequest = (data: any) => {
    const newRequest: SubmittedMPPRequest = {
      id: `mpp-${Date.now()}`,
      tanggalMulai: data.tanggalMulai,
      tanggalSelesai: data.tanggalSelesai,
      tanggalPengajuan: data.tanggalPengajuan,
      durasi: data.durasi,
      keterangan: data.keterangan,
      statusProses: 'Dalam Review',
      tahapanSaat: 2,
    };
    setSubmittedRequests(prev => [...prev, newRequest]);
    setShowForm(false);
  };

  // Page: viewing submitted request detail (pegawai)
  if (viewingRequest) {
    return <ViewingRequestPage req={viewingRequest} onClose={() => setViewingRequest(null)} />;
  }

  // Page: form pengajuan MPP baru (pegawai)
  if (showForm) {
    return (
      <MPPForm
        pegawai={{ ...DATA[0], statusProses: 'Belum Diproses', tahapanSaat: 1 } as Pegawai}
        role={role}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitRequest}
      />
    );
  }

  // Page: review/detail pegawai (non-pegawai roles)
  if (selected) {
    return <MPPForm pegawai={selected} role={role} onClose={() => setSelected(null)} isArchived={mainTab === 'arsip'} />;
  }

  // Tampilan untuk pegawai
  if (role === 'pegawai') {
    return (
      <div className="p-6 space-y-5">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3">
          <CalendarClock size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Alur Pengajuan Masa Persiapan Pensiun (MPP)</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              MPP diberikan kepada pegawai 1–12 bulan sebelum BUP. Pengajuan dilakukan oleh pegawai,
              direview berjenjang, hingga ditetapkan dengan SK MPP oleh Biro SDM.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#065F46' }}
        >
          <CalendarClock size={16} />
          Ajukan Permohonan MPP Baru
        </button>

        {submittedRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Permohonan MPP Saya</h3>
              <p className="text-xs text-gray-500">{submittedRequests.length} permohonan yang telah diajukan</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl Mulai</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl Selesai</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Durasi</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl Diajukan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Proses</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tahapan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {submittedRequests.map((req, idx) => {
                    const statusColor = getStatusColor(req.statusProses);
                    return (
                      <tr key={req.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{req.tanggalMulai}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{req.tanggalSelesai}</td>
                        <td className="px-4 py-3 text-gray-700">{req.durasi} Bulan</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{req.tanggalPengajuan}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                            style={{ background: statusColor }}
                          >
                            {req.statusProses}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${(req.tahapanSaat / STEPS.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-500 text-[10px]">{req.tahapanSaat}/{STEPS.length}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setViewingRequest(req)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800"
                          >
                            Lihat
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Tampilan untuk role lainnya (atasan, sdm-satker, dll)
  return (
    <div className="p-6 space-y-5">
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3">
        <CalendarClock size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Alur Pengajuan Masa Persiapan Pensiun (MPP)</p>
          <p className="text-xs text-emerald-600 mt-0.5">
            MPP diberikan kepada pegawai 1–12 bulan sebelum BUP. Pengajuan dilakukan oleh pegawai,
            direview berjenjang, hingga ditetapkan dengan SK MPP oleh Biro SDM.
          </p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['aktif', 'arsip'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mainTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'aktif' ? 'Pengajuan Aktif' : 'Arsip'}
            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-green-100 text-green-700'}`}>
              {tab === 'aktif' ? dataAktif.length : dataArsip.length}
            </span>
          </button>
        ))}
      </div>

      {mainTab === 'aktif' && <MiniDashboard data={dataAktif} onFilterClick={setStatusFilter} currentFilter={statusFilter as StatusProses as any} />}

      {mainTab === 'aktif' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Min Durasi MPP', value: '1 Bulan', color: '#059669', bg: '#ECFDF5' },
            { label: 'Max Durasi MPP', value: '12 Bulan', color: '#0891B2', bg: '#ECFEFF' },
            { label: 'MPP Aktif Saat Ini', value: `${dataAktif.length} Pegawai`, color: '#7C3AED', bg: '#F5F3FF' },
          ].map(info => (
            <div key={info.label} className="rounded-2xl p-4 text-center border" style={{ background: info.bg, borderColor: info.color + '33' }}>
              <p className="text-xl font-bold" style={{ color: info.color }}>{info.value}</p>
              <p className="text-xs mt-1" style={{ color: info.color }}>{info.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Filter</p>
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setSatkerFilter(''); }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-4">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Pencarian</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari NIP / Nama / Satker..."
                className="bg-transparent text-xs focus:outline-none flex-1 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          {mainTab === 'aktif' && (
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Status</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as StatusProses | '')}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
              >
                <option value="">Semua</option>
                <option value="Belum Diproses">Belum Diproses</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Satker</label>
            <input
              value={satkerFilter}
              onChange={e => setSatkerFilter(e.target.value)}
              placeholder="Nama satker..."
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">
            {mainTab === 'aktif' ? 'Daftar Pengajuan MPP Aktif' : 'Arsip Pengajuan Selesai'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} dari {mainTab === 'aktif' ? dataAktif.length : dataArsip.length} permohonan
          </p>
        </div>
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Search size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Tidak ada data yang sesuai filter</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">NIP / Nama</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jabatan / Satker</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Keterangan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tahapan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p, idx) => {
                    const statusColor = getStatusColor(p.statusProses);
                    const pctStep = (p.tahapanSaat / STEPS.length) * 100;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                        onClick={() => setSelected(p)}
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
                        <td className="px-4 py-3">
                          <p className="text-emerald-600 font-medium">{p.keterangan}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                            style={{ background: statusColor }}
                          >
                            {p.statusProses}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${pctStep}%` }}
                              />
                            </div>
                            <span className="text-gray-500 text-[10px]">{p.tahapanSaat}/{STEPS.length}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={e => { e.stopPropagation(); setSelected(p); }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800"
                          >
                            {mainTab === 'arsip' ? 'Buka' : 'Review'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">Menampilkan {filtered.length} dari {myData.length} permohonan</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
