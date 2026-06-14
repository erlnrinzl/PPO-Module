import { useState } from "react";
import { JenisLaporan, PegawaiWithStatus } from "../proposalFile.types";
import { Pegawai } from "../../../types/employee.types";
import { MOCK_PEGAWAI } from "../../../data/mockData";
import { AlertCircle, Check, ChevronRight, HeartCrack, Search, Stethoscope, X } from "lucide-react";
import { getKasusColor } from "../../../utils/case.util";
import { PENYEBAB_UZUR } from "../dismissalProposal.constants";

interface TambahKasusModalProps {
  onClose: () => void;
  onSave: (entry: PegawaiWithStatus) => void;
}


export function TambahKasusModal({ onClose, onSave }: TambahKasusModalProps) {
  const [jenis, setJenis] = useState<JenisLaporan>("Meninggal");
  const [step, setStep] = useState<1 | 2>(1);

  // Shared
  const [nipQuery, setNipQuery] = useState("");
  const [resolvedPegawai, setResolvedPegawai] = useState<Pegawai | null>(null);
  const [nipNotFound, setNipNotFound] = useState(false);
  const [manualNama, setManualNama] = useState("");
  const [manualNip, setManualNip] = useState("");
  const [satker, setSatker] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // Meninggal-specific
  const [tanggalMeninggal, setTanggalMeninggal] = useState("");
  const [nomorSuratKematian, setNomorSuratKematian] = useState("");
  const [penyebabKematian, setPenyebabKematian] = useState("");
  const [tempatMeninggal, setTempatMeninggal] = useState("");

  // Uzur-specific
  const [tanggalDiagnosis, setTanggalDiagnosis] = useState("");
  const [kondisiUzur, setKondisiUzur] = useState("");
  const [nomorSuratDokter, setNomorSuratDokter] = useState("");
  const [institusiMedis, setInstitusiMedis] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const lookupNIP = () => {
    const found = MOCK_PEGAWAI.find((p) => p.nip === nipQuery.trim());
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
    if (!manualNama.trim()) e.nama = "Nama pegawai wajib diisi";
    if (!manualNip.trim()) e.nip = "NIP pegawai wajib diisi";
    if (!satker.trim()) e.satker = "Satker wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (jenis === "Meninggal") {
      if (!tanggalMeninggal) e.tanggal = "Tanggal meninggal wajib diisi";
      if (!nomorSuratKematian) e.nomSurat = "Nomor surat kematian wajib diisi";
      if (!penyebabKematian) e.penyebab = "Penyebab wajib diisi";
    } else {
      if (!tanggalDiagnosis) e.tanggal = "Tanggal diagnosis wajib diisi";
      if (!kondisiUzur) e.kondisi = "Kondisi uzur wajib dipilih";
      if (!nomorSuratDokter) e.nomSurat = "Nomor surat dokter wajib diisi";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSave = () => {
    if (!validateStep2()) return;

    const base = resolvedPegawai ?? {
      id: `manual-${Date.now()}`,
      nip: manualNip,
      nama: manualNama,
      jabatan,
      unitKerja: satker,
      satker,
      eselon: "-",
      pangkatGolongan: "-",
      tmtGolongan: "-",
      tanggalLahir: "-",
      tanggalBUP: "-",
      sisaBulan: 0,
      jenisKelamin: "L" as const,
      statusKepegawaian: "PNS",
      jenisKasus: jenis as any,
      statusProses: "Belum Diproses" as any,
      tahapanSaat: 1,
      totalTahapan: 5,
      nomorKasus: `PPO/${jenis.toUpperCase()}/${new Date().getFullYear()}/${String(Date.now()).slice(-3)}`,
      tanggalKasus: jenis === "Meninggal" ? tanggalMeninggal : tanggalDiagnosis,
      keterangan,
    };

    const entry = {
      ...base,
      jenisKasus: jenis as any,
      tanggalKasus: jenis === "Meninggal" ? tanggalMeninggal : tanggalDiagnosis,
      statusDokumen: "Belum Lengkap" as "Lengkap" | "Belum Lengkap",
    };

    onSave(entry);
    onClose();
  };

  const Field = ({
    label,
    error,
    children,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    `w-full text-xs border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 text-gray-700 placeholder-gray-400 ${err ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-start justify-between shrink-0"
          style={{ background: "#162D54" }}
        >
          <div>
            <p className="text-white font-semibold">Laporan Kasus Baru</p>
            <p className="text-white/60 text-xs mt-0.5">
              Unit SDM Satker · Flow 2
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Jenis kasus selector */}
        <div className="px-6 pt-5 pb-0 shrink-0">
          <p className="text-xs font-semibold text-gray-600 mb-3">
            Jenis Kasus
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(["Meninggal", "Uzur"] as JenisLaporan[]).map((j) => (
              <button
                key={j}
                onClick={() => {
                  setJenis(j);
                  setStep(1);
                  setErrors({});
                }}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  jenis === j
                    ? j === "Meninggal"
                      ? "border-gray-700 bg-gray-50"
                      : "border-amber-500 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${jenis === j ? (j === "Meninggal" ? "bg-gray-700" : "bg-amber-500") : "bg-gray-100"}`}
                >
                  {j === "Meninggal" ? (
                    <HeartCrack
                      size={18}
                      className={jenis === j ? "text-white" : "text-gray-400"}
                    />
                  ) : (
                    <Stethoscope
                      size={18}
                      className={jenis === j ? "text-white" : "text-gray-400"}
                    />
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${jenis === j ? "text-gray-800" : "text-gray-500"}`}
                  >
                    {j === "Meninggal" ? "Meninggal Dunia" : "Uzur / Sakit"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                    {j === "Meninggal"
                      ? "Pegawai meninggal dalam dinas"
                      : "Tidak mampu menjalankan tugas"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Progress steps */}
        <div className="px-6 pt-4 pb-0 shrink-0">
          <div className="flex items-center gap-2">
            {["Data Pegawai", "Detail Kasus"].map((s, i) => {
              const idx = i + 1;
              const active = step === idx;
              const done = step > idx;
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? "bg-green-500 text-white" : active ? "text-white" : "bg-gray-200 text-gray-400"}`}
                    style={active ? { background: "#162D54" } : {}}
                  >
                    {done ? <Check size={12} /> : idx}
                  </div>
                  <span
                    className={`text-xs font-semibold ${active ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {s}
                  </span>
                  {i < 1 && (
                    <ChevronRight size={14} className="text-gray-300 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* ── Step 1: Data Pegawai ─────────────────────────────── */}
          {step === 1 && (
            <>
              {/* NIP lookup */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Cari Pegawai berdasarkan NIP
                </label>
                <div className="flex gap-2">
                  <input
                    value={nipQuery}
                    onChange={(e) => setNipQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && lookupNIP()}
                    placeholder="Masukkan NIP pegawai..."
                    className={inputCls()}
                  />
                  <button
                    onClick={lookupNIP}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0"
                    style={{ background: "#162D54" }}
                  >
                    <Search size={13} /> Cari
                  </button>
                </div>
                {nipNotFound && (
                  <p className="text-[10px] text-amber-600 mt-1.5 bg-amber-50 rounded-lg px-2 py-1">
                    NIP tidak ditemukan di sistem. Isi data pegawai secara
                    manual di bawah.
                  </p>
                )}
              </div>

              {/* Resolved pegawai card */}
              {resolvedPegawai && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                  <Check size={16} className="text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {resolvedPegawai.nama}
                    </p>
                    <p className="text-xs text-gray-500">
                      {resolvedPegawai.nip} · {resolvedPegawai.jabatan} ·{" "}
                      {resolvedPegawai.satker}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setResolvedPegawai(null);
                      setManualNama("");
                      setManualNip("");
                      setSatker("");
                      setJabatan("");
                      setNipQuery("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Data Pegawai
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nama Lengkap *" error={errors.nama}>
                    <input
                      value={manualNama}
                      onChange={(e) => setManualNama(e.target.value)}
                      placeholder="Nama pegawai"
                      className={inputCls(errors.nama)}
                      disabled={!!resolvedPegawai}
                    />
                  </Field>
                  <Field label="NIP *" error={errors.nip}>
                    <input
                      value={manualNip}
                      onChange={(e) => setManualNip(e.target.value)}
                      placeholder="18 digit NIP"
                      className={inputCls(errors.nip)}
                      disabled={!!resolvedPegawai}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Satker *" error={errors.satker}>
                    <input
                      value={satker}
                      onChange={(e) => setSatker(e.target.value)}
                      placeholder="Nama satker"
                      className={inputCls(errors.satker)}
                      disabled={!!resolvedPegawai}
                    />
                  </Field>
                  <Field label="Jabatan">
                    <input
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      placeholder="Jabatan terakhir"
                      className={inputCls()}
                      disabled={!!resolvedPegawai}
                    />
                  </Field>
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Detail Kasus ─────────────────────────────── */}
          {step === 2 && (
            <>
              {/* Pegawai summary */}
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${jenis === "Meninggal" ? "bg-gray-700" : "bg-amber-500"}`}
                >
                  {jenis === "Meninggal" ? (
                    <HeartCrack size={15} className="text-white" />
                  ) : (
                    <Stethoscope size={15} className="text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {manualNama}
                  </p>
                  <p className="text-xs text-gray-500">
                    {manualNip} · {satker}
                  </p>
                </div>
                <span
                  className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold text-white"
                  style={{ background: getKasusColor(jenis) }}
                >
                  {jenis}
                </span>
              </div>

              {jenis === "Meninggal" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Tanggal Meninggal *" error={errors.tanggal}>
                      <input
                        type="date"
                        value={tanggalMeninggal}
                        onChange={(e) => setTanggalMeninggal(e.target.value)}
                        className={inputCls(errors.tanggal)}
                      />
                    </Field>
                    <Field label="Tempat Meninggal">
                      <input
                        value={tempatMeninggal}
                        onChange={(e) => setTempatMeninggal(e.target.value)}
                        placeholder="RS / kota..."
                        className={inputCls()}
                      />
                    </Field>
                  </div>
                  <Field
                    label="No. Surat Keterangan Kematian *"
                    error={errors.nomSurat}
                  >
                    <input
                      value={nomorSuratKematian}
                      onChange={(e) => setNomorSuratKematian(e.target.value)}
                      placeholder="Misal: 474/SKK/IV/2027"
                      className={inputCls(errors.nomSurat)}
                    />
                  </Field>
                  <Field label="Penyebab Kematian *" error={errors.penyebab}>
                    <input
                      value={penyebabKematian}
                      onChange={(e) => setPenyebabKematian(e.target.value)}
                      placeholder="Sakit / kecelakaan / dll"
                      className={inputCls(errors.penyebab)}
                    />
                  </Field>
                  <Field label="Keterangan Tambahan">
                    <textarea
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Informasi tambahan yang relevan..."
                      rows={3}
                      className={`${inputCls()} resize-none`}
                    />
                  </Field>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Tanggal Diagnosis *" error={errors.tanggal}>
                      <input
                        type="date"
                        value={tanggalDiagnosis}
                        onChange={(e) => setTanggalDiagnosis(e.target.value)}
                        className={inputCls(errors.tanggal)}
                      />
                    </Field>
                    <Field label="Institusi Medis">
                      <input
                        value={institusiMedis}
                        onChange={(e) => setInstitusiMedis(e.target.value)}
                        placeholder="Nama RS / klinik"
                        className={inputCls()}
                      />
                    </Field>
                  </div>
                  <Field label="Kondisi / Jenis Uzur *" error={errors.kondisi}>
                    <select
                      value={kondisiUzur}
                      onChange={(e) => setKondisiUzur(e.target.value)}
                      className={inputCls(errors.kondisi)}
                    >
                      <option value="">Pilih kondisi uzur...</option>
                      {PENYEBAB_UZUR.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="No. Surat Keterangan Dokter *"
                    error={errors.nomSurat}
                  >
                    <input
                      value={nomorSuratDokter}
                      onChange={(e) => setNomorSuratDokter(e.target.value)}
                      placeholder="Misal: SKD/2027/IV/001"
                      className={inputCls(errors.nomSurat)}
                    />
                  </Field>
                  <Field label="Keterangan Tambahan">
                    <textarea
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Kondisi terkini, riwayat pengobatan, dll..."
                      rows={3}
                      className={`${inputCls()} resize-none`}
                    />
                  </Field>
                </div>
              )}

              <div
                className={`rounded-xl p-3 flex gap-2 ${jenis === "Meninggal" ? "bg-gray-50 border border-gray-200" : "bg-amber-50 border border-amber-200"}`}
              >
                <AlertCircle
                  size={13}
                  className={`shrink-0 mt-0.5 ${jenis === "Meninggal" ? "text-gray-500" : "text-amber-600"}`}
                />
                <p
                  className={`text-xs ${jenis === "Meninggal" ? "text-gray-600" : "text-amber-700"}`}
                >
                  {jenis === "Meninggal"
                    ? "Salinan surat kematian dan dokumen pendukung akan diminta setelah laporan ini disimpan."
                    : "Surat keterangan dokter dan dokumen medis pendukung akan diminta setelah laporan ini disimpan."}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white ml-auto"
                style={{ background: "#162D54" }}
              >
                Selanjutnya <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setStep(1);
                  setErrors({});
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white ml-auto"
                style={{
                  background: jenis === "Meninggal" ? "#374151" : "#D97706",
                }}
              >
                <Check size={14} />
                Simpan Laporan {jenis}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}