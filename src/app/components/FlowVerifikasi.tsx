import { useState } from 'react';
import {
  FileCheck2, X, Check, Send, Download, Eye, AlertCircle, ExternalLink,
  Stamp, Search, ChevronRight, ArrowLeft, Users, Calendar,
  ClipboardList, FileText, CheckCircle2,
} from 'lucide-react';
import type { Role } from '../routes/routeConfig';
// import { getKasusColor } from '../data/mockData';

import { getStatusColor, getKasusColor, getKasusLabel, getSisaBulanColor, getSisaBulanLabel  } from '../utils/case.util';
import { type Pegawai, StatusProses } from '../types/employee.types';
import { MOCK_PEGAWAI } from '../data/mockData';


import { WorkflowStepper, type Step } from './WorkflowStepper';
import { BerkasSection, type BerkasFile } from './BerkasSection';
import { MiniDashboardND } from './MiniDashboardND';

/* ── Data Structures ─────────────────────────────────────── */

const STEPS: Step[] = [
  { id: 1, label: 'Lanjutan Flow 2/3/4', actor: 'Biro SDM' },
  { id: 2, label: 'Kompilasi Pertek', actor: 'Biro SDM' },
  { id: 3, label: 'Kirim Dokumen ke SIASN', actor: 'Biro SDM' },
  { id: 4, label: 'Proses Pertek SIASN', actor: 'BKN/SIASN' },
  { id: 5, label: 'Generate Draft SK', actor: 'Sistem / Biro SDM' },
  { id: 6, label: 'TTE & Terbit SK', actor: 'Nadine (e-Sign)' },
];

type PertekItem = {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  satker: string;
  jenis: string;
  nomorPertek: string;
  tglPertek: string;
  status: string;
  skStatus: string;
};

const PERTEK_DATA: PertekItem[] = [
  { id: 'p1', nama: 'Ahmad Subarjo', nip: '196501151990031002', jabatan: 'Kasubbag TU', satker: 'KPPN Jakarta I', jenis: 'BUP', nomorPertek: 'PERTEK/BKN/2024/0523', tglPertek: '10-05-2024', status: 'Data Pertek Ada', skStatus: 'Draft' },
  { id: 'p2', nama: 'Budi Santoso', nip: '196602201991031005', jabatan: 'Analis Keuangan', satker: 'KPPN Jakarta I', jenis: 'BUP', nomorPertek: 'PERTEK/BKN/2024/0524', tglPertek: '10-05-2024', status: 'Data Pertek Ada', skStatus: 'Draft' },
  { id: 'p4', nama: 'Lukman Hakim', nip: '196712181992031009', jabatan: 'Kepala Seksi', satker: 'KPPN Jakarta II', jenis: 'BUP', nomorPertek: 'PERTEK/BKN/2024/0525', tglPertek: '12-05-2024', status: 'Data Pertek Ada', skStatus: 'Siap TTE' },
  { id: 'p6', nama: 'Siti Rohmah', nip: '196803141993032003', jabatan: 'Pelaksana', satker: 'KPPN Bogor', jenis: 'BUP', nomorPertek: 'PERTEK/BKN/2024/0530', tglPertek: '12-05-2024', status: 'Data Pertek Ada', skStatus: 'Draft' },
  { id: 'p3', nama: 'Hartono Susilo', nip: '196910221994031007', jabatan: 'Fungsional Auditor', satker: 'Kanwil DJPb Jabar', jenis: 'Uzur', nomorPertek: '-', tglPertek: '-', status: 'Menunggu Pertek', skStatus: '-' },
  { id: 'p7', nama: 'Retno Wulandari', nip: '197005161995032004', jabatan: 'Analis Anggaran', satker: 'Kanwil DJPb Jabar', jenis: 'Uzur', nomorPertek: '-', tglPertek: '-', status: 'Menunggu Pertek', skStatus: '-' },
  { id: 'p5', nama: 'Dewi Rahayu', nip: '198204271998032001', jabatan: 'Pelaksana', satker: 'DJBC Jakarta', jenis: 'Meninggal', nomorPertek: 'PERTEK/BKN/2024/0501', tglPertek: '01-04-2024', status: 'SK Terbit', skStatus: 'Selesai' },
  { id: 'p8', nama: 'Prayitno Utomo', nip: '198107081998031003', jabatan: 'Pengawas', satker: 'DJBC Jakarta', jenis: 'Tewas', nomorPertek: 'PERTEK/BKN/2024/0502', tglPertek: '01-04-2024', status: 'SK Terbit', skStatus: 'Selesai' },
  { id: 'p9', nama: 'Wahyu Setiawan', nip: '196904231994031006', jabatan: 'Kepala Seksi', satker: 'KPP Pratama Depok', jenis: 'Pengunduran Diri dengan Hak Pensiun', nomorPertek: '-', tglPertek: '-', status: 'Menunggu Pertek', skStatus: '-' },
  { id: 'p10', nama: 'Nining Sulistyowati', nip: '198503172007032001', jabatan: 'Analis Kepegawaian', satker: 'Biro SDM Kemenkeu', jenis: 'Pengunduran Diri Tanpa Hak Pensiun', nomorPertek: '-', tglPertek: '-', status: 'Menunggu Pertek', skStatus: '-' },
  { id: 'p11', nama: 'Eko Budiyanto', nip: '197611082001031003', jabatan: 'Fungsional Pemeriksa', satker: 'BPKP Perwakilan Jatim', jenis: 'Tewas', nomorPertek: '-', tglPertek: '-', status: 'Menunggu Pertek', skStatus: '-' },
];

// Pegawai yang SK-nya siap untuk dikirim ke Menteri
const PEGAWAI_SIAP_KIRIM: PertekItem[] = [
  { id: 'pk1', nama: 'Bambang Wijaya', nip: '196505121991031001', jabatan: 'Kepala Seksi Anggaran', satker: 'KPPN Bandung', jenis: 'BUP', nomorPertek: 'PERTEK/BKN/2024/0520', tglPertek: '08-05-2024', status: 'SK Draft Selesai', skStatus: 'Siap Kirim' },
  { id: 'pk2', nama: 'Suryati Indah', nip: '196606152992032002', jabatan: 'Analis Keuangan', satker: 'KPPN Bandung', jenis: 'BUP', nomorPertek: 'PERTEK/BKN/2024/0521', tglPertek: '08-05-2024', status: 'SK Draft Selesai', skStatus: 'Siap Kirim' },
  { id: 'pk3', nama: 'Agus Prasetyo', nip: '196708201993031003', jabatan: 'Kepala Subbag', satker: 'KPPN Semarang', jenis: 'BUP', nomorPertek: 'PERTEK/BKN/2024/0522', tglPertek: '09-05-2024', status: 'SK Draft Selesai', skStatus: 'Siap Kirim' },
];

type NDStatus = 'Menunggu Verifikasi' | 'Dalam Proses' | 'Menunggu Pertek' | 'Menunggu Verifikasi Pertek' | 'Verifikasi Ditolak' | 'Siap TTE' | 'Selesai';

type NotaDinas = {
  id: string;
  nomor: string;
  tanggal: string;
  perihal: string;
  dari: string;
  kepada: string;
  jenisPemberhentian: string;
  status: NDStatus;
  pegawaiIds: string[];
  alasanPenolakan?: string;
};

const NOTA_DINAS_LIST: NotaDinas[] = [
  {
    id: 'nd1',
    nomor: 'ND-SDM.1/2024/0523',
    tanggal: '10 Mei 2024',
    perihal: 'Usul Pemberhentian dengan Hormat karena BUP Periode Mei–Juni 2024',
    dari: 'Kepala Biro Sumber Daya Manusia',
    kepada: 'Kepala BKN / SIASN',
    jenisPemberhentian: 'BUP',
    status: 'Menunggu Pertek',
    pegawaiIds: ['p1', 'p2', 'p4', 'p6'],
  },
  {
    id: 'nd2',
    nomor: 'ND-SDM.1/2024/0541',
    tanggal: '15 Mei 2024',
    perihal: 'Usul Pemberhentian dengan Hormat karena Uzur / Sakit Berkepanjangan',
    dari: 'Kepala Biro Sumber Daya Manusia',
    kepada: 'Kepala BKN / SIASN',
    jenisPemberhentian: 'Uzur',
    status: 'Menunggu Verifikasi Pertek',
    pegawaiIds: ['p3', 'p7'],
  },
  {
    id: 'nd3',
    nomor: 'ND-SDM.1/2024/0498',
    tanggal: '02 April 2024',
    perihal: 'Usul Penetapan Pemberhentian karena Meninggal / Tewas Dalam Dinas',
    dari: 'Kepala Biro Sumber Daya Manusia',
    kepada: 'Kepala BKN / SIASN',
    jenisPemberhentian: 'Meninggal/Tewas',
    status: 'Selesai',
    pegawaiIds: ['p5', 'p8'],
  },
  {
    id: 'nd4',
    nomor: 'ND-SDM.1/2024/0558',
    tanggal: '20 Mei 2024',
    perihal: 'Usul Pemberhentian dengan Hormat atas Permintaan Sendiri dengan Hak Pensiun',
    dari: 'Kepala Biro Sumber Daya Manusia',
    kepada: 'Kepala BKN / SIASN',
    jenisPemberhentian: 'Pengunduran Diri dengan Hak Pensiun',
    status: 'Menunggu Verifikasi',
    pegawaiIds: ['p9'],
  },
  {
    id: 'nd5',
    nomor: 'ND-SDM.1/2024/0561',
    tanggal: '21 Mei 2024',
    perihal: 'Usul Pemberhentian dengan Hormat atas Permintaan Sendiri Tanpa Hak Pensiun',
    dari: 'Kepala Biro Sumber Daya Manusia',
    kepada: 'Kepala BKN / SIASN',
    jenisPemberhentian: 'Pengunduran Diri Tanpa Hak Pensiun',
    status: 'Menunggu Verifikasi',
    pegawaiIds: ['p10'],
  },
  {
    id: 'nd6',
    nomor: 'ND-SDM.1/2024/0567',
    tanggal: '22 Mei 2024',
    perihal: 'Usul Penetapan Pemberhentian karena Tewas Dalam Menjalankan Tugas',
    dari: 'Kepala Biro Sumber Daya Manusia',
    kepada: 'Kepala BKN / SIASN',
    jenisPemberhentian: 'Tewas',
    status: 'Menunggu Pertek',
    pegawaiIds: ['p11'],
  },
  {
    id: 'nd7',
    nomor: 'ND-SDM.1/2024/0488',
    tanggal: '28 Maret 2024',
    perihal: 'Usul Pemberhentian dengan Hormat karena BUP Periode Maret–April 2024',
    dari: 'Kepala Biro Sumber Daya Manusia',
    kepada: 'Kepala BKN / SIASN',
    jenisPemberhentian: 'BUP',
    status: 'Verifikasi Ditolak',
    pegawaiIds: ['p1', 'p6'],
    alasanPenolakan: 'Data kepegawaian pada SIASN tidak sesuai dengan data lokal. NIP pegawai Ahmad Subarjo tercatat dengan pangkat IV-b pada sistem lokal namun pangkat IV-a pada data BKN. Perlu konfirmasi dan koreksi data pangkat/golongan sebelum dapat diproses kembali.',
  },
];

const BERKAS_VERIFIKASI: BerkasFile[] = [
  { id: 'v1', nama: 'Kelengkapan Berkas Usulan dari SDM Satker', tipe: 'PDF', tanggal: '12 Mei 2024', ukuran: '1.2 MB', status: 'verified' },
  { id: 'v2', nama: 'Validasi Data HRIS Pegawai', tipe: 'PDF', tanggal: '12 Mei 2024', ukuran: '415 KB', status: 'verified' },
  { id: 'v3', nama: 'Surat Keterangan Clearance BMN', tipe: 'PDF', tanggal: '11 Mei 2024', ukuran: '234 KB', status: 'uploaded' },
  { id: 'v4', nama: 'Data Tapem (TASPEN)', tipe: 'PDF', tanggal: '11 Mei 2024', ukuran: '512 KB', status: 'uploaded' },
  { id: 'v5', nama: 'Pertimbangan Teknis (Pertek) BKN', tipe: 'PDF', tanggal: '13 Mei 2024', ukuran: '688 KB', status: 'uploaded' },
  { id: 'v6', nama: 'Draft SK Pemberhentian', tipe: 'DOCX', tanggal: '14 Mei 2024', ukuran: '344 KB', status: 'uploaded' },
];

/* ── Status helpers ──────────────────────────────────────── */

const ND_STATUS_CFG: Record<NDStatus, { bg: string; text: string; border: string }> = {
  'Menunggu Verifikasi':        { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  'Dalam Proses':               { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Menunggu Pertek':            { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
  'Menunggu Verifikasi Pertek': { bg: '#FFFBEB', text: '#CA8A04', border: '#FDE68A' },
  'Verifikasi Ditolak':   { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  'Siap TTE':                   { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  'Selesai':                    { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
};

const PERTEK_STATUS_COLOR: Record<string, string> = {
  'SK Terbit': '#10B981',
  'Data Pertek Ada': '#3B82F6',
  'Menunggu Pertek': '#F59E0B',
};

const SK_STATUS_COLOR: Record<string, string> = {
  'Selesai': '#10B981',
  'Siap TTE': '#8B5CF6',
  'Draft': '#3B82F6',
  '-': '#6B7280',
};

/* ── VerifikasiDetail page (full-page view) ─────────────── */

interface VerifikasiDetailProps {
  item: PertekItem;
  onBack: () => void;
  isArchived?: boolean;
}

function VerifikasiDetail({ item, onBack, isArchived = false }: VerifikasiDetailProps) {
  const [step, setStep] = useState<'verifikasi-pertek' | 'draft-sk'>('verifikasi-pertek');
  const [catatan, setCatatan] = useState('');
  const [skNomor] = useState(() => String(Math.floor(Math.random() * 9000) + 1000));
  const [showTolakPage, setShowTolakPage] = useState(false);
  const [tolakAlasan, setTolakAlasan] = useState('');

  const skContent = `KEPUTUSAN MENTERI KEUANGAN REPUBLIK INDONESIA
NOMOR: SK-${skNomor}/KM.1/2024

TENTANG PEMBERHENTIAN DENGAN HORMAT KARENA MENCAPAI BATAS USIA PENSIUN

DENGAN RAHMAT TUHAN YANG MAHA ESA
MENTERI KEUANGAN REPUBLIK INDONESIA,

Menimbang: bahwa dalam rangka tertib administrasi kepegawaian dan melaksanakan
ketentuan Peraturan Pemerintah tentang manajemen Pegawai Negeri Sipil,
perlu menetapkan Keputusan Menteri tentang Pemberhentian dengan Hormat...

Nama         : ${item.nama}
NIP          : ${item.nip}
Pangkat/Gol  : Pembina Tk.I / IV-b
Jabatan      : ${item.jabatan}
Unit Kerja   : ${item.satker}
Berlaku      : 1 Februari 2026

Ditetapkan di Jakarta
Pada tanggal _______________
MENTERI KEUANGAN REPUBLIK INDONESIA,

[TTD ELEKTRONIK - NADINE]`;

  // ── Rejection page ─────────────────────────────────────────
  if (showTolakPage) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setShowTolakPage(false)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Verifikasi Pertek
        </button>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Penolakan Verifikasi Pertek</p>
            <p className="text-xs text-red-600 mt-0.5">
              {item.nama} · {item.nip} · {item.jenis}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#4C1D95' }}>
              <FileText size={22} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{item.nama}</p>
              <p className="text-xs text-gray-500">{item.nip} · {item.jabatan} · {item.satker}</p>
              <span className="text-[9px] px-2 py-0.5 rounded-full text-white font-semibold mt-1 inline-block" style={{ background: '#4C1D95' }}>{item.jenis}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Alasan Penolakan Verifikasi Pertek <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-gray-500">
              Jelaskan secara rinci alasan penolakan beserta poin-poin data atau dokumen yang perlu diperbaiki oleh BKN/SIASN.
            </p>
            <textarea
              value={tolakAlasan}
              onChange={e => setTolakAlasan(e.target.value)}
              placeholder="Contoh: Data NIP pegawai tidak sesuai dengan data di SIASN. Pangkat/golongan tercatat berbeda antara data lokal dan data BKN. Perlu konfirmasi dan perbaikan data..."
              rows={6}
              className="w-full text-xs border border-red-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300 bg-red-50/30 resize-none placeholder-gray-400"
            />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
            <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">
              File ini akan dipindahkan ke sub menu <span className="font-semibold">Verifikasi Ditolak</span> beserta alasan penolakan,
              untuk kemudian dikirim ulang ke SIASN setelah data dikoreksi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTolakPage(false)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => { onBack(); }}
            disabled={!tolakAlasan.trim()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white ml-auto transition-colors ${
              tolakAlasan.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <X size={14} /> Pindah ke Verifikasi Ditolak
          </button>
        </div>
      </div>
    );
  }

  // ── Main detail page ────────────────────────────────────────
  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Pegawai
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4" style={{ background: '#4C1D95' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-white font-bold text-base">{item.nama}</p>
              <p className="text-white/70 text-xs mt-0.5">{item.nip} · {item.jabatan} · {item.satker}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-white bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  {item.jenis}
                </span>
                {item.nomorPertek !== '-' && (
                  <span className="text-[10px] text-white/70">{item.nomorPertek}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
          <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 6: Verifikasi & SK)</p>
          <WorkflowStepper
            steps={STEPS}
            currentStep={
              item.skStatus === 'Selesai' ? 6 :
              item.skStatus === 'Siap TTE' ? 5 :
              item.nomorPertek !== '-' ? 4 : 2
            }
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 m-5 mb-0">
            {[
              { id: 'verifikasi-pertek', label: '1. Verifikasi Pertek' },
              { id: 'draft-sk', label: '2. Generate Draft SK' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStep(tab.id as any)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${step === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {step === 'verifikasi-pertek' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Verifikasi Pertimbangan Teknis (Pertek) BKN</p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-700">
                    Verifikasi bahwa data Pertek dari SIASN/BKN telah lengkap dan sesuai untuk proses penerbitan SK.
                  </p>
                </div>

                <BerkasSection berkas={BERKAS_VERIFIKASI} title="Berkas Dokumen untuk Diverifikasi" />

                {[
                  { label: 'Kelengkapan Berkas dari SDM Satker', status: true },
                  { label: 'Validasi Data Pegawai di HRIS', status: true },
                  { label: 'Cek Status Clearance BMN', status: true },
                  { label: 'Verifikasi Data Pertek dari BKN', status: item.nomorPertek !== '-' },
                  { label: 'Verifikasi Clearance Ikatan Dinas', status: item.jenis !== 'Uzur' },
                ].map((check, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border ${check.status ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                    {check.status
                      ? <Check size={14} className="text-green-600 shrink-0" />
                      : <AlertCircle size={14} className="text-amber-500 shrink-0" />}
                    <p className="text-xs text-gray-700 flex-1">{check.label}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${check.status ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {check.status ? 'OK' : 'Perlu Cek'}
                    </span>
                  </div>
                ))}

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Catatan Verifikasi Pertek</label>
                  <textarea
                    value={catatan}
                    onChange={e => setCatatan(e.target.value)}
                    placeholder="Catatan hasil verifikasi pertek..."
                    rows={3}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none resize-none placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {step === 'draft-sk' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Generate Draft SK Pemberhentian</p>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3">
                  <p className="text-xs text-purple-700">
                    Draft SK yang telah digenerate akan dipindahkan ke menu "Siap Kirim" untuk proses TTE oleh Menteri Keuangan.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{skContent}</pre>
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
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
            {!isArchived && (
              <>
                {step === 'verifikasi-pertek' && (
                  <>
                    <button
                      onClick={() => setShowTolakPage(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      <X size={13} /> Tolak
                    </button>
                    <button
                      onClick={() => setStep('draft-sk')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-green-600 hover:bg-green-700 ml-auto transition-colors"
                    >
                      <Check size={13} /> Setuju
                    </button>
                  </>
                )}
                {step === 'draft-sk' && (
                  <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-green-600 hover:bg-green-700 ml-auto transition-colors"
                  >
                    <Check size={13} /> Pindahkan ke Siap Kirim
                  </button>
                )}
              </>
            )}
            <button
              onClick={onBack}
              className={`px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors ${isArchived || step === 'draft-sk' ? '' : 'ml-auto'}`}
            >
              {isArchived ? 'Tutup' : 'Kembali'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Employee sub-page (inside a Nota Dinas) ──────────────── */

interface NDDetailPageProps {
  nd: NotaDinas;
  onBack: () => void;
  isArchived?: boolean;
}

function NDDetailPage({ nd, onBack, isArchived = false }: NDDetailPageProps) {
  const [selected, setSelected] = useState<PertekItem | null>(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [search, setSearch] = useState('');

  const pegawai = PERTEK_DATA.filter(p => nd.pegawaiIds.includes(p.id));
  const filtered = pegawai.filter(p =>
    !search ||
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.nip.includes(search) ||
    p.satker.toLowerCase().includes(search.toLowerCase())
  );

  const ndCfg = ND_STATUS_CFG[nd.status];

  // Show detail page when employee is selected
  if (selected && showDetailPage) {
    return <VerifikasiDetail item={selected} onBack={() => { setSelected(null); setShowDetailPage(false); }} isArchived={isArchived} />;
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb / back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Nota Dinas
      </button>

      {/* ND Info card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-start gap-4" style={{ background: '#1E3A5F' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <ClipboardList size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-white font-bold text-base">{nd.nomor}</p>
                <p className="text-white/70 text-xs mt-0.5">{nd.perihal}</p>
              </div>
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0"
                style={{ background: ndCfg.bg, color: ndCfg.text, borderColor: ndCfg.border }}
              >
                {nd.status}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 mt-3">
              {[
                { label: 'Tanggal ND', value: nd.tanggal },
                { label: 'Dari', value: nd.dari },
                { label: 'Kepada', value: nd.kepada },
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
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
          {[
            { label: 'Total Pegawai', value: pegawai.length, icon: Users },
            { label: 'Jenis Pemberhentian', value: nd.jenisPemberhentian, icon: FileCheck2 },
            { label: 'Status ND', value: nd.status, icon: Calendar },
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
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold text-gray-800">Daftar Pegawai dalam Nota Dinas</h3>
            <p className="text-xs text-gray-500">{filtered.length} dari {pegawai.length} pegawai</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari NIP / Nama / Satker..."
              className="bg-transparent text-xs focus:outline-none w-40 text-gray-700 placeholder-gray-400"
            />
          </div>
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
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jenis</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Nomor Pertek</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status Pertek</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status SK</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors"
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
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                          style={{ background: getKasusColor(item.jenis as any) }}
                        >
                          {item.jenis}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.nomorPertek}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                          style={{ background: PERTEK_STATUS_COLOR[item.status] ?? '#6B7280' }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                          style={{ background: SK_STATUS_COLOR[item.skStatus] ?? '#6B7280' }}
                        >
                          {item.skStatus !== '-' ? item.skStatus : 'Belum Ada SK'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setSelected(item); setShowDetailPage(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 transition-colors"
                        >
                          {isArchived ? 'Buka' : 'Proses'} {!isArchived && <ChevronRight size={12} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Menampilkan {filtered.length} dari {pegawai.length} pegawai dalam {nd.nomor}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main FlowVerifikasi ─────────────────────────────────── */

interface FlowVerifikasiProps { role: Role; }

export function FlowVerifikasi({ role }: FlowVerifikasiProps) {
  const [mainTab, setMainTab] = useState<'aktif' | 'siap-kirim' | 'verifikasi-ditolak' | 'arsip'>('aktif');
  const [activeND, setActiveND] = useState<NotaDinas | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<NDStatus | ''>('');
  const [jenisFilter, setJenisFilter] = useState('');

  // Siap Kirim state
  const [selectedPegawai, setSelectedPegawai] = useState<string[]>([]);
  const [showNotaDinasForm, setShowNotaDinasForm] = useState(false);

  // Batch kirim SIASN state (Nota Dinas Aktif)
  const [selectedBatchND, setSelectedBatchND] = useState<string[]>([]);
  const [showBatchKirimSiasn, setShowBatchKirimSiasn] = useState(false);
  const [notaDinasToMenteri, setNotaDinasToMenteri] = useState({
    nomor: `ND-BSDM/${Math.floor(Math.random() * 9000) + 1000}/2024`,
    perihal: 'Penyampaian SK Pemberhentian PNS untuk TTE',
  });

  // Verifikasi Ditolak state
  const [selectedVerdiND, setSelectedVerdiND] = useState<string[]>([]);
  const [showBatchKirimUlang, setShowBatchKirimUlang] = useState(false);
  const [activeVerdiItem, setActiveVerdiItem] = useState<{ nd: NotaDinas; employee: PertekItem } | null>(null);

  const canAccess = role === 'sdm-satker-1' || role === 'sdm-ue1' || role === 'biro-sdm';

  const ndAktif = NOTA_DINAS_LIST.filter(nd => nd.status !== 'Selesai' && nd.status !== 'Verifikasi Ditolak');
  const ndVerdiDitolak = NOTA_DINAS_LIST.filter(nd => nd.status === 'Verifikasi Ditolak');
  const ndArsip = NOTA_DINAS_LIST.filter(nd => nd.status === 'Selesai');

  const filteredND = (mainTab === 'aktif' ? ndAktif : ndArsip).filter(nd => {
    const matchSearch = !search ||
      nd.nomor.toLowerCase().includes(search.toLowerCase()) ||
      nd.perihal.toLowerCase().includes(search.toLowerCase()) ||
      nd.jenisPemberhentian.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || nd.status === statusFilter;
    const matchJenis = !jenisFilter || nd.jenisPemberhentian === jenisFilter;
    return matchSearch && matchStatus && matchJenis;
  });

  if (activeND) {
    return (
      <div className="p-6">
        <NDDetailPage nd={activeND} onBack={() => setActiveND(null)} isArchived={mainTab === 'arsip'} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Info banner */}
      <div className="rounded-2xl p-4 flex gap-3 border" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
        <FileCheck2 size={18} className="shrink-0 mt-0.5" style={{ color: '#1E40AF' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>Alur Verifikasi, Usul Pertek & Penetapan SK Pemberhentian</p>
          <p className="text-xs mt-0.5" style={{ color: '#3B82F6' }}>
            Proses akhir setelah Flow 2/3/4 selesai. Biro SDM memverifikasi dan mengirimkan dokumen ke SIASN
            dalam bentuk <strong>Nota Dinas (ND) bulk</strong> yang memuat banyak pegawai, lalu menerbitkan SK via TTE Nadine.
          </p>
        </div>
      </div>

      {!canAccess ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <AlertCircle size={32} className="mx-auto mb-3 text-amber-400" />
          <p className="text-sm font-semibold text-amber-700">Akses Terbatas</p>
          <p className="text-xs text-amber-600 mt-1">Flow ini hanya dapat diakses oleh Biro SDM, SDM Satker, dan SDM UE1.</p>
        </div>
      ) : (
        <>
          {/* Tab switcher */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
            {(['aktif', 'siap-kirim', 'verifikasi-ditolak', 'arsip'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${mainTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab === 'aktif' ? 'Nota Dinas Aktif' :
                 tab === 'siap-kirim' ? 'Siap Kirim' :
                 tab === 'verifikasi-ditolak' ? 'Verifikasi Ditolak' :
                 'Arsip'}
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  tab === 'aktif' ? 'bg-blue-100 text-blue-700' :
                  tab === 'siap-kirim' ? 'bg-purple-100 text-purple-700' :
                  tab === 'verifikasi-ditolak' ? 'bg-red-100 text-red-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {tab === 'aktif' ? ndAktif.length :
                   tab === 'siap-kirim' ? PEGAWAI_SIAP_KIRIM.length :
                   tab === 'verifikasi-ditolak' ? ndVerdiDitolak.length :
                   ndArsip.length}
                </span>
              </button>
            ))}
          </div>

          {/* Mini Dashboard Status - only for active */}
          {mainTab === 'aktif' && <MiniDashboardND data={ndAktif} onFilterClick={setStatusFilter} currentFilter={statusFilter} />}

          {/* Siap Kirim View */}
          {mainTab === 'siap-kirim' && (
            <div className="space-y-5">
              {/* Action buttons when items selected */}
              {selectedPegawai.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-800">{selectedPegawai.length} pegawai dipilih</p>
                    <p className="text-xs text-purple-600 mt-0.5">Pilih aksi untuk pegawai yang telah dipilih</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPegawai([])}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-white transition-colors"
                    >
                      Batal Pilih
                    </button>
                    <button
                      onClick={() => setShowNotaDinasForm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 transition-colors"
                    >
                      <FileText size={13} /> Generate Nota Dinas
                    </button>
                  </div>
                </div>
              )}

              {/* Nota Dinas Form Modal */}
              {showNotaDinasForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                    <div className="px-6 py-4 bg-purple-900 flex items-center justify-between">
                      <p className="text-white font-semibold">Generate Nota Dinas ke Menteri Keuangan</p>
                      <button onClick={() => setShowNotaDinasForm(false)} className="text-white/70 hover:text-white">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                      <p className="text-sm text-gray-600">
                        Nota Dinas akan dikirimkan ke Menteri Keuangan untuk proses TTE SK Pemberhentian {selectedPegawai.length} pegawai.
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 block mb-1.5">Nomor Nota Dinas</label>
                          <input
                            value={notaDinasToMenteri.nomor}
                            onChange={e => setNotaDinasToMenteri({...notaDinasToMenteri, nomor: e.target.value})}
                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-gray-700 block mb-1.5">Perihal</label>
                          <input
                            value={notaDinasToMenteri.perihal}
                            onChange={e => setNotaDinasToMenteri({...notaDinasToMenteri, perihal: e.target.value})}
                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Pegawai yang akan dimasukkan:</p>
                        <div className="space-y-1">
                          {PEGAWAI_SIAP_KIRIM.filter(p => selectedPegawai.includes(p.id)).map(p => (
                            <div key={p.id} className="text-xs text-gray-600 flex items-center gap-2">
                              <CheckCircle2 size={12} className="text-green-600" />
                              <span>{p.nama} - {p.nip}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-xs text-blue-700">
                          Draft SK untuk pegawai yang dipilih akan dilampirkan dalam Nota Dinas untuk proses TTE.
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                      <button
                        onClick={() => setShowNotaDinasForm(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => {
                          setShowNotaDinasForm(false);
                          alert('Nota Dinas berhasil digenerate dan siap untuk proses TTE!');
                          setSelectedPegawai([]);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 ml-auto"
                      >
                        <Stamp size={13} /> Generate & Lanjut ke TTE
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pegawai Siap Kirim Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">SK Pemberhentian Siap Kirim ke Menteri</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {PEGAWAI_SIAP_KIRIM.length} SK siap untuk proses TTE
                    </p>
                  </div>
                  {PEGAWAI_SIAP_KIRIM.length > 0 && (
                    <button
                      onClick={() => {
                        if (selectedPegawai.length === PEGAWAI_SIAP_KIRIM.length) {
                          setSelectedPegawai([]);
                        } else {
                          setSelectedPegawai(PEGAWAI_SIAP_KIRIM.map(p => p.id));
                        }
                      }}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                    >
                      {selectedPegawai.length === PEGAWAI_SIAP_KIRIM.length ? 'Batalkan Semua' : 'Pilih Semua'}
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedPegawai.length === PEGAWAI_SIAP_KIRIM.length && PEGAWAI_SIAP_KIRIM.length > 0}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedPegawai(PEGAWAI_SIAP_KIRIM.map(p => p.id));
                              } else {
                                setSelectedPegawai([]);
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">NIP / Nama</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jabatan / Satker</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jenis</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Nomor Pertek</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {PEGAWAI_SIAP_KIRIM.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={`transition-colors ${selectedPegawai.includes(item.id) ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedPegawai.includes(item.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedPegawai([...selectedPegawai, item.id]);
                                } else {
                                  setSelectedPegawai(selectedPegawai.filter(id => id !== item.id));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
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
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                              style={{ background: getKasusColor(item.jenis as any) }}
                            >
                              {item.jenis}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-[11px]">{item.nomorPertek}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700">
                              {item.skStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Menampilkan {PEGAWAI_SIAP_KIRIM.length} SK siap kirim</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Verifikasi Ditolak Tab ──────────────────────────── */}
          {mainTab === 'verifikasi-ditolak' && (
            <div className="space-y-5">
              {/* Detail view for individual employee */}
              {activeVerdiItem ? (
                (() => {
                  const { nd, employee } = activeVerdiItem;
                  const cfg = ND_STATUS_CFG[nd.status];
                  return (
                    <div className="space-y-5">
                      <button
                        onClick={() => setActiveVerdiItem(null)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        Kembali ke Daftar Verifikasi Ditolak
                      </button>

                      {/* Header */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4" style={{ background: '#4C1D95' }}>
                          <p className="text-white font-bold text-base">{employee.nama}</p>
                          <p className="text-white/70 text-xs mt-0.5">{employee.nip} · {employee.jabatan} · {employee.satker}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-white bg-white/20 px-2 py-0.5 rounded-full font-semibold">{employee.jenis}</span>
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border" style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}>{nd.status}</span>
                            <span className="text-[10px] text-white/60">{nd.nomor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Verifikasi Pertek checklist (read-only) */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <p className="text-sm font-semibold text-gray-700">Review Verifikasi Pertek</p>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                          <p className="text-xs text-red-700">
                            Data verifikasi ini ditolak. Lihat alasan penolakan di bawah untuk tindak lanjut perbaikan.
                          </p>
                        </div>
                        <BerkasSection berkas={BERKAS_VERIFIKASI} title="Berkas Dokumen" />
                        {[
                          { label: 'Kelengkapan Berkas dari SDM Satker', status: true },
                          { label: 'Validasi Data Pegawai di HRIS', status: true },
                          { label: 'Cek Status Clearance BMN', status: true },
                          { label: 'Verifikasi Data Pertek dari BKN', status: employee.nomorPertek !== '-' },
                          { label: 'Verifikasi Clearance Ikatan Dinas', status: employee.jenis !== 'Uzur' },
                        ].map((check, i) => (
                          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border ${check.status ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                            {check.status
                              ? <Check size={14} className="text-green-600 shrink-0" />
                              : <AlertCircle size={14} className="text-amber-500 shrink-0" />}
                            <p className="text-xs text-gray-700 flex-1">{check.label}</p>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${check.status ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {check.status ? 'OK' : 'Perlu Cek'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Alasan Penolakan */}
                      {nd.alasanPenolakan && (
                        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-500 shrink-0" />
                            <p className="text-sm font-semibold text-red-800">Alasan Penolakan Verifikasi Pertek</p>
                          </div>
                          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                            <p className="text-xs text-gray-700 leading-relaxed">{nd.alasanPenolakan}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setActiveVerdiItem(null)}
                          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          Kembali
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <>
              {/* Info banner */}
              <div className="rounded-2xl p-4 flex gap-3 border bg-red-50 border-red-200">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Verifikasi Pertek Ditolak</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Pegawai berikut ditolak saat verifikasi Pertek BKN. Perbaiki data dan kirim ulang ke SIASN setelah dikoreksi.
                  </p>
                </div>
              </div>

              {/* Batch action banner */}
              {selectedVerdiND.length > 0 && (
                <div className="rounded-2xl p-4 flex items-center justify-between gap-4 border bg-orange-50 border-orange-200">
                  <div>
                    <p className="text-sm font-semibold text-orange-800">{selectedVerdiND.length} Nota Dinas dipilih</p>
                    <p className="text-xs text-orange-600 mt-0.5">
                      Akan dikirim ulang ke SIASN setelah data dikoreksi
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedVerdiND([])}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-white transition-colors"
                    >
                      Batal Pilih
                    </button>
                    <button
                      onClick={() => setShowBatchKirimUlang(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
                      style={{ background: '#1E3A5F' }}
                    >
                      <Send size={13} /> Kirim Ulang ke SIASN
                    </button>
                  </div>
                </div>
              )}

              {/* Pegawai Verifikasi Ditolak table (employee-level) */}
              {(() => {
                const verdiRows = ndVerdiDitolak.flatMap(nd =>
                  PERTEK_DATA.filter(p => nd.pegawaiIds.includes(p.id)).map(employee => ({ nd, employee }))
                );
                const allNdIds = [...new Set(verdiRows.map(r => r.nd.id))];
                const allSelected = allNdIds.length > 0 && allNdIds.every(id => selectedVerdiND.includes(id));
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">Daftar Pegawai — Verifikasi Ditolak</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{verdiRows.length} pegawai dari {ndVerdiDitolak.length} nota dinas perlu perbaikan</p>
                      </div>
                      {verdiRows.length > 0 && (
                        <button
                          onClick={() => {
                            if (allSelected) setSelectedVerdiND([]);
                            else setSelectedVerdiND(allNdIds);
                          }}
                          className="text-xs font-semibold shrink-0 transition-colors"
                          style={{ color: '#1E3A5F' }}
                        >
                          {allSelected ? 'Batalkan Semua' : 'Pilih Semua'}
                        </button>
                      )}
                    </div>

                    {verdiRows.length === 0 ? (
                      <div className="py-12 text-center text-gray-400">
                        <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Tidak ada pegawai verifikasi ditolak</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="px-4 py-3 text-left">
                                <input
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={e => {
                                    if (e.target.checked) setSelectedVerdiND(allNdIds);
                                    else setSelectedVerdiND([]);
                                  }}
                                  className="rounded border-gray-300"
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                              <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Nomor ND</th>
                              <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Nama Pegawai</th>
                              <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tanggal ND</th>
                              <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jenis</th>
                              <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                              <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {verdiRows.map(({ nd, employee }, idx) => {
                              const cfg = ND_STATUS_CFG[nd.status];
                              const isNdSelected = selectedVerdiND.includes(nd.id);
                              return (
                                <tr
                                  key={`${nd.id}-${employee.id}`}
                                  className={`transition-colors ${isNdSelected ? 'bg-orange-50/40' : 'hover:bg-red-50/20'}`}
                                >
                                  <td className="px-4 py-3">
                                    <input
                                      type="checkbox"
                                      checked={isNdSelected}
                                      onChange={e => {
                                        if (e.target.checked) setSelectedVerdiND(prev => [...new Set([...prev, nd.id])]);
                                        else setSelectedVerdiND(prev => prev.filter(id => id !== nd.id));
                                      }}
                                      className="rounded border-gray-300"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <p className="font-semibold text-gray-800">{nd.nomor}</p>
                                    <p className="text-gray-400 mt-0.5">{nd.dari}</p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="font-semibold text-gray-800">{employee.nama}</p>
                                    <p className="text-gray-400 mt-0.5">{employee.nip}</p>
                                  </td>
                                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{nd.tanggal}</td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                                      style={{ background: getKasusColor(nd.jenisPemberhentian as any) }}
                                    >
                                      {nd.jenisPemberhentian}
                                    </span>
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
                                      onClick={() => setActiveVerdiItem({ nd, employee })}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors hover:opacity-90"
                                      style={{ background: '#1E3A5F' }}
                                    >
                                      Buka <ChevronRight size={12} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="px-4 py-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">Menampilkan {verdiRows.length} pegawai perlu perbaikan</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Batch Kirim Ulang Modal */}
              {showBatchKirimUlang && (() => {
                const selectedNDs = ndVerdiDitolak.filter(nd => selectedVerdiND.includes(nd.id));
                const totalPegawai = selectedNDs.reduce((acc, nd) => acc + PERTEK_DATA.filter(p => nd.pegawaiIds.includes(p.id)).length, 0);
                return (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                      <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#1E3A5F' }}>
                        <div>
                          <p className="text-white font-semibold">Kirim Ulang Nota Dinas ke SIASN</p>
                          <p className="text-white/60 text-xs mt-0.5">
                            {selectedNDs.length} Nota Dinas · {totalPegawai} pegawai
                          </p>
                        </div>
                        <button onClick={() => setShowBatchKirimUlang(false)} className="text-white/70 hover:text-white">
                          <X size={20} />
                        </button>
                      </div>

                      <div className="p-6 space-y-5 overflow-y-auto flex-1">
                        <div className="rounded-xl p-3 flex gap-2 border bg-orange-50 border-orange-200">
                          <AlertCircle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-orange-700">
                            Pastikan data yang bermasalah sudah dikoreksi di Unit SDM UE1 sebelum mengirim ulang ke SIASN.
                            ND yang dikirim ulang akan diproses kembali oleh BKN.
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">Nota Dinas yang akan dikirim ulang</p>
                          <div className="space-y-2">
                            {selectedNDs.map(nd => {
                              const pegawaiList = PERTEK_DATA.filter(p => nd.pegawaiIds.includes(p.id));
                              const cfg = ND_STATUS_CFG[nd.status];
                              return (
                                <div key={nd.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1E3A5F' }}>
                                    <FileText size={14} className="text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="text-xs font-semibold text-gray-800">{nd.nomor}</p>
                                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border" style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}>
                                        {nd.status}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{nd.perihal}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{nd.tanggal} · {pegawaiList.length} pegawai</p>
                                  </div>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold text-white shrink-0" style={{ background: getKasusColor(nd.jenisPemberhentian as any) }}>
                                    {nd.jenisPemberhentian}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Total ND Dikirim Ulang', value: selectedNDs.length, color: '#1E3A5F', bg: '#EFF6FF' },
                            { label: 'Total Pegawai', value: totalPegawai, color: '#059669', bg: '#ECFDF5' },
                            { label: 'Estimasi Proses', value: '3–5 hari kerja', color: '#EA580C', bg: '#FFF7ED' },
                          ].map(s => (
                            <div key={s.label} className="rounded-xl p-3 text-center border" style={{ background: s.bg, borderColor: s.color + '33' }}>
                              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: s.color }}>{s.label}</p>
                              <p className="text-base font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
                            </div>
                          ))}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">Konfirmasi Perbaikan Data</p>
                          {[
                            { label: 'Data kepegawaian SIASN telah dikoreksi', done: true },
                            { label: 'Berkas usulan sudah diperbarui oleh Unit SDM UE1', done: true },
                            { label: 'Nomor ND dan perihal sudah sesuai', done: true },
                          ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border mb-2 ${item.done ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                              {item.done ? <CheckCircle2 size={14} className="text-green-600 shrink-0" /> : <AlertCircle size={14} className="text-amber-500 shrink-0" />}
                              <p className="text-xs text-gray-700 flex-1">{item.label}</p>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${item.done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {item.done ? 'OK' : 'Perlu Cek'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
                        <button onClick={() => setShowBatchKirimUlang(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">
                          Batal
                        </button>
                        <button
                          onClick={() => { setShowBatchKirimUlang(false); setSelectedVerdiND([]); }}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white ml-auto transition-colors hover:opacity-90"
                          style={{ background: '#1E3A5F' }}
                        >
                          <Send size={13} /> Kirim Ulang {selectedNDs.length} ND ke SIASN
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
              </>
              )}
            </div>
          )}

          {/* Filter panel - only for aktif and arsip */}
          {mainTab !== 'siap-kirim' && mainTab !== 'verifikasi-ditolak' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Filter</p>
              <button
                onClick={() => { setSearch(''); setStatusFilter(''); setJenisFilter(''); }}
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
                    placeholder="Cari nomor / perihal..."
                    className="bg-transparent text-xs focus:outline-none flex-1 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
              {mainTab === 'aktif' && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as NotaDinas['status'] | '')}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                  >
                    <option value="">Semua</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Siap TTE">Siap TTE</option>
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jenis Pemberhentian</label>
                <select
                  value={jenisFilter}
                  onChange={e => setJenisFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="BUP">BUP</option>
                  <option value="Uzur">Uzur</option>
                  <option value="Meninggal/Tewas">Meninggal/Tewas</option>
                </select>
              </div>
            </div>
          </div>
          )}

          {/* Batch action banner — aktif tab only */}
          {mainTab === 'aktif' && selectedBatchND.length > 0 && (() => {
            const totalPegawai = selectedBatchND.reduce((acc, ndId) => {
              const nd = NOTA_DINAS_LIST.find(n => n.id === ndId);
              if (!nd) return acc;
              return acc + PERTEK_DATA.filter(p => nd.pegawaiIds.includes(p.id)).length;
            }, 0);
            return (
              <div className="rounded-2xl p-4 flex items-center justify-between gap-4 border" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>
                    {selectedBatchND.length} Nota Dinas dipilih
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#3B82F6' }}>
                    Total {totalPegawai} pegawai akan dikirimkan sekaligus ke SIASN
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedBatchND([])}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-white transition-colors"
                  >
                    Batal Pilih
                  </button>
                  <button
                    onClick={() => setShowBatchKirimSiasn(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
                    style={{ background: '#1E3A5F' }}
                  >
                    <Send size={13} /> Kirim Batch ke SIASN
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ND List - only for aktif and arsip */}
          {mainTab !== 'siap-kirim' && mainTab !== 'verifikasi-ditolak' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {mainTab === 'aktif' ? 'Nota Dinas (ND) Verifikasi & SK Aktif' : 'Arsip Nota Dinas Selesai'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filteredND.length} dari {mainTab === 'aktif' ? ndAktif.length : ndArsip.length} nota dinas
                </p>
              </div>
              {mainTab === 'aktif' && filteredND.length > 0 && (() => {
                const selectable = filteredND.filter(nd => nd.jenisPemberhentian !== 'Pengunduran Diri Tanpa Hak Pensiun');
                const allSelected = selectable.length > 0 && selectable.every(nd => selectedBatchND.includes(nd.id));
                return (
                  <button
                    onClick={() => {
                      if (allSelected) setSelectedBatchND([]);
                      else setSelectedBatchND(selectable.map(nd => nd.id));
                    }}
                    className="text-xs font-semibold shrink-0 transition-colors"
                    style={{ color: '#1E3A5F' }}
                  >
                    {allSelected ? 'Batalkan Semua' : 'Pilih Semua'}
                  </button>
                );
              })()}
            </div>

            {filteredND.length === 0 ? (
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
                        {mainTab === 'aktif' && (
                          <th className="px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={selectedBatchND.length === filteredND.length && filteredND.length > 0}
                              onChange={e => {
                                if (e.target.checked) setSelectedBatchND(filteredND.map(nd => nd.id));
                                else setSelectedBatchND([]);
                              }}
                              className="rounded border-gray-300"
                            />
                          </th>
                        )}
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Nomor ND</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Perihal</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl ND</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jenis</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jumlah Pegawai</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Progress SK</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredND.map((nd, idx) => {
                        const cfg = ND_STATUS_CFG[nd.status];
                        const pegawaiList = PERTEK_DATA.filter(p => nd.pegawaiIds.includes(p.id));
                        const selesai = pegawaiList.filter(p => p.skStatus === 'Selesai').length;
                        const isSelected = selectedBatchND.includes(nd.id);
                        return (
                          <tr
                            key={nd.id}
                            className={`transition-colors cursor-pointer ${isSelected && mainTab === 'aktif' ? 'bg-blue-50/40' : 'hover:bg-blue-50/30'}`}
                            onClick={() => mainTab !== 'aktif' ? setActiveND(nd) : undefined}
                          >
                            {mainTab === 'aktif' && (
                              <td className="px-4 py-3">
                                {nd.jenisPemberhentian !== 'Pengunduran Diri Tanpa Hak Pensiun' && (
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={e => {
                                      if (e.target.checked) setSelectedBatchND([...selectedBatchND, nd.id]);
                                      else setSelectedBatchND(selectedBatchND.filter(id => id !== nd.id));
                                    }}
                                    onClick={e => e.stopPropagation()}
                                    className="rounded border-gray-300"
                                  />
                                )}
                              </td>
                            )}
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
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                                style={{ background: getKasusColor(nd.jenisPemberhentian as any) }}
                              >
                                {nd.jenisPemberhentian}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Users size={12} className="text-gray-400" />
                                <span className="font-semibold text-gray-800">{pegawaiList.length}</span>
                                <span className="text-gray-400">pegawai</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: pegawaiList.length ? `${(selesai / pegawaiList.length) * 100}%` : '0%',
                                      background: selesai === pegawaiList.length ? '#10B981' : '#1E3A5F',
                                    }}
                                  />
                                </div>
                                <span className="text-gray-500 text-[10px] whitespace-nowrap">{selesai}/{pegawaiList.length} SK</span>
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
                                onClick={e => { e.stopPropagation(); setActiveND(nd); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors hover:opacity-90"
                                style={{ background: '#1E3A5F' }}
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
                  <p className="text-xs text-gray-500">Menampilkan {filteredND.length} dari {NOTA_DINAS_LIST.length} nota dinas</p>
                </div>
              </>
            )}
          </div>
          )}

          {/* Batch Kirim SIASN Modal */}
          {showBatchKirimSiasn && (() => {
            const selectedNDs = NOTA_DINAS_LIST.filter(nd => selectedBatchND.includes(nd.id));
            const totalPegawai = selectedNDs.reduce((acc, nd) => {
              return acc + PERTEK_DATA.filter(p => nd.pegawaiIds.includes(p.id)).length;
            }, 0);
            return (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                  <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#1E3A5F' }}>
                    <div>
                      <p className="text-white font-semibold">Kirim Batch Nota Dinas ke SIASN</p>
                      <p className="text-white/60 text-xs mt-0.5">
                        {selectedNDs.length} Nota Dinas · {totalPegawai} pegawai
                      </p>
                    </div>
                    <button onClick={() => setShowBatchKirimSiasn(false)} className="text-white/70 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-6 space-y-5 overflow-y-auto flex-1">
                    <div className="rounded-xl p-3 flex gap-2 border" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                      <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#1E40AF' }} />
                      <p className="text-xs" style={{ color: '#1E40AF' }}>
                        Semua Nota Dinas yang dipilih beserta data pegawai di dalamnya akan dikirimkan sekaligus ke SIASN
                        untuk proses pertimbangan teknis (Pertek) oleh BKN.
                      </p>
                    </div>

                    {/* Summary per ND */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Nota Dinas yang akan dikirim</p>
                      <div className="space-y-2">
                        {selectedNDs.map(nd => {
                          const pegawaiList = PERTEK_DATA.filter(p => nd.pegawaiIds.includes(p.id));
                          const cfg = ND_STATUS_CFG[nd.status];
                          return (
                            <div key={nd.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1E3A5F' }}>
                                <FileText size={14} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-xs font-semibold text-gray-800">{nd.nomor}</p>
                                  <span
                                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border"
                                    style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                                  >
                                    {nd.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{nd.perihal}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{nd.tanggal} · {pegawaiList.length} pegawai</p>
                              </div>
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold text-white shrink-0"
                                style={{ background: getKasusColor(nd.jenisPemberhentian as any) }}
                              >
                                {nd.jenisPemberhentian}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ringkasan total */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Total Nota Dinas', value: selectedNDs.length, color: '#1E3A5F', bg: '#EFF6FF' },
                        { label: 'Total Pegawai', value: totalPegawai, color: '#059669', bg: '#ECFDF5' },
                        { label: 'Estimasi Proses', value: '3–5 hari kerja', color: '#D97706', bg: '#FFFBEB' },
                      ].map(s => (
                        <div key={s.label} className="rounded-xl p-3 text-center border" style={{ background: s.bg, borderColor: s.color + '33' }}>
                          <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: s.color }}>{s.label}</p>
                          <p className="text-base font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Checklist dokumen untuk batch */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Kelengkapan Dokumen Batch</p>
                      {[
                        { label: 'Data kepegawaian SIASN terverifikasi', done: true },
                        { label: 'Berkas usulan dari SDM Satker lengkap', done: true },
                        { label: 'Clearance BMN, Ikatan Dinas & Hukdis terpenuhi', done: true },
                        { label: 'Nomor ND dan tanggal tercatat dalam sistem', done: true },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border mb-2 ${item.done ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}
                        >
                          {item.done
                            ? <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                            : <AlertCircle size={14} className="text-amber-500 shrink-0" />}
                          <p className="text-xs text-gray-700 flex-1">{item.label}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${item.done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {item.done ? 'OK' : 'Perlu Cek'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
                    <button
                      onClick={() => setShowBatchKirimSiasn(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        setShowBatchKirimSiasn(false);
                        setSelectedBatchND([]);
                      }}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white ml-auto transition-colors hover:opacity-90"
                      style={{ background: '#1E3A5F' }}
                    >
                      <Send size={13} /> Kirim {selectedNDs.length} ND ke SIASN
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
