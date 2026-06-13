import { useState, useRef, useEffect } from 'react';
import {
  Search, Download, Package, Eye, CheckSquare, PlusSquare,
  X, Check, ChevronDown, FileText, Send, Users, AlertCircle,
  ArrowLeft, ClipboardList, Stamp, ChevronRight, MoreHorizontal,
  ThumbsUp, ThumbsDown, Info,
} from 'lucide-react';
import svgPaths from '../../imports/UpsdmUe1BupMeninggalUzurBerkasUsulan/svg-x8r0wrzwge';
// import { MOCK_PEGAWAI, getKasusColor, getKasusLabel } from '../data/mockData';

import { getKasusColor, getKasusLabel, getSisaBulanColor, getSisaBulanLabel  } from '../utils/case.util';
import { type Pegawai } from '../types/employee.types';
import { MOCK_PEGAWAI } from '../data/mockData';


// ─── Types ──────────────────────────────────────────────────────────────────────

type StatusUsulan =
  | 'Draft' | 'Dokumen Lengkap' | 'Diajukan ke UE1' | 'Review UE1'
  | 'Diterima UE1' | 'Perlu Revisi Satker' | 'Review Biro SDM' | 'SK Terbit';

type Jenis = 'BUP' | 'Uzur' | 'Meninggal';
type PegawaiDecisionStatus = 'pending' | 'approved' | 'rejected';

interface PegawaiDecision {
  status: PegawaiDecisionStatus;
  alasan: string;
}

interface BerkasUsulan {
  id: string;
  nomorUsulan: string;
  namaBerkas: string;
  satkerPengusul: string;
  jenis: Jenis;
  jumlahPegawai: number;
  lengkap: number;
  belumLengkap: number;
  status: StatusUsulan;
  tanggalDibuat: string;
  catatan?: string;
  pegawaiIds: string[];
}

interface PaketKonsolidasi {
  id: string;
  nomorPaket: string;
  namaPaket: string;
  jumlahBerkas: number;
  jumlahPegawai: number;
  berkasIds: string[];
  tanggalDibuat: string;
  status: 'Draft ND' | 'Siap TTE' | 'Terkirim';
  notaDinas?: { nomor: string; perihal: string; tanggal: string };
}

type AppView =
  | 'list'
  | 'berkas-detail'
  | 'paket-detail'
  | 'nota-dinas'
  | 'tte';

// ─── Mock data ──────────────────────────────────────────────────────────────────

const BUP_KASUS = ['BUP', 'Meninggal', 'Uzur'] as const;
const KANDIDAT_DATA = MOCK_PEGAWAI.filter(p =>
  BUP_KASUS.includes(p.jenisKasus as (typeof BUP_KASUS)[number])
).map((p, i) => ({
  ...p,
  statusDokumen: (i % 3 === 2 ? 'Belum Lengkap' : 'Lengkap') as 'Lengkap' | 'Belum Lengkap',
}));

const LIFECYCLE: { status: StatusUsulan; actor: string; flow: string }[] = [
  { status: 'Draft',            actor: 'Unit SDM Satker', flow: 'Flow 2' },
  { status: 'Dokumen Lengkap',  actor: 'Unit SDM Satker', flow: 'Flow 2' },
  { status: 'Diajukan ke UE1', actor: 'Unit SDM Satker', flow: 'Flow 2' },
  { status: 'Review UE1',       actor: 'Unit SDM UE1',   flow: 'Flow 2' },
  { status: 'Diterima UE1',     actor: 'Unit SDM UE1',   flow: 'Flow 2' },
  { status: 'Review Biro SDM',  actor: 'Biro SDM',        flow: 'Flow 6' },
  { status: 'SK Terbit',        actor: 'Biro SDM',        flow: 'Flow 6' },
];

const INITIAL_BERKAS: BerkasUsulan[] = [
  {
    id: 'u1', nomorUsulan: 'USP-2027-001', namaBerkas: 'BUP Januari 2027',
    satkerPengusul: 'KPP Pratama Bandung', jenis: 'BUP',
    jumlahPegawai: 35, lengkap: 35, belumLengkap: 0,
    status: 'Diajukan ke UE1', tanggalDibuat: '02 Jan 2027', catatan: '',
    pegawaiIds: ['1','2','3','4','5','6'],
  },
  {
    id: 'u2', nomorUsulan: 'USP-2027-002', namaBerkas: 'BUP Februari 2027',
    satkerPengusul: 'KPP Pratama Jakarta Selatan', jenis: 'BUP',
    jumlahPegawai: 22, lengkap: 19, belumLengkap: 3,
    status: 'Perlu Revisi Satker', tanggalDibuat: '01 Feb 2027', catatan: 'Berkas digital rusak',
    pegawaiIds: ['7','8','9','10'],
  },
  {
    id: 'u3', nomorUsulan: 'USP-2027-003', namaBerkas: 'Uzur Triwulan I',
    satkerPengusul: 'KPP Pratama Bintan', jenis: 'Uzur',
    jumlahPegawai: 5, lengkap: 5, belumLengkap: 0,
    status: 'Review UE1', tanggalDibuat: '15 Mar 2027', catatan: '',
    pegawaiIds: ['11','12'],
  },
];

// ─── Berkas per Jenis ───────────────────────────────────────────────────────────

interface BerkasItem {
  id: string;
  nama: string;
  source: 'satu-kemenkeu' | 'upload';
}

const BERKAS_BUP: BerkasItem[] = [
  { id: 'bup1',  nama: 'SK Kenaikan Pangkat Terakhir', source: 'satu-kemenkeu' },
  { id: 'bup2',  nama: 'SK Mutasi Jabatan Terakhir', source: 'satu-kemenkeu' },
  { id: 'bup3',  nama: 'Surat Pernyataan Pengembalian (SPP) BMN', source: 'upload' },
  { id: 'bup4',  nama: 'Surat Keterangan tidak dalam proses pemeriksaan dugaan pelanggaran disiplin tingkat sedang atau berat, atau menjalani hukuman disiplin tingkat sedang atau berat, dan/atau dalam proses/masa pemberhentian sementara dari jabatan negeri', source: 'upload' },
  { id: 'bup5',  nama: 'Surat Pernyataan Tidak Pernah Dijatuhi Hukuman Disiplin Tingkat Sedang/Berat 1 Tahun Terakhir', source: 'upload' },
  { id: 'bup6',  nama: 'Surat Pernyataan Tidak Sedang Menjalani Proses Pidana/Pernah Dipidana', source: 'upload' },
  { id: 'bup7',  nama: 'Surat Keputusan CPNS', source: 'satu-kemenkeu' },
  { id: 'bup8',  nama: 'SKP 1 Tahun Terakhir dengan Nilai Minimal Baik', source: 'satu-kemenkeu' },
  { id: 'bup9',  nama: 'Surat/Akta Nikah (bagi yang sudah menikah)', source: 'satu-kemenkeu' },
  { id: 'bup10', nama: 'Akta Lahir Anak Usia < 25 Tahun & Belum Bekerja/Menikah', source: 'satu-kemenkeu' },
  { id: 'bup11', nama: 'Kartu Keluarga', source: 'satu-kemenkeu' },
  { id: 'bup12', nama: 'SK PMK/SK Cuti Diluar Tanggungan Negara', source: 'satu-kemenkeu' },
];

const BERKAS_MENINGGAL: BerkasItem[] = [
  { id: 'men1',  nama: 'SK Kenaikan Pangkat Terakhir', source: 'satu-kemenkeu' },
  { id: 'men2',  nama: 'SK Mutasi Jabatan Terakhir', source: 'satu-kemenkeu' },
  { id: 'men3',  nama: 'Surat Pernyataan Pengembalian (SPP) BMN', source: 'upload' },
  { id: 'men4',  nama: 'Surat Keterangan tidak dalam proses pemeriksaan dugaan pelanggaran disiplin tingkat sedang atau berat, atau menjalani hukuman disiplin tingkat sedang atau berat, dan/atau dalam proses/masa pemberhentian sementara dari jabatan negeri', source: 'upload' },
  { id: 'men5',  nama: 'Surat Pernyataan Tidak Pernah Dijatuhi Hukuman Disiplin Tingkat Sedang/Berat 1 Tahun Terakhir', source: 'upload' },
  { id: 'men6',  nama: 'Surat Pernyataan Tidak Sedang Menjalani Proses Pidana/Pernah Dipidana', source: 'upload' },
  { id: 'men7',  nama: 'Surat Keputusan CPNS', source: 'satu-kemenkeu' },
  { id: 'men8',  nama: 'Surat Keputusan PNS', source: 'satu-kemenkeu' },
  { id: 'men9',  nama: 'SKP 1 Tahun Terakhir dengan Nilai Minimal Baik', source: 'satu-kemenkeu' },
  { id: 'men10', nama: 'Surat/Akta Nikah (bagi yang sudah menikah)', source: 'satu-kemenkeu' },
  { id: 'men11', nama: 'Akta Lahir Anak Usia < 25 Tahun & Belum Bekerja/Menikah', source: 'satu-kemenkeu' },
  { id: 'men12', nama: 'Kartu Keluarga', source: 'satu-kemenkeu' },
  { id: 'men13', nama: 'Surat Keterangan Janda/Duda/Ahli Waris dari Kelurahan/Kecamatan', source: 'upload' },
  { id: 'men14', nama: 'Akta Kematian', source: 'upload' },
  { id: 'men15', nama: 'Surat Keterangan Kematian', source: 'upload' },
];

const BERKAS_UZUR: BerkasItem[] = [
  { id: 'uzr1',  nama: 'SK Kenaikan Pangkat Terakhir', source: 'satu-kemenkeu' },
  { id: 'uzr2',  nama: 'SK Mutasi Jabatan Terakhir', source: 'satu-kemenkeu' },
  { id: 'uzr3',  nama: 'Surat Pernyataan Pengembalian (SPP) BMN', source: 'upload' },
  { id: 'uzr4',  nama: 'Surat Keterangan tidak dalam proses pemeriksaan dugaan pelanggaran disiplin tingkat sedang atau berat, atau menjalani hukuman disiplin tingkat sedang atau berat, dan/atau dalam proses/masa pemberhentian sementara dari jabatan negeri', source: 'upload' },
  { id: 'uzr5',  nama: 'Surat Pernyataan Tidak Sedang Menjalani Proses Pidana/Pernah Dipidana', source: 'upload' },
  { id: 'uzr6',  nama: 'Surat Keputusan CPNS', source: 'satu-kemenkeu' },
  { id: 'uzr7',  nama: 'SKP 1 Tahun Terakhir dengan Nilai Minimal Baik', source: 'satu-kemenkeu' },
  { id: 'uzr8',  nama: 'Surat/Akta Nikah (bagi yang sudah menikah)', source: 'satu-kemenkeu' },
  { id: 'uzr9',  nama: 'Akta Lahir Anak Usia < 25 Tahun & Belum Bekerja/Menikah', source: 'satu-kemenkeu' },
  { id: 'uzr10', nama: 'Kartu Keluarga', source: 'satu-kemenkeu' },
  { id: 'uzr11', nama: 'Surat Keterangan Tim Penguji Kesehatan', source: 'upload' },
];

function getBerkasForJenis(jenis: Jenis): BerkasItem[] {
  if (jenis === 'BUP')      return BERKAS_BUP;
  if (jenis === 'Meninggal') return BERKAS_MENINGGAL;
  return BERKAS_UZUR;
}

function resolveJenisForPegawai(jenisKasus: string, fallback: Jenis): Jenis {
  if (jenisKasus === 'BUP' || jenisKasus === 'Meninggal' || jenisKasus === 'Uzur') return jenisKasus as Jenis;
  return fallback;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

const JENIS_COLOR: Record<Jenis, string> = {
  BUP: '#2563eb', Uzur: '#7c3aed', Meninggal: '#6b7280',
};

function statusUsulanColor(s: StatusUsulan): string {
  const map: Record<StatusUsulan, string> = {
    'Draft': '#6B7280', 'Dokumen Lengkap': '#3B82F6', 'Diajukan ke UE1': '#8B5CF6',
    'Review UE1': '#EC4899', 'Diterima UE1': '#10B981', 'Perlu Revisi Satker': '#EF4444',
    'Review Biro SDM': '#F59E0B', 'SK Terbit': '#059669',
  };
  return map[s] ?? '#6B7280';
}

function resolveKandidatForBerkas(berkas: BerkasUsulan) {
  return berkas.pegawaiIds
    .map(id => KANDIDAT_DATA.find(p => p.id === id))
    .filter((p): p is typeof KANDIDAT_DATA[number] => p !== undefined);
}

// ─── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'info' }) {
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
      <Check size={14} /> {msg}
    </div>
  );
}

// ─── Row dropdown menu ───────────────────────────────────────────────────────────

function RowMenu({
  berkas, pakets, onDetail, onSetujuSemua, onTambahKePaket,
}: {
  berkas: BerkasUsulan;
  pakets: PaketKonsolidasi[];
  onDetail: () => void;
  onSetujuSemua: () => void;
  onTambahKePaket: (paketId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showPaketPicker, setShowPaketPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setShowPaketPicker(false); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const availablePakets = pakets.filter(p => p.status === 'Draft ND' && !p.berkasIds.includes(berkas.id));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(o => !o); setShowPaketPicker(false); }}
        className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#162d54] hover:bg-[#1e3a8a] transition-colors"
      >
        <svg className="size-4" fill="none" viewBox="0 0 16 16"><path d={svgPaths.p260dd400} fill="white" /></svg>
      </button>

      {open && !showPaketPicker && (
        <div className="absolute right-0 top-9 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-56">
          <button onClick={() => { onDetail(); setOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50">
            <Eye size={13} className="text-blue-600 shrink-0" /> Lihat Detail Berkas
          </button>
          <button onClick={() => { onSetujuSemua(); setOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50">
            <CheckSquare size={13} className="text-green-600 shrink-0" /> Setuju Semua Pegawai
          </button>
          <button onClick={() => setShowPaketPicker(true)} className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50">
            <PlusSquare size={13} className="text-violet-600 shrink-0" /> Tambah ke Paket Konsolidasi
          </button>
        </div>
      )}

      {open && showPaketPicker && (
        <div className="absolute right-0 top-9 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-64">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
            <button onClick={() => setShowPaketPicker(false)} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={13} /></button>
            <span className="text-xs font-semibold text-gray-700">Pilih Paket Konsolidasi</span>
          </div>
          {availablePakets.length === 0 ? (
            <p className="px-4 py-3 text-xs text-gray-500">Belum ada paket. Buat paket baru dulu.</p>
          ) : availablePakets.map(p => (
            <button key={p.id} onClick={() => { onTambahKePaket(p.id); setOpen(false); setShowPaketPicker(false); }} className="flex items-start gap-2 w-full px-4 py-2.5 text-left hover:bg-gray-50">
              <Package size={13} className="text-violet-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-800">{p.namaPaket}</p>
                <p className="text-[10px] text-gray-500">{p.jumlahBerkas} berkas · {p.jumlahPegawai} pegawai</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pegawai Berkas Modal ───────────────────────────────────────────────────────

function PegawaiBerkasModal({
  pegawai,
  berkasJenis,
  onClose,
}: {
  pegawai: typeof KANDIDAT_DATA[number];
  berkasJenis: Jenis;
  onClose: () => void;
}) {
  const jenis = resolveJenisForPegawai(pegawai.jenisKasus, berkasJenis);
  const berkasItems = getBerkasForJenis(jenis);
  const kemenkeuItems = berkasItems.filter(b => b.source === 'satu-kemenkeu');
  const uploadItems   = berkasItems.filter(b => b.source === 'upload');

  const isMissingItem = (b: BerkasItem) =>
    b.source === 'upload' &&
    pegawai.statusDokumen === 'Belum Lengkap' &&
    b.id === uploadItems[uploadItems.length - 1].id;

  const teruploadCount   = uploadItems.filter(b => !isMissingItem(b)).length;
  const belumUploadCount = uploadItems.filter(isMissingItem).length;
  const totalLengkap     = kemenkeuItems.length + teruploadCount;
  const pct              = Math.round((totalLengkap / berkasItems.length) * 100);

  const jenisLabel: Record<Jenis, string> = { BUP: 'Batas Usia Pensiun', Meninggal: 'Meninggal', Uzur: 'Uzur / Sakit' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Modal header ── */}
        <div className="px-6 py-5 flex items-center gap-4 shrink-0" style={{ background: '#162D54' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white" style={{ background: 'rgba(255,255,255,0.18)' }}>
            {pegawai.nama.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">{pegawai.nama}</p>
            <p className="text-white/60 text-xs mt-0.5">{pegawai.nip} · {pegawai.jabatan} · {pegawai.satker}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="text-[10px] font-semibold text-white px-2.5 py-1 rounded-full"
              style={{ background: JENIS_COLOR[jenis] }}
            >
              {jenisLabel[jenis]}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors"
            >
              <X size={13} className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-gray-100">

          {/* ── Kelengkapan Berkas ── */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-800">Kelengkapan Berkas</h4>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${pegawai.statusDokumen === 'Lengkap' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {pegawai.statusDokumen === 'Lengkap' ? 'Lengkap' : 'Belum Lengkap'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>{totalLengkap} dari {berkasItems.length} berkas lengkap</span>
                <span className="font-bold">{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: pct === 100 ? '#10B981' : pct >= 70 ? '#F59E0B' : '#EF4444' }}
                />
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Berkas',   value: berkasItems.length,    color: 'text-gray-700',  bg: 'bg-gray-50',   border: 'border-gray-200' },
                { label: 'Satu Kemenkeu',  value: kemenkeuItems.length,  color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-100' },
                { label: 'Terupload',      value: teruploadCount,        color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-100' },
                { label: 'Belum Upload',   value: belumUploadCount,      color: belumUploadCount > 0 ? 'text-red-600' : 'text-gray-400', bg: belumUploadCount > 0 ? 'bg-red-50' : 'bg-gray-50', border: belumUploadCount > 0 ? 'border-red-100' : 'border-gray-200' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl border px-3 py-2.5 text-center ${s.bg} ${s.border}`}>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold mb-1">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Berkas Terlampir ── */}
          <div className="px-6 py-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-800">
              Berkas Terlampir
              <span className="ml-2 text-[10px] font-semibold text-gray-400">({berkasItems.length} dokumen diperlukan)</span>
            </h4>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Column headers */}
              <div className="grid grid-cols-[28px_1fr_auto_auto] gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">#</span>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Nama Dokumen</span>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Sumber</span>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Status</span>
              </div>

              <div className="divide-y divide-gray-50">
                {berkasItems.map((b, bIdx) => {
                  const isKemenkeu = b.source === 'satu-kemenkeu';
                  const missing    = isMissingItem(b);
                  return (
                    <div key={b.id} className="grid grid-cols-[28px_1fr_auto_auto] gap-2 items-start px-4 py-2.5 hover:bg-gray-50/80 transition-colors">
                      <span className="text-[10px] text-gray-400 font-semibold pt-0.5">{bIdx + 1}</span>
                      <p className="text-[11px] text-gray-800 leading-snug">{b.nama}</p>

                      {/* Sumber */}
                      {isKemenkeu ? (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">Satu Kemenkeu</span>
                      ) : (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 whitespace-nowrap">Upload</span>
                      )}

                      {/* Status + Lihat */}
                      <div className="flex items-center gap-1.5">
                        {isKemenkeu ? (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-0.5 whitespace-nowrap">
                            <Check size={8} /> Terverifikasi
                          </span>
                        ) : missing ? (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-0.5 whitespace-nowrap">
                            <AlertCircle size={8} /> Belum Upload
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-0.5 whitespace-nowrap">
                            <Check size={8} /> Terupload
                          </span>
                        )}
                        {!missing && (
                          <button className="text-[9px] font-semibold text-blue-600 border border-blue-200 rounded-lg px-1.5 py-0.5 hover:bg-blue-50 transition-colors flex items-center gap-0.5">
                            <Eye size={8} /> Lihat
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-3.5 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Berkas Detail Page (collapsible per-pegawai list) ──────────────────────────

function BerkasDetailPage({
  berkas, pegawaiDecisions, onDecisionChange, onBack,
}: {
  berkas: BerkasUsulan;
  pegawaiDecisions: Record<string, PegawaiDecision>;
  onDecisionChange: (pegawaiId: string, d: PegawaiDecision) => void;
  onBack: () => void;
}) {
  const [pegawaiSearch, setPegawaiSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandedBerkasIds, setExpandedBerkasIds] = useState<Set<string>>(new Set());
  const [savedAlasanIds, setSavedAlasanIds] = useState<Set<string>>(new Set());
  const [modalPegawaiId, setModalPegawaiId] = useState<string | null>(null);

  const berkasForJenis = getBerkasForJenis(berkas.jenis);
  const berkasUploadCount = berkasForJenis.filter(b => b.source === 'upload').length;
  const berkasKemenkeuCount = berkasForJenis.filter(b => b.source === 'satu-kemenkeu').length;

  const toggleBerkasSection = (pegawaiId: string) => {
    setExpandedBerkasIds(prev => {
      const s = new Set(prev); s.has(pegawaiId) ? s.delete(pegawaiId) : s.add(pegawaiId); return s;
    });
  };

  const currentIdx = LIFECYCLE.findIndex(l => l.status === berkas.status);
  const resolvedPegawai = resolveKandidatForBerkas(berkas);
  const filtered = resolvedPegawai.filter(p =>
    !pegawaiSearch || p.nama.toLowerCase().includes(pegawaiSearch.toLowerCase()) || p.nip.includes(pegawaiSearch)
  );

  const totalDisplay  = berkas.jumlahPegawai;
  const sampleShown   = resolvedPegawai.length;
  const approvedCount = Object.values(pegawaiDecisions).filter(d => d.status === 'approved').length;
  const rejectedCount = Object.values(pegawaiDecisions).filter(d => d.status === 'rejected').length;

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleDecision = (pegawaiId: string, action: 'approved' | 'rejected') => {
    const current = pegawaiDecisions[pegawaiId] ?? { status: 'pending', alasan: '' };
    const next = current.status === action ? 'pending' : action;
    onDecisionChange(pegawaiId, { status: next, alasan: current.alasan });
    // Auto-expand when rejected so alasan textarea is visible
    if (next === 'rejected') {
      setExpandedIds(prev => new Set([...prev, pegawaiId]));
    }
  };

  const expandAll  = () => setExpandedIds(new Set(filtered.map(p => p.id)));
  const collapseAll = () => setExpandedIds(new Set());

  const modalPegawai = modalPegawaiId ? resolvedPegawai.find(p => p.id === modalPegawaiId) ?? null : null;

  return (
    <>
    {modalPegawai && (
      <PegawaiBerkasModal
        pegawai={modalPegawai}
        berkasJenis={berkas.jenis}
        onClose={() => setModalPegawaiId(null)}
      />
    )}
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Daftar Berkas Usulan
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-start gap-4" style={{ background: '#162D54' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <ClipboardList size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-white font-bold text-base">{berkas.namaBerkas}</p>
                <p className="text-white/70 text-xs mt-0.5">{berkas.nomorUsulan} · {berkas.satkerPengusul} · Dibuat {berkas.tanggalDibuat}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold" style={{ background: JENIS_COLOR[berkas.jenis] }}>{berkas.jenis}</span>
                <span className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold" style={{ background: statusUsulanColor(berkas.status) }}>{berkas.status}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 divide-x divide-gray-100 border-t border-gray-100">
          {[
            { label: 'Total Pegawai',   value: totalDisplay,          color: 'text-gray-800' },
            { label: 'Dokumen Lengkap', value: berkas.lengkap,        color: 'text-green-700' },
            { label: 'Belum Lengkap',   value: berkas.belumLengkap,   color: berkas.belumLengkap > 0 ? 'text-red-700' : 'text-gray-400' },
            { label: 'Disetujui UE1',   value: approvedCount,         color: 'text-blue-700' },
          ].map(s => (
            <div key={s.label} className="px-4 py-3 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lifecycle */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-500 mb-5">Lifecycle Berkas Usulan</p>
        <div className="relative">
          <div className="absolute left-3.5 top-3.5 bottom-3.5 w-0.5 bg-gray-200" />
          <div className="absolute left-3.5 top-3.5 w-0.5 bg-blue-500" style={{ height: currentIdx > 0 ? `calc(${(currentIdx / (LIFECYCLE.length - 1)) * 100}%)` : '0%' }} />
          <div className="space-y-4">
            {LIFECYCLE.map((l, i) => {
              const isPast = i < currentIdx, isActive = i === currentIdx;
              return (
                <div key={l.status} className="flex items-start gap-4 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${isActive ? 'bg-blue-500 ring-4 ring-blue-100' : isPast ? 'bg-blue-500' : 'bg-gray-200'}`}>
                    {isPast || isActive ? <Check size={13} className="text-white" /> : <span className="text-[10px] text-gray-400 font-bold">{i + 1}</span>}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : isPast ? 'text-gray-700' : 'text-gray-400'}`}>{l.status}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${l.flow === 'Flow 6' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{l.flow}</span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>{l.actor}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daftar Pegawai — collapsible list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="font-semibold text-gray-800">Daftar Pegawai dalam Berkas</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {sampleShown} dari {totalDisplay} pegawai ·
              <span className="text-green-600 font-semibold"> {approvedCount} disetujui</span>
              {rejectedCount > 0 && <span className="text-red-500 font-semibold"> · {rejectedCount} ditolak</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search size={13} className="text-gray-400" />
              <input
                value={pegawaiSearch}
                onChange={e => setPegawaiSearch(e.target.value)}
                placeholder="Cari nama / NIP..."
                className="bg-transparent text-xs focus:outline-none w-36 text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              onClick={expandedIds.size === filtered.length ? collapseAll : expandAll}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              {expandedIds.size === filtered.length ? 'Tutup Semua' : 'Buka Semua'}
            </button>
          </div>
        </div>

        {/* Collapsible pegawai items */}
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <Users size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tidak ada data</p>
            </div>
          ) : filtered.map((p, idx) => {
            const decision   = pegawaiDecisions[p.id] ?? { status: 'pending', alasan: '' };
            const isExpanded = expandedIds.has(p.id);

            // Header row bg based on decision
            const headerBg =
              decision.status === 'approved' ? 'bg-green-50 hover:bg-green-100/60' :
              decision.status === 'rejected'  ? 'bg-red-50 hover:bg-red-100/60'    :
              'bg-white hover:bg-gray-50';

            const decisionBadge =
              decision.status === 'approved'
                ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700"><Check size={9} /> Disetujui</span>
                : decision.status === 'rejected'
                ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600"><X size={9} /> Ditolak</span>
                : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">Belum Diputuskan</span>;

            return (
              <div key={p.id}>
                {/* ── Collapsible header ── */}
                <button
                  onClick={() => toggleExpand(p.id)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors ${headerBg}`}
                >
                  {/* Index */}
                  <span className="text-xs text-gray-400 w-5 shrink-0">{idx + 1}</span>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: '#162D54' }}>
                    {p.nama.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                  </div>

                  {/* Name + NIP */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.nama}</p>
                    <p className="text-xs text-gray-400">{p.nip}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ background: getKasusColor(p.jenisKasus) }}>
                      {getKasusLabel(p.jenisKasus)}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.statusDokumen === 'Lengkap' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.statusDokumen === 'Lengkap' ? <Check size={9} /> : <AlertCircle size={9} />}
                      {p.statusDokumen}
                    </span>
                    {decisionBadge}
                    <button
                      onClick={e => { e.stopPropagation(); setModalPegawaiId(p.id); }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#162D54] text-white hover:bg-[#1e3a8a] transition-colors"
                    >
                      <Eye size={9} /> Berkas
                    </button>
                  </div>

                  {/* Chevron */}
                  <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* ── Expanded content ── */}
                {isExpanded && (
                  <div className={`border-t px-5 py-4 space-y-4 ${decision.status === 'rejected' ? 'bg-red-50/40 border-red-100' : decision.status === 'approved' ? 'bg-green-50/40 border-green-100' : 'bg-gray-50/60 border-gray-100'}`}>
                    {/* Detail grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Jabatan',       value: p.jabatan },
                        { label: 'Unit / Satker', value: p.satker },
                        { label: 'Tanggal BUP',   value: p.tanggalBUP },
                      ].map(item => (
                        <div key={item.label} className="bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{item.label}</p>
                          <p className="text-xs text-gray-800 font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Berkas Terlampir sub-collapsible */}
                    {(() => {
                      const pJenis = resolveJenisForPegawai(p.jenisKasus, berkas.jenis);
                      const pBerkas = getBerkasForJenis(pJenis);
                      const pKemenkeuCount = pBerkas.filter(b => b.source === 'satu-kemenkeu').length;
                      const pUploadCount = pBerkas.filter(b => b.source === 'upload').length;
                      return (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleBerkasSection(p.id)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <FileText size={13} className="text-gray-500 shrink-0" />
                        <span className="text-xs font-semibold text-gray-700 flex-1">Berkas Terlampir</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {pKemenkeuCount} Satu Kemenkeu · {pUploadCount} Upload
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.statusDokumen === 'Lengkap' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {p.statusDokumen === 'Lengkap' ? 'Lengkap' : 'Belum Lengkap'}
                        </span>
                        <ChevronDown size={13} className={`text-gray-400 shrink-0 transition-transform duration-200 ${expandedBerkasIds.has(p.id) ? 'rotate-180' : ''}`} />
                      </button>

                      {expandedBerkasIds.has(p.id) && (
                        <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                          {pBerkas.map((b, bIdx) => {
                            const isKemenkeu = b.source === 'satu-kemenkeu';
                            const uploadItems = pBerkas.filter(x => x.source === 'upload');
                            const isMissingItem = !isKemenkeu && p.statusDokumen === 'Belum Lengkap' && b.id === uploadItems[uploadItems.length - 1].id;
                            return (
                              <div key={b.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50/80">
                                <span className="text-[10px] text-gray-400 font-semibold w-5 shrink-0 mt-0.5">{bIdx + 1}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] text-gray-800 leading-snug">{b.nama}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                                  {isKemenkeu && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Satu Kemenkeu</span>
                                  )}
                                  {isKemenkeu ? (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-0.5">
                                      <Check size={8} /> Terverifikasi
                                    </span>
                                  ) : isMissingItem ? (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-0.5">
                                      <AlertCircle size={8} /> Belum Upload
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-0.5">
                                      <Check size={8} /> Terupload
                                    </span>
                                  )}
                                  {!isMissingItem && (
                                    <button className="flex items-center gap-0.5 text-[9px] font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg px-1.5 py-0.5 hover:bg-blue-50 transition-colors">
                                      <Eye size={9} /> Lihat
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                      );
                    })()}

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDecision(p.id, 'approved')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${decision.status === 'approved' ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'}`}
                      >
                        <ThumbsUp size={13} />
                        {decision.status === 'approved' ? 'Disetujui' : 'Setujui'}
                      </button>
                      <button
                        onClick={() => toggleDecision(p.id, 'rejected')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${decision.status === 'rejected' ? 'bg-red-500 text-white shadow-sm' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'}`}
                      >
                        <ThumbsDown size={13} />
                        {decision.status === 'rejected' ? 'Ditolak' : 'Tolak'}
                      </button>
                      {decision.status !== 'pending' && (
                        <button
                          onClick={() => onDecisionChange(p.id, { status: 'pending', alasan: '' })}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-white border border-gray-200 transition-colors"
                        >
                          <X size={11} /> Reset
                        </button>
                      )}
                    </div>

                    {/* Alasan penolakan */}
                    {decision.status === 'rejected' && (
                      <div className="bg-white border border-red-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-semibold text-red-700">
                            Alasan Penolakan <span className="text-red-400">*</span>
                          </label>
                          {savedAlasanIds.has(p.id) && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                              <Check size={10} /> Tersimpan
                            </span>
                          )}
                        </div>
                        <textarea
                          rows={2}
                          value={decision.alasan}
                          onChange={e => {
                            onDecisionChange(p.id, { ...decision, alasan: e.target.value });
                            setSavedAlasanIds(prev => { const s = new Set(prev); s.delete(p.id); return s; });
                          }}
                          placeholder="Masukkan alasan penolakan pegawai ini..."
                          className="w-full text-xs border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400 bg-white resize-none placeholder-red-300"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              if (decision.alasan.trim()) {
                                setSavedAlasanIds(prev => new Set([...prev, p.id]));
                              }
                            }}
                            disabled={!decision.alasan.trim() || savedAlasanIds.has(p.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
                          >
                            <Check size={11} /> Simpan Alasan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {totalDisplay > sampleShown && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-center">
            <p className="text-xs text-gray-400">Menampilkan {sampleShown} dari {totalDisplay} pegawai. Data lengkap tersedia setelah integrasi sistem.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

// ─── Paket Detail Page ───────────────────────────────────────────────────────────

function PaketDetailPage({
  paket, berkasList, onBuatNotaDinas, onBack,
}: {
  paket: PaketKonsolidasi;
  berkasList: BerkasUsulan[];
  onBuatNotaDinas: () => void;
  onBack: () => void;
}) {
  const [expandedBerkas, setExpandedBerkas] = useState<Set<string>>(new Set(paket.berkasIds));
  const berkasInPaket = berkasList.filter(b => paket.berkasIds.includes(b.id));
  const totalPegawai  = berkasInPaket.reduce((sum, b) => sum + resolveKandidatForBerkas(b).length, 0);

  const toggleBerkas = (id: string) => {
    setExpandedBerkas(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Siap Kirim
      </button>

      {/* Paket header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 flex items-start gap-4" style={{ background: '#162D54' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Package size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-base">{paket.namaPaket}</p>
            <p className="text-white/70 text-xs mt-0.5">{paket.nomorPaket} · Dibuat {paket.tanggalDibuat}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-semibold text-white bg-white/20 px-2.5 py-0.5 rounded-full">{paket.jumlahBerkas} Berkas Usulan</span>
              <span className="text-[10px] font-semibold text-white bg-white/20 px-2.5 py-0.5 rounded-full">{totalPegawai} Pegawai</span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                paket.status === 'Terkirim' ? 'bg-green-500 text-white' : paket.status === 'Siap TTE' ? 'bg-amber-500 text-white' : 'bg-blue-400 text-white'
              }`}>{paket.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hierarchy tree */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Hierarki Paket Konsolidasi</h4>
            <p className="text-xs text-gray-500 mt-0.5">{paket.jumlahBerkas} berkas usulan · {totalPegawai} pegawai tercakup</p>
          </div>
          <button
            onClick={() => setExpandedBerkas(expandedBerkas.size === berkasInPaket.length ? new Set() : new Set(paket.berkasIds))}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            {expandedBerkas.size === berkasInPaket.length ? 'Tutup Semua' : 'Buka Semua'}
          </button>
        </div>

        <div className="p-5 space-y-3">
          {berkasInPaket.map((b, bIdx) => {
            const pegawaiList = resolveKandidatForBerkas(b);
            const isLast = bIdx === berkasInPaket.length - 1;
            const expanded = expandedBerkas.has(b.id);

            return (
              <div key={b.id} className="flex gap-3">
                {/* Tree lines */}
                <div className="flex flex-col items-center w-5 shrink-0">
                  <div className="w-0.5 bg-gray-200 flex-1 mt-2" style={{ minHeight: 12 }} />
                  {!isLast && <div className="w-0.5 bg-gray-200 flex-1" />}
                </div>

                {/* Berkas card */}
                <div className="flex-1 min-w-0 pb-2">
                  <button
                    onClick={() => toggleBerkas(b.id)}
                    className="w-full flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-left hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                      <FileText size={15} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-blue-900">{b.namaBerkas}</p>
                      <p className="text-[10px] text-blue-600">{b.nomorUsulan} · {b.satkerPengusul}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-semibold text-white px-2 py-0.5 rounded-full" style={{ background: JENIS_COLOR[b.jenis] }}>{b.jenis}</span>
                      <span className="text-[10px] text-blue-600 font-semibold">{pegawaiList.length} pegawai</span>
                      <ChevronRight size={14} className={`text-blue-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Pegawai rows */}
                  {expanded && pegawaiList.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1">
                      {pegawaiList.map((p, pIdx) => {
                        const isLastP = pIdx === pegawaiList.length - 1;
                        return (
                          <div key={p.id} className="flex gap-3">
                            <div className="flex flex-col items-center w-4 shrink-0">
                              <div className="w-0.5 bg-gray-200 flex-1" />
                              {!isLastP && <div className="w-0.5 bg-gray-200 flex-1" />}
                            </div>
                            <div className="flex items-center gap-3 flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 mb-1">
                              <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-600">
                                {p.nama.split(' ').map(w => w[0]).slice(0, 2).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-800 truncate">{p.nama}</p>
                                <p className="text-[10px] text-gray-400">{p.nip} · {p.jabatan}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white" style={{ background: getKasusColor(p.jenisKasus) }}>
                                  {getKasusLabel(p.jenisKasus)}
                                </span>
                                <span className="text-[9px] text-gray-400 whitespace-nowrap">{p.tanggalBUP}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {b.jumlahPegawai > pegawaiList.length && (
                        <p className="text-[10px] text-gray-400 ml-7 py-1">+{b.jumlahPegawai - pegawaiList.length} pegawai lainnya (data lengkap setelah integrasi sistem)</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action */}
      {paket.status === 'Draft ND' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Langkah Selanjutnya: Buat Nota Dinas</p>
              <p className="text-xs text-blue-600 mt-0.5">Buat nota dinas berisi daftar pegawai untuk dikirimkan ke Biro SDM.</p>
            </div>
          </div>
          <button
            onClick={onBuatNotaDinas}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#162d54] hover:bg-[#1e3a8a] transition-colors shrink-0 ml-4"
          >
            <FileText size={14} /> Buat Nota Dinas
          </button>
        </div>
      )}
      {paket.status === 'Siap TTE' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Stamp size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Nota Dinas Siap Ditandatangani</p>
              <p className="text-xs text-amber-700 mt-0.5">Lakukan TTE untuk mengirimkan nota dinas ke Biro SDM.</p>
            </div>
          </div>
          <button
            onClick={onBuatNotaDinas}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shrink-0 ml-4"
          >
            <Stamp size={14} /> Lanjut ke TTE
          </button>
        </div>
      )}
      {paket.status === 'Terkirim' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <Check size={18} className="text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Paket Telah Dikirim ke Biro SDM</p>
            <p className="text-xs text-green-600 mt-0.5">Proses dilanjutkan di Flow 6: Verifikasi &amp; Penetapan SK.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Nota Dinas Form ─────────────────────────────────────────────────────────────

function NotaDinasPage({
  paket, berkasList, onSubmit, onBack,
}: {
  paket: PaketKonsolidasi;
  berkasList: BerkasUsulan[];
  onSubmit: (nd: { nomor: string; perihal: string; tanggal: string }) => void;
  onBack: () => void;
}) {
  const [nomor, setNomor]   = useState(`ND-BUP/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`);
  const [perihal, setPerihal] = useState(`Penyampaian Usulan Pemberhentian PNS — ${paket.namaPaket}`);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);

  const berkasInPaket = berkasList.filter(b => paket.berkasIds.includes(b.id));
  const allPegawai = berkasInPaket.flatMap(b => resolveKandidatForBerkas(b).map(p => ({ ...p, berkas: b })));

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Detail Paket
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#162d54] flex items-center justify-center shrink-0">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Generate Nota Dinas ke Biro SDM</p>
            <p className="text-xs text-gray-500 mt-0.5">Nota dinas akan dikirimkan ke Biro SDM beserta daftar {allPegawai.length} pegawai dari {paket.jumlahBerkas} berkas usulan.</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Nomor Nota Dinas</label>
            <input
              value={nomor}
              onChange={e => setNomor(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Perihal</label>
            <input
              value={perihal}
              onChange={e => setPerihal(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Preview daftar pegawai */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">Lampiran: Daftar Pegawai ({allPegawai.length} orang)</p>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 grid grid-cols-12 gap-3">
              <p className="col-span-1 text-[10px] font-semibold text-gray-500">No.</p>
              <p className="col-span-4 text-[10px] font-semibold text-gray-500">Nama / NIP</p>
              <p className="col-span-3 text-[10px] font-semibold text-gray-500">Jabatan / Satker</p>
              <p className="col-span-2 text-[10px] font-semibold text-gray-500">Jenis</p>
              <p className="col-span-2 text-[10px] font-semibold text-gray-500">Berkas Usulan</p>
            </div>
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {allPegawai.map((p, idx) => (
                <div key={p.id} className="grid grid-cols-12 gap-3 px-4 py-2.5 hover:bg-gray-50">
                  <p className="col-span-1 text-xs text-gray-400">{idx + 1}</p>
                  <div className="col-span-4">
                    <p className="text-xs font-semibold text-gray-800">{p.nama}</p>
                    <p className="text-[10px] text-gray-400">{p.nip}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-gray-700 truncate">{p.jabatan}</p>
                    <p className="text-[10px] text-gray-400 truncate">{p.satker}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white" style={{ background: getKasusColor(p.jenisKasus) }}>
                      {getKasusLabel(p.jenisKasus)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-500 truncate">{p.berkas.nomorUsulan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={onBack} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Batal</button>
          <button
            onClick={() => onSubmit({ nomor, perihal, tanggal })}
            disabled={!nomor || !perihal || !tanggal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#162d54] hover:bg-[#1e3a8a] transition-colors ml-auto disabled:opacity-50"
          >
            <FileText size={14} /> Generate Nota Dinas &amp; Lanjut ke TTE
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TTE Page ────────────────────────────────────────────────────────────────────

function TTEPage({
  paket, berkasList, onSign, onBack,
}: {
  paket: PaketKonsolidasi;
  berkasList: BerkasUsulan[];
  onSign: () => void;
  onBack: () => void;
}) {
  const [signed, setSigned] = useState(false);
  const berkasInPaket = berkasList.filter(b => paket.berkasIds.includes(b.id));
  const allPegawai = berkasInPaket.flatMap(b => resolveKandidatForBerkas(b));
  const nd = paket.notaDinas;

  const handleSign = () => {
    setSigned(true);
    setTimeout(onSign, 1500);
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Detail Paket
      </button>

      {/* Document preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3" style={{ background: '#162D54' }}>
          <Stamp size={20} className="text-white" />
          <div>
            <p className="text-white font-semibold">Tanda Tangan Elektronik — Nota Dinas</p>
            <p className="text-white/70 text-xs">{nd?.nomor} · {nd?.tanggal}</p>
          </div>
        </div>

        {/* Nota Dinas preview */}
        <div className="p-8 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto shadow-sm space-y-6 font-serif">
            <div className="text-center border-b-2 border-gray-800 pb-4">
              <p className="font-bold text-sm">KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</p>
              <p className="text-xs text-gray-600">UNIT SDM ESELON I</p>
            </div>
            <div>
              <p className="text-xs font-semibold">NOTA DINAS</p>
              <p className="text-xs text-gray-700 mt-1">Nomor: {nd?.nomor}</p>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-700">
              {[
                ['Kepada', 'Kepala Biro SDM Kemenkeu'],
                ['Dari', 'Kepala Unit SDM UE1'],
                ['Tanggal', nd?.tanggal ?? '-'],
                ['Perihal', nd?.perihal ?? '-'],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <p className="font-semibold">{k}</p>
                  <p>: {v}</p>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-700 leading-relaxed space-y-2">
              <p>Dengan hormat, bersama ini kami sampaikan usulan pemberhentian Pegawai Negeri Sipil yang telah memenuhi syarat berdasarkan ketentuan yang berlaku.</p>
              <p>Daftar pegawai yang diusulkan sebanyak <strong>{allPegawai.length} orang</strong> terlampir dalam nota dinas ini.</p>
              <p>Demikian disampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
            </div>
            <div className="text-right text-xs text-gray-700 pt-4">
              <p>Jakarta, {nd?.tanggal ?? '-'}</p>
              <p className="mt-1">Kepala Unit SDM UE1,</p>
              {signed ? (
                <div className="mt-3 inline-block border-2 border-blue-500 rounded-lg px-4 py-2 bg-blue-50">
                  <p className="text-blue-700 font-bold text-sm">✓ Ditandatangani Elektronik</p>
                  <p className="text-blue-500 text-[10px]">Hadi Purnomo · {new Date().toLocaleDateString('id-ID')}</p>
                </div>
              ) : (
                <div className="mt-3 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-[10px] text-gray-400">Ruang Tanda Tangan Elektronik</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">{allPegawai.length} pegawai tercakup · {paket.jumlahBerkas} berkas usulan</p>
          {!signed ? (
            <button
              onClick={handleSign}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              <Stamp size={14} /> Tanda Tangani &amp; Kirim ke Biro SDM
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <Check size={16} /> Mengirim ke Biro SDM (Flow 6)...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────────

export function FlowBUPUe1() {
  const [tab, setTab]             = useState<'masuk' | 'siap-kirim' | 'arsip'>('masuk');
  const [view, setView]           = useState<AppView>('list');
  const [berkasList, setBerkasList] = useState<BerkasUsulan[]>(INITIAL_BERKAS);
  const [pakets, setPakets]       = useState<PaketKonsolidasi[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [selectedPaketIds, setSelectedPaketIds] = useState<string[]>([]);

  // Per-berkas per-pegawai decisions
  const [pegawaiDecisions, setPegawaiDecisions] =
    useState<Record<string, Record<string, PegawaiDecision>>>({});

  // Active items for sub-views
  const [activeBerkas, setActiveBerkas] = useState<BerkasUsulan | null>(null);
  const [activePaket, setActivePaket]   = useState<PaketKonsolidasi | null>(null);

  // Filters
  const [search, setSearch]         = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tanggalFilter, setTanggalFilter] = useState('');

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Derived lists
  const masukList = berkasList.filter(b =>
    (b.status === 'Diajukan ke UE1' || b.status === 'Review UE1' || b.status === 'Perlu Revisi Satker') &&
    (!jenisFilter || b.jenis === jenisFilter) &&
    (!statusFilter || b.status === statusFilter) &&
    (!search || b.nomorUsulan.toLowerCase().includes(search.toLowerCase()) || b.namaBerkas.toLowerCase().includes(search.toLowerCase()))
  );
  const arsipList      = berkasList.filter(b => b.status === 'Diterima UE1' || b.status === 'Review Biro SDM' || b.status === 'SK Terbit');
  const draftNdPakets  = pakets.filter(p => p.status === 'Draft ND');
  const siapTtePakets  = pakets.filter(p => p.status === 'Siap TTE');
  const terkirimPakets = pakets.filter(p => p.status === 'Terkirim');
  const siapKirimTotal = draftNdPakets.length + siapTtePakets.length;

  // Berkas masuk checkboxes
  const allChecked = masukList.length > 0 && masukList.every(b => checkedIds.has(b.id));
  const toggleAll  = () => setCheckedIds(allChecked ? new Set() : new Set(masukList.map(b => b.id)));
  const toggleOne  = (id: string) => { const s = new Set(checkedIds); s.has(id) ? s.delete(id) : s.add(id); setCheckedIds(s); };
  const selectedCount = [...checkedIds].filter(id => masukList.some(b => b.id === id)).length;

  // Paket checkboxes (siap kirim)
  const siapKirimPakets = [...draftNdPakets, ...siapTtePakets];
  const allPaketChecked = siapKirimPakets.length > 0 && siapKirimPakets.every(p => selectedPaketIds.includes(p.id));
  const togglePaket = (id: string) => setSelectedPaketIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAllPaket = () => setSelectedPaketIds(allPaketChecked ? [] : siapKirimPakets.map(p => p.id));

  // Actions
  const handleSetujuSemua = (id: string) => {
    setBerkasList(prev => prev.map(b => b.id === id ? { ...b, status: 'Diterima UE1' as StatusUsulan } : b));
    setCheckedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    showToast('Semua pegawai dalam berkas disetujui.');
  };

  const handleBuatPaket = () => {
    const selected = berkasList.filter(b => checkedIds.has(b.id));
    if (!selected.length) return;
    const idx = pakets.length + 1;
    const newPaket: PaketKonsolidasi = {
      id: `paket-${Date.now()}`,
      nomorPaket: `PKT-${new Date().getFullYear()}-${String(idx).padStart(3, '0')}`,
      namaPaket: `Paket Konsolidasi ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      jumlahBerkas: selected.length,
      jumlahPegawai: selected.reduce((sum, b) => sum + b.jumlahPegawai, 0),
      berkasIds: selected.map(b => b.id),
      tanggalDibuat: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Draft ND',
    };
    setPakets(prev => [newPaket, ...prev]);
    setCheckedIds(new Set());
    setTab('siap-kirim');
    showToast(`Paket "${newPaket.namaPaket}" berhasil dibuat.`);
  };

  const handleTambahKePaket = (berkasId: string, paketId: string) => {
    const berkas = berkasList.find(b => b.id === berkasId);
    if (!berkas) return;
    setPakets(prev => prev.map(p => p.id === paketId
      ? { ...p, jumlahBerkas: p.jumlahBerkas + 1, jumlahPegawai: p.jumlahPegawai + berkas.jumlahPegawai, berkasIds: [...p.berkasIds, berkasId] }
      : p
    ));
    showToast('Berkas ditambahkan ke paket konsolidasi.');
  };

  const handlePegawaiDecision = (berkasId: string, pegawaiId: string, d: PegawaiDecision) => {
    setPegawaiDecisions(prev => ({
      ...prev,
      [berkasId]: { ...(prev[berkasId] ?? {}), [pegawaiId]: d },
    }));
  };

  const handleNotaDinasSubmit = (nd: { nomor: string; perihal: string; tanggal: string }) => {
    if (!activePaket) return;
    setPakets(prev => prev.map(p => p.id === activePaket.id ? { ...p, status: 'Siap TTE', notaDinas: nd } : p));
    setActivePaket(prev => prev ? { ...prev, status: 'Siap TTE', notaDinas: nd } : null);
    setView('tte');
    showToast('Nota dinas berhasil digenerate.', 'info');
  };

  const handleTTE = () => {
    if (!activePaket) return;
    setPakets(prev => prev.map(p => p.id === activePaket.id ? { ...p, status: 'Terkirim' } : p));
    setActivePaket(null);
    setView('list');
    setTab('arsip');
    showToast('Paket berhasil ditandatangani dan dikirim ke Biro SDM (Flow 6).', 'info');
  };

  // ── Sub-views ──────────────────────────────────────────────────────────────

  if (view === 'berkas-detail' && activeBerkas) {
    return (
      <div className="p-6">
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        <BerkasDetailPage
          berkas={activeBerkas}
          pegawaiDecisions={pegawaiDecisions[activeBerkas.id] ?? {}}
          onDecisionChange={(pgId, d) => handlePegawaiDecision(activeBerkas.id, pgId, d)}
          onBack={() => { setActiveBerkas(null); setView('list'); }}
        />
      </div>
    );
  }

  if (view === 'paket-detail' && activePaket) {
    const latestPaket = pakets.find(p => p.id === activePaket.id) ?? activePaket;
    return (
      <div className="p-6">
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        <PaketDetailPage
          paket={latestPaket}
          berkasList={berkasList}
          onBuatNotaDinas={() => setView(latestPaket.status === 'Siap TTE' ? 'tte' : 'nota-dinas')}
          onBack={() => { setActivePaket(null); setView('list'); setTab('siap-kirim'); }}
        />
      </div>
    );
  }

  if (view === 'nota-dinas' && activePaket) {
    const latestPaket = pakets.find(p => p.id === activePaket.id) ?? activePaket;
    return (
      <div className="p-6">
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        <NotaDinasPage
          paket={latestPaket}
          berkasList={berkasList}
          onSubmit={handleNotaDinasSubmit}
          onBack={() => setView('paket-detail')}
        />
      </div>
    );
  }

  if (view === 'tte' && activePaket) {
    const latestPaket = pakets.find(p => p.id === activePaket.id) ?? activePaket;
    return (
      <div className="p-6">
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        <TTEPage
          paket={latestPaket}
          berkasList={berkasList}
          onSign={handleTTE}
          onBack={() => setView('paket-detail')}
        />
      </div>
    );
  }

  // ── Main list view ─────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-5 relative">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Info banner */}
      <div className="bg-blue-50 border border-[#bedbff] rounded-2xl p-4 flex gap-3">
        <div className="mt-0.5 shrink-0">
          <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
            <path d={svgPaths.pd2eb480} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p19685c00} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p226d9800} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2a5062c0} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#193cb8]">Usulan Pemberhentian — BUP, Meninggal, Uzur</p>
          <p className="text-xs text-[#155dfc] mt-0.5">Kelola usulan pemberhentian dan buat berkas konsolidasi usulan untuk diajukan ke Biro SDM Kemenkeu.</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-[#f3f4f6] flex gap-1 h-12 items-start p-1 rounded-2xl w-fit">
        {([
          { key: 'masuk',      label: 'Berkas Usulan Masuk', count: masukList.length,  countBg: 'bg-blue-100 text-blue-700' },
          { key: 'siap-kirim', label: 'Siap Kirim',          count: siapKirimTotal,    countBg: 'bg-green-100 text-green-700' },
          { key: 'arsip',      label: 'Arsip',               count: arsipList.length + terkirimPakets.length, countBg: 'bg-gray-200 text-gray-600' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 h-full px-4 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-white text-[#1e2939] shadow-sm' : 'text-[#6a7282] hover:text-gray-800'}`}
          >
            {t.label}
            <span className={`text-[10px] px-1.5 py-px rounded-full font-semibold ${t.countBg}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── TAB: BERKAS USULAN MASUK ──────────────────────────────────────────── */}
      {tab === 'masuk' && (
        <>
          {/* Filter */}
          <div className="bg-white border border-[#f3f4f6] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1e2939]">Filter Berkas Usulan</p>
              <button onClick={() => { setSearch(''); setJenisFilter(''); setStatusFilter(''); setTanggalFilter(''); }} className="text-xs font-semibold text-blue-600 hover:underline">Reset</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="text-xs font-semibold text-[#4a5565] block mb-1.5">Pencarian</label>
                <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl px-3 py-2">
                  <Search size={14} className="text-[#99a1af] shrink-0" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nomor usulan, nama berkas..." className="bg-transparent text-xs text-gray-700 flex-1 outline-none placeholder-[#99a1af]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4a5565] block mb-1.5">Jenis</label>
                <div className="relative">
                  <select value={jenisFilter} onChange={e => setJenisFilter(e.target.value)} className="w-full appearance-none bg-white border border-[#e5e7eb] rounded-2xl px-3 py-2 text-xs text-gray-700 outline-none pr-7">
                    <option value="">Semua</option><option value="BUP">BUP</option><option value="Uzur">Uzur</option><option value="Meninggal">Meninggal</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4a5565] block mb-1.5">Status</label>
                <div className="relative">
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full appearance-none bg-white border border-[#e5e7eb] rounded-2xl px-3 py-2 text-xs text-gray-700 outline-none pr-7">
                    <option value="">Semua</option><option value="Diajukan ke UE1">Diajukan ke UE1</option><option value="Review UE1">Review UE1</option><option value="Perlu Revisi Satker">Perlu Revisi Satker</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4a5565] block mb-1.5">Tanggal Dibuat</label>
                <input type="date" value={tanggalFilter} onChange={e => setTanggalFilter(e.target.value)} className="w-full bg-white border border-[#e5e7eb] rounded-2xl px-3 py-2 text-xs text-gray-700 outline-none" />
              </div>
            </div>
          </div>

          {/* Bulk action */}
          {selectedCount > 0 && (
            <div className="bg-[#162d54] rounded-2xl px-4 py-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{selectedCount} Usulan dipilih</p>
              <div className="flex items-center gap-3">
                <button onClick={handleBuatPaket} className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                  <svg className="size-3.5" fill="none" viewBox="0 0 14 14">
                    <path d="M9.33333 9.33333H12.8333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                    <path d="M11.0833 7.58333V11.0833" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                    <path d={svgPaths.p14ed2380} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                    <path d="M4.375 2.49083L9.625 5.495" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                    <path d={svgPaths.p21a6a770} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                    <path d="M7 12.8333V7" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                  </svg>
                  Buat Paket Konsolidasi
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                  <Download size={14} /> Export Excel
                </button>
              </div>
            </div>
          )}

          <div>
            <p className="text-lg font-semibold text-[#1e2939]">Berkas Usulan Masuk</p>
            <p className="text-xs text-[#6a7282] mt-0.5">{masukList.length} berkas aktif</p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#f3f4f6] shadow-sm overflow-hidden">
            <div className="bg-[#f9fafb] border-b border-[#f3f4f6] px-4 py-3 flex items-center gap-6">
              <div className="w-8 flex items-center">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
              </div>
              <p className="text-xs font-semibold text-[#6a7282] w-32">Nomor Usulan</p>
              <p className="text-xs font-semibold text-[#6a7282] w-28 text-center">Nama Berkas</p>
              <p className="text-xs font-semibold text-[#6a7282] w-36 text-center">Satker Pengusul</p>
              <p className="text-xs font-semibold text-[#6a7282] w-16 text-center">Jenis</p>
              <p className="text-xs font-semibold text-[#6a7282] w-32 text-center">Jumlah Pegawai</p>
              <p className="text-xs font-semibold text-[#6a7282] w-36 text-center">Status</p>
              <p className="text-xs font-semibold text-[#6a7282] flex-1 text-center">Catatan</p>
              <p className="text-xs font-semibold text-[#6a7282] w-8 text-center">Aksi</p>
            </div>
            {masukList.length === 0 ? (
              <div className="py-12 text-center"><FileText size={32} className="text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">Tidak ada berkas ditemukan.</p></div>
            ) : masukList.map((b, idx) => (
              <div key={b.id} className={`flex items-center gap-6 px-4 py-3 ${idx < masukList.length - 1 ? 'border-b border-[#f9fafb]' : ''} ${checkedIds.has(b.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="w-8 flex items-center">
                  <input type="checkbox" checked={checkedIds.has(b.id)} onChange={() => toggleOne(b.id)} className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
                </div>
                <div className="w-32 shrink-0">
                  <p className="text-xs font-semibold text-[#1e2939]">{b.nomorUsulan}</p>
                  <p className="text-[10px] text-[#99a1af]">{b.tanggalDibuat}</p>
                </div>
                <div className="w-28 text-center"><p className="text-xs text-[#364153]">{b.namaBerkas}</p></div>
                <div className="w-36 text-center"><p className="text-xs text-[#364153]">{b.satkerPengusul}</p></div>
                <div className="w-16 flex justify-center">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: JENIS_COLOR[b.jenis] }}>{b.jenis}</span>
                </div>
                <div className="w-32 px-2">
                  <p className="text-xs font-semibold text-[#1e2939]">{b.jumlahPegawai} pegawai</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[9px] font-semibold text-green-600">✓ {b.lengkap} lengkap</span>
                    {b.belumLengkap > 0 && <span className="text-[9px] font-semibold text-red-500">⚠ {b.belumLengkap} belum</span>}
                  </div>
                </div>
                <div className="w-36 flex justify-center">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: statusUsulanColor(b.status) }}>{b.status}</span>
                </div>
                <div className="flex-1 text-center"><p className="text-[10px] text-[#99a1af]">{b.catatan || '—'}</p></div>
                <div className="w-8 flex justify-center">
                  <RowMenu
                    berkas={b} pakets={pakets}
                    onDetail={() => { setActiveBerkas(b); setView('berkas-detail'); }}
                    onSetujuSemua={() => handleSetujuSemua(b.id)}
                    onTambahKePaket={(paketId) => handleTambahKePaket(b.id, paketId)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB: SIAP KIRIM ────────────────────────────────────────────────────── */}
      {tab === 'siap-kirim' && (
        <div className="space-y-5">
          {selectedPaketIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-800">{selectedPaketIds.length} paket dipilih</p>
                <p className="text-xs text-blue-600 mt-0.5">Pilih aksi untuk paket yang dipilih</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedPaketIds([])} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-white">Batal Pilih</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Paket Konsolidasi — Siap Kirim ke Biro SDM</h3>
                <p className="text-xs text-gray-500 mt-0.5">{siapKirimTotal} paket dalam proses</p>
              </div>
              {siapKirimPakets.length > 0 && (
                <button onClick={toggleAllPaket} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  {allPaketChecked ? 'Batalkan Semua' : 'Pilih Semua'}
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left"><input type="checkbox" checked={allPaketChecked && siapKirimPakets.length > 0} onChange={toggleAllPaket} className="rounded border-gray-300 accent-blue-600" /></th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">No.</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">Nomor Paket</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">Nama Paket</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">Berkas</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">Pegawai</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">Tanggal</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {siapKirimPakets.length === 0 ? (
                    <tr><td colSpan={9} className="py-16 text-center">
                      <Package size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-500">Belum ada paket konsolidasi</p>
                      <button onClick={() => setTab('masuk')} className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50">Ke Berkas Usulan Masuk</button>
                    </td></tr>
                  ) : siapKirimPakets.map((p, idx) => (
                    <tr key={p.id} className={`transition-colors ${selectedPaketIds.includes(p.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3"><input type="checkbox" checked={selectedPaketIds.includes(p.id)} onChange={() => togglePaket(p.id)} className="rounded border-gray-300 accent-blue-600" /></td>
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{p.nomorPaket}</td>
                      <td className="px-4 py-3 text-gray-700">{p.namaPaket}</td>
                      <td className="px-4 py-3 text-gray-700">{p.jumlahBerkas} berkas</td>
                      <td className="px-4 py-3 text-gray-700">{p.jumlahPegawai} pegawai</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.tanggalDibuat}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === 'Siap TTE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setActivePaket(p); setView('paket-detail'); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            <Eye size={11} /> Detail
                          </button>
                          <button
                            onClick={() => { setActivePaket(p); setView(p.status === 'Siap TTE' ? 'tte' : 'nota-dinas'); }}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-colors ${p.status === 'Siap TTE' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#162d54] hover:bg-[#1e3a8a]'}`}
                          >
                            {p.status === 'Siap TTE' ? <><Stamp size={11} /> TTE</> : <><FileText size={11} /> Buat ND</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {siapKirimPakets.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Menampilkan {siapKirimPakets.length} paket dalam proses</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: ARSIP ─────────────────────────────────────────────────────────── */}
      {tab === 'arsip' && (
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-[#1e2939]">Arsip</p>
            <p className="text-xs text-[#6a7282] mt-0.5">{arsipList.length + terkirimPakets.length} item telah diproses</p>
          </div>

          {arsipList.length === 0 && terkirimPakets.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
              <FileText size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">Arsip masih kosong</p>
            </div>
          ) : (
            <>
              {terkirimPakets.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800">Paket Konsolidasi Terkirim ke Biro SDM</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{terkirimPakets.length} paket · dilanjutkan ke Flow 6</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">No.</th>
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">Nomor Paket</th>
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">Nama Paket</th>
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">Berkas</th>
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">Pegawai</th>
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">Tanggal</th>
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {terkirimPakets.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold text-gray-800">{p.nomorPaket}</td>
                            <td className="px-4 py-3 text-gray-700">{p.namaPaket}</td>
                            <td className="px-4 py-3 text-gray-700">{p.jumlahBerkas} berkas</td>
                            <td className="px-4 py-3 text-gray-700">{p.jumlahPegawai} pegawai</td>
                            <td className="px-4 py-3 text-gray-600">{p.tanggalDibuat}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                                <Check size={9} /> {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => { setActivePaket(p); setView('paket-detail'); }} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                                <Eye size={12} /> Lihat
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {arsipList.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800">Berkas Usulan Selesai</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{arsipList.length} berkas</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {arsipList.map(b => (
                      <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-800">{b.namaBerkas}</p>
                          <p className="text-[10px] text-gray-400">{b.nomorUsulan} · {b.satkerPengusul} · {b.tanggalDibuat}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: statusUsulanColor(b.status) }}>{b.status}</span>
                        <button onClick={() => { setActiveBerkas(b); setView('berkas-detail'); }} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
                          <Eye size={12} /> Lihat
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
