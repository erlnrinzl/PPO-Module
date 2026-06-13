import { useState } from 'react';
import { Search, X, Check, AlertCircle, Clock, MapPin, Phone, Plus, ChevronRight, UserX, ArrowLeft } from 'lucide-react';
import type { Role } from '../App';
// import { MOCK_PEGAWAI, getStatusColor, type Pegawai, type StatusProses } from '../data/mockData';
import { WorkflowStepper, type Step } from './WorkflowStepper';
import { BerkasSection, type BerkasFile } from './BerkasSection';
import { MiniDashboard } from './MiniDashboard';

import { getStatusColor, getKasusColor, getKasusLabel, getSisaBulanColor, getSisaBulanLabel  } from '../utils/case.util';
import { type Pegawai, StatusProses } from '../types/employee.types';
import { MOCK_PEGAWAI } from '../data/mockData';


const BERKAS_HILANG: BerkasFile[] = [
  { id: 'h1', nama: 'Laporan Kepolisian (Kehilangan)', tipe: 'PDF', tanggal: '30 Mar 2024', ukuran: '298 KB', status: 'uploaded' },
  { id: 'h2', nama: 'Surat Keterangan RT/RW/Lurah', tipe: 'PDF', tanggal: '30 Mar 2024', ukuran: '144 KB', status: 'uploaded' },
  { id: 'h3', nama: 'SK Pengangkatan Terakhir', tipe: 'PDF', tanggal: '31 Mar 2024', ukuran: '365 KB', status: 'uploaded' },
  { id: 'h4', nama: 'Fotokopi KTP Pegawai', tipe: 'JPG', tanggal: '29 Mar 2024', ukuran: '76 KB', status: 'uploaded' },
  { id: 'h5', nama: 'Fotokopi Kartu Keluarga', tipe: 'PDF', tanggal: '-', ukuran: '-', status: 'pending' },
  { id: 'h6', nama: 'Foto Terbaru Pegawai', tipe: 'JPG', tanggal: '29 Mar 2024', ukuran: '120 KB', status: 'uploaded' },
];

const STEPS_HILANG: Step[] = [
  { id: 1, label: 'Monitoring', actor: 'SDM Satker/UE1' },
  { id: 2, label: 'Isi Form Hilang', actor: 'SDM Satker/UE1' },
  { id: 3, label: 'Verifikasi Dokumen', actor: 'SDM Satker/UE1' },
  { id: 4, label: 'Review Biro SDM', actor: 'Biro SDM' },
];

const DATA = MOCK_PEGAWAI.filter(p => p.jenisKasus === 'Hilang' || p.jenisKasus === 'Ditemukan');

interface HilangFormProps {
  pegawai: Pegawai;
  role: Role;
  onClose: () => void;
  isArchived?: boolean;
}

function HilangForm({ pegawai, role, onClose, isArchived = false }: HilangFormProps) {
  const [formData, setFormData] = useState({
    tanggalHilang: isArchived ? '2023-02-15' : '2024-03-28',
    terakhirTerlihat: 'Kantor KPPN Bogor, Jl. Veteran No. 45',
    kondisiTerakhir: 'Normal, masuk kerja seperti biasa. Tidak ada tanda-tanda akan meninggalkan kantor.',
    kontakKeluarga: '081234567890',
    sudahDilaporkan: true,
    nomorLaporan: isArchived ? 'LP/234/II/2023/Polresta Bogor' : 'LP/456/IV/2024/Polresta Bogor',
  });
  const [status, setStatus] = useState<'hilang' | 'ditemukan'>(isArchived ? 'ditemukan' : 'hilang');
  const canEdit = !isArchived && (role === 'sdm-satker' || role === 'sdm-ue1');
  const canVerify = !isArchived && role === 'biro-sdm';

  const hariHilang = 70;

  const getCurrentStep = () => {
    if (role === 'sdm-satker' || role === 'sdm-ue1') return 2;
    if (role === 'biro-sdm') return 4;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="p-6 space-y-5">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Kasus
      </button>

      {/* Header Card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1F2937' }}>
        <div className="px-6 py-4">
          <p className="text-white font-semibold">{pegawai.nama}</p>
          <p className="text-white/60 text-xs">{pegawai.nip} · {pegawai.jabatan} · {pegawai.satker}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] bg-gray-600 text-white px-2 py-0.5 rounded-full">
              {status === 'hilang' ? `HILANG ${hariHilang} Hari` : 'DITEMUKAN'}
            </span>
            <span className="text-[10px] text-white/60">{pegawai.nomorKasus}</span>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
        <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 5: Hilang/Ditemukan)</p>
        <WorkflowStepper steps={STEPS_HILANG} currentStep={currentStep} />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
        <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-700">Status: Pegawai Dinyatakan Hilang</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Timer 12 bulan berjalan. Timer otomatis dimulai sejak tanggal ditetapkan hilang.
            Jika pegawai tidak ditemukan dalam 12 bulan, akan diproses pemberhentian.
          </p>
        </div>
      </div>

      {/* Status toggle */}
      {canEdit && (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">Update Status Pegawai</p>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus('hilang')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${status === 'hilang' ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-500 border-gray-200 hover:border-gray-400'}`}
            >
              Masih Hilang
            </button>
            <button
              onClick={() => setStatus('ditemukan')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${status === 'ditemukan' ? 'bg-green-600 text-white border-green-600' : 'text-gray-500 border-gray-200 hover:border-green-400'}`}
            >
              Ditemukan / Kembali
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-sm font-semibold text-gray-700">Data Kejadian Hilang</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">
              <Clock size={11} className="inline mr-1" />
              Tanggal Hilang
            </label>
            <input
              type="date"
              value={formData.tanggalHilang}
              onChange={e => setFormData(f => ({ ...f, tanggalHilang: e.target.value }))}
              disabled={!canEdit}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">
              <Phone size={11} className="inline mr-1" />
              Kontak Keluarga
            </label>
            <input
              value={formData.kontakKeluarga}
              onChange={e => setFormData(f => ({ ...f, kontakKeluarga: e.target.value }))}
              disabled={!canEdit}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none disabled:bg-gray-50"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 font-medium block mb-1">
              <MapPin size={11} className="inline mr-1" />
              Terakhir Terlihat
            </label>
            <input
              value={formData.terakhirTerlihat}
              onChange={e => setFormData(f => ({ ...f, terakhirTerlihat: e.target.value }))}
              disabled={!canEdit}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none disabled:bg-gray-50"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 font-medium block mb-1">Kondisi Terakhir</label>
            <textarea
              value={formData.kondisiTerakhir}
              onChange={e => setFormData(f => ({ ...f, kondisiTerakhir: e.target.value }))}
              disabled={!canEdit}
              rows={3}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none resize-none disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* Laporan Polisi */}
        <div className={`p-3 rounded-xl border ${formData.sudahDilaporkan ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.sudahDilaporkan}
              onChange={e => setFormData(f => ({ ...f, sudahDilaporkan: e.target.checked }))}
              disabled={!canEdit}
            />
            <label className="text-xs font-semibold text-gray-700">Sudah dilaporkan ke Kepolisian</label>
          </div>
          {formData.sudahDilaporkan && (
            <div className="mt-2 ml-5">
              <label className="text-[10px] text-gray-500 block mb-1">Nomor Laporan Polisi</label>
              <input
                value={formData.nomorLaporan}
                onChange={e => setFormData(f => ({ ...f, nomorLaporan: e.target.value }))}
                disabled={!canEdit}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none bg-white disabled:bg-gray-50"
              />
            </div>
          )}
        </div>
      </div>

      {/* Berkas Terlampir */}
      <BerkasSection berkas={BERKAS_HILANG} canUpload={canEdit} />

      {/* Timer */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">Timer Otomatis (12 Bulan)</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(hariHilang / 365) * 100}%` }} />
          </div>
          <span className="text-xs font-semibold text-amber-600 shrink-0">{hariHilang}/365 hari</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1.5">
          Sisa {365 - hariHilang} hari sebelum otomatis diproses pemberhentian karena hilang.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
        >
          {isArchived ? 'Kembali' : 'Batal'}
        </button>
        {!isArchived && canEdit && (
          <>
            <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700">
              Simpan
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white ml-auto"
              style={{ background: '#1F2937' }}
            >
              Ajukan ke Biro SDM
            </button>
          </>
        )}
        {!isArchived && canVerify && (
          <>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600">
              <X size={13} /> Kembalikan
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 ml-auto"
            >
              <Check size={13} /> Verifikasi
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Form tambah kasus hilang baru ────────────────────────────────────────────

interface TambahKasusHilangProps {
  onClose: () => void;
  onSave: (entry: Pegawai) => void;
}

function TambahKasusHilang({ onClose, onSave }: TambahKasusHilangProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const [nipQuery, setNipQuery] = useState('');
  const [resolvedPegawai, setResolvedPegawai] = useState<Pegawai | null>(null);
  const [nipNotFound, setNipNotFound] = useState(false);
  const [manualNama, setManualNama] = useState('');
  const [manualNip, setManualNip] = useState('');
  const [satker, setSatker] = useState('');
  const [jabatan, setJabatan] = useState('');

  const [tanggalHilang, setTanggalHilang] = useState('');
  const [lokasiTerakhir, setLokasiTerakhir] = useState('');
  const [kondisiTerakhir, setKondisiTerakhir] = useState('');
  const [nomorLaporan, setNomorLaporan] = useState('');
  const [kontakKeluarga, setKontakKeluarga] = useState('');
  const [saksi1, setSaksi1] = useState('');
  const [saksi2, setSaksi2] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const lookupNIP = () => {
    const found = MOCK_PEGAWAI.find(p => p.nip === nipQuery.trim());
    if (found) {
      setResolvedPegawai(found);
      setManualNama(found.nama);
      setManualNip(found.nip);
      setSatker(found.satker);
      setJabatan(found.jabatan);
      setNipNotFound(false);
    } else {
      setResolvedPegawai(null);
      setNipNotFound(true);
      setManualNip(nipQuery.trim());
    }
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!manualNama.trim()) e.nama = 'Nama pegawai wajib diisi';
    if (!manualNip.trim()) e.nip = 'NIP pegawai wajib diisi';
    if (!satker.trim()) e.satker = 'Satker wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!tanggalHilang) e.tanggal = 'Tanggal hilang wajib diisi';
    if (!lokasiTerakhir.trim()) e.lokasi = 'Lokasi terakhir terlihat wajib diisi';
    if (!kondisiTerakhir.trim()) e.kondisi = 'Kondisi terakhir wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validateStep2()) return;
    const base = resolvedPegawai ?? {
      id: `hilang-${Date.now()}`,
      nip: manualNip,
      nama: manualNama,
      jabatan,
      unitKerja: satker,
      satker,
      eselon: '-',
      pangkatGolongan: '-',
      tmtGolongan: '-',
      tanggalLahir: '-',
      tanggalBUP: '-',
      sisaBulan: 0,
      jenisKelamin: 'L' as const,
      statusKepegawaian: 'PNS',
      jenisKasus: 'Hilang' as any,
      statusProses: 'Belum Diproses' as any,
      tahapanSaat: 1,
      totalTahapan: 4,
      nomorKasus: `PPO/HILANG/${new Date().getFullYear()}/${String(Date.now()).slice(-3)}`,
      tanggalKasus: tanggalHilang,
      keterangan: `Hilang sejak ${tanggalHilang} di ${lokasiTerakhir}`,
    };
    onSave({ ...base, jenisKasus: 'Hilang' as any, statusProses: 'Belum Diproses' as any });
    onClose();
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    `w-full text-xs border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 text-gray-700 placeholder-gray-400 ${err ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-gray-400'}`;

  return (
    <div className="p-6 space-y-5">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Kasus
      </button>

      {/* Header */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1F2937' }}>
        <div className="px-6 py-4">
          <p className="text-white font-semibold">Laporan Kasus Pegawai Hilang Baru</p>
          <p className="text-white/60 text-xs mt-0.5">Unit SDM Satker · Flow 5</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {(['Data Pegawai', 'Detail Kejadian'] as const).map((s, i) => {
          const idx = i + 1;
          const active = step === idx;
          const done = step > idx;
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? 'bg-green-500 text-white' : active ? 'text-white' : 'bg-gray-200 text-gray-400'}`}
                style={active ? { background: '#1F2937' } : {}}
              >
                {done ? <Check size={12} /> : idx}
              </div>
              <span className={`text-xs font-semibold ${active ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
              {i < 1 && <ChevronRight size={14} className="text-gray-300 ml-auto" />}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        {/* Step 1: Data Pegawai */}
        {step === 1 && (
          <>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Cari Pegawai berdasarkan NIP</label>
              <div className="flex gap-2">
                <input
                  value={nipQuery}
                  onChange={e => setNipQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && lookupNIP()}
                  placeholder="Masukkan NIP pegawai..."
                  className={inputCls()}
                />
                <button
                  onClick={lookupNIP}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0"
                  style={{ background: '#1F2937' }}
                >
                  <Search size={13} /> Cari
                </button>
              </div>
              {nipNotFound && (
                <p className="text-[10px] text-amber-600 mt-1.5 bg-amber-50 rounded-lg px-2 py-1">
                  NIP tidak ditemukan di sistem. Isi data pegawai secara manual di bawah.
                </p>
              )}
            </div>

            {resolvedPegawai && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                <Check size={16} className="text-green-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{resolvedPegawai.nama}</p>
                  <p className="text-xs text-gray-500">{resolvedPegawai.nip} · {resolvedPegawai.jabatan} · {resolvedPegawai.satker}</p>
                </div>
                <button
                  onClick={() => { setResolvedPegawai(null); setManualNama(''); setManualNip(''); setSatker(''); setJabatan(''); setNipQuery(''); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 space-y-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Pegawai</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nama Lengkap *" error={errors.nama}>
                  <input value={manualNama} onChange={e => setManualNama(e.target.value)} placeholder="Nama pegawai" className={inputCls(errors.nama)} disabled={!!resolvedPegawai} />
                </Field>
                <Field label="NIP *" error={errors.nip}>
                  <input value={manualNip} onChange={e => setManualNip(e.target.value)} placeholder="18 digit NIP" className={inputCls(errors.nip)} disabled={!!resolvedPegawai} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Satker *" error={errors.satker}>
                  <input value={satker} onChange={e => setSatker(e.target.value)} placeholder="Nama satker" className={inputCls(errors.satker)} disabled={!!resolvedPegawai} />
                </Field>
                <Field label="Jabatan">
                  <input value={jabatan} onChange={e => setJabatan(e.target.value)} placeholder="Jabatan terakhir" className={inputCls()} disabled={!!resolvedPegawai} />
                </Field>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Detail Kejadian */}
        {step === 2 && (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gray-700">
                <UserX size={15} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{manualNama}</p>
                <p className="text-xs text-gray-500">{manualNip} · {satker}</p>
              </div>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold text-white bg-gray-700">Hilang</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tanggal Hilang *" error={errors.tanggal}>
                  <input type="date" value={tanggalHilang} onChange={e => setTanggalHilang(e.target.value)} className={inputCls(errors.tanggal)} />
                </Field>
                <Field label="Kontak Keluarga">
                  <input value={kontakKeluarga} onChange={e => setKontakKeluarga(e.target.value)} placeholder="No. HP keluarga" className={inputCls()} />
                </Field>
              </div>
              <Field label="Lokasi Terakhir Terlihat *" error={errors.lokasi}>
                <input value={lokasiTerakhir} onChange={e => setLokasiTerakhir(e.target.value)} placeholder="Alamat / lokasi terakhir pegawai terlihat..." className={inputCls(errors.lokasi)} />
              </Field>
              <Field label="Kondisi Terakhir *" error={errors.kondisi}>
                <textarea
                  value={kondisiTerakhir}
                  onChange={e => setKondisiTerakhir(e.target.value)}
                  placeholder="Deskripsi kondisi pegawai terakhir kali terlihat..."
                  rows={3}
                  className={`${inputCls(errors.kondisi)} resize-none`}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="No. Laporan Polisi">
                  <input value={nomorLaporan} onChange={e => setNomorLaporan(e.target.value)} placeholder="LP/xxx/xx/xxxx/..." className={inputCls()} />
                </Field>
                <Field label="Nama Saksi 1">
                  <input value={saksi1} onChange={e => setSaksi1(e.target.value)} placeholder="Nama saksi pertama" className={inputCls()} />
                </Field>
              </div>
              <Field label="Nama Saksi 2">
                <input value={saksi2} onChange={e => setSaksi2(e.target.value)} placeholder="Nama saksi kedua (opsional)" className={inputCls()} />
              </Field>
              <Field label="Keterangan Tambahan">
                <textarea
                  value={keterangan}
                  onChange={e => setKeterangan(e.target.value)}
                  placeholder="Informasi tambahan yang relevan..."
                  rows={2}
                  className={`${inputCls()} resize-none`}
                />
              </Field>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
              <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Salinan laporan polisi dan dokumen pendukung lainnya akan diminta setelah laporan ini disimpan.
                Timer 12 bulan akan otomatis dimulai setelah kasus diterbitkan.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-3">
        {step === 1 ? (
          <>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">
              Batal
            </button>
            <button
              onClick={() => { if (validateStep1()) setStep(2); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white ml-auto"
              style={{ background: '#1F2937' }}
            >
              Selanjutnya <ChevronRight size={14} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => { setStep(1); setErrors({}); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">
              Kembali
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white ml-auto"
              style={{ background: '#1F2937' }}
            >
              <Check size={14} /> Simpan Laporan Kasus
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface FlowHilangProps { role: Role; }

export function FlowHilang({ role }: FlowHilangProps) {
  const [mainTab, setMainTab] = useState<'aktif' | 'arsip'>('aktif');
  const [selected, setSelected] = useState<Pegawai | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusProses | ''>('');
  const [satkerFilter, setSatkerFilter] = useState('');
  const [showTambahKasus, setShowTambahKasus] = useState(false);
  const [kasusData, setKasusData] = useState(DATA);

  const isSdmSatker = role === 'sdm-satker';

  const handleTambahKasus = (entry: Pegawai) => {
    setKasusData(prev => [entry, ...prev]);
  };

  const dataAktif = kasusData.filter(p => p.statusProses !== 'Selesai');
  const dataArsip = kasusData.filter(p => p.statusProses === 'Selesai');

  const filtered = ((mainTab === 'aktif' ? dataAktif : dataArsip) || []).filter(p => {
    if (!p) return false;
    const matchSearch = !search ||
      p.nama?.toLowerCase().includes(search.toLowerCase()) ||
      p.nip?.includes(search) ||
      p.satker?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.statusProses === statusFilter;
    const matchSatker = !satkerFilter || p.satker?.toLowerCase().includes(satkerFilter.toLowerCase());
    return matchSearch && matchStatus && matchSatker;
  });

  // Page: detail kasus
  if (selected) {
    return <HilangForm pegawai={selected} role={role} onClose={() => setSelected(null)} isArchived={mainTab === 'arsip'} />;
  }

  // Page: tambah kasus baru
  if (showTambahKasus) {
    return <TambahKasusHilang onClose={() => setShowTambahKasus(false)} onSave={handleTambahKasus} />;
  }

  return (
    <div className="p-6 space-y-5">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex gap-3">
        <Search size={18} className="text-gray-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-800">Alur Usulan Pegawai Hilang atau Ditemukan</p>
          <p className="text-xs text-gray-600 mt-0.5">
            Pengajuan pegawai yang dinyatakan hilang dan hilang kemudian ditemukan.
            Timer 12 bulan otomatis berjalan — jika tidak ditemukan dalam 12 bulan, diproses pemberhentian.
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
            {tab === 'aktif' ? 'Kasus Aktif' : 'Arsip'}
            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === 'aktif' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
              {tab === 'aktif' ? dataAktif.length : dataArsip.length}
            </span>
          </button>
        ))}
      </div>

      {mainTab === 'aktif' && <MiniDashboard data={dataAktif} onFilterClick={setStatusFilter} currentFilter={statusFilter as StatusProses as any} />}

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
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-800">
              {mainTab === 'aktif' ? 'Kasus Pegawai Hilang Aktif' : 'Arsip Kasus Selesai'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {filtered.length} dari {mainTab === 'aktif' ? dataAktif.length : dataArsip.length} kasus
            </p>
          </div>
          {mainTab === 'aktif' && isSdmSatker && (
            <button
              onClick={() => setShowTambahKasus(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0"
              style={{ background: '#1F2937' }}
            >
              <Plus size={14} /> Tambah Kasus
            </button>
          )}
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
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Satker</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Hilang Sejak</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Timer</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p, idx) => {
                    const statusColor = getStatusColor(p.statusProses);
                    const hariHilang = 70;
                    const sisaHari = 365 - hariHilang;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => setSelected(p)}
                      >
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">{p.nama}</p>
                          <p className="text-gray-400 mt-0.5">{p.nip}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{p.satker}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.tanggalKasus}</td>
                        <td className="px-4 py-3">
                          <p className="text-amber-600 font-medium">{hariHilang} hari</p>
                          <p className="text-gray-400 text-[10px] mt-0.5">Sisa {sisaHari} hari</p>
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
                          <button
                            onClick={e => { e.stopPropagation(); setSelected(p); }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gray-700 hover:bg-gray-800"
                          >
                            Buka
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">Menampilkan {filtered.length} dari {kasusData.length} kasus</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
