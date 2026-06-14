import { useState } from 'react';
import { DoorOpen, X, Check, Upload, AlertCircle, ChevronRight, User, Building2, ShieldCheck, Search, UserCircle2, CheckCircle2, XCircle, Calendar, Users2, FileText, Send, Eye, Stamp, ArrowLeft, Download } from 'lucide-react';
import type { Role } from '../routes/routeConfig';
// import { MOCK_PEGAWAI, getStatusColor, type Pegawai, type StatusProses } from '../data/mockData';

import { getStatusColor, getKasusColor, getKasusLabel, getSisaBulanColor, getSisaBulanLabel  } from '../utils/case.util';
import { type Pegawai, StatusProses } from '../types/employee.types';
import { MOCK_PEGAWAI } from '../data/mockData';


import { WorkflowStepper, type Step } from './WorkflowStepper';
import { BerkasSection, type BerkasFile } from './BerkasSection';
import { MiniDashboard } from './MiniDashboard';

const BERKAS_PGD: BerkasFile[] = [
  { id: 'p1', nama: 'Surat Permohonan Pengunduran Diri', tipe: 'PDF', tanggal: '18 Mei 2024', ukuran: '143 KB', status: 'uploaded' },
  { id: 'p2', nama: 'SK Pengangkatan Terakhir', tipe: 'PDF', tanggal: '19 Mei 2024', ukuran: '387 KB', status: 'uploaded' },
  { id: 'p3', nama: 'Fotokopi KTP yang masih berlaku', tipe: 'JPG', tanggal: '18 Mei 2024', ukuran: '88 KB', status: 'uploaded' },
  { id: 'p4', nama: 'Formulir C3 (Pengunduran Diri)', tipe: 'PDF', tanggal: '19 Mei 2024', ukuran: '221 KB', status: 'uploaded' },
  { id: 'p5', nama: 'Surat Rekomendasi Atasan Langsung', tipe: 'PDF', tanggal: '-', ukuran: '-', status: 'pending' },
  { id: 'p6', nama: 'DPKP 2 Tahun Terakhir', tipe: 'PDF', tanggal: '20 Mei 2024', ukuran: '456 KB', status: 'verified' },
];

type PensionType = 'dengan-hak' | 'tanpa-hak';
type BerkasSource = 'satu-kemenkeu' | 'upload';
type BerkasStatus = 'verified' | 'not-verified' | 'uploaded' | 'not-uploaded';

interface BerkasDocument {
  id: string;
  nama: string;
  source: BerkasSource;
  status: BerkasStatus;
  tipe?: string;
  tanggal?: string;
  ukuran?: string;
}

const BERKAS_DENGAN_HAK: BerkasDocument[] = [
  { id: 'dh1', nama: 'SK Kenaikan Pangkat Terakhir', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'dh2', nama: 'SK Peninjauan Masa Kerja', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'dh4', nama: 'Surat Keputusan CPNS', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'dh5', nama: 'Surat Keputusan PNS', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'dh6', nama: 'SK Mutasi Jabatan Terakhir', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'dh7', nama: 'Surat Permohonan Berhenti Atas Permintaan Sendiri sebagai PNS (ttd Ybs dan Pejabat yang bersangkutan)', source: 'upload', status: 'not-uploaded', tipe: 'PDF' },
];

const BERKAS_TANPA_HAK: BerkasDocument[] = [
  { id: 'th1', nama: 'SK Kenaikan Pangkat Terakhir', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'th2', nama: 'SK Peninjauan Masa Kerja', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'th3', nama: 'Surat Keputusan CPNS', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'th4', nama: 'Surat Keputusan PNS', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'th5', nama: 'SK Mutasi Jabatan Terakhir', source: 'satu-kemenkeu', status: 'verified' },
  { id: 'th6', nama: 'Surat Permohonan Berhenti Atas Permintaan Sendiri sebagai PNS (ttd Ybs dan Pejabat yang bersangkutan)', source: 'upload', status: 'not-uploaded', tipe: 'PDF' },
];

const STEPS: Step[] = [
  { id: 1, label: 'Pengajuan Pegawai', actor: 'Pegawai' },
  { id: 2, label: 'Review Atasan', actor: 'Atasan Langsung' },
  { id: 3, label: 'Review SDM Satker', actor: 'SDM Satker/UE1' },
  { id: 4, label: 'Review SDM UE1', actor: 'SDM UE1' },
  { id: 5, label: 'Review Biro SDM', actor: 'Biro SDM' },
  { id: 6, label: 'Penetapan SK', actor: 'Biro SDM', desc: 'Flow 6' },
];

const ALASAN = [
  'Alasan Keluarga',
  'Mendapatkan Pekerjaan Lain',
  'Alasan Kesehatan',
  'Alasan Pribadi Lainnya',
  'Pindah ke Sektor Swasta',
  'Melanjutkan Studi',
];

const DATA = MOCK_PEGAWAI.filter(p => p.jenisKasus === 'PengunduranDiri');

// Nota Dinas structure for Biro SDM
type NotaDinasPGD = {
  id: string;
  nomor: string;
  tanggal: string;
  perihal: string;
  dari: string;
  kepada: string;
  jenisPengunduranDiri: string;
  status: 'Menunggu Verifikasi' | 'Dalam Proses' | 'Siap Proses Pertek' | 'Selesai';
  pegawaiIds: string[];
};

const NOTA_DINAS_PGD_LIST: NotaDinasPGD[] = [
  {
    id: 'ndpgd1',
    nomor: 'ND-UE1/0523/2024',
    tanggal: '24 Mei 2024',
    perihal: 'Rekomendasi Pemberhentian PNS Atas Permintaan Sendiri - Dengan Hak Pensiun',
    dari: 'Kepala Unit SDM UE1',
    kepada: 'Kepala Biro Sumber Daya Manusia',
    jenisPengunduranDiri: 'Dengan Hak Pensiun',
    status: 'Menunggu Verifikasi',
    pegawaiIds: ['8', '9'],
  },
  {
    id: 'ndpgd2',
    nomor: 'ND-UE1/0524/2024',
    tanggal: '25 Mei 2024',
    perihal: 'Rekomendasi Pemberhentian PNS Atas Permintaan Sendiri - Tanpa Hak Pensiun',
    dari: 'Kepala Unit SDM UE1',
    kepada: 'Kepala Biro Sumber Daya Manusia',
    jenisPengunduranDiri: 'Tanpa Hak Pensiun',
    status: 'Dalam Proses',
    pegawaiIds: ['38'],
  },
];

const ND_PGD_STATUS_CFG = {
  'Menunggu Verifikasi': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  'Dalam Proses':        { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Siap Proses Pertek':  { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  'Selesai':             { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
};

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface ApprovalNode {
  role: string;
  label: string;
  status: ApprovalStatus;
  name: string;
  tanggal?: string;
  catatan?: string;
  icon: React.ElementType;
}

const DEFAULT_APPROVALS: ApprovalNode[] = [
  { role: 'atasan', label: 'Atasan Langsung', status: 'approved', name: 'Dr. Surya Pratama', tanggal: '20 Mei 2024', catatan: 'Disetujui. Pegawai telah menyampaikan alasan yang dapat dipahami.', icon: User },
  { role: 'sdm-satker', label: 'SDM Satker', status: 'approved', name: 'Ratna Dewi', tanggal: '22 Mei 2024', catatan: 'Berkas lengkap, tidak ada kendala administrasi.', icon: Building2 },
  { role: 'sdm-ue1', label: 'SDM UE1', status: 'pending', name: '-', icon: Building2 },
  { role: 'biro-sdm', label: 'Biro SDM', status: 'pending', name: '-', icon: ShieldCheck },
];

// Rantai persetujuan khusus tampilan Atasan Langsung:
// SDM Satker belum mereview (masih menunggu karena atasan baru sedang mereview)
const ATASAN_APPROVALS: ApprovalNode[] = [
  { role: 'atasan', label: 'Atasan Langsung', status: 'pending', name: '-', icon: User },
  { role: 'sdm-satker', label: 'SDM Satker', status: 'pending', name: '-', icon: Building2 },
  { role: 'sdm-ue1', label: 'SDM UE1', status: 'pending', name: '-', icon: Building2 },
  { role: 'biro-sdm', label: 'Biro SDM', status: 'pending', name: '-', icon: ShieldCheck },
];

interface PGDFormProps {
  pegawai: Pegawai;
  role: Role;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  isArchived?: boolean;
}

function PGDForm({ pegawai, role, onClose, onSubmit, isArchived = false }: PGDFormProps) {
  const [formData, setFormData] = useState({
    alasan: isArchived ? 'Alasan Keluarga' : ALASAN[0],
    tanggalEfektif: isArchived ? '2024-07-31' : '',
    uraianAlasan: isArchived ? 'Pegawai menyatakan ingin mengundurkan diri untuk merawat anggota keluarga yang sakit. Telah dipertimbangkan dengan matang dan mendapat restu keluarga.' : '',
    rencanaSetelah: isArchived ? 'Fokus merawat keluarga dan mempertimbangkan usaha kecil di daerah asal' : '',
  });
  const [catatan, setCatatan] = useState('');

  const isPegawai = !isArchived && role === 'pegawai';
  const isAtasan = !isArchived && role === 'atasan';
  const isSdmSatker = !isArchived && role === 'sdm-satker';
  const isSdmUe1 = !isArchived && role === 'sdm-ue1';
  const isBiroSdm = !isArchived && role === 'biro-sdm';

  // Tentukan current step berdasarkan role
  const getCurrentStep = () => {
    switch (role) {
      case 'pegawai': return 1;
      case 'atasan': return 2;
      case 'sdm-satker': return 3;
      case 'sdm-ue1': return 4;
      case 'biro-sdm': return 5;
      default: return 1;
    }
  };

  // Setup initial approvals berdasarkan role (role sebelumnya sudah approved)
  const getInitialApprovals = (): ApprovalNode[] => {
    const baseApprovals: ApprovalNode[] = [
      { role: 'atasan', label: 'Atasan Langsung', status: 'pending', name: '-', icon: User },
      { role: 'sdm-satker', label: 'SDM Satker', status: 'pending', name: '-', icon: Building2 },
      { role: 'sdm-ue1', label: 'SDM UE1', status: 'pending', name: '-', icon: Building2 },
      { role: 'biro-sdm', label: 'Biro SDM', status: 'pending', name: '-', icon: ShieldCheck },
    ];

    // Set status approved untuk role-role sebelumnya
    if (role === 'sdm-satker') {
      baseApprovals[0] = { ...baseApprovals[0], status: 'approved', name: 'Dr. Surya Pratama', tanggal: '20 Mei 2024', catatan: 'Disetujui. Pegawai telah menyampaikan alasan yang dapat dipahami.' };
    } else if (role === 'sdm-ue1') {
      baseApprovals[0] = { ...baseApprovals[0], status: 'approved', name: 'Dr. Surya Pratama', tanggal: '20 Mei 2024', catatan: 'Disetujui. Pegawai telah menyampaikan alasan yang dapat dipahami.' };
      baseApprovals[1] = { ...baseApprovals[1], status: 'approved', name: 'Ratna Dewi', tanggal: '22 Mei 2024', catatan: 'Berkas lengkap, tidak ada kendala administrasi.' };
    } else if (role === 'biro-sdm') {
      baseApprovals[0] = { ...baseApprovals[0], status: 'approved', name: 'Dr. Surya Pratama', tanggal: '20 Mei 2024', catatan: 'Disetujui. Pegawai telah menyampaikan alasan yang dapat dipahami.' };
      baseApprovals[1] = { ...baseApprovals[1], status: 'approved', name: 'Ratna Dewi', tanggal: '22 Mei 2024', catatan: 'Berkas lengkap, tidak ada kendala administrasi.' };
      baseApprovals[2] = { ...baseApprovals[2], status: 'approved', name: 'Ahmad Hidayat', tanggal: '24 Mei 2024', catatan: 'Telah diverifikasi dan disetujui.' };
    }

    return baseApprovals;
  };

  const [approvals, setApprovals] = useState<ApprovalNode[]>(getInitialApprovals());
  const currentStep = getCurrentStep();

  const approve = () => {
    setApprovals(prev => prev.map(a => {
      if (a.role === role) return { ...a, status: 'approved', name: 'Demo User', tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), catatan: catatan || 'Disetujui' };
      return a;
    }));
  };
  const reject = () => {
    setApprovals(prev => prev.map(a => {
      if (a.role === role) return { ...a, status: 'rejected', name: 'Demo User', tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), catatan: catatan || 'Ditolak' };
      return a;
    }));
  };

  const handleSubmit = () => {
    if (isPegawai && onSubmit) {
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      onSubmit({
        ...formData,
        tanggalPengajuan: today,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 flex items-start justify-between shrink-0 bg-purple-900">
          <div>
            <p className="text-white font-semibold">{pegawai.nama}</p>
            <p className="text-white/60 text-xs">{pegawai.nip} · {pegawai.jabatan} · {pegawai.satker}</p>
            <p className="text-white/70 text-xs mt-0.5">Pengunduran Diri · {pegawai.nomorKasus}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
            <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 4: Pengunduran Diri)</p>
            <WorkflowStepper steps={STEPS} currentStep={currentStep} />
          </div>

          {/* Form Pengajuan */}
          {isPegawai ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Formulir Pengunduran Diri</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Alasan Pengunduran Diri</label>
                  <select
                    value={formData.alasan}
                    onChange={e => setFormData(f => ({ ...f, alasan: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  >
                    {ALASAN.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Tanggal Efektif</label>
                  <input
                    type="date"
                    value={formData.tanggalEfektif}
                    onChange={e => setFormData(f => ({ ...f, tanggalEfektif: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 font-medium block mb-1">Uraian Alasan Lengkap</label>
                  <textarea
                    value={formData.uraianAlasan}
                    onChange={e => setFormData(f => ({ ...f, uraianAlasan: e.target.value }))}
                    placeholder="Jelaskan secara rinci alasan pengunduran diri..."
                    rows={3}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none placeholder-gray-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 font-medium block mb-1">Rencana setelah Pengunduran Diri</label>
                  <input
                    value={formData.rencanaSetelah}
                    onChange={e => setFormData(f => ({ ...f, rencanaSetelah: e.target.value }))}
                    placeholder="Contoh: Bekerja di sektor swasta, melanjutkan studi..."
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <Upload size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-xs text-gray-500">Upload Dokumen Pendukung</p>
                <p className="text-[10px] text-gray-400 mt-1">Surat Pernyataan, Surat Keterangan, dll.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Detail Pengajuan</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Alasan', value: 'Alasan Keluarga' },
                  { label: 'Tgl Efektif', value: '31 Juli 2024' },
                  { label: 'Tgl Pengajuan', value: pegawai.tanggalKasus },
                  { label: 'Status', value: pegawai.statusProses },
                  { label: 'Jenis Pengunduran Diri', value: pegawai.jenisPengunduranDiri ?? '-' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Uraian Alasan</p>
                <p className="text-xs text-gray-700">Pegawai menyatakan ingin mengundurkan diri untuk merawat anggota keluarga yang sakit. Telah dipertimbangkan dengan matang.</p>
              </div>
            </div>
          )}

          {/* Approval Chain */}
          {!isPegawai && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Rantai Persetujuan</p>
              <div className="space-y-2">
                {approvals.map((a, idx) => {
                  const Icon = a.icon;
                  return (
                    <div key={a.role} className={`flex items-start gap-3 p-3 rounded-xl border ${
                      a.status === 'approved' ? 'bg-green-50 border-green-200' :
                      a.status === 'rejected' ? 'bg-red-50 border-red-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        a.status === 'approved' ? 'bg-green-500' :
                        a.status === 'rejected' ? 'bg-red-500' :
                        'bg-gray-300'
                      }`}>
                        <Icon size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-gray-800">{a.label}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                            a.status === 'approved' ? 'bg-green-100 text-green-700' :
                            a.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {a.status === 'approved' ? 'Disetujui' : a.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                          </span>
                        </div>
                        {a.name !== '-' && <p className="text-[10px] text-gray-500 mt-0.5">{a.name} · {a.tanggal}</p>}
                        {a.catatan && <p className="text-[10px] text-gray-600 mt-0.5 italic">"{a.catatan}"</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Berkas Terlampir */}
          <BerkasSection berkas={BERKAS_PGD} canUpload={isPegawai} />

          {/* Catatan */}
          {!isPegawai && (
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Catatan Persetujuan</label>
              <textarea
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                placeholder="Tambahkan catatan persetujuan/penolakan..."
                rows={2}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none placeholder-gray-400"
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          {!isArchived && isPegawai && (
            <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white ml-auto bg-purple-900">
              Ajukan Pengunduran Diri
            </button>
          )}
          {!isArchived && (isAtasan || isSdmSatker || isSdmUe1 || isBiroSdm) && (
            <>
              <button onClick={reject} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600">
                <X size={13} /> Tolak
              </button>
              <button onClick={approve} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-green-600 hover:bg-green-700 ml-auto">
                <Check size={13} /> Setujui
              </button>
            </>
          )}
          <button onClick={onClose} className={`px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 ${isArchived ? 'ml-auto' : ''}`}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

interface SubmittedRequest {
  id: string;
  alasan: string;
  tanggalPengajuan: string;
  tanggalEfektif: string;
  statusProses: StatusProses;
  tahapanSaat: number;
}

interface FlowPGDProps { role: Role; }

export function FlowPengunduranDiri({ role }: FlowPGDProps) {
  const [mainTab, setMainTab] = useState<'aktif' | 'arsip'>('aktif');
  const [selected, setSelected] = useState<Pegawai | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusProses | ''>('');
  const [satkerFilter, setSatkerFilter] = useState('');
  const [submittedRequests, setSubmittedRequests] = useState<SubmittedRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<SubmittedRequest | null>(null);

  // Pegawai-specific state (must be at top level)
  const [currentPage, setCurrentPage] = useState<'selection' | 'form' | 'berkas' | 'monitoring'>('monitoring');
  const [selectedPensionType, setSelectedPensionType] = useState<PensionType | null>(null);
  const [formData, setFormData] = useState({
    alasan: '',
    tanggalEfektif: '',
    uraianAlasan: '',
    rencanaSetelah: '',
  });
  const [documents, setDocuments] = useState<BerkasDocument[]>([]);

  // SDM Satker-specific state
  const [sdmSatkerView, setSdmSatkerView] = useState<'list' | 'review' | 'schedule-exit' | 'input-exit'>('list');
  const [exitInterviewData, setExitInterviewData] = useState({
    tanggal: '',
    waktu: '',
    pewawancara1: '',
    pewawancara2: '',
  });

  // Other roles state (atasan, sdm-ue1, biro-sdm)
  const [showReviewPage, setShowReviewPage] = useState(false);

  // Atasan specific state
  const [atasanApprovalStatus, setAtasanApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [atasanCatatan, setAtasanCatatan] = useState('');
  const [atasanView, setAtasanView] = useState<'review' | 'rekomendasi'>('review');

  // SDM Satker wizard state
  const [sdmSatkerWizardStep, setSdmSatkerWizardStep] = useState(1);
  const [sdmSatkerVerifikasiDecision, setSdmSatkerVerifikasiDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [sdmSatkerCatatan, setSdmSatkerCatatan] = useState('');
  const [sdmSatkerBMN, setSdmSatkerBMN] = useState({ spp: false, bast: false });
  const [sdmSatkerIkatanDinas, setSdmSatkerIkatanDinas] = useState({ nilaiGantiRugi: '', bukti: false });
  const [sdmSatkerHukdis, setSdmSatkerHukdis] = useState({ surat: false });
  const [sdmSatkerTidakDiperlukan, setSdmSatkerTidakDiperlukan] = useState<Set<string>>(new Set());

  // Biro SDM specific state (for nota dinas structure)
  const [activeNotaDinas, setActiveNotaDinas] = useState<NotaDinasPGD | null>(null);
  const [showPegawaiDetail, setShowPegawaiDetail] = useState(false);
  const [biroSdmAction, setBiroSdmAction] = useState<'tolak' | 'penundaan' | null>(null);
  const [biroSdmAlasan, setBiroSdmAlasan] = useState('');
  const [showBiroSdmActionPage, setShowBiroSdmActionPage] = useState(false);
  const [biroSdmStep, setBiroSdmStep] = useState<'alasan' | 'draft-surat' | 'tte'>('alasan');
  const [biroSdmSkNomor] = useState(() => String(Math.floor(Math.random() * 9000) + 1000));

  // SDM UE1 specific state (for multi-tab view)
  const [ue1Step, setUe1Step] = useState<'verifikasi' | 'draft-rekomendasi' | 'nota-dinas' | 'draft-penolakan' | 'draft-penundaan' | 'tte'>('verifikasi');
  const [ue1Decision, setUe1Decision] = useState<'approve' | 'reject' | 'postpone' | null>(null);
  const [ue1Catatan, setUe1Catatan] = useState('');
  const [ue1SkNomor] = useState(() => String(Math.floor(Math.random() * 9000) + 1000));
  // Track rejections/postponements by UE1 in this session
  const [ue1RejectedItems, setUe1RejectedItems] = useState<Record<string, { alasan: string; tanggal: string; skNomor: string }>>({});
  const [ue1PostponedItems, setUe1PostponedItems] = useState<Record<string, { alasan: string; tanggal: string; skNomor: string }>>({});
  const [notaDinasData, setNotaDinasData] = useState({
    nomor: `ND-UE1/${Math.floor(Math.random() * 9000) + 1000}/2024`,
    perihal: 'Rekomendasi Pemberhentian PNS Atas Permintaan Sendiri',
    kepada: 'Kepala Biro Sumber Daya Manusia',
  });

  const myData = role === 'pegawai' ? DATA.filter(p => p.id === '8') : DATA;
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
    const newRequest: SubmittedRequest = {
      id: `req-${Date.now()}`,
      alasan: data.alasan,
      tanggalPengajuan: data.tanggalPengajuan,
      tanggalEfektif: data.tanggalEfektif,
      statusProses: 'Dalam Review',
      tahapanSaat: 2,
    };
    setSubmittedRequests(prev => [...prev, newRequest]);
    setShowForm(false);
  };

  // Tampilan untuk pegawai
  if (role === 'pegawai') {
    const handlePensionTypeSelect = (type: PensionType) => {
      setSelectedPensionType(type);
      setDocuments(type === 'dengan-hak' ? [...BERKAS_DENGAN_HAK] : [...BERKAS_TANPA_HAK]);
      setCurrentPage('form');
    };

    const handleSubmitForm = () => {
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const newRequest: SubmittedRequest = {
        id: `req-${Date.now()}`,
        alasan: formData.alasan,
        tanggalPengajuan: today,
        tanggalEfektif: formData.tanggalEfektif,
        statusProses: 'Dalam Review',
        tahapanSaat: 2,
      };
      setSubmittedRequests(prev => [...prev, newRequest]);
      setCurrentPage('monitoring');
      setSelectedPensionType(null);
      setFormData({ alasan: '', tanggalEfektif: '', uraianAlasan: '', rencanaSetelah: '' });
      setDocuments([]);
    };

    const handleCancel = () => {
      setCurrentPage('monitoring');
      setSelectedPensionType(null);
      setFormData({ alasan: '', tanggalEfektif: '', uraianAlasan: '', rencanaSetelah: '' });
      setDocuments([]);
    };

    const handleUploadDocument = (docId: string) => {
      setDocuments(prev => prev.map(doc =>
        doc.id === docId && doc.source === 'upload'
          ? { ...doc, status: 'uploaded' as BerkasStatus, tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), ukuran: '120 KB' }
          : doc
      ));
    };

    // Page 1: Pension Type Selection
    if (currentPage === 'selection') {
      // Auto eligibility calculation based on employee profile
      // Sri Wahyuni — NIP 197007201995012001 → born 1970-07-20, TMT PNS 1995-01-01
      const TGLAHIR = new Date('1970-07-20');
      const TMT_PNS = new Date('1995-01-01');
      const today = new Date();

      const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
      const usiaTahun = Math.floor((today.getTime() - TGLAHIR.getTime()) / msPerYear);
      const masaKerjaTahun = Math.floor((today.getTime() - TMT_PNS.getTime()) / msPerYear);
      const masaKerjaBulan = Math.floor(((today.getTime() - TMT_PNS.getTime()) % msPerYear) / (30.44 * 24 * 60 * 60 * 1000));

      const syaratUsiaTerpenuhi = usiaTahun >= 50;
      const syaratMasaKerjaTerpenuhi = masaKerjaTahun >= 20;
      const berhakPensiun = syaratUsiaTerpenuhi && syaratMasaKerjaTerpenuhi;

      return (
        <div className="p-6 space-y-5">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex gap-3">
            <DoorOpen size={18} className="text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-purple-800">Pilih Jenis Pensiun</p>
              <p className="text-xs text-purple-600 mt-0.5">
                Sistem akan menentukan jenis pensiun yang tersedia berdasarkan kalkulasi usia dan masa kerja Anda secara otomatis.
              </p>
            </div>
          </div>

          {/* Eligibility Calculation Card */}
          <div className={`rounded-2xl border-2 p-5 ${berhakPensiun ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${berhakPensiun ? 'bg-green-500' : 'bg-amber-500'}`}>
                {berhakPensiun
                  ? <CheckCircle2 size={16} className="text-white" />
                  : <AlertCircle size={16} className="text-white" />
                }
              </div>
              <div>
                <p className={`text-sm font-semibold ${berhakPensiun ? 'text-green-800' : 'text-amber-800'}`}>
                  Kalkulasi Otomatis Syarat Pensiun
                </p>
                <p className={`text-xs ${berhakPensiun ? 'text-green-600' : 'text-amber-600'}`}>
                  Berdasarkan data kepegawaian Anda per {today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Usia */}
              <div className={`rounded-xl p-3 border ${syaratUsiaTerpenuhi ? 'bg-green-100 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Usia Saat Ini</p>
                  {syaratUsiaTerpenuhi
                    ? <CheckCircle2 size={14} className="text-green-600" />
                    : <XCircle size={14} className="text-red-500" />
                  }
                </div>
                <p className={`text-lg font-bold ${syaratUsiaTerpenuhi ? 'text-green-800' : 'text-red-700'}`}>
                  {usiaTahun} <span className="text-xs font-normal">tahun</span>
                </p>
                <p className={`text-[10px] mt-0.5 ${syaratUsiaTerpenuhi ? 'text-green-600' : 'text-red-500'}`}>
                  Syarat: ≥ 50 tahun &mdash; {syaratUsiaTerpenuhi ? 'Terpenuhi' : `Kurang ${50 - usiaTahun} tahun`}
                </p>
              </div>

              {/* Masa Kerja */}
              <div className={`rounded-xl p-3 border ${syaratMasaKerjaTerpenuhi ? 'bg-green-100 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Masa Kerja</p>
                  {syaratMasaKerjaTerpenuhi
                    ? <CheckCircle2 size={14} className="text-green-600" />
                    : <XCircle size={14} className="text-red-500" />
                  }
                </div>
                <p className={`text-lg font-bold ${syaratMasaKerjaTerpenuhi ? 'text-green-800' : 'text-red-700'}`}>
                  {masaKerjaTahun} <span className="text-xs font-normal">thn {masaKerjaBulan} bln</span>
                </p>
                <p className={`text-[10px] mt-0.5 ${syaratMasaKerjaTerpenuhi ? 'text-green-600' : 'text-red-500'}`}>
                  Syarat: ≥ 20 tahun &mdash; {syaratMasaKerjaTerpenuhi ? 'Terpenuhi' : `Kurang ${20 - masaKerjaTahun} tahun`}
                </p>
              </div>
            </div>

            <div className={`rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2 ${
              berhakPensiun
                ? 'bg-green-200 text-green-900'
                : 'bg-amber-200 text-amber-900'
            }`}>
              {berhakPensiun
                ? <><CheckCircle2 size={14} /> Anda memenuhi semua syarat dan dapat memilih kedua jenis pensiun.</>
                : <><AlertCircle size={14} /> Anda belum memenuhi syarat pensiun dengan hak pensiun. Hanya tersedia Pensiun tanpa Hak Pensiun.</>
              }
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dengan Hak Pensiun — disabled if not eligible */}
            {berhakPensiun ? (
              <button
                onClick={() => handlePensionTypeSelect('dengan-hak')}
                className="bg-white border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <CheckCircle2 size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Pensiun dengan Hak Pensiun</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Anda telah memenuhi syarat usia dan masa kerja sehingga berhak mendapatkan pensiun setelah pemberhentian.
                </p>
                <div className="mt-4 flex items-center gap-2 text-purple-600">
                  <span className="text-xs font-semibold">Pilih opsi ini</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ) : (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-left opacity-60 cursor-not-allowed relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-semibold px-2 py-1 rounded-full bg-red-100 text-red-600 border border-red-200">
                    Tidak Memenuhi Syarat
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-400">Pensiun dengan Hak Pensiun</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Opsi ini tidak tersedia karena Anda belum memenuhi syarat usia (≥ 50 tahun) dan/atau masa kerja (≥ 20 tahun).
                </p>
                <div className="mt-4 flex items-center gap-2 text-gray-400">
                  <XCircle size={14} />
                  <span className="text-xs font-semibold">Tidak tersedia</span>
                </div>
              </div>
            )}

            <button
              onClick={() => handlePensionTypeSelect('tanpa-hak')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <XCircle size={24} className="text-gray-600 group-hover:text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Pensiun tanpa Hak Pensiun</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pilih opsi ini jika Anda mengundurkan diri sebelum memenuhi masa kerja minimal atau tidak memenuhi syarat pensiun.
              </p>
              <div className="mt-4 flex items-center gap-2 text-purple-600">
                <span className="text-xs font-semibold">Pilih opsi ini</span>
                <ChevronRight size={14} />
              </div>
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentPage('monitoring')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </div>
      );
    }

    // Page 2: Detail Pengajuan (profil + form fields + upload dok pendukung)
    if (currentPage === 'form' && selectedPensionType) {
      return (
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex gap-3 items-start">
              <DoorOpen size={18} className="text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-purple-800">
                  Pengunduran Diri &mdash; {selectedPensionType === 'dengan-hak' ? 'Dengan Hak Pensiun' : 'Tanpa Hak Pensiun'}
                </p>
                <p className="text-xs text-purple-600 mt-0.5">Langkah 1 dari 2: Detail Pengajuan</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-6 h-2 rounded-full bg-purple-600" />
              <div className="w-6 h-2 rounded-full bg-purple-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
              <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <UserCircle2 size={48} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Sri Wahyuni</p>
                <p className="text-xs text-gray-500 mt-0.5">197007201995012001</p>
                <p className="text-xs text-gray-500">Analis Kebijakan Madya · Kantor Pusat</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">III/d — Penata Tingkat I</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">TMT PNS: 01-01-1995</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">Usia: 55 Thn · Masa Kerja: 31 Thn</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Detail Pengajuan</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">Alasan Pengunduran Diri <span className="text-red-400">*</span></label>
                  <select
                    value={formData.alasan}
                    onChange={e => setFormData(f => ({ ...f, alasan: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">Pilih alasan...</option>
                    {ALASAN.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">Tanggal Efektif Pengunduran Diri <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    value={formData.tanggalEfektif}
                    onChange={e => setFormData(f => ({ ...f, tanggalEfektif: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">Uraian Alasan Lengkap <span className="text-red-400">*</span></label>
                  <textarea
                    value={formData.uraianAlasan}
                    onChange={e => setFormData(f => ({ ...f, uraianAlasan: e.target.value }))}
                    placeholder="Jelaskan secara rinci alasan pengunduran diri..."
                    rows={4}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none placeholder-gray-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">Rencana setelah Pengunduran Diri</label>
                  <input
                    value={formData.rencanaSetelah}
                    onChange={e => setFormData(f => ({ ...f, rencanaSetelah: e.target.value }))}
                    placeholder="Contoh: Bekerja di sektor swasta, melanjutkan studi, wirausaha..."
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Dokumen Pendukung Upload */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Dokumen Pendukung</p>
                <p className="text-xs text-gray-400 mt-0.5">Upload dokumen tambahan yang mendukung alasan pengunduran diri (surat keterangan dokter, surat keterangan keluarga, dll.)</p>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-purple-300 hover:bg-purple-50/30 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
                  <Upload size={22} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Klik untuk memilih file atau seret ke sini</p>
                <p className="text-[10px] text-gray-400">Format: PDF, JPG, PNG · Maks. 10 MB per file</p>
                <button className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-purple-700 border border-purple-300 hover:bg-purple-100 transition-colors">
                  Pilih File
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() => setCurrentPage('berkas')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800"
            >
              Selanjutnya <ChevronRight size={15} />
            </button>
          </div>
        </div>
      );
    }

    // Page 3: Kelengkapan Berkas
    if (currentPage === 'berkas' && selectedPensionType) {
      const uploadedCount = documents.filter(d => d.status === 'uploaded' || d.status === 'verified').length;
      const totalCount = documents.length;

      return (
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex gap-3 items-start">
              <FileText size={18} className="text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-purple-800">
                  Kelengkapan Berkas &mdash; {selectedPensionType === 'dengan-hak' ? 'Dengan Hak Pensiun' : 'Tanpa Hak Pensiun'}
                </p>
                <p className="text-xs text-purple-600 mt-0.5">Langkah 2 dari 2: Unggah dan verifikasi kelengkapan berkas</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-6 h-2 rounded-full bg-purple-600" />
              <div className="w-6 h-2 rounded-full bg-purple-600" />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-gray-700">Kelengkapan Berkas</p>
                <p className="text-xs font-semibold text-purple-700">{uploadedCount} / {totalCount}</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
              uploadedCount === totalCount ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {uploadedCount === totalCount ? 'Lengkap' : 'Belum Lengkap'}
            </div>
          </div>

          {/* Document List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Daftar Berkas yang Diperlukan</p>
            </div>
            <div className="divide-y divide-gray-50">
              {documents.map((doc, idx) => (
                <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-[10px] text-gray-400 font-semibold w-5 shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-gray-800 leading-snug">{doc.nama}</p>
                      {doc.source === 'satu-kemenkeu' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold shrink-0">
                          Satu Kemenkeu
                        </span>
                      )}
                    </div>
                    {(doc.tanggal || doc.ukuran) && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{[doc.tipe, doc.ukuran, doc.tanggal].filter(Boolean).join(' · ')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.source === 'satu-kemenkeu' ? (
                      doc.status === 'verified' ? (
                        <>
                          <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            <CheckCircle2 size={11} /> Terverifikasi
                          </span>
                          <button className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors border border-blue-200">
                            <Eye size={11} /> Lihat
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-600 font-semibold">
                          <XCircle size={11} /> Tidak Terverifikasi
                        </span>
                      )
                    ) : (
                      doc.status === 'uploaded' ? (
                        <>
                          <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            <CheckCircle2 size={11} /> Terupload
                          </span>
                          <button className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors border border-blue-200">
                            <Eye size={11} /> Lihat
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUploadDocument(doc.id)}
                          className="flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                        >
                          <Upload size={11} /> Upload
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {uploadedCount < totalCount && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                Masih terdapat <span className="font-semibold">{totalCount - uploadedCount} berkas</span> yang belum lengkap.
                Permohonan tetap dapat diajukan, namun berkas wajib dilengkapi sebelum tahap verifikasi SDM Satker.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('form')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft size={14} /> Kembali
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmitForm}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto"
            >
              <Send size={14} /> Ajukan Permohonan
            </button>
          </div>
        </div>
      );
    }

    // Page 3: Monitoring Table (default page)
    return (
      <div className="p-6 space-y-5">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex gap-3">
          <DoorOpen size={18} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-800">Alur Usulan Pengunduran Diri</p>
            <p className="text-xs text-purple-600 mt-0.5">
              Pengajuan pengunduran diri pegawai melalui sistem, mulai dari pengisian formulir oleh pegawai,
              review berjenjang, hingga penetapan SK Pemberhentian Atas Permintaan Sendiri.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('selection')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 transition-colors"
        >
          <DoorOpen size={16} />
          Ajukan Pengunduran Diri Baru
        </button>

        {submittedRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Permohonan Pengunduran Diri Saya</h3>
              <p className="text-xs text-gray-500">{submittedRequests.length} permohonan yang telah diajukan</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Alasan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl Diajukan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl Efektif</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Proses</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tahapan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {submittedRequests.map((req, idx) => {
                    const statusColor = getStatusColor(req.statusProses);
                    return (
                      <tr key={req.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-700">{req.alasan}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{req.tanggalPengajuan}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{req.tanggalEfektif}</td>
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
                                className="h-full rounded-full"
                                style={{
                                  width: `${(req.tahapanSaat / STEPS.length) * 100}%`,
                                  background: statusColor
                                }}
                              />
                            </div>
                            <span className="text-gray-500 text-[10px]">{req.tahapanSaat}/{STEPS.length}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setViewingRequest(req)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800"
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

        {viewingRequest && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 flex items-start justify-between shrink-0 bg-purple-900">
                <div>
                  <p className="text-white font-semibold">Detail Permohonan Pengunduran Diri</p>
                  <p className="text-white/70 text-xs mt-0.5">Status: {viewingRequest.statusProses}</p>
                </div>
                <button onClick={() => setViewingRequest(null)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-5">
                <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 4: Pengunduran Diri)</p>
                  <WorkflowStepper steps={STEPS} currentStep={viewingRequest.tahapanSaat} />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Detail Pengajuan</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Alasan</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{viewingRequest.alasan}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Tgl Efektif</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{viewingRequest.tanggalEfektif}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Tgl Pengajuan</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{viewingRequest.tanggalPengajuan}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Status</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{viewingRequest.statusProses}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setViewingRequest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 ml-auto"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SDM Satker special views (review tabs, schedule, input)
  if (role === 'sdm-satker' && selected && sdmSatkerView === 'review') {
    const resetAndBack = () => {
      setSdmSatkerWizardStep(1);
      setSdmSatkerVerifikasiDecision('pending');
      setSdmSatkerCatatan('');
      setSdmSatkerBMN({ spp: false, bast: false });
      setSdmSatkerIkatanDinas({ nilaiGantiRugi: '', bukti: false });
      setSdmSatkerHukdis({ surat: false });
      setSdmSatkerTidakDiperlukan(new Set());
      setSelected(null);
      setSdmSatkerView('list');
    };

    const BERKAS_SDM_SATKER = [
      { id: 's1', no: 1, nama: 'SK Kenaikan Pangkat Terakhir', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's2', no: 2, nama: 'SK Peninjauan Masa Kerja', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's3', no: 3, nama: 'Surat Keputusan CPNS', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's4', no: 4, nama: 'Surat Keputusan PNS', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's5', no: 5, nama: 'SK Mutasi Jabatan Terakhir', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's6', no: 6, nama: 'Surat Permohonan Berhenti Atas Permintaan Sendiri sebagai PNS', source: 'upload' as BerkasSource, status: 'uploaded' as BerkasStatus },
      { id: 's7', no: 7, nama: 'SK Cuti Diluar Tanggungan Negara', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's8', no: 8, nama: 'Surat KGB Terakhir', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's9', no: 9, nama: 'Kartu Keluarga', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's10', no: 10, nama: 'Akta Nikah', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
      { id: 's11', no: 11, nama: 'Akta Lahir Anak (anak < 25 tahun dan belum bekerja)', source: 'satu-kemenkeu' as BerkasSource, status: 'verified' as BerkasStatus },
    ];

    const hasIkatanDinas = true;

    const summaryItems = [
      { label: 'Verifikasi Berkas Pengajuan', done: sdmSatkerVerifikasiDecision === 'approved' },
      { label: 'Clearance BMN (SPP + BAST)', done: sdmSatkerBMN.spp && sdmSatkerBMN.bast },
      { label: 'Pelunasan Ikatan Dinas', done: sdmSatkerIkatanDinas.bukti },
      { label: 'Surat Pernyataan Bebas Hukdis', done: sdmSatkerHukdis.surat },
    ];
    const allDone = summaryItems.every(i => i.done);

    const TABS = [
      { no: 1, label: 'Verifikasi Berkas' },
      { no: 2, label: 'Clearance BMN' },
      { no: 3, label: 'Ikatan Dinas' },
      { no: 4, label: 'Hukuman Disiplin' },
      { no: 5, label: 'Konfirmasi' },
    ];

    const tabDone = (no: number) => {
      if (no === 1) return sdmSatkerVerifikasiDecision === 'approved';
      if (no === 2) return sdmSatkerBMN.spp && sdmSatkerBMN.bast;
      if (no === 3) return sdmSatkerIkatanDinas.bukti;
      if (no === 4) return sdmSatkerHukdis.surat;
      return false;
    };

    const UploadRow = ({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: () => void }) => (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-xs font-semibold text-gray-800 flex-1 mr-3">{label}</p>
        <div className="flex items-center gap-2 shrink-0">
          {uploaded ? (
            <>
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                <CheckCircle2 size={11} /> Terupload
              </span>
              <button className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 border border-blue-200">
                <Eye size={11} /> Lihat
              </button>
            </>
          ) : (
            <button onClick={onUpload} className="flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700">
              <Upload size={11} /> Upload
            </button>
          )}
        </div>
      </div>
    );

    return (
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex gap-3">
          <DoorOpen size={18} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-800">Review Permohonan Pengunduran Diri</p>
            <p className="text-xs text-purple-600 mt-0.5">Periksa dan lengkapi setiap aspek persyaratan pengunduran diri.</p>
          </div>
        </div>

        {/* Profile + Workflow */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <UserCircle2 size={32} className="text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{selected.nama}</p>
              <p className="text-xs text-gray-500 mt-0.5">{selected.nip}</p>
              <p className="text-xs text-gray-500">{selected.jabatan} · {selected.satker}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
            <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 4: Pengunduran Diri)</p>
            <WorkflowStepper steps={STEPS} currentStep={3} />
          </div>
        </div>

        {/* Tab Submenu */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map(tab => {
              const isActive = sdmSatkerWizardStep === tab.no;
              const isDone = tabDone(tab.no);
              return (
                <button
                  key={tab.no}
                  onClick={() => setSdmSatkerWizardStep(tab.no)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                    isActive
                      ? 'border-purple-600 text-purple-700 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isDone ? 'bg-green-500 text-white' :
                    isActive ? 'bg-purple-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isDone ? <Check size={10} /> : tab.no}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-5 space-y-4">

            {/* ── TAB 1: Verifikasi Berkas ── */}
            {sdmSatkerWizardStep === 1 && (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Detail Pengajuan</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Alasan', value: 'Alasan Keluarga' },
                      { label: 'Tgl Efektif', value: '31 Juli 2024' },
                      { label: 'Tgl Pengajuan', value: selected.tanggalKasus },
                      { label: 'Status', value: selected.statusProses },
                      { label: 'Jenis Pengunduran Diri', value: selected.jenisPengunduranDiri ?? '-' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Uraian Alasan</p>
                    <p className="text-xs text-gray-700">Pegawai menyatakan ingin mengundurkan diri untuk merawat anggota keluarga yang sakit. Telah dipertimbangkan dengan matang.</p>
                  </div>
                  {/* File pendukung pegawai */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">File Pendukung (dilampirkan Pegawai)</p>
                    {[
                      { nama: 'Surat Keterangan Dokter', tipe: 'PDF', ukuran: '312 KB' },
                      { nama: 'Surat Pernyataan Pengunduran Diri', tipe: 'PDF', ukuran: '185 KB' },
                    ].map(f => (
                      <div key={f.nama} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{f.nama}</p>
                          <p className="text-[10px] text-gray-400">{f.tipe} · {f.ukuran}</p>
                        </div>
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                          <Eye size={11} /> Lihat
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* File rekomendasi atasan */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">File Rekomendasi Atasan Langsung</p>
                    {[
                      { nama: 'Lembar Rekomendasi Atasan Langsung', tipe: 'PDF', ukuran: '224 KB', tanggal: '22 Mei 2024' },
                    ].map(f => (
                      <div key={f.nama} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{f.nama}</p>
                          <p className="text-[10px] text-gray-400">{f.tipe} · {f.ukuran} · {f.tanggal}</p>
                        </div>
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                          <Eye size={11} /> Lihat
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Rantai Persetujuan</p>
                  <div className="space-y-2">
                    {DEFAULT_APPROVALS.map(a => {
                      const Icon = a.icon;
                      return (
                        <div key={a.role} className={`flex items-start gap-3 p-3 rounded-xl border ${
                          a.status === 'approved' ? 'bg-green-50 border-green-200' :
                          a.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            a.status === 'approved' ? 'bg-green-500' : a.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                          }`}><Icon size={14} className="text-white" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold text-gray-800">{a.label}</p>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                                a.status === 'approved' ? 'bg-green-100 text-green-700' :
                                a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                              }`}>{a.status === 'approved' ? 'Disetujui' : a.status === 'rejected' ? 'Ditolak' : 'Menunggu'}</span>
                            </div>
                            {a.name !== '-' && <p className="text-[10px] text-gray-500 mt-0.5">{a.name} · {a.tanggal}</p>}
                            {a.catatan && <p className="text-[10px] text-gray-600 mt-0.5 italic">"{a.catatan}"</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Persyaratan Berkas</p>
                    <p className="text-[10px] text-gray-400">No. 7–11 bersifat opsional</p>
                  </div>
                  <div className="divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                    {BERKAS_SDM_SATKER.map(doc => {
                      const isOptional = doc.no >= 7;
                      const tidakDiperlukan = sdmSatkerTidakDiperlukan.has(doc.id);
                      const toggleTidakDiperlukan = () => {
                        setSdmSatkerTidakDiperlukan(prev => {
                          const next = new Set(prev);
                          if (next.has(doc.id)) next.delete(doc.id);
                          else next.add(doc.id);
                          return next;
                        });
                      };
                      return (
                        <div key={doc.id} className={`flex items-center gap-3 px-4 py-3 ${tidakDiperlukan ? 'bg-gray-50' : 'bg-white'}`}>
                          <span className="text-[10px] text-gray-400 font-semibold w-5 shrink-0">{doc.no}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-xs font-semibold ${tidakDiperlukan ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{doc.nama}</p>
                              {doc.source === 'satu-kemenkeu' && !tidakDiperlukan && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold shrink-0">Satu Kemenkeu</span>
                              )}
                              {isOptional && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold shrink-0">Opsional</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {tidakDiperlukan ? (
                              <>
                                <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-gray-200 text-gray-500 font-semibold">
                                  Tidak Diperlukan
                                </span>
                                <button
                                  onClick={toggleTidakDiperlukan}
                                  className="text-[10px] px-2 py-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 font-semibold"
                                >
                                  Batalkan
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                                  <CheckCircle2 size={11} /> {doc.status === 'verified' ? 'Terverifikasi' : 'Terupload'}
                                </span>
                                <button className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 border border-blue-200">
                                  <Eye size={11} /> Lihat
                                </button>
                                {isOptional && (
                                  <button
                                    onClick={toggleTidakDiperlukan}
                                    className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 font-semibold hover:bg-gray-100 border border-gray-200"
                                  >
                                    <X size={10} /> Tidak Diperlukan
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">Catatan Verifikasi</label>
                  <textarea
                    value={sdmSatkerCatatan}
                    onChange={e => setSdmSatkerCatatan(e.target.value)}
                    placeholder="Tambahkan catatan verifikasi berkas..."
                    rows={2}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none placeholder-gray-400"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setSdmSatkerVerifikasiDecision('rejected')}
                    disabled={sdmSatkerVerifikasiDecision === 'approved'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors ${sdmSatkerVerifikasiDecision === 'approved' ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                  ><X size={13} /> Tolak</button>
                  <button
                    onClick={() => setSdmSatkerVerifikasiDecision('approved')}
                    disabled={sdmSatkerVerifikasiDecision === 'rejected'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors ${sdmSatkerVerifikasiDecision === 'rejected' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  ><Check size={13} /> Setujui</button>
                  {sdmSatkerVerifikasiDecision !== 'pending' && (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sdmSatkerVerifikasiDecision === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {sdmSatkerVerifikasiDecision === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* ── TAB 2: Clearance BMN ── */}
            {sdmSatkerWizardStep === 2 && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800">Clearance Barang Milik Negara (BMN)</p>
                    <p className="text-xs text-blue-600 mt-0.5">Proses pengembalian BMN dilakukan melalui aplikasi SIMAN. Upload dokumen bukti penyelesaian BMN di bawah ini.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Dokumen Clearance BMN</p>
                  <UploadRow
                    label="1. Surat Pernyataan Pengembalian (SPP) Barang Milik Negara"
                    uploaded={sdmSatkerBMN.spp}
                    onUpload={() => setSdmSatkerBMN(b => ({ ...b, spp: true }))}
                  />
                  <UploadRow
                    label="2. Berita Acara Serah Terima (BAST) Barang Milik Negara"
                    uploaded={sdmSatkerBMN.bast}
                    onUpload={() => setSdmSatkerBMN(b => ({ ...b, bast: true }))}
                  />
                </div>
              </>
            )}

            {/* ── TAB 3: Ikatan Dinas ── */}
            {sdmSatkerWizardStep === 3 && (
              <>
                <div className={`rounded-xl p-4 flex gap-3 border ${hasIkatanDinas ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                  <AlertCircle size={16} className={`shrink-0 mt-0.5 ${hasIkatanDinas ? 'text-amber-600' : 'text-green-600'}`} />
                  <div>
                    <p className={`text-xs font-semibold ${hasIkatanDinas ? 'text-amber-800' : 'text-green-800'}`}>
                      Status Ikatan Dinas: {hasIkatanDinas ? 'Masih Memiliki Ikatan Dinas' : 'Tidak Ada Ikatan Dinas'}
                    </p>
                    <p className={`text-xs mt-0.5 ${hasIkatanDinas ? 'text-amber-600' : 'text-green-600'}`}>
                      {hasIkatanDinas
                        ? 'Pegawai tercatat masih memiliki kewajiban ikatan dinas. Wajib melunasi biaya ganti rugi sebelum pengunduran diri diproses.'
                        : 'Pegawai tidak memiliki kewajiban ikatan dinas.'}
                    </p>
                  </div>
                </div>
                {hasIkatanDinas && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Jenis Ikatan Dinas</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">Tugas Belajar S2 LN</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Periode</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">2018 – 2020</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Sisa Kewajiban</p>
                        <p className="text-xs font-semibold text-amber-700 mt-0.5">3 tahun</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1.5">Nilai Ganti Rugi (Rp)</label>
                      <input
                        type="text"
                        value={sdmSatkerIkatanDinas.nilaiGantiRugi}
                        onChange={e => setSdmSatkerIkatanDinas(d => ({ ...d, nilaiGantiRugi: e.target.value }))}
                        placeholder="Contoh: 150.000.000"
                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
                      />
                    </div>
                    <UploadRow
                      label="Bukti Pembayaran Ganti Rugi Ikatan Dinas (Bukti Setor Bank)"
                      uploaded={sdmSatkerIkatanDinas.bukti}
                      onUpload={() => setSdmSatkerIkatanDinas(d => ({ ...d, bukti: true }))}
                    />
                  </div>
                )}
              </>
            )}

            {/* ── TAB 4: Hukuman Disiplin ── */}
            {sdmSatkerWizardStep === 4 && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-green-800">Pemeriksaan Status Hukuman Disiplin</p>
                    <p className="text-xs text-green-600 mt-0.5">Upload surat pernyataan yang menyatakan pegawai bebas dari hukuman disiplin tingkat sedang atau berat.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Dokumen Hukuman Disiplin</p>
                  <UploadRow
                    label="Surat Pernyataan Bebas Hukuman Disiplin Tingkat Sedang/Berat"
                    uploaded={sdmSatkerHukdis.surat}
                    onUpload={() => setSdmSatkerHukdis({ surat: true })}
                  />
                </div>
              </>
            )}

            {/* ── TAB 5: Konfirmasi ── */}
            {sdmSatkerWizardStep === 5 && (
              <>
                <div className={`rounded-xl p-4 flex gap-3 border ${allDone ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                  {allDone
                    ? <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                    : <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className={`text-sm font-semibold ${allDone ? 'text-green-800' : 'text-amber-800'}`}>
                      {allDone ? 'Semua Kelengkapan Berkas Terpenuhi' : 'Masih Terdapat Kelengkapan yang Belum Selesai'}
                    </p>
                    <p className={`text-xs mt-0.5 ${allDone ? 'text-green-600' : 'text-amber-600'}`}>
                      {allDone
                        ? 'Seluruh persyaratan telah terpenuhi. Proses dapat dilanjutkan ke tahap Exit Interview.'
                        : 'Harap selesaikan semua persyaratan pada tab sebelumnya sebelum melanjutkan ke Exit Interview.'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Ringkasan Kelengkapan</p>
                  {summaryItems.map((item, idx) => (
                    <button
                      key={item.label}
                      onClick={() => setSdmSatkerWizardStep(idx + 1)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-green-500' : 'bg-gray-300'}`}>
                        {item.done ? <Check size={12} className="text-white" /> : <X size={12} className="text-white" />}
                      </div>
                      <p className={`text-xs font-semibold flex-1 ${item.done ? 'text-gray-800' : 'text-gray-400'}`}>{item.label}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.done ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                        {item.done ? 'Selesai' : 'Belum'}
                      </span>
                      <ChevronRight size={12} className="text-gray-400" />
                    </button>
                  ))}
                </div>
                {allDone && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
                    <Calendar size={16} className="text-purple-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-700">
                      Dengan melanjutkan, proses pengunduran diri akan diteruskan ke tahap <span className="font-semibold">Exit Interview</span> dan selanjutnya ke SDM UE1 untuk verifikasi lebih lanjut.
                    </p>
                  </div>
                )}
              </>
            )}

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-3">
          <button onClick={resetAndBack} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">
            Kembali ke Daftar
          </button>
          {sdmSatkerWizardStep === 5 && (
            <button
              onClick={resetAndBack}
              disabled={!allDone}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white ml-auto transition-colors ${allDone ? 'bg-purple-900 hover:bg-purple-800' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              <Send size={14} /> Lanjutkan ke Exit Interview
            </button>
          )}
        </div>
      </div>
    );
  }

  if (role === 'sdm-satker' && selected && sdmSatkerView === 'schedule-exit') {
    return (
      <div className="p-6 space-y-5">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <Calendar size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Jadwalkan Exit Interview</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Tentukan jadwal dan pilih pewawancara untuk pelaksanaan exit interview.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Profile Section */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
              <UserCircle2 size={48} className="text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{selected.nama}</p>
              <p className="text-xs text-gray-500 mt-0.5">{selected.nip}</p>
              <p className="text-xs text-gray-500">{selected.jabatan} · {selected.satker}</p>
            </div>
          </div>

          {/* Schedule Form */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Jadwal Exit Interview</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Tanggal</label>
                <input
                  type="date"
                  value={exitInterviewData.tanggal}
                  onChange={e => setExitInterviewData(d => ({ ...d, tanggal: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Waktu</label>
                <input
                  type="time"
                  value={exitInterviewData.waktu}
                  onChange={e => setExitInterviewData(d => ({ ...d, waktu: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Pewawancara Selection */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Pilih Pewawancara (2 orang)</p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Pewawancara 1</label>
                <select
                  value={exitInterviewData.pewawancara1}
                  onChange={e => setExitInterviewData(d => ({ ...d, pewawancara1: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Pilih pewawancara...</option>
                  <option value="Ahmad Hidayat - SDM UE1">Ahmad Hidayat - SDM UE1</option>
                  <option value="Ratna Dewi - SDM Satker">Ratna Dewi - SDM Satker</option>
                  <option value="Budi Santoso - SDM Satker">Budi Santoso - SDM Satker</option>
                  <option value="Siti Nurhaliza - SDM UE1">Siti Nurhaliza - SDM UE1</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Pewawancara 2</label>
                <select
                  value={exitInterviewData.pewawancara2}
                  onChange={e => setExitInterviewData(d => ({ ...d, pewawancara2: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Pilih pewawancara...</option>
                  <option value="Ahmad Hidayat - SDM UE1">Ahmad Hidayat - SDM UE1</option>
                  <option value="Ratna Dewi - SDM Satker">Ratna Dewi - SDM Satker</option>
                  <option value="Budi Santoso - SDM Satker">Budi Santoso - SDM Satker</option>
                  <option value="Siti Nurhaliza - SDM UE1">Siti Nurhaliza - SDM UE1</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => { setSelected(null); setSdmSatkerView('list'); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Kembali
          </button>
          <button
            onClick={() => { setSelected(null); setSdmSatkerView('list'); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            <Check size={14} /> Simpan Jadwal
          </button>
        </div>
      </div>
    );
  }

  if (role === 'sdm-satker' && selected && sdmSatkerView === 'input-exit') {
    return (
      <div className="p-6 space-y-5">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">
          <FileText size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">Input Hasil Exit Interview</p>
            <p className="text-xs text-green-600 mt-0.5">
              Upload dokumen hasil exit interview untuk diteruskan ke UPSDM UE1.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Profile Section */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
              <UserCircle2 size={48} className="text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{selected.nama}</p>
              <p className="text-xs text-gray-500 mt-0.5">{selected.nip}</p>
              <p className="text-xs text-gray-500">{selected.jabatan} · {selected.satker}</p>
            </div>
          </div>

          {/* Exit Interview Info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-800 mb-2">Informasi Exit Interview</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-blue-600">Tanggal & Waktu</p>
                <p className="text-xs font-semibold text-blue-900">15 Juni 2024, 10:00 WIB</p>
              </div>
              <div>
                <p className="text-[10px] text-blue-600">Status</p>
                <p className="text-xs font-semibold text-blue-900">Sudah Dilaksanakan</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-blue-600">Pewawancara</p>
                <p className="text-xs font-semibold text-blue-900">Ratna Dewi, Ahmad Hidayat</p>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Dokumen Hasil Exit Interview</p>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Upload Dokumen Exit Interview</p>
              <p className="text-xs text-gray-500">Format: PDF, maksimal 10MB</p>
              <button className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-green-600 hover:bg-green-700">
                Pilih File
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Catatan Tambahan</label>
            <textarea
              placeholder="Tambahkan catatan terkait hasil exit interview..."
              rows={3}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-400 resize-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => { setSelected(null); setSdmSatkerView('list'); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={() => { setSelected(null); setSdmSatkerView('list'); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700"
          >
            <Send size={14} /> Kirim ke UPSDM UE1
          </button>
        </div>
      </div>
    );
  }

  // SDM UE1 — Letter page for previously rejected employee
  if (selected && showReviewPage && role === 'sdm-ue1' && ue1RejectedItems[selected.id]) {
    const { alasan, tanggal, skNomor: rejSkNomor } = ue1RejectedItems[selected.id];
    const letterContent = `SURAT KEPUTUSAN PENOLAKAN PERMOHONAN PEMBERHENTIAN
NOMOR: SKP-${rejSkNomor}/UE1/2024

Kepada Yth.
${selected.nama}
NIP ${selected.nip}
${selected.jabatan}
${selected.satker}

Perihal : Penolakan Permohonan Pemberhentian sebagai PNS
          Atas Permintaan Sendiri

─────────────────────────────────────────────────────────────

Dengan hormat,

Berdasarkan hasil verifikasi dan penelitian terhadap permohonan
pemberhentian sebagai Pegawai Negeri Sipil atas permintaan sendiri
yang Saudara ajukan, dengan ini kami sampaikan bahwa permohonan
Saudara tidak dapat dikabulkan dengan alasan sebagai berikut:

${alasan || '(Alasan penolakan tidak tersedia)'}

Saudara dapat mengajukan kembali apabila persyaratan telah
terpenuhi sesuai ketentuan yang berlaku.

Ditetapkan di Jakarta
Pada tanggal ${tanggal}

KEPALA UNIT SUMBER DAYA MANUSIA UE1,



[TTD ELEKTRONIK - NADINE]`;

    return (
      <div className="p-6 space-y-5">
        <button onClick={() => { setSelected(null); setShowReviewPage(false); }} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Daftar Permohonan
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
          <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Permohonan Ditolak</p>
            <p className="text-xs text-red-600 mt-0.5">{selected.nama} · {selected.nip} · {selected.jenisPengunduranDiri ?? 'Pengunduran Diri'}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700">Surat Keputusan Penolakan</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"><Eye size={13} /> Preview</button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"><Download size={13} /> Unduh</button>
            </div>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{letterContent}</pre>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setSelected(null); setShowReviewPage(false); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // SDM UE1 — Letter page for previously postponed employee
  if (selected && showReviewPage && role === 'sdm-ue1' && ue1PostponedItems[selected.id]) {
    const { alasan, tanggal, skNomor: pndSkNomor } = ue1PostponedItems[selected.id];
    const letterContent = `SURAT KEPUTUSAN PENUNDAAN PROSES PEMBERHENTIAN
NOMOR: SKND-${pndSkNomor}/UE1/2024

Kepada Yth.
${selected.nama}
NIP ${selected.nip}
${selected.jabatan}
${selected.satker}

Perihal : Penundaan Proses Pemberhentian sebagai PNS
          Atas Permintaan Sendiri

─────────────────────────────────────────────────────────────

Dengan hormat,

Berdasarkan hasil verifikasi terhadap permohonan pemberhentian
sebagai Pegawai Negeri Sipil atas permintaan sendiri yang Saudara
ajukan, dengan ini kami sampaikan bahwa proses pemberhentian
ditunda sementara dengan alasan:

${alasan || '(Alasan penundaan tidak tersedia)'}

Saudara dimohon untuk segera memenuhi persyaratan di atas agar
proses pemberhentian dapat dilanjutkan sesuai ketentuan berlaku.

Ditetapkan di Jakarta
Pada tanggal ${tanggal}

KEPALA UNIT SUMBER DAYA MANUSIA UE1,



[TTD ELEKTRONIK - NADINE]`;

    return (
      <div className="p-6 space-y-5">
        <button onClick={() => { setSelected(null); setShowReviewPage(false); }} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Daftar Permohonan
        </button>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Permohonan Ditunda</p>
            <p className="text-xs text-amber-600 mt-0.5">{selected.nama} · {selected.nip} · {selected.jenisPengunduranDiri ?? 'Pengunduran Diri'}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700">Surat Keputusan Penundaan</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"><Eye size={13} /> Preview</button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"><Download size={13} /> Unduh</button>
            </div>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{letterContent}</pre>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setSelected(null); setShowReviewPage(false); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // SDM UE1 Detail Page with tabs (like Flow 6)
  if (selected && showReviewPage && role === 'sdm-ue1') {
    const berkasWithUpdatedStatus = BERKAS_DENGAN_HAK.map(doc => ({
      ...doc,
      status: doc.source === 'satu-kemenkeu' ? 'verified' as BerkasStatus : 'uploaded' as BerkasStatus
    }));

    const suratRekomendasiContent = `SURAT REKOMENDASI
NOMOR: SR-${ue1SkNomor}/UE1/2024

Kepada Yth.
Kepala Biro Sumber Daya Manusia
Kementerian Keuangan
di Jakarta

Perihal: Rekomendasi Pemberhentian PNS Atas Permintaan Sendiri

Dengan hormat,

Berdasarkan hasil verifikasi dan penelitian terhadap permohonan pemberhentian
sebagai Pegawai Negeri Sipil yang diajukan oleh:

Nama         : ${selected.nama}
NIP          : ${selected.nip}
Pangkat/Gol  : Pembina / IV-a
Jabatan      : ${selected.jabatan}
Unit Kerja   : ${selected.satker}

Dengan inikami merekomendasikan untuk dapat diproses lebih lanjut pemberhentian
dengan hormat sebagai Pegawai Negeri Sipil atas permintaan sendiri terhadap
yang bersangkutan dengan pertimbangan sebagai berikut:

1. Berkas persyaratan pemberhentian telah lengkap dan memenuhi ketentuan
2. Tidak terdapat kendala administratif kepegawaian
3. Yang bersangkutan tidak sedang dalam proses hukuman disiplin
4. Telah dilakukan verifikasi kelengkapan dokumen

${ue1Catatan ? `Catatan Tambahan:\n${ue1Catatan}\n` : ''}
Demikian surat rekomendasi ini dibuat untuk dapat diproses sesuai ketentuan
yang berlaku.

Ditetapkan di Jakarta
Pada tanggal _______________

KEPALA UNIT SUMBER DAYA MANUSIA UE1,



[TTD ELEKTRONIK - NADINE]
`;

    const notaDinasContent = `NOTA DINAS
NOMOR: ${notaDinasData.nomor}

Kepada      : ${notaDinasData.kepada}
Dari        : Kepala Unit Sumber Daya Manusia UE1
Tanggal     : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
Perihal     : ${notaDinasData.perihal}

─────────────────────────────────────────────────────────────────

Dengan hormat,

Bersama ini kami sampaikan permohonan pemberhentian sebagai Pegawai Negeri Sipil
atas permintaan sendiri untuk pegawai dengan data sebagai berikut:

Nama         : ${selected.nama}
NIP          : ${selected.nip}
Pangkat/Gol  : Pembina / IV-a
Jabatan      : ${selected.jabatan}
Unit Kerja   : ${selected.satker}

Terlampir bersama nota dinas ini:
1. Surat Rekomendasi Pemberhentian (Nomor: SR-${ue1SkNomor}/UE1/2024)
2. Berkas kelengkapan persyaratan pemberhentian
3. Hasil verifikasi kelengkapan dokumen

Kami mohon kiranya dapat diproses lebih lanjut sesuai dengan ketentuan yang berlaku.

Demikian nota dinas ini kami sampaikan untuk menjadi perhatian dan dapat ditindaklanjuti.



KEPALA UNIT SUMBER DAYA MANUSIA UE1,



[TTD ELEKTRONIK - NADINE]
`;

    const suratPenolakanContent = `SURAT KEPUTUSAN PENOLAKAN PERMOHONAN PEMBERHENTIAN
NOMOR: SKP-${ue1SkNomor}/UE1/2024

Kepada Yth.
${selected.nama}
NIP ${selected.nip}
${selected.jabatan}
${selected.satker}

Perihal : Penolakan Permohonan Pemberhentian sebagai PNS
          Atas Permintaan Sendiri

─────────────────────────────────────────────────────────────

Dengan hormat,

Berdasarkan hasil verifikasi terhadap permohonan Saudara tanggal ${selected.tanggalKasus},
dengan ini kami sampaikan bahwa permohonan tidak dapat dikabulkan dengan alasan:

${ue1Catatan || '(Alasan penolakan akan diisi berdasarkan catatan verifikasi)'}

Saudara dapat mengajukan kembali apabila persyaratan telah terpenuhi.

Ditetapkan di Jakarta
Pada tanggal _______________
KEPALA UNIT SUMBER DAYA MANUSIA UE1,

[TTD ELEKTRONIK - NADINE]`;

    const suratPenundaanContent = `SURAT KEPUTUSAN PENUNDAAN PROSES PEMBERHENTIAN
NOMOR: SKND-${ue1SkNomor}/UE1/2024

Kepada Yth.
${selected.nama}
NIP ${selected.nip}
${selected.jabatan}
${selected.satker}

Perihal : Penundaan Proses Pemberhentian sebagai PNS
          Atas Permintaan Sendiri

─────────────────────────────────────────────────────────────

Dengan hormat,

Berdasarkan hasil verifikasi terhadap permohonan Saudara tanggal ${selected.tanggalKasus},
dengan ini kami sampaikan bahwa proses pemberhentian ditunda sementara dengan alasan:

${ue1Catatan || '(Alasan penundaan akan diisi berdasarkan catatan verifikasi)'}

Saudara dimohon segera memenuhi persyaratan di atas agar proses dapat dilanjutkan.

Ditetapkan di Jakarta
Pada tanggal _______________
KEPALA UNIT SUMBER DAYA MANUSIA UE1,

[TTD ELEKTRONIK - NADINE]`;

    return (
      <div className="p-6 space-y-5">
        {/* Back button */}
        <button
          onClick={() => { setSelected(null); setShowReviewPage(false); }}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Permohonan
        </button>

        {/* Employee Info Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4" style={{ background: '#4C1D95' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-white font-bold text-base">{selected.nama}</p>
                <p className="text-white/70 text-xs mt-0.5">{selected.nip} · {selected.jabatan} · {selected.satker}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-white bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    Pengunduran Diri
                  </span>
                  <span className="text-[10px] text-white/70">Tanggal Pengajuan: {selected.tanggalKasus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
          <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 4: Pengunduran Diri - SDM UE1)</p>
          <WorkflowStepper steps={STEPS} currentStep={4} />
        </div>

        {/* Content Card with Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 m-5 mb-0">
            {(ue1Decision === 'approve' ? [
              { id: 'verifikasi', label: '1. Verifikasi & Keputusan' },
              { id: 'draft-rekomendasi', label: '2. Draft Surat Rekomendasi' },
              { id: 'nota-dinas', label: '3. Nota Dinas' },
              { id: 'tte', label: '4. TTE & Terbit' },
            ] : ue1Decision === 'reject' ? [
              { id: 'verifikasi', label: '1. Verifikasi & Keputusan' },
              { id: 'draft-penolakan', label: '2. Draft Surat Penolakan' },
              { id: 'tte', label: '3. TTE & Terbit' },
            ] : ue1Decision === 'postpone' ? [
              { id: 'verifikasi', label: '1. Verifikasi & Keputusan' },
              { id: 'draft-penundaan', label: '2. Draft Surat Penundaan' },
              { id: 'tte', label: '3. TTE & Terbit' },
            ] : [
              { id: 'verifikasi', label: '1. Verifikasi & Keputusan' },
              { id: 'draft-rekomendasi', label: '2. Draft Dokumen' },
              { id: 'nota-dinas', label: '3. Nota Dinas' },
              { id: 'tte', label: '4. TTE & Terbit' },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => ue1Decision && setUe1Step(tab.id as any)}
                disabled={!ue1Decision && tab.id !== 'verifikasi'}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  ue1Step === tab.id
                    ? 'bg-white text-gray-800 shadow-sm'
                    : ue1Decision || tab.id === 'verifikasi'
                      ? 'text-gray-500 hover:text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {ue1Step === 'verifikasi' && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">Verifikasi Permohonan Pengunduran Diri</p>

                {/* Detail Pengajuan */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-600">Detail Pengajuan</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Alasan', value: 'Alasan Keluarga' },
                      { label: 'Tgl Efektif', value: '31 Juli 2024' },
                      { label: 'Tgl Pengajuan', value: selected.tanggalKasus },
                      { label: 'Status', value: selected.statusProses },
                      { label: 'Jenis Pengunduran Diri', value: selected.jenisPengunduranDiri ?? '-' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Uraian Alasan</p>
                    <p className="text-xs text-gray-700">Pegawai menyatakan ingin mengundurkan diri untuk merawat anggota keluarga yang sakit. Telah dipertimbangkan dengan matang.</p>
                  </div>
                  {/* File pendukung pegawai */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">File Pendukung (dilampirkan Pegawai)</p>
                    {[
                      { nama: 'Surat Keterangan Dokter', tipe: 'PDF', ukuran: '312 KB' },
                      { nama: 'Surat Pernyataan Pengunduran Diri', tipe: 'PDF', ukuran: '185 KB' },
                    ].map(f => (
                      <div key={f.nama} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{f.nama}</p>
                          <p className="text-[10px] text-gray-400">{f.tipe} · {f.ukuran}</p>
                        </div>
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                          <Eye size={11} /> Lihat
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* File rekomendasi atasan */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">File Rekomendasi Atasan Langsung</p>
                    {[
                      { nama: 'Lembar Rekomendasi Atasan Langsung', tipe: 'PDF', ukuran: '224 KB', tanggal: '22 Mei 2024' },
                    ].map(f => (
                      <div key={f.nama} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{f.nama}</p>
                          <p className="text-[10px] text-gray-400">{f.tipe} · {f.ukuran} · {f.tanggal}</p>
                        </div>
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                          <Eye size={11} /> Lihat
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Berkas Verification */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-600">Verifikasi Kelengkapan Berkas</p>
                  <div className="space-y-2">
                    {berkasWithUpdatedStatus.slice(0, 8).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 flex-1">
                          <Check size={14} className="text-green-600 shrink-0" />
                          <p className="text-xs text-gray-700">{doc.nama}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                            {doc.source === 'satu-kemenkeu' ? 'Terverifikasi' : 'Terupload'}
                          </span>
                          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                            <Eye size={12} /> Lihat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approval Chain */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Rantai Persetujuan</p>
                  {DEFAULT_APPROVALS.map((a, idx) => {
                    const Icon = a.icon;
                    const isApproved = a.status === 'approved';
                    const isRejected = a.status === 'rejected';
                    const isPending = a.status === 'pending';
                    const borderColor = isApproved ? 'border-green-200' : isRejected ? 'border-red-200' : 'border-gray-200';
                    const bgColor = isApproved ? 'bg-green-50' : isRejected ? 'bg-red-50' : 'bg-gray-50';
                    const iconBg = isApproved ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-gray-300';
                    const badgeBg = isApproved ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500';
                    const badgeLabel = isApproved ? 'Disetujui' : isRejected ? 'Ditolak' : 'Menunggu';
                    return (
                      <div key={idx} className={`flex items-start gap-3 p-2.5 rounded-xl border ${bgColor} ${borderColor}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                          {isApproved ? <Check size={12} className="text-white" /> : isRejected ? <X size={12} className="text-white" /> : <Icon size={12} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800">{a.label}</p>
                          {a.name !== '-' && <p className="text-[10px] text-gray-500">{a.name}{a.tanggal ? ` · ${a.tanggal}` : ''}</p>}
                          {a.catatan && <p className="text-[10px] text-gray-500 mt-0.5 italic">"{a.catatan}"</p>}
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${badgeBg}`}>
                          {badgeLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Catatan */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    {ue1Decision === 'reject' ? 'Alasan Penolakan' : ue1Decision === 'postpone' ? 'Alasan Penundaan' : 'Catatan Persetujuan'}
                  </label>
                  <textarea
                    value={ue1Catatan}
                    onChange={e => setUe1Catatan(e.target.value)}
                    placeholder={ue1Decision === 'reject'
                      ? "Masukkan alasan penolakan permohonan..."
                      : "Catatan persetujuan (opsional)..."
                    }
                    rows={3}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none placeholder-gray-400"
                  />
                </div>

                {/* Decision Prompt */}
                {!ue1Decision && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-blue-800 mb-2">Keputusan Verifikasi</p>
                    <p className="text-xs text-blue-600 mb-3">
                      Setelah memverifikasi kelengkapan berkas dan pertimbangan, silakan pilih keputusan:
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setUe1Decision('reject')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                      >
                        <X size={13} /> Tolak Permohonan
                      </button>
                      <button
                        onClick={() => setUe1Decision('postpone')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
                      >
                        <AlertCircle size={13} /> Tunda Permohonan
                      </button>
                      <button
                        onClick={() => setUe1Decision('approve')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <Check size={13} /> Setujui Permohonan
                      </button>
                    </div>
                  </div>
                )}

                {/* Decision Made */}
                {ue1Decision && (
                  <div className={`rounded-xl p-4 border ${
                    ue1Decision === 'approve' ? 'bg-green-50 border-green-200' :
                    ue1Decision === 'postpone' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {ue1Decision === 'approve' ? <Check size={16} className="text-green-600" /> :
                       ue1Decision === 'postpone' ? <AlertCircle size={16} className="text-amber-600" /> :
                       <X size={16} className="text-red-600" />}
                      <p className={`text-xs font-semibold ${
                        ue1Decision === 'approve' ? 'text-green-800' :
                        ue1Decision === 'postpone' ? 'text-amber-800' :
                        'text-red-800'
                      }`}>
                        Keputusan: {ue1Decision === 'approve' ? 'Disetujui' : ue1Decision === 'postpone' ? 'Ditunda' : 'Ditolak'}
                      </p>
                    </div>
                    <p className={`text-xs ${
                      ue1Decision === 'approve' ? 'text-green-600' :
                      ue1Decision === 'postpone' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {ue1Decision === 'approve'
                        ? 'Permohonan akan diproses untuk penerbitan SK Pemberhentian.'
                        : ue1Decision === 'postpone'
                        ? 'Proses permohonan ditunda. Surat keputusan penundaan akan digenerate.'
                        : 'Surat keputusan penolakan akan digenerate dan dikirimkan kepada pegawai.'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {ue1Step === 'draft-rekomendasi' && ue1Decision === 'approve' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Draft Surat Rekomendasi Pemberhentian</p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
                  <p className="text-xs text-blue-700">
                    Surat rekomendasi ini akan menjadi lampiran dalam Nota Dinas yang akan dikirim ke Biro SDM.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{suratRekomendasiContent}</pre>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Eye size={13} /> Preview
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Download size={13} /> Unduh Draft
                  </button>
                </div>
              </div>
            )}

            {ue1Step === 'nota-dinas' && ue1Decision === 'approve' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Nota Dinas ke Biro SDM</p>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3">
                  <p className="text-xs text-purple-700">
                    Nota Dinas ini akan dikirim ke Biro SDM dengan melampirkan Surat Rekomendasi yang telah dibuat sebelumnya.
                  </p>
                </div>

                {/* Nota Dinas Info */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Nomor Nota Dinas</p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">{notaDinasData.nomor}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Kepada</p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">{notaDinasData.kepada}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{notaDinasContent}</pre>
                </div>

                {/* Lampiran */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Lampiran Nota Dinas:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-blue-600" />
                        <p className="text-xs text-gray-700">Surat Rekomendasi Pemberhentian</p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                        Terlampir
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-blue-600" />
                        <p className="text-xs text-gray-700">Berkas Kelengkapan Persyaratan</p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                        Terlampir
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Eye size={13} /> Preview Nota Dinas
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Download size={13} /> Unduh Nota Dinas
                  </button>
                </div>
              </div>
            )}

            {ue1Step === 'draft-penolakan' && ue1Decision === 'reject' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Draft Surat Keputusan Penolakan</p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs text-red-700">Surat penolakan ini akan ditandatangani dan dikirimkan kepada pegawai yang bersangkutan.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-72 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{suratPenolakanContent}</pre>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Eye size={13} /> Preview
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Download size={13} /> Unduh Draft
                  </button>
                </div>
              </div>
            )}

            {ue1Step === 'draft-penundaan' && ue1Decision === 'postpone' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Draft Surat Keputusan Penundaan</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700">Surat penundaan ini akan ditandatangani dan dikirimkan kepada pegawai yang bersangkutan.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-72 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{suratPenundaanContent}</pre>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Eye size={13} /> Preview
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Download size={13} /> Unduh Draft
                  </button>
                </div>
              </div>
            )}

            {ue1Step === 'tte' && ue1Decision && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">Tanda Tangan Elektronik (Nadine)</p>

                {ue1Decision === 'approve' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-purple-800 mb-1">Dokumen yang akan ditandatangani:</p>
                    <ul className="text-xs text-purple-700 space-y-0.5 ml-4">
                      <li>• Surat Rekomendasi Pemberhentian</li>
                      <li>• Nota Dinas ke Biro SDM</li>
                    </ul>
                  </div>
                )}

                <div className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-blue-50/50">
                  <Stamp size={40} className="mx-auto mb-3 text-blue-300" />
                  <p className="text-sm font-semibold text-blue-700">Proses TTE via Nadine</p>
                  <p className="text-xs text-blue-500 mt-1">
                    {ue1Decision === 'approve'
                      ? 'Surat Rekomendasi dan Nota Dinas siap untuk ditandatangani secara elektronik'
                      : 'Surat Penolakan siap untuk ditandatangani secara elektronik'
                    }
                  </p>
                  <button className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Ajukan ke Nadine untuk TTE
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">
                    {ue1Decision === 'approve'
                      ? 'Setelah ditandatangani, Nota Dinas beserta lampirannya akan dikirimkan ke Biro SDM untuk proses lebih lanjut.'
                      : 'Surat penolakan yang telah ditandatangani akan dikirimkan kepada pegawai yang bersangkutan.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
            {ue1Step === 'verifikasi' && ue1Decision && (
              <button
                onClick={() => setUe1Step(ue1Decision === 'approve' ? 'draft-rekomendasi' : 'draft-penolakan')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto transition-colors"
              >
                Lanjut ke Draft <ChevronRight size={13} />
              </button>
            )}
            {ue1Step === 'draft-rekomendasi' && ue1Decision === 'approve' && (
              <button
                onClick={() => setUe1Step('nota-dinas')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto transition-colors"
              >
                Lanjut ke Nota Dinas <ChevronRight size={13} />
              </button>
            )}
            {ue1Step === 'nota-dinas' && ue1Decision === 'approve' && (
              <button
                onClick={() => setUe1Step('tte')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto transition-colors"
              >
                Lanjut ke TTE <ChevronRight size={13} />
              </button>
            )}
            {ue1Step === 'draft-penolakan' && ue1Decision === 'reject' && (
              <button
                onClick={() => setUe1Step('tte')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto transition-colors"
              >
                Lanjut ke TTE <ChevronRight size={13} />
              </button>
            )}
            {ue1Step === 'draft-penundaan' && ue1Decision === 'postpone' && (
              <button
                onClick={() => setUe1Step('tte')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto transition-colors"
              >
                Lanjut ke TTE <ChevronRight size={13} />
              </button>
            )}
            {ue1Step === 'tte' && (
              <button
                onClick={() => {
                  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                  if (ue1Decision === 'reject') {
                    setUe1RejectedItems(prev => ({ ...prev, [selected.id]: { alasan: ue1Catatan, tanggal: today, skNomor: ue1SkNomor } }));
                  } else if (ue1Decision === 'postpone') {
                    setUe1PostponedItems(prev => ({ ...prev, [selected.id]: { alasan: ue1Catatan, tanggal: today, skNomor: ue1SkNomor } }));
                  }
                  setSelected(null);
                  setShowReviewPage(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 ml-auto transition-colors"
              >
                <Check size={13} /> Selesaikan
              </button>
            )}
            <button
              onClick={() => { setSelected(null); setShowReviewPage(false); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors ${!ue1Decision && ue1Step === 'verifikasi' ? 'ml-auto' : ''}`}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Biro SDM - Action Page (Tolak / Penundaan) — multi-step
  if (role === 'biro-sdm' && selected && showPegawaiDetail && activeNotaDinas && showBiroSdmActionPage && biroSdmAction) {
    const isTolak = biroSdmAction === 'tolak';
    const tglSurat = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const tahun = new Date().getFullYear();

    const suratContent = isTolak
      ? `SURAT PENOLAKAN PERMOHONAN PEMBERHENTIAN
NOMOR: SP-${biroSdmSkNomor}/BSDM/${tahun}

Kepada Yth.
${selected.nama}
NIP ${selected.nip}
${selected.jabatan}
${selected.satker}

Perihal : Penolakan Permohonan Pemberhentian sebagai PNS
          Atas Permintaan Sendiri (${activeNotaDinas.jenisPengunduranDiri})

─────────────────────────────────────────────────────────────

Dengan hormat,

Berdasarkan penelitian terhadap permohonan pemberhentian Saudara sebagai
Pegawai Negeri Sipil atas permintaan sendiri, dengan ini kami sampaikan bahwa
setelah dilakukan pertimbangan, permohonan Saudara tidak dapat dikabulkan
dengan alasan sebagai berikut:

${biroSdmAlasan || '(Alasan penolakan)'}

Saudara dapat mengajukan kembali apabila persyaratan telah terpenuhi sesuai
ketentuan yang berlaku.

Ditetapkan di Jakarta
Pada tanggal ${tglSurat}

KEPALA BIRO SUMBER DAYA MANUSIA,



[TTD ELEKTRONIK - NADINE]`
      : `SURAT PENUNDAAN PROSES PEMBERHENTIAN
NOMOR: SND-${biroSdmSkNomor}/BSDM/${tahun}

Kepada Yth.
${selected.nama}
NIP ${selected.nip}
${selected.jabatan}
${selected.satker}

Perihal : Penundaan Proses Pemberhentian sebagai PNS
          Atas Permintaan Sendiri (${activeNotaDinas.jenisPengunduranDiri})

─────────────────────────────────────────────────────────────

Dengan hormat,

Berdasarkan penelitian terhadap permohonan pemberhentian Saudara sebagai
Pegawai Negeri Sipil atas permintaan sendiri, dengan ini kami sampaikan bahwa
proses pemberhentian ditunda sementara dengan alasan:

${biroSdmAlasan || '(Alasan penundaan)'}

Saudara dimohon segera memenuhi persyaratan di atas agar proses pemberhentian
dapat dilanjutkan sesuai ketentuan yang berlaku.

Ditetapkan di Jakarta
Pada tanggal ${tglSurat}

KEPALA BIRO SUMBER DAYA MANUSIA,



[TTD ELEKTRONIK - NADINE]`;

    const tabs = [
      { id: 'alasan' as const, label: `1. ${isTolak ? 'Alasan Penolakan' : 'Alasan Penundaan'}` },
      { id: 'draft-surat' as const, label: `2. ${isTolak ? 'Draft Surat Penolakan' : 'Draft Surat Penundaan'}` },
      { id: 'tte' as const, label: '3. TTE & Terbit' },
    ];

    return (
      <div className="p-6 space-y-5">
        <button
          onClick={() => { setShowBiroSdmActionPage(false); setBiroSdmAlasan(''); setBiroSdmStep('alasan'); }}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Detail Pegawai
        </button>

        {/* Header */}
        <div className={`rounded-2xl p-4 flex gap-3 border ${isTolak ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
          <AlertCircle size={18} className={`shrink-0 mt-0.5 ${isTolak ? 'text-red-500' : 'text-amber-500'}`} />
          <div>
            <p className={`text-sm font-semibold ${isTolak ? 'text-red-800' : 'text-amber-800'}`}>
              {isTolak ? 'Penolakan Permohonan Pengunduran Diri' : 'Penundaan Proses Pengunduran Diri'}
            </p>
            <p className={`text-xs mt-0.5 ${isTolak ? 'text-red-600' : 'text-amber-600'}`}>
              {selected.nama} · {selected.nip} · {activeNotaDinas.jenisPengunduranDiri}
            </p>
          </div>
        </div>

        {/* Card with tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 m-5 mb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'alasan') setBiroSdmStep('alasan');
                  else if (biroSdmAlasan.trim()) setBiroSdmStep(tab.id);
                }}
                disabled={tab.id !== 'alasan' && !biroSdmAlasan.trim()}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  biroSdmStep === tab.id
                    ? 'bg-white text-gray-800 shadow-sm'
                    : biroSdmAlasan.trim() || tab.id === 'alasan'
                      ? 'text-gray-500 hover:text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6">

            {/* Step 1: Alasan */}
            {biroSdmStep === 'alasan' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <UserCircle2 size={28} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selected.nama}</p>
                    <p className="text-xs text-gray-500">{selected.nip} · {selected.jabatan} · {selected.satker}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">
                    {isTolak ? 'Alasan Penolakan' : 'Alasan Penundaan'} <span className="text-red-400">*</span>
                  </label>
                  <p className="text-xs text-gray-500">
                    {isTolak
                      ? 'Jelaskan alasan penolakan secara rinci berdasarkan peraturan yang berlaku.'
                      : 'Jelaskan alasan penundaan dan persyaratan yang masih harus dipenuhi oleh pegawai.'}
                  </p>
                  <textarea
                    value={biroSdmAlasan}
                    onChange={e => setBiroSdmAlasan(e.target.value)}
                    placeholder={isTolak
                      ? 'Contoh: Permohonan ditolak karena pegawai masih terikat ikatan dinas yang belum diselesaikan...'
                      : 'Contoh: Proses ditunda karena masih terdapat kewajiban pelunasan ganti rugi ikatan dinas...'}
                    rows={6}
                    className={`w-full text-xs border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 resize-none placeholder-gray-400 ${
                      isTolak
                        ? 'border-red-200 focus:ring-red-300 bg-red-50/30'
                        : 'border-amber-200 focus:ring-amber-300 bg-amber-50/30'
                    }`}
                  />
                </div>

                <div className={`rounded-xl p-4 flex gap-3 border ${isTolak ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                  <AlertCircle size={14} className={`shrink-0 mt-0.5 ${isTolak ? 'text-red-500' : 'text-amber-500'}`} />
                  <ul className={`text-xs space-y-0.5 ml-1 list-disc ${isTolak ? 'text-red-700' : 'text-amber-700'}`}>
                    {isTolak ? (
                      <>
                        <li>Penolakan akan dicatat dalam sistem kepegawaian</li>
                        <li>Surat penolakan resmi akan dikirimkan kepada pegawai</li>
                        <li>Pegawai dapat mengajukan ulang jika syarat terpenuhi</li>
                      </>
                    ) : (
                      <>
                        <li>Proses akan ditangguhkan sementara</li>
                        <li>Surat penundaan resmi akan dikirimkan kepada pegawai</li>
                        <li>Proses dilanjutkan setelah seluruh syarat terpenuhi</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Draft Surat */}
            {biroSdmStep === 'draft-surat' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">
                  {isTolak ? 'Draft Surat Penolakan' : 'Draft Surat Penundaan'}
                </p>
                <div className={`p-3 rounded-xl border ${isTolak ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                  <p className={`text-xs ${isTolak ? 'text-red-700' : 'text-amber-700'}`}>
                    {isTolak
                      ? 'Surat penolakan ini akan ditandatangani secara elektronik melalui Nadine dan dikirimkan kepada pegawai.'
                      : 'Surat penundaan ini akan ditandatangani secara elektronik melalui Nadine dan dikirimkan kepada pegawai.'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-80 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{suratContent}</pre>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Eye size={13} /> Preview
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Download size={13} /> Unduh Draft
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: TTE & Terbit */}
            {biroSdmStep === 'tte' && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">Tanda Tangan Elektronik (Nadine)</p>
                <div className={`p-3 rounded-xl border ${isTolak ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                  <p className={`text-xs font-semibold mb-1 ${isTolak ? 'text-red-800' : 'text-amber-800'}`}>
                    Dokumen yang akan ditandatangani:
                  </p>
                  <ul className={`text-xs space-y-0.5 ml-4 list-disc ${isTolak ? 'text-red-700' : 'text-amber-700'}`}>
                    <li>{isTolak ? 'Surat Penolakan Permohonan Pemberhentian' : 'Surat Penundaan Proses Pemberhentian'}</li>
                    <li>Nomor: {isTolak ? `SP-${biroSdmSkNomor}/BSDM/${tahun}` : `SND-${biroSdmSkNomor}/BSDM/${tahun}`}</li>
                  </ul>
                </div>
                <div className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-blue-50/50">
                  <Stamp size={40} className="mx-auto mb-3 text-blue-300" />
                  <p className="text-sm font-semibold text-blue-700">Proses TTE via Nadine</p>
                  <p className="text-xs text-blue-500 mt-1">
                    {isTolak
                      ? 'Surat Penolakan siap untuk ditandatangani secara elektronik'
                      : 'Surat Penundaan siap untuk ditandatangani secara elektronik'}
                  </p>
                  <button className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Ajukan ke Nadine untuk TTE
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">
                    {isTolak
                      ? 'Setelah ditandatangani, surat penolakan akan dikirimkan kepada pegawai yang bersangkutan.'
                      : 'Setelah ditandatangani, surat penundaan akan dikirimkan kepada pegawai untuk ditindaklanjuti.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
            {biroSdmStep === 'alasan' && (
              <button
                onClick={() => setBiroSdmStep('draft-surat')}
                disabled={!biroSdmAlasan.trim()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white ml-auto transition-colors ${
                  biroSdmAlasan.trim() ? 'bg-purple-900 hover:bg-purple-800' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Lanjut ke Draft Surat <ChevronRight size={13} />
              </button>
            )}
            {biroSdmStep === 'draft-surat' && (
              <button
                onClick={() => setBiroSdmStep('tte')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto transition-colors"
              >
                Lanjut ke TTE <ChevronRight size={13} />
              </button>
            )}
            {biroSdmStep === 'tte' && (
              <button
                onClick={() => {
                  setBiroSdmStep('alasan');
                  setShowBiroSdmActionPage(false);
                  setBiroSdmAlasan('');
                  setBiroSdmAction(null);
                  setSelected(null);
                  setShowPegawaiDetail(false);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 ml-auto transition-colors"
              >
                <Check size={13} /> Selesaikan
              </button>
            )}
            <button
              onClick={() => { setShowBiroSdmActionPage(false); setBiroSdmAlasan(''); setBiroSdmStep('alasan'); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors ${biroSdmStep === 'alasan' ? 'ml-auto' : ''}`}
            >
              {biroSdmStep === 'alasan' ? 'Batal' : 'Kembali'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Biro SDM - Pegawai Detail Page (Verifikasi)
  if (role === 'biro-sdm' && selected && showPegawaiDetail && activeNotaDinas) {
    const berkasList = activeNotaDinas.jenisPengunduranDiri === 'Tanpa Hak Pensiun' ? BERKAS_TANPA_HAK : BERKAS_DENGAN_HAK;
    const berkasWithUpdatedStatus = berkasList.map(doc => ({
      ...doc,
      status: doc.source === 'satu-kemenkeu' ? 'verified' as BerkasStatus : 'uploaded' as BerkasStatus
    }));

    const getCurrentStepForRole = () => 5; // Biro SDM is step 5

    const approvals: ApprovalNode[] = [
      { role: 'atasan', label: 'Atasan Langsung', status: 'approved', name: 'Dr. Surya Pratama', tanggal: '20 Mei 2024', catatan: 'Disetujui. Pegawai telah menyampaikan alasan yang dapat dipahami.', icon: User },
      { role: 'sdm-satker', label: 'SDM Satker', status: 'approved', name: 'Ratna Dewi', tanggal: '22 Mei 2024', catatan: 'Berkas lengkap, tidak ada kendala administrasi.', icon: Building2 },
      { role: 'sdm-ue1', label: 'SDM UE1', status: 'approved', name: 'Ahmad Hidayat', tanggal: '24 Mei 2024', catatan: 'Telah diverifikasi dan direkomendasikan.', icon: Building2 },
      { role: 'biro-sdm', label: 'Biro SDM', status: 'pending', name: '-', icon: ShieldCheck },
    ];

    return (
      <div className="p-6 space-y-5">
        {/* Back button */}
        <button
          onClick={() => { setSelected(null); setShowPegawaiDetail(false); }}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Pegawai
        </button>

        {/* Employee Info Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4" style={{ background: '#4C1D95' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-white font-bold text-base">{selected.nama}</p>
                <p className="text-white/70 text-xs mt-0.5">{selected.nip} · {selected.jabatan} · {selected.satker}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-white bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    {activeNotaDinas.jenisPengunduranDiri}
                  </span>
                  <span className="text-[10px] text-white/70">Nota Dinas: {activeNotaDinas.nomor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
          <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 4: Pengunduran Diri - Biro SDM)</p>
          <WorkflowStepper steps={STEPS} currentStep={getCurrentStepForRole()} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Detail Pengajuan */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Detail Pengajuan</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Alasan', value: 'Alasan Keluarga' },
                { label: 'Tgl Efektif', value: '31 Juli 2024' },
                { label: 'Tgl Pengajuan', value: selected.tanggalKasus },
                { label: 'Jenis', value: activeNotaDinas.jenisPengunduranDiri },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Uraian Alasan</p>
              <p className="text-xs text-gray-700">Pegawai menyatakan ingin mengundurkan diri untuk merawat anggota keluarga yang sakit. Telah dipertimbangkan dengan matang.</p>
            </div>
            {/* File pendukung pegawai */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">File Pendukung (dilampirkan Pegawai)</p>
              {[
                { nama: 'Surat Keterangan Dokter', tipe: 'PDF', ukuran: '312 KB' },
                { nama: 'Surat Pernyataan Pengunduran Diri', tipe: 'PDF', ukuran: '185 KB' },
              ].map(f => (
                <div key={f.nama} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{f.nama}</p>
                    <p className="text-[10px] text-gray-400">{f.tipe} · {f.ukuran}</p>
                  </div>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                    <Eye size={11} /> Lihat
                  </button>
                </div>
              ))}
            </div>
            {/* File rekomendasi atasan */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">File Rekomendasi Atasan Langsung</p>
              {[
                { nama: 'Lembar Rekomendasi Atasan Langsung', tipe: 'PDF', ukuran: '224 KB', tanggal: '22 Mei 2024' },
              ].map(f => (
                <div key={f.nama} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{f.nama}</p>
                    <p className="text-[10px] text-gray-400">{f.tipe} · {f.ukuran} · {f.tanggal}</p>
                  </div>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                    <Eye size={11} /> Lihat
                  </button>
                </div>
              ))}
            </div>
            {/* Surat rekomendasi SDM UE1 */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Surat Rekomendasi Unit SDM UE1</p>
              {[
                { nama: 'Surat Rekomendasi Unit SDM UE1', tipe: 'PDF', ukuran: '198 KB', tanggal: '28 Mei 2024' },
              ].map(f => (
                <div key={f.nama} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{f.nama}</p>
                    <p className="text-[10px] text-gray-400">{f.tipe} · {f.ukuran} · {f.tanggal}</p>
                  </div>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                    <Eye size={11} /> Lihat
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Berkas Terlampir */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Berkas Terlampir</p>
            <div className="space-y-2">
              {berkasWithUpdatedStatus.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-800">{doc.nama}</p>
                      {doc.source === 'satu-kemenkeu' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                          Satu Kemenkeu
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.source === 'satu-kemenkeu' ? (
                      doc.status === 'verified' ? (
                        <>
                          <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            <CheckCircle2 size={12} /> Terverifikasi
                          </span>
                          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                            <Eye size={12} /> Lihat
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                          <XCircle size={12} /> Tidak Terverifikasi
                        </span>
                      )
                    ) : (
                      doc.status === 'uploaded' ? (
                        <>
                          <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            <CheckCircle2 size={12} /> Terupload
                          </span>
                          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                            <Eye size={12} /> Lihat
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold">
                          <XCircle size={12} /> Belum Terupload
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}

              {/* Clearance documents from SDM Satker review */}
              {[
                { id: 'cl-bmn', nama: 'Surat Keterangan Clearance BMN', label: 'Clearance BMN', tipe: 'PDF', ukuran: '234 KB', tanggal: '22 Mei 2024' },
                { id: 'cl-ikdinas', nama: 'Surat Pelunasan / Keterangan Bebas Ikatan Dinas', label: 'Ikatan Dinas', tipe: 'PDF', ukuran: '187 KB', tanggal: '23 Mei 2024' },
                { id: 'cl-hukdis', nama: 'Surat Pernyataan Bebas Hukuman Disiplin', label: 'Bebas Hukdis', tipe: 'PDF', ukuran: '156 KB', tanggal: '23 Mei 2024' },
              ].map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-gray-800">{doc.nama}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 font-semibold shrink-0">
                        {doc.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{doc.tipe} · {doc.ukuran} · {doc.tanggal}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                      <CheckCircle2 size={12} /> Terupload
                    </span>
                    <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                      <Eye size={12} /> Lihat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Chain */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Rantai Persetujuan</p>
            <div className="space-y-2">
              {approvals.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.role} className={`flex items-start gap-3 p-3 rounded-xl border ${
                    a.status === 'approved' ? 'bg-green-50 border-green-200' :
                    a.status === 'rejected' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      a.status === 'approved' ? 'bg-green-500' :
                      a.status === 'rejected' ? 'bg-red-500' :
                      'bg-gray-300'
                    }`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-800">{a.label}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                          a.status === 'approved' ? 'bg-green-100 text-green-700' :
                          a.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {a.status === 'approved' ? 'Disetujui' : a.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                        </span>
                      </div>
                      {a.name !== '-' && <p className="text-[10px] text-gray-500 mt-0.5">{a.name} · {a.tanggal}</p>}
                      {a.catatan && <p className="text-[10px] text-gray-600 mt-0.5 italic">"{a.catatan}"</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Catatan Verifikasi</label>
            <textarea
              placeholder="Tambahkan catatan verifikasi..."
              rows={2}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => { setSelected(null); setShowPegawaiDetail(false); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={() => { setBiroSdmAction('tolak'); setBiroSdmAlasan(''); setBiroSdmStep('alasan'); setShowBiroSdmActionPage(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <X size={14} /> Tolak Permohonan
          </button>
          <button
            onClick={() => { setBiroSdmAction('penundaan'); setBiroSdmAlasan(''); setBiroSdmStep('alasan'); setShowBiroSdmActionPage(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
          >
            <AlertCircle size={14} /> Penundaan
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto transition-colors"
          >
            <Send size={14} />
            {activeNotaDinas.jenisPengunduranDiri === 'Tanpa Hak Pensiun'
              ? 'Lanjutkan ke Proses Penerbitan SK Pemberhentian'
              : 'Lanjutkan ke Proses Penetapan Pertek'}
          </button>
        </div>
      </div>
    );
  }

  // Biro SDM - Nota Dinas Detail Page (List Pegawai)
  if (role === 'biro-sdm' && activeNotaDinas && !showPegawaiDetail) {
    const pegawaiInND = DATA.filter(p => activeNotaDinas.pegawaiIds.includes(p.id));
    const ndCfg = ND_PGD_STATUS_CFG[activeNotaDinas.status];

    return (
      <div className="p-6 space-y-5">
        {/* Back button */}
        <button
          onClick={() => setActiveNotaDinas(null)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Nota Dinas
        </button>

        {/* ND Info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-start gap-4" style={{ background: '#4C1D95' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <FileText size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-white font-bold text-base">{activeNotaDinas.nomor}</p>
                  <p className="text-white/70 text-xs mt-0.5">{activeNotaDinas.perihal}</p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0"
                  style={{ background: ndCfg.bg, color: ndCfg.text, borderColor: ndCfg.border }}
                >
                  {activeNotaDinas.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 mt-3">
                {[
                  { label: 'Tanggal ND', value: activeNotaDinas.tanggal },
                  { label: 'Dari', value: activeNotaDinas.dari },
                  { label: 'Jenis', value: activeNotaDinas.jenisPengunduranDiri },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span className="text-white/50 text-[10px] uppercase tracking-wide">{label}</span>
                    <p className="text-white/90 text-xs font-medium leading-tight">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
            {[
              { label: 'Total Pegawai', value: pegawaiInND.length, icon: Users2 },
              { label: 'Jenis Pengunduran Diri', value: activeNotaDinas.jenisPengunduranDiri, icon: DoorOpen },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="px-4 py-3 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide flex items-center justify-center gap-1">
                  <Icon size={10} /> {label}
                </p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Employee table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Daftar Pegawai dalam Nota Dinas</h3>
            <p className="text-xs text-gray-500">{pegawaiInND.length} pegawai</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">NIP / Nama</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jabatan / Satker</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jenis</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pegawaiInND.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{item.nama}</p>
                      <p className="text-gray-400 mt-0.5">{item.nip}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{item.jabatan}</p>
                      <p className="text-gray-400 mt-0.5">{item.satker}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-purple-600">
                        {activeNotaDinas.jenisPengunduranDiri}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: getStatusColor(item.statusProses), color: '#fff' }}
                      >
                        {item.statusProses}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSelected(item); setShowPegawaiDetail(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 transition-colors"
                      >
                        Proses <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Atasan: Lembar Rekomendasi page
  if (selected && showReviewPage && role === 'atasan' && atasanView === 'rekomendasi') {
    const today = new Date();
    const tglSurat = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const nomorSurat = `S-${String(Math.floor(Math.random() * 9000) + 1000)}/AT/${today.getFullYear()}`;

    return (
      <div className="p-6 space-y-5">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex gap-3">
          <FileText size={18} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-800">Draft Lembar Rekomendasi Atasan Langsung</p>
            <p className="text-xs text-purple-600 mt-0.5">
              Periksa kembali isi rekomendasi sebelum dikirimkan ke Unit UPSDM Satker.
            </p>
          </div>
        </div>

        {/* Draft Document */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Document Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-5 text-center">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Kementerian Keuangan Republik Indonesia</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Direktorat Jenderal ...</p>
            <div className="my-3 border-t-2 border-b border-gray-400" />
            <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">Lembar Rekomendasi Atasan Langsung</p>
            <p className="text-xs text-gray-500 mt-0.5">Pengunduran Diri Pegawai Negeri Sipil</p>
          </div>

          <div className="px-8 py-6 space-y-5 text-xs text-gray-700">
            {/* Nomor & Tanggal */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex gap-2">
                <span className="text-gray-500 w-24 shrink-0">Nomor</span>
                <span className="font-semibold">: {nomorSurat}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24 shrink-0">Tanggal</span>
                <span className="font-semibold">: {tglSurat}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24 shrink-0">Hal</span>
                <span className="font-semibold">: Rekomendasi Pengunduran Diri PNS</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-24 shrink-0">Lampiran</span>
                <span className="font-semibold">: 1 (satu) berkas</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200" />

            {/* Yang bertanda tangan */}
            <div className="space-y-2">
              <p>Yang bertanda tangan di bawah ini:</p>
              <div className="ml-4 space-y-1">
                <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">Nama</span><span>: Dr. Surya Pratama, M.M.</span></div>
                <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">NIP</span><span>: 197205131998031003</span></div>
                <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">Jabatan</span><span>: Kepala Subbagian Kepegawaian dan Umum</span></div>
                <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">Unit Kerja</span><span>: {selected.satker}</span></div>
              </div>
            </div>

            <p>Selaku Atasan Langsung dari pegawai yang bersangkutan:</p>
            <div className="ml-4 space-y-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">Nama</span><span className="font-semibold">: {selected.nama}</span></div>
              <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">NIP</span><span>: {selected.nip}</span></div>
              <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">Jabatan</span><span>: {selected.jabatan}</span></div>
              <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">Unit Kerja</span><span>: {selected.satker}</span></div>
              <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">Alasan</span><span>: Alasan Keluarga</span></div>
              <div className="flex gap-2"><span className="w-28 shrink-0 text-gray-500">Tgl Efektif</span><span>: 31 Juli 2024</span></div>
            </div>

            {/* Isi Rekomendasi */}
            <div className="space-y-3 leading-relaxed">
              <p>Dengan ini menyatakan bahwa:</p>
              <ol className="list-decimal ml-5 space-y-2">
                <li>
                  Pegawai yang bersangkutan telah menyampaikan permohonan pengunduran diri secara tertulis dengan alasan yang dapat diterima dan dipertimbangkan.
                </li>
                <li>
                  Berdasarkan evaluasi kinerja dan rekam jejak pelaksanaan tugas, pegawai tersebut telah menjalankan tugasnya dengan baik dan tidak sedang menjalani hukuman disiplin.
                </li>
                <li>
                  Saya selaku Atasan Langsung <span className="font-semibold">MEREKOMENDASIKAN</span> permohonan pengunduran diri pegawai yang bersangkutan untuk dapat diproses lebih lanjut sesuai ketentuan peraturan perundang-undangan yang berlaku.
                </li>
              </ol>
              {atasanCatatan && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-2">
                  <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide mb-1">Catatan Tambahan</p>
                  <p className="text-xs text-blue-800 italic">"{atasanCatatan}"</p>
                </div>
              )}
            </div>

            {/* Tanda Tangan */}
            <div className="border-t border-dashed border-gray-200 pt-5">
              <div className="flex justify-end">
                <div className="text-center w-56">
                  <p>{selected.satker}, {tglSurat}</p>
                  <p className="mt-1">Atasan Langsung,</p>
                  <div className="h-16 flex items-center justify-center">
                    <p className="text-[10px] text-gray-400 italic">[Tanda tangan dan cap]</p>
                  </div>
                  <p className="font-semibold border-t border-gray-400 pt-1">Dr. Surya Pratama, M.M.</p>
                  <p className="text-gray-500">NIP. 197205131998031003</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document footer badge */}
          <div className="bg-green-50 border-t border-green-200 px-8 py-3 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-600" />
            <p className="text-xs text-green-700 font-semibold">Permohonan telah disetujui oleh Atasan Langsung pada {tglSurat}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAtasanView('review')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
          <button
            onClick={() => { setSelected(null); setShowReviewPage(false); setAtasanApprovalStatus('pending'); setAtasanCatatan(''); setAtasanView('review'); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={() => { setSelected(null); setShowReviewPage(false); setAtasanApprovalStatus('pending'); setAtasanCatatan(''); setAtasanView('review'); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto"
          >
            <Send size={14} /> Kirim ke Unit UPSDM Satker
          </button>
        </div>
      </div>
    );
  }

  // Atasan: Review page
  if (selected && showReviewPage && role === 'atasan') {
    const berkasWithUpdatedStatus = BERKAS_DENGAN_HAK.map(doc => ({
      ...doc,
      status: doc.source === 'satu-kemenkeu' ? 'verified' as BerkasStatus : 'uploaded' as BerkasStatus
    }));

    return (
      <div className="p-6 space-y-5">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex gap-3">
          <DoorOpen size={18} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-800">Review Permohonan Pengunduran Diri</p>
            <p className="text-xs text-purple-600 mt-0.5">
              Periksa kelengkapan dokumen dan berikan persetujuan atau penolakan terhadap permohonan.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Profile Section */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
              <UserCircle2 size={48} className="text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{selected.nama}</p>
              <p className="text-xs text-gray-500 mt-0.5">{selected.nip}</p>
              <p className="text-xs text-gray-500">{selected.jabatan} · {selected.satker}</p>
            </div>
          </div>

          {/* Workflow Stepper */}
          <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
            <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 4: Pengunduran Diri)</p>
            <WorkflowStepper steps={STEPS} currentStep={2} />
          </div>

          {/* Detail Pengajuan */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Detail Pengajuan</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Alasan', value: 'Alasan Keluarga' },
                { label: 'Tgl Efektif', value: '31 Juli 2024' },
                { label: 'Tgl Pengajuan', value: selected.tanggalKasus },
                { label: 'Status', value: selected.statusProses },
                { label: 'Jenis Pengunduran Diri', value: selected.jenisPengunduranDiri ?? '-' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Uraian Alasan</p>
              <p className="text-xs text-gray-700">Pegawai menyatakan ingin mengundurkan diri untuk merawat anggota keluarga yang sakit. Telah dipertimbangkan dengan matang.</p>
            </div>
            {/* File pendukung pegawai */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">File Pendukung (dilampirkan Pegawai)</p>
              {[
                { nama: 'Surat Keterangan Dokter', tipe: 'PDF', ukuran: '312 KB' },
                { nama: 'Surat Pernyataan Pengunduran Diri', tipe: 'PDF', ukuran: '185 KB' },
              ].map(f => (
                <div key={f.nama} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{f.nama}</p>
                    <p className="text-[10px] text-gray-400">{f.tipe} · {f.ukuran}</p>
                  </div>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                    <Eye size={11} /> Lihat
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Berkas Terlampir */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Berkas Terlampir</p>
            <div className="space-y-2">
              {berkasWithUpdatedStatus.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-800">{doc.nama}</p>
                      {doc.source === 'satu-kemenkeu' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">Satu Kemenkeu</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.source === 'satu-kemenkeu' ? (
                      doc.status === 'verified' ? (
                        <>
                          <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            <CheckCircle2 size={12} /> Terverifikasi
                          </span>
                          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                            <Eye size={12} /> Lihat
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                          <XCircle size={12} /> Tidak Terverifikasi
                        </span>
                      )
                    ) : (
                      doc.status === 'uploaded' ? (
                        <>
                          <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            <CheckCircle2 size={12} /> Terupload
                          </span>
                          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                            <Eye size={12} /> Lihat
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold">
                          <XCircle size={12} /> Belum Terupload
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Chain */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Rantai Persetujuan</p>
            <div className="space-y-2">
              {ATASAN_APPROVALS.map((a) => {
                const Icon = a.icon;
                const isCurrentAtasan = a.role === 'atasan';
                const displayStatus = isCurrentAtasan ? atasanApprovalStatus : a.status;
                return (
                  <div key={a.role} className={`flex items-start gap-3 p-3 rounded-xl border ${
                    displayStatus === 'approved' ? 'bg-green-50 border-green-200' :
                    displayStatus === 'rejected' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      displayStatus === 'approved' ? 'bg-green-500' :
                      displayStatus === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                    }`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-800">{a.label}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                          displayStatus === 'approved' ? 'bg-green-100 text-green-700' :
                          displayStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {displayStatus === 'approved' ? 'Disetujui' : displayStatus === 'rejected' ? 'Ditolak' : 'Menunggu'}
                        </span>
                      </div>
                      {isCurrentAtasan && displayStatus !== 'pending' && (
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          Dr. Surya Pratama · {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      )}
                      {!isCurrentAtasan && a.name !== '-' && <p className="text-[10px] text-gray-500 mt-0.5">{a.name} · {a.tanggal}</p>}
                      {!isCurrentAtasan && a.catatan && <p className="text-[10px] text-gray-600 mt-0.5 italic">"{a.catatan}"</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Catatan Persetujuan</label>
            <textarea
              value={atasanCatatan}
              onChange={e => setAtasanCatatan(e.target.value)}
              placeholder="Tambahkan catatan persetujuan/penolakan..."
              rows={2}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Action Buttons: Setujui / Tolak */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelected(null); setShowReviewPage(false); setAtasanApprovalStatus('pending'); setAtasanCatatan(''); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Kembali
          </button>
          <button
            onClick={() => setAtasanApprovalStatus('rejected')}
            disabled={atasanApprovalStatus === 'approved'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${
              atasanApprovalStatus === 'approved'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <X size={14} /> Tolak
          </button>
          <button
            onClick={() => setAtasanApprovalStatus('approved')}
            disabled={atasanApprovalStatus === 'rejected'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${
              atasanApprovalStatus === 'rejected'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <Check size={14} /> Setujui
          </button>
        </div>

        {/* Generate Rekomendasi Button */}
        <div className={`rounded-2xl border-2 p-4 flex items-center justify-between gap-4 transition-colors ${
          atasanApprovalStatus === 'approved'
            ? 'bg-purple-50 border-purple-300'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              atasanApprovalStatus === 'approved' ? 'bg-purple-900' : 'bg-gray-300'
            }`}>
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <p className={`text-sm font-semibold ${atasanApprovalStatus === 'approved' ? 'text-purple-900' : 'text-gray-400'}`}>
                Generate Lembar Rekomendasi Atasan
              </p>
              <p className={`text-xs mt-0.5 ${atasanApprovalStatus === 'approved' ? 'text-purple-600' : 'text-gray-400'}`}>
                {atasanApprovalStatus === 'approved'
                  ? 'Persetujuan telah diberikan. Buat lembar rekomendasi untuk dikirim ke UPSDM Satker.'
                  : 'Berikan persetujuan terlebih dahulu sebelum membuat lembar rekomendasi.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAtasanView('rekomendasi')}
            disabled={atasanApprovalStatus !== 'approved'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              atasanApprovalStatus === 'approved'
                ? 'bg-purple-900 text-white hover:bg-purple-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FileText size={14} />
            {atasanApprovalStatus === 'approved' ? 'Generate Rekomendasi' : 'Belum Dapat Diakses'}
          </button>
        </div>
      </div>
    );
  }

  // Biro SDM - Nota Dinas List View
  if (role === 'biro-sdm' && !activeNotaDinas) {
    const ndAktif = NOTA_DINAS_PGD_LIST.filter(nd => nd.status !== 'Selesai');
    const ndArsip = NOTA_DINAS_PGD_LIST.filter(nd => nd.status === 'Selesai');
    const filteredND = mainTab === 'aktif' ? ndAktif : ndArsip;

    return (
      <div className="p-6 space-y-5">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex gap-3">
          <DoorOpen size={18} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-800">Verifikasi Nota Dinas Pengunduran Diri</p>
            <p className="text-xs text-purple-600 mt-0.5">
              Verifikasi dan proses nota dinas rekomendasi pemberhentian PNS yang dikirim oleh SDM UE1 sebelum dilanjutkan ke proses penetapan Pertek.
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
              {tab === 'aktif' ? 'Nota Dinas Aktif' : 'Arsip'}
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === 'aktif' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                {tab === 'aktif' ? ndAktif.length : ndArsip.length}
              </span>
            </button>
          ))}
        </div>

        {/* ND List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">
              {mainTab === 'aktif' ? 'Nota Dinas Rekomendasi Pengunduran Diri Aktif' : 'Arsip Nota Dinas Selesai'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredND.length} nota dinas
            </p>
          </div>

          {filteredND.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tidak ada nota dinas</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Nomor ND</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Perihal</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl ND</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jenis</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jumlah Pegawai</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredND.map((nd, idx) => {
                      const cfg = ND_PGD_STATUS_CFG[nd.status];
                      const pegawaiList = DATA.filter(p => nd.pegawaiIds.includes(p.id));
                      return (
                        <tr
                          key={nd.id}
                          className="hover:bg-purple-50/30 transition-colors cursor-pointer"
                          onClick={() => setActiveNotaDinas(nd)}
                        >
                          <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800 whitespace-nowrap">{nd.nomor}</p>
                            <p className="text-gray-400 mt-0.5">{nd.dari}</p>
                          </td>
                          <td className="px-4 py-3 max-w-[220px]">
                            <p className="text-gray-700 leading-snug line-clamp-2">{nd.perihal}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{nd.tanggal}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-purple-600">
                              {nd.jenisPengunduranDiri}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Users2 size={12} className="text-gray-400" />
                              <span className="font-semibold text-gray-800">{pegawaiList.length}</span>
                              <span className="text-gray-400">pegawai</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                              style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                            >
                              {nd.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={e => { e.stopPropagation(); setActiveNotaDinas(nd); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 transition-colors"
                            >
                              {mainTab === 'arsip' ? 'Buka' : 'Proses'} {mainTab !== 'arsip' && <ChevronRight size={12} />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Menampilkan {filteredND.length} nota dinas</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Tampilan untuk role lainnya (atasan, sdm-satker list, dll)
  return (
    <div className="p-6 space-y-5">
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex gap-3">
        <DoorOpen size={18} className="text-purple-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-800">Alur Usulan Pengunduran Diri</p>
          <p className="text-xs text-purple-600 mt-0.5">
            Pengajuan pengunduran diri pegawai melalui sistem, mulai dari pengisian formulir oleh pegawai,
            review berjenjang, hingga penetapan SK Pemberhentian Atas Permintaan Sendiri.
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
            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === 'aktif' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
              {tab === 'aktif' ? dataAktif.length : dataArsip.length}
            </span>
          </button>
        ))}
      </div>

      {/* Mini Dashboard Status - only for active */}
      {mainTab === 'aktif' && <MiniDashboard data={dataAktif} onFilterClick={setStatusFilter} currentFilter={statusFilter as any} />}

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
            {mainTab === 'aktif' ? 'Daftar Kasus Pengunduran Diri Aktif' : 'Arsip Kasus Selesai'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} dari {mainTab === 'aktif' ? dataAktif.length : dataArsip.length} kasus
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
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl Diajukan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tahapan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p, idx) => {
                    const isUe1Rejected = role === 'sdm-ue1' && !!ue1RejectedItems[p.id];
                    const isUe1Postponed = role === 'sdm-ue1' && !!ue1PostponedItems[p.id];
                    const displayStatus = isUe1Rejected ? 'Ditolak' : isUe1Postponed ? 'Ditunda' : p.statusProses;
                    const statusColor = isUe1Rejected ? '#EF4444' : isUe1Postponed ? '#F59E0B' : getStatusColor(p.statusProses);
                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-purple-50/30 transition-colors ${role !== 'sdm-satker' || mainTab === 'arsip' ? 'cursor-pointer' : ''}`}
                        onClick={() => {
                          if (role !== 'sdm-satker' || mainTab === 'arsip') {
                            setSelected(p);
                            if (role !== 'sdm-satker' && mainTab === 'aktif') setShowReviewPage(true);
                          }
                        }}
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
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.tanggalKasus}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                            style={{ background: statusColor }}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(p.tahapanSaat / STEPS.length) * 100}%`,
                                  background: statusColor
                                }}
                              />
                            </div>
                            <span className="text-gray-500 text-[10px]">{p.tahapanSaat}/{STEPS.length}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {role === 'sdm-satker' && mainTab === 'aktif' ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={e => { e.stopPropagation(); setSelected(p); setSdmSatkerView('review'); }}
                                className="px-2 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800"
                              >
                                Review
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); setSelected(p); setSdmSatkerView('schedule-exit'); }}
                                className="px-2 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                              >
                                Jadwalkan
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); setSelected(p); setSdmSatkerView('input-exit'); }}
                                className="px-2 py-1.5 rounded-xl text-xs font-semibold text-white bg-green-600 hover:bg-green-700"
                              >
                                Input
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelected(p);
                                if (mainTab === 'aktif') setShowReviewPage(true);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white ${
                                isUe1Rejected ? 'bg-red-600 hover:bg-red-700' :
                                isUe1Postponed ? 'bg-amber-500 hover:bg-amber-600' :
                                'bg-purple-700 hover:bg-purple-800'
                              }`}
                            >
                              {mainTab === 'arsip' ? 'Buka' : (isUe1Rejected || isUe1Postponed) ? 'Lihat Surat' : 'Review'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">Menampilkan {filtered.length} dari {myData.length} kasus</p>
            </div>
          </>
        )}
      </div>

      {selected && role !== 'sdm-satker' && mainTab === 'arsip' && <PGDForm pegawai={selected} role={role} onClose={() => setSelected(null)} isArchived={true} />}
    </div>
  );
}
