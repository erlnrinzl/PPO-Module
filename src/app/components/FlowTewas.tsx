import { useState } from 'react';
import { HeartCrack, FileText, Send, X, Check, AlertCircle, ExternalLink, Search, Plus, ChevronRight } from 'lucide-react';
import type { Role } from '../App';
// import { MOCK_PEGAWAI, getStatusColor, type Pegawai, type StatusProses } from '../data/mockData';
import { getStatusColor, getKasusColor, getKasusLabel, getSisaBulanColor, getSisaBulanLabel  } from '../utils/case.util';
import { type Pegawai, StatusProses } from '../types/employee.types';
import { MOCK_PEGAWAI } from '../data/mockData';


import { WorkflowStepper, type Step } from './WorkflowStepper';
import { BerkasSection, type BerkasFile } from './BerkasSection';
import { MiniDashboard } from './MiniDashboard';

const BERKAS_TEWAS: BerkasFile[] = [
  { id: 't1', nama: 'Surat Keterangan Meninggal (Instansi)', tipe: 'PDF', tanggal: '02 Apr 2024', ukuran: '210 KB', status: 'uploaded' },
  { id: 't2', nama: 'Surat Keterangan Kematian (Kepala Desa/Lurah)', tipe: 'PDF', tanggal: '02 Apr 2024', ukuran: '175 KB', status: 'uploaded' },
  { id: 't3', nama: 'Berita Acara / Laporan Kepolisian', tipe: 'PDF', tanggal: '03 Apr 2024', ukuran: '320 KB', status: 'uploaded' },
  { id: 't4', nama: 'Surat Keterangan dari Pimpinan Unit Kerja', tipe: 'PDF', tanggal: '04 Apr 2024', ukuran: '155 KB', status: 'uploaded' },
  { id: 't5', nama: 'Visum et Repertum', tipe: 'PDF', tanggal: '-', ukuran: '-', status: 'pending' },
  { id: 't6', nama: 'Data Riwayat Jabatan Terakhir (HRIS)', tipe: 'PDF', tanggal: '05 Apr 2024', ukuran: '412 KB', status: 'verified' },
  { id: 't7', nama: 'Fotokopi KTP dan KK', tipe: 'PDF', tanggal: '02 Apr 2024', ukuran: '98 KB', status: 'uploaded' },
  { id: 't8', nama: 'Foto Diri Pegawai Terbaru', tipe: 'JPG', tanggal: '-', ukuran: '-', status: 'pending' },
];

const STEPS: Step[] = [
  { id: 1, label: 'Monitoring', actor: 'SDM Satker/UE1' },
  { id: 2, label: 'Isi Form Verval PNS Tewas', actor: 'SDM Satker/UE1' },
  { id: 3, label: 'Lengkapi Berkas', actor: 'SDM Satker/UE1' },
  { id: 4, label: 'Ajukan Rekomendasi Verval', actor: 'SDM Satker/UE1' },
  { id: 5, label: 'Verifikasi & Kirim SIASN', actor: 'Biro SDM' },
  { id: 6, label: 'Analisis BKN & SK', actor: 'BKN / Biro SDM' },
];

const DOKUMEN_TEWAS = [
  'Surat Keterangan Meninggal dari Instansi berwenang',
  'Surat Keterangan Kematian dari Kepala Desa/Lurah',
  'Berita Acara / Laporan Kepolisian',
  'Surat Keterangan dari Pimpinan Unit Kerja',
  'Visum et Repertum (jika kecelakaan)',
  'Data Riwayat Jabatan terakhir (HRIS)',
  'Fotokopi KTP dan KK',
  'Foto diri pegawai terbaru',
];

const DATA = MOCK_PEGAWAI.filter(p => p.jenisKasus === 'Tewas');

interface TewasFormProps {
  pegawai: Pegawai;
  role: Role;
  onClose: () => void;
  isArchived?: boolean;
}

function TewasForm({ pegawai, role, onClose, isArchived = false }: TewasFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    tanggalKejadian: isArchived ? '2024-03-15' : '',
    tempatKejadian: isArchived ? 'Jl. Raya Bogor KM 12, Jakarta Timur' : '',
    kronologi: isArchived ? 'Pegawai mengalami kecelakaan lalu lintas saat perjalanan dinas dari kantor menuju lokasi pertemuan dengan mitra kerja. Kecelakaan terjadi akibat tabrakan dari kendaraan lain yang melanggar rambu lalu lintas.' : '',
    nomorLaporanPolisi: isArchived ? 'LP/456/III/2024/Polresta Bogor' : '',
    saksi1: isArchived ? 'Ahmad Hidayat (Pegawai KPPN Bogor)' : '',
    saksi2: isArchived ? 'Budi Santoso (Sopir kendaraan dinas)' : '',
    jenisKematian: 'kecelakaan_dinas',
  });
  const canEdit = !isArchived && (role === 'sdm-satker' || role === 'sdm-ue1');
  const canVerify = !isArchived && role === 'biro-sdm';

  // Tentukan current step berdasarkan role
  const getCurrentStep = () => {
    if (role === 'sdm-satker' || role === 'sdm-ue1') return 2; // Isi Form Verval PNS Tewas
    if (role === 'biro-sdm') return 5; // Verifikasi & Kirim SIASN
    return 1; // Default
  };

  const currentStep = getCurrentStep();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 flex items-start justify-between shrink-0" style={{ background: '#7F1D1D' }}>
          <div>
            <p className="text-white font-semibold">{pegawai.nama}</p>
            <p className="text-white/60 text-xs">{pegawai.nip} · {pegawai.satker}</p>
            <p className="text-white/70 text-xs mt-0.5">Kasus Tewas · {pegawai.nomorKasus}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
            <p className="text-xs font-semibold text-gray-500 mb-3">Tahapan Proses (Flow 3: Tewas)</p>
            <WorkflowStepper steps={STEPS} currentStep={currentStep} />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
            <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700">Kasus Tewas Dalam Dinas</p>
              <p className="text-xs text-red-600 mt-0.5">{pegawai.keterangan}</p>
            </div>
          </div>

          {/* Tab Sections */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Form Verval PNS Tewas</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Tanggal Kejadian</label>
                  <input
                    type="date"
                    value={formData.tanggalKejadian}
                    onChange={e => setFormData(f => ({ ...f, tanggalKejadian: e.target.value }))}
                    disabled={!canEdit}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Jenis Kematian</label>
                  <select
                    value={formData.jenisKematian}
                    onChange={e => setFormData(f => ({ ...f, jenisKematian: e.target.value }))}
                    disabled={!canEdit}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none disabled:bg-gray-50"
                  >
                    <option value="kecelakaan_dinas">Kecelakaan dalam Dinas</option>
                    <option value="kecelakaan_perjalanan_dinas">Kecelakaan Perjalanan Dinas</option>
                    <option value="bencana_alam">Bencana Alam</option>
                    <option value="sakit_dinas">Sakit karena Tugas</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 font-medium block mb-1">Tempat Kejadian</label>
                  <input
                    value={formData.tempatKejadian}
                    onChange={e => setFormData(f => ({ ...f, tempatKejadian: e.target.value }))}
                    disabled={!canEdit}
                    placeholder="Nama jalan, kota..."
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400 disabled:bg-gray-50 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">No. Laporan Polisi</label>
                  <input
                    value={formData.nomorLaporanPolisi}
                    onChange={e => setFormData(f => ({ ...f, nomorLaporanPolisi: e.target.value }))}
                    disabled={!canEdit}
                    placeholder="LP/xxx/xxxx/..."
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400 disabled:bg-gray-50 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Nama Saksi 1</label>
                  <input
                    value={formData.saksi1}
                    onChange={e => setFormData(f => ({ ...f, saksi1: e.target.value }))}
                    disabled={!canEdit}
                    placeholder="Nama saksi pertama"
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400 disabled:bg-gray-50 placeholder-gray-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 font-medium block mb-1">Kronologi Kejadian</label>
                  <textarea
                    value={formData.kronologi}
                    onChange={e => setFormData(f => ({ ...f, kronologi: e.target.value }))}
                    disabled={!canEdit}
                    placeholder="Uraikan kronologi kejadian secara lengkap..."
                    rows={4}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400 resize-none disabled:bg-gray-50 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <BerkasSection berkas={BERKAS_TEWAS} canUpload={canEdit} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          {!isArchived && canEdit && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-colors">
                Simpan Draft
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors ml-auto" style={{ background: '#7F1D1D' }}>
                <Send size={13} />
                Ajukan Rekomendasi Verval
              </button>
            </>
          )}
          {!isArchived && canVerify && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600">
                <X size={13} /> Kembalikan
              </button>
              <div className="flex items-center gap-1 ml-auto">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700">
                  <ExternalLink size={13} /> Kirim ke SIASN
                </button>
              </div>
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

// ─── Form tambah kasus tewas baru ─────────────────────────────────────────────

interface TambahKasusTewasModalProps {
  onClose: () => void;
  onSave: (entry: Pegawai) => void;
}

const JENIS_KEMATIAN_OPTIONS = [
  { value: 'kecelakaan_dinas',          label: 'Kecelakaan dalam Dinas' },
  { value: 'kecelakaan_perjalanan_dinas', label: 'Kecelakaan Perjalanan Dinas' },
  { value: 'bencana_alam',              label: 'Bencana Alam' },
  { value: 'sakit_dinas',               label: 'Sakit karena Tugas' },
];

function TambahKasusTewasModal({ onClose, onSave }: TambahKasusTewasModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — Data Pegawai
  const [nipQuery, setNipQuery]           = useState('');
  const [resolvedPegawai, setResolvedPegawai] = useState<Pegawai | null>(null);
  const [nipNotFound, setNipNotFound]     = useState(false);
  const [manualNama, setManualNama]       = useState('');
  const [manualNip, setManualNip]         = useState('');
  const [satker, setSatker]               = useState('');
  const [jabatan, setJabatan]             = useState('');

  // Step 2 — Detail Kasus
  const [tanggalKejadian, setTanggalKejadian]       = useState('');
  const [tempatKejadian, setTempatKejadian]           = useState('');
  const [jenisKematian, setJenisKematian]             = useState('kecelakaan_dinas');
  const [nomorLaporanPolisi, setNomorLaporanPolisi]   = useState('');
  const [saksi1, setSaksi1]                           = useState('');
  const [saksi2, setSaksi2]                           = useState('');
  const [kronologi, setKronologi]                     = useState('');
  const [keterangan, setKeterangan]                   = useState('');

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
    if (!manualNama.trim()) e.nama    = 'Nama pegawai wajib diisi';
    if (!manualNip.trim())  e.nip     = 'NIP pegawai wajib diisi';
    if (!satker.trim())     e.satker  = 'Satker wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!tanggalKejadian)       e.tanggal   = 'Tanggal kejadian wajib diisi';
    if (!tempatKejadian.trim()) e.tempat    = 'Tempat kejadian wajib diisi';
    if (!nomorLaporanPolisi.trim()) e.polisi = 'Nomor laporan polisi wajib diisi';
    if (!kronologi.trim())      e.kronologi = 'Kronologi kejadian wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validateStep2()) return;

    const jenisLabel = JENIS_KEMATIAN_OPTIONS.find(j => j.value === jenisKematian)?.label ?? jenisKematian;
    const base = resolvedPegawai ?? {
      id:                `tewas-${Date.now()}`,
      nip:               manualNip,
      nama:              manualNama,
      jabatan,
      unitKerja:         satker,
      satker,
      eselon:            '-',
      pangkatGolongan:   '-',
      tmtGolongan:       '-',
      tanggalLahir:      '-',
      tanggalBUP:        '-',
      sisaBulan:         0,
      jenisKelamin:      'L' as const,
      statusKepegawaian: 'PNS',
      jenisKasus:        'Tewas' as any,
      statusProses:      'Belum Diproses' as any,
      tahapanSaat:       1,
      totalTahapan:      6,
      nomorKasus:        `PPO/TEWAS/${new Date().getFullYear()}/${String(Date.now()).slice(-3)}`,
      tanggalKasus:      tanggalKejadian,
      keterangan:        `${jenisLabel} — ${tempatKejadian}`,
    };

    onSave({ ...base, jenisKasus: 'Tewas' as any, statusProses: 'Belum Diproses' as any });
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
    `w-full text-xs border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 text-gray-700 placeholder-gray-400 ${err ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-red-400'}`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between shrink-0" style={{ background: '#7F1D1D' }}>
          <div>
            <p className="text-white font-semibold">Laporan Kasus Tewas Baru</p>
            <p className="text-white/60 text-xs mt-0.5">Unit SDM Satker · Flow 3</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X size={20} /></button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-5 pb-0 shrink-0">
          <div className="flex items-center gap-2">
            {(['Data Pegawai', 'Detail Kejadian'] as const).map((s, i) => {
              const idx    = i + 1;
              const active = step === idx;
              const done   = step > idx;
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? 'bg-green-500 text-white' : active ? 'text-white' : 'bg-gray-200 text-gray-400'}`}
                    style={active ? { background: '#7F1D1D' } : {}}
                  >
                    {done ? <Check size={12} /> : idx}
                  </div>
                  <span className={`text-xs font-semibold ${active ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
                  {i < 1 && <ChevronRight size={14} className="text-gray-300 ml-auto" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* ── Step 1: Data Pegawai ── */}
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
                    style={{ background: '#7F1D1D' }}
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

          {/* ── Step 2: Detail Kejadian ── */}
          {step === 2 && (
            <>
              {/* Pegawai summary */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-800">
                  <HeartCrack size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{manualNama}</p>
                  <p className="text-xs text-gray-500">{manualNip} · {satker}</p>
                </div>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold text-white bg-red-800">Tewas</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tanggal Kejadian *" error={errors.tanggal}>
                    <input type="date" value={tanggalKejadian} onChange={e => setTanggalKejadian(e.target.value)} className={inputCls(errors.tanggal)} />
                  </Field>
                  <Field label="Jenis Kematian">
                    <select value={jenisKematian} onChange={e => setJenisKematian(e.target.value)} className={inputCls()}>
                      {JENIS_KEMATIAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Tempat Kejadian *" error={errors.tempat}>
                  <input value={tempatKejadian} onChange={e => setTempatKejadian(e.target.value)} placeholder="Nama jalan, kota, lokasi..." className={inputCls(errors.tempat)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="No. Laporan Polisi *" error={errors.polisi}>
                    <input value={nomorLaporanPolisi} onChange={e => setNomorLaporanPolisi(e.target.value)} placeholder="LP/xxx/xx/xxxx/..." className={inputCls(errors.polisi)} />
                  </Field>
                  <Field label="Nama Saksi 1">
                    <input value={saksi1} onChange={e => setSaksi1(e.target.value)} placeholder="Nama saksi pertama" className={inputCls()} />
                  </Field>
                </div>
                <Field label="Nama Saksi 2">
                  <input value={saksi2} onChange={e => setSaksi2(e.target.value)} placeholder="Nama saksi kedua (opsional)" className={inputCls()} />
                </Field>
                <Field label="Kronologi Kejadian *" error={errors.kronologi}>
                  <textarea
                    value={kronologi}
                    onChange={e => setKronologi(e.target.value)}
                    placeholder="Uraikan kronologi kejadian secara lengkap..."
                    rows={4}
                    className={`${inputCls(errors.kronologi)} resize-none`}
                  />
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

              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
                <AlertCircle size={13} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">
                  Salinan surat kematian, laporan polisi, dan dokumen pendukung lainnya akan diminta setelah laporan ini disimpan.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          {step === 1 ? (
            <>
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Batal</button>
              <button
                onClick={() => { if (validateStep1()) setStep(2); }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white ml-auto"
                style={{ background: '#7F1D1D' }}
              >
                Selanjutnya <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setStep(1); setErrors({}); }} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">
                Kembali
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white ml-auto"
                style={{ background: '#7F1D1D' }}
              >
                <Check size={14} /> Simpan Laporan Kasus
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface FlowTewasProps { role: Role; }

export function FlowTewas({ role }: FlowTewasProps) {
  const [mainTab, setMainTab] = useState<'aktif' | 'arsip'>('aktif');
  const [selected, setSelected] = useState<Pegawai | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusProses | ''>('');
  const [satkerFilter, setSatkerFilter] = useState('');
  const [tanggalFilter, setTanggalFilter] = useState('');
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

  return (
    <div className="p-6 space-y-5">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
        <HeartCrack size={18} className="text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800">Alur Usulan Penetapan Tewas</p>
          <p className="text-xs text-red-600 mt-0.5">
            Pengusulan penetapan tewas untuk pegawai Kementerian Keuangan yang meninggal dalam menjalankan tugas.
            Melibatkan analisis BKN dan diteruskan ke Flow 2 jika rekomendasi tidak disetujui.
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
            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === 'aktif' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {tab === 'aktif' ? dataAktif.length : dataArsip.length}
            </span>
          </button>
        ))}
      </div>

      {/* Mini Dashboard Status - only for active */}
      {mainTab === 'aktif' && <MiniDashboard data={dataAktif} onFilterClick={setStatusFilter} currentFilter={statusFilter} />}

      {/* Filter panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Filter</p>
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setSatkerFilter(''); setTanggalFilter(''); }}
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
              {mainTab === 'aktif' ? 'Kasus Pemberhentian Tewas Aktif' : 'Arsip Kasus Selesai'}
            </h3>
            <p className="text-xs text-gray-500">
              {filtered.length} dari {mainTab === 'aktif' ? dataAktif.length : dataArsip.length} kasus
            </p>
          </div>
          {mainTab === 'aktif' && isSdmSatker && (
            <button
              onClick={() => setShowTambahKasus(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0"
              style={{ background: '#7F1D1D' }}
            >
              <Plus size={14} /> Tambah Kasus
            </button>
          )}
        </div>
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Search size={32} className="mx-auto mb-2 opacity-30" />
            <p>Tidak ada data yang sesuai filter</p>
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
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-red-50/30 transition-colors cursor-pointer"
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
                          <p className="text-red-600 font-medium">{p.keterangan}</p>
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
                                className="h-full rounded-full"
                                style={{
                                  width: `${(p.tahapanSaat / p.totalTahapan) * 100}%`,
                                  background: statusColor
                                }}
                              />
                            </div>
                            <span className="text-gray-500 text-[10px]">{p.tahapanSaat}/{p.totalTahapan}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={e => { e.stopPropagation(); setSelected(p); }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-red-800 hover:bg-red-900"
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

      {selected && <TewasForm pegawai={selected} role={role} onClose={() => setSelected(null)} isArchived={mainTab === 'arsip'} />}
      {showTambahKasus && <TambahKasusTewasModal onClose={() => setShowTambahKasus(false)} onSave={handleTambahKasus} />}
    </div>
  );
}
