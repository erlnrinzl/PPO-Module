import { useState } from "react";
import {
  CheckSquare,
  Square,
  FileText,
  Send,
  X,
  Check,
  AlertCircle,
  Users,
  Search,
  Download,
  Mail,
  UserPlus,
  Plus,
  PackagePlus,
  HeartCrack,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
  ClipboardList,
  Eye,
  ChevronDown,
  Upload,
} from "lucide-react";
import { FlowBUPUe1 } from "./FlowBUPUe1";
import type { Role } from "../routes/routeConfig";
// import {
//   MOCK_PEGAWAI, getKasusColor, getKasusLabel, getSisaBulanColor, getSisaBulanLabel, type Pegawai,
// } from '../data/mockData';

import {
  getKasusColor,
  getKasusLabel,
  getSisaBulanColor,
  getSisaBulanLabel,
} from "../utils/case.util";
import { type Pegawai } from "../types/employee.types";
import { MOCK_PEGAWAI } from "../data/mockData";
import { WorkflowStepper } from "./WorkflowStepper";

//--------------------------------------------------------------------------------
import { FLOW_STEPS } from "../constants/approvalTemplates";
import type {
  DokStatus,
  Dokumen,
  BerkasReq,
} from "../types/proposalFile.types";
import {
  BASE_DOKUMEN,
  KANDIDAT_WITH_STATUS,
  LIFECYCLE,
  MOCK_BERKAS,
  PENYEBAB_UZUR,
} from "../features/dismissalProposal/dismissalProposal.constants";
import {
  type BerkasUsulan,
  type JenisLaporan,
  type PegawaiWithStatus,
  type StatusUsulan,
} from "../features/dismissalProposal/dismissal-proposal.types";
import { getBerkasReqForJenis } from "../features/dismissalProposal/utils/getDocumentRequirements";
import { statusUsulanColor } from "../features/dismissalProposal/utils/approvalStatusColor";
import { useProposalDetail } from "../features/dismissalProposal/hooks/useProposalDetail";

//--------------------------------------------------------------------------------
// ─── Sub-components ────────────────────────────────────────────────────────────

function DokumenChecklist({
  dokumen,
  editable,
}: {
  dokumen: Dokumen[];
  editable: boolean;
}) {
  const [docs, setDocs] = useState(dokumen);
  const toggle = (id: string) => {
    if (!editable) return;
    setDocs((d) =>
      d.map((x) =>
        x.id === id
          ? {
              ...x,
              status:
                x.status === "uploaded" ? "missing" : ("uploaded" as DokStatus),
            }
          : x,
      ),
    );
  };
  const uploaded = docs.filter((d) => d.status !== "missing").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-700">
          Kelengkapan Berkas ({uploaded}/{docs.length})
        </p>
        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${(uploaded / docs.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => toggle(doc.id)}
            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${editable ? "cursor-pointer" : "cursor-default"} ${doc.status !== "missing" ? "bg-green-50 border-green-200" : "bg-red-50/50 border-red-200"}`}
          >
            {doc.status !== "missing" ? (
              <CheckSquare size={16} className="text-green-600 shrink-0" />
            ) : (
              <Square size={16} className="text-red-400 shrink-0" />
            )}
            <p className="text-xs font-medium text-gray-700 flex-1">
              {doc.label}
            </p>
            <div className="flex items-center gap-1.5">
              {doc.wajib && (
                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                  Wajib
                </span>
              )}
              {doc.status === "verified" ? (
                <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Verified
                </span>
              ) : doc.status === "uploaded" ? (
                <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Uploaded
                </span>
              ) : (
                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                  Belum
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseDetail({
  pegawai,
  role,
  onClose,
  isArchived = false,
  statusDokumen = "Lengkap",
  berkasStatus,
}: {
  pegawai: Pegawai;
  role: Role;
  onClose: () => void;
  isArchived?: boolean;
  statusDokumen?: "Lengkap" | "Belum Lengkap";
  berkasStatus?: StatusUsulan;
}) {
  const [catatan, setCatatan] = useState(
    isArchived
      ? "Proses pemberhentian telah selesai. SK Pemberhentian telah diterbitkan dan disampaikan kepada pegawai."
      : "",
  );
  const [confirmed, setConfirmed] = useState(false);
  const [berkasExpanded, setBerkasExpanded] = useState(false);
  const [manualUploads, setManualUploads] = useState<Set<string>>(new Set());
  const canEdit =
    !isArchived && (role === "sdm-satker-1" || role === "sdm-ue1");
  const canVerify = !isArchived && role === "biro-sdm";
  const currentStep = role === "biro-sdm" ? 4 : 2;

  const isSubmitted =
    berkasStatus != null &&
    berkasStatus !== "Draft" &&
    berkasStatus !== "Dokumen Lengkap";
  const canUpload = role === "sdm-satker-1" && !isArchived && !isSubmitted;

  const berkasItems = getBerkasReqForJenis(pegawai.jenisKasus);
  const kemenkeuItems = berkasItems.filter((b) => b.source === "satu-kemenkeu");
  const uploadItems = berkasItems.filter((b) => b.source === "upload");
  const isMissingItem = (b: BerkasReq) =>
    b.source === "upload" &&
    statusDokumen === "Belum Lengkap" &&
    b.id === uploadItems[uploadItems.length - 1].id &&
    !manualUploads.has(b.id);
  const handleUpload = (id: string) =>
    setManualUploads((prev) => new Set([...prev, id]));
  const teruploadCount = uploadItems.filter((b) => !isMissingItem(b)).length;
  const belumUploadCount = uploadItems.filter(isMissingItem).length;
  const totalLengkap = kemenkeuItems.length + teruploadCount;
  const pct = Math.round((totalLengkap / berkasItems.length) * 100);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div
          className="px-6 py-4 flex items-start justify-between shrink-0"
          style={{ background: "#162D54" }}
        >
          <div>
            <p className="text-white font-semibold">{pegawai.nama}</p>
            <p className="text-white/60 text-xs">
              {pegawai.nip} · {pegawai.jabatan} · {pegawai.satker}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] text-white bg-white/20 px-2 py-0.5 rounded-full">
                {pegawai.nomorKasus}
              </span>
              <span
                className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold"
                style={{ background: getKasusColor(pegawai.jenisKasus) }}
              >
                {getKasusLabel(pegawai.jenisKasus)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white mt-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
            <p className="text-xs font-semibold text-gray-500 mb-3">
              Tahapan Proses (Flow 2)
            </p>
            <WorkflowStepper steps={FLOW_STEPS} currentStep={currentStep} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Tgl BUP", value: pegawai.tanggalBUP },
              { label: "Tgl Kasus", value: pegawai.tanggalKasus },
              { label: "Pangkat/Gol", value: pegawai.pangkatGolongan },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {value}
                </p>
              </div>
            ))}
          </div>
          {pegawai.keterangan && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
              <AlertCircle
                size={14}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <p className="text-xs text-amber-700">{pegawai.keterangan}</p>
            </div>
          )}
          {/* ── Kelengkapan Berkas ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                Kelengkapan Berkas
              </p>
              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusDokumen === "Lengkap" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
              >
                {statusDokumen}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>
                  {totalLengkap} dari {berkasItems.length} berkas lengkap
                </span>
                <span className="font-bold">{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background:
                      pct === 100
                        ? "#10B981"
                        : pct >= 70
                          ? "#F59E0B"
                          : "#EF4444",
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                {
                  label: "Total",
                  value: berkasItems.length,
                  color: "text-gray-700",
                  bg: "bg-gray-50",
                  border: "border-gray-200",
                },
                {
                  label: "Satu Kemenkeu",
                  value: kemenkeuItems.length,
                  color: "text-blue-700",
                  bg: "bg-blue-50",
                  border: "border-blue-100",
                },
                {
                  label: "Terupload",
                  value: teruploadCount,
                  color: "text-green-700",
                  bg: "bg-green-50",
                  border: "border-green-100",
                },
                {
                  label: "Belum Upload",
                  value: belumUploadCount,
                  color:
                    belumUploadCount > 0 ? "text-red-600" : "text-gray-400",
                  bg: belumUploadCount > 0 ? "bg-red-50" : "bg-gray-50",
                  border:
                    belumUploadCount > 0 ? "border-red-100" : "border-gray-200",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl border px-2 py-2 text-center ${s.bg} ${s.border}`}
                >
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                    {s.label}
                  </p>
                  <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Berkas Terlampir (collapsible) ── */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setBerkasExpanded((v) => !v)}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <FileText size={13} className="text-gray-500 shrink-0" />
              <span className="text-xs font-semibold text-gray-700 flex-1">
                Berkas Terlampir
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {kemenkeuItems.length} Satu Kemenkeu · {uploadItems.length}{" "}
                Upload
              </span>
              <ChevronDown
                size={13}
                className={`text-gray-400 shrink-0 transition-transform duration-200 ${berkasExpanded ? "rotate-180" : ""}`}
              />
            </button>
            {berkasExpanded && (
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {berkasItems.map((b, idx) => {
                  const isKemenkeu = b.source === "satu-kemenkeu";
                  const missing = isMissingItem(b);
                  return (
                    <div
                      key={b.id}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50/80"
                    >
                      <span className="text-[10px] text-gray-400 font-semibold w-5 shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-800 leading-snug">
                          {b.nama}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        {isKemenkeu && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Satu Kemenkeu
                          </span>
                        )}
                        {isKemenkeu ? (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-0.5">
                            <Check size={8} /> Terverifikasi
                          </span>
                        ) : missing ? (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-0.5">
                            <AlertCircle size={8} /> Belum Upload
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-0.5">
                            <Check size={8} /> Terupload
                          </span>
                        )}
                        {!missing && (
                          <button className="flex items-center gap-0.5 text-[9px] font-semibold text-blue-600 border border-blue-200 rounded-lg px-1.5 py-0.5 hover:bg-blue-50 transition-colors">
                            <Eye size={8} /> Lihat
                          </button>
                        )}
                        {!isKemenkeu && missing && canUpload && (
                          <button
                            onClick={() => handleUpload(b.id)}
                            className="flex items-center gap-0.5 text-[9px] font-semibold text-white bg-blue-600 rounded-lg px-1.5 py-0.5 hover:bg-blue-700 transition-colors"
                          >
                            <Upload size={8} /> Unggah
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Catatan / Komentar
            </p>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tambahkan catatan proses..."
              disabled={!canEdit && !canVerify}
              className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none text-gray-700 placeholder-gray-400 disabled:bg-gray-50"
              rows={3}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          {!isArchived && canEdit && (
            <>
              <label className="flex items-center gap-2 cursor-pointer mr-auto">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-gray-600">
                  Berkas telah diperiksa dan lengkap
                </span>
              </label>
              <button
                disabled={!confirmed}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40"
                style={{ background: "#162D54" }}
              >
                <Send size={13} /> Ajukan ke Biro SDM
              </button>
            </>
          )}
          {!isArchived && canVerify && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600">
                <X size={13} /> Kembalikan
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white ml-auto"
                style={{ background: "#162D54" }}
              >
                <Check size={13} /> Verifikasi & Teruskan
              </button>
            </>
          )}
          {!isArchived && !canEdit && !canVerify && (
            <p className="text-xs text-gray-400 mr-auto">
              Anda hanya memiliki akses baca.
            </p>
          )}
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 ${isArchived ? "ml-auto" : ""}`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function SmartGroupingModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (
    groups: {
      name: string;
      count: number;
      jenis: "BUP" | "Uzur" | "Meninggal";
    }[],
  ) => void;
}) {
  const suggestions = [
    { name: "BUP Januari 2027", count: 35, jenis: "BUP" as const },
    { name: "BUP Februari 2027", count: 22, jenis: "BUP" as const },
    { name: "Uzur Triwulan I", count: 3, jenis: "Uzur" as const },
    { name: "Meninggal Dunia", count: 1, jenis: "Meninggal" as const },
  ];
  const [chosen, setChosen] = useState<Set<number>>(new Set([0, 1]));

  const toggle = (i: number) => {
    const next = new Set(chosen);
    next.has(i) ? next.delete(i) : next.add(i);
    setChosen(next);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: "#162D54" }}
        >
          <div>
            <p className="text-white font-semibold">
              Smart Grouping — Buat Berkas Usulan
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Sistem menyarankan pengelompokan otomatis berdasarkan jenis kasus
              dan periode
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
            <AlertCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Pilih grouping yang ingin dibuat menjadi berkas usulan. Anda dapat
              memilih lebih dari satu.
            </p>
          </div>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => toggle(i)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${chosen.has(i) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-3">
                  {chosen.has(i) ? (
                    <CheckSquare size={20} className="text-blue-600 shrink-0" />
                  ) : (
                    <Square size={20} className="text-gray-300 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      → {s.count} pegawai
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: getKasusColor(s.jenis) }}
                  >
                    {s.jenis}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm(suggestions.filter((_, i) => chosen.has(i)));
              onClose();
            }}
            disabled={chosen.size === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40 ml-auto"
            style={{ background: "#162D54" }}
          >
            <PackagePlus size={14} /> Buat {chosen.size} Berkas Usulan
          </button>
        </div>
      </div>
    </div>
  );
}

function ValidationModal({
  berkas,
  onClose,
  onSubmit,
}: {
  berkas: BerkasUsulan;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const canSubmit = berkas.belumLengkap === 0;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4" style={{ background: "#162D54" }}>
          <p className="text-white font-semibold">Validasi Sebelum Pengajuan</p>
          <p className="text-white/60 text-xs mt-0.5">{berkas.nomorUsulan}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-800">
              {berkas.namaberkas}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {berkas.jumlahPegawai} Pegawai
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                <span className="text-sm text-gray-700">Dokumen Lengkap</span>
              </div>
              <span className="text-sm font-semibold text-green-700">
                {berkas.lengkap} pegawai
              </span>
            </div>
            {berkas.belumLengkap > 0 && (
              <div className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-sm text-gray-700">Belum Lengkap</span>
                </div>
                <span className="text-sm font-semibold text-red-700">
                  {berkas.belumLengkap} pegawai
                </span>
              </div>
            )}
          </div>

          {!canSubmit ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
              <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-700">
                  Tidak dapat diajukan
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Berkas tidak dapat diajukan karena masih terdapat{" "}
                  {berkas.belumLengkap} pegawai dengan dokumen belum lengkap
                  atau clearance belum selesai.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex gap-2">
              <Check size={14} className="text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-green-700">
                  Siap diajukan
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Semua dokumen lengkap. Berkas dapat diajukan ke UE1.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Tutup
          </button>
          {canSubmit && (
            <button
              onClick={() => {
                onSubmit();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white ml-auto"
              style={{ background: "#162D54" }}
            >
              <Send size={13} /> Ajukan ke UE1
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal kelengkapan dokumen per-pegawai (read-only) ─────────────────────────

function PegawaiDokModal({
  pegawai,
  onClose,
}: {
  pegawai: PegawaiWithStatus;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div
          className="px-6 py-4 flex items-start justify-between shrink-0"
          style={{ background: "#162D54" }}
        >
          <div>
            <p className="text-white font-semibold">{pegawai.nama}</p>
            <p className="text-white/60 text-xs">
              {pegawai.nip} · {pegawai.jabatan}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] text-white bg-white/20 px-2 py-0.5 rounded-full">
                {pegawai.satker}
              </span>
              <span
                className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold"
                style={{ background: getKasusColor(pegawai.jenisKasus) }}
              >
                {getKasusLabel(pegawai.jenisKasus)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white mt-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Kelengkapan Dokumen Pegawai
          </p>
          <DokumenChecklist dokumen={BASE_DOKUMEN} editable={false} />
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman detail berkas usulan (page view, bukan modal) ─────────────────────

function BerkasDetailPage({
  berkas,
  onBack,
  role,
}: {
  berkas: BerkasUsulan;
  onBack: () => void;
  role: Role;
}) {
  const [selectedPegawai, setSelectedPegawai] =
    useState<PegawaiWithStatus | null>(null);
  const [pegawaiSearch, setPegawaiSearch] = useState("");

  const { currentIdx, filteredPegawai, totalDisplay, sampleShown } =
    useProposalDetail({
      berkas,
      pegawaiSearch,
    });

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Berkas Usulan
      </button>

      {/* Berkas info card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="px-6 py-4 flex items-start gap-4"
          style={{ background: "#162D54" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <ClipboardList size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-white font-bold text-base">
                  {berkas.namaberkas}
                </p>
                <p className="text-white/70 text-xs mt-0.5">
                  {berkas.nomorUsulan} · Dibuat {berkas.tanggalDibuat}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: getKasusColor(berkas.jenis) }}
                >
                  {berkas.jenis}
                </span>
                <span
                  className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: statusUsulanColor(berkas.status) }}
                >
                  {berkas.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
          <div className="px-4 py-3 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide flex items-center justify-center gap-1">
              <Users size={10} /> Total Pegawai
            </p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {totalDisplay}
            </p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-[10px] text-green-600 uppercase tracking-wide flex items-center justify-center gap-1">
              <Check size={10} /> Dokumen Lengkap
            </p>
            <p className="text-xl font-bold text-green-700 mt-0.5">
              {berkas.lengkap}
            </p>
          </div>
          <div className="px-4 py-3 text-center">
            <p
              className={`text-[10px] uppercase tracking-wide flex items-center justify-center gap-1 ${berkas.belumLengkap > 0 ? "text-red-600" : "text-gray-400"}`}
            >
              <AlertCircle size={10} /> Belum Lengkap
            </p>
            <p
              className={`text-xl font-bold mt-0.5 ${berkas.belumLengkap > 0 ? "text-red-700" : "text-gray-400"}`}
            >
              {berkas.belumLengkap}
            </p>
          </div>
        </div>
      </div>

      {/* Lifecycle stepper */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-500 mb-5">
          Lifecycle Berkas Usulan
        </p>
        <div className="relative">
          <div className="absolute left-3.5 top-3.5 bottom-3.5 w-0.5 bg-gray-200" />
          <div
            className="absolute left-3.5 top-3.5 w-0.5 bg-blue-500 transition-all"
            style={{
              height:
                currentIdx > 0
                  ? `calc(${(currentIdx / (LIFECYCLE.length - 1)) * 100}%)`
                  : "0%",
            }}
          />
          <div className="space-y-4">
            {LIFECYCLE.map((l, i) => {
              const isPast = i < currentIdx;
              const isActive = i === currentIdx;
              return (
                <div key={l.status} className="flex items-start gap-4 relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${isActive ? "bg-blue-500 ring-4 ring-blue-100" : isPast ? "bg-blue-500" : "bg-gray-200"}`}
                  >
                    {isPast || isActive ? (
                      <Check size={13} className="text-white" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold">
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-semibold ${isActive ? "text-blue-700" : isPast ? "text-gray-700" : "text-gray-400"}`}
                      >
                        {l.status}
                      </p>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${l.flow === "Flow 6" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
                      >
                        {l.flow}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${isActive ? "text-blue-500" : "text-gray-400"}`}
                    >
                      {l.actor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daftar Pegawai */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="font-semibold text-gray-800">
              Daftar Pegawai dalam Berkas
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Menampilkan {sampleShown} data (
              {totalDisplay - sampleShown > 0
                ? `+${totalDisplay - sampleShown} lainnya`
                : "semua"}{" "}
              total {totalDisplay} pegawai) · Klik baris untuk cek dokumen
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input
              value={pegawaiSearch}
              onChange={(e) => setPegawaiSearch(e.target.value)}
              placeholder="Cari nama / NIP..."
              className="bg-transparent text-xs focus:outline-none w-36 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                  No.
                </th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                  Nama / NIP
                </th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                  Jabatan / Satker
                </th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                  Jenis Kasus
                </th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                  TMT BUP
                </th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                  Status Dokumen
                </th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPegawai.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    <Users size={28} className="mx-auto mb-2 opacity-30" />
                    <p>Tidak ada data</p>
                  </td>
                </tr>
              ) : (
                filteredPegawai.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50/20 transition-colors cursor-pointer"
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{ background: getKasusColor(p.jenisKasus) }}
                      >
                        {getKasusLabel(p.jenisKasus)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {p.tanggalBUP}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.statusDokumen === "Lengkap" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {p.statusDokumen === "Lengkap" ? (
                          <Check size={10} />
                        ) : (
                          <AlertCircle size={10} />
                        )}
                        {p.statusDokumen}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPegawai(p);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                        style={{ background: "#162D54" }}
                      >
                        Cek Dokumen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalDisplay > sampleShown && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-center">
            <p className="text-xs text-gray-400">
              Menampilkan {sampleShown} dari {totalDisplay} pegawai. Data
              lengkap tersedia setelah integrasi sistem kepegawaian.
            </p>
          </div>
        )}
      </div>

      {selectedPegawai && (
        <CaseDetail
          pegawai={selectedPegawai}
          role={role}
          statusDokumen={selectedPegawai.statusDokumen}
          berkasStatus={berkas.status}
          onClose={() => setSelectedPegawai(null)}
        />
      )}
    </div>
  );
}

// ─── Form kasus baru (Meninggal / Uzur) ───────────────────────────────────────

interface TambahKasusModalProps {
  onClose: () => void;
  onSave: (entry: PegawaiWithStatus) => void;
}

function TambahKasusModal({ onClose, onSave }: TambahKasusModalProps) {
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

// ─── Main component ────────────────────────────────────────────────────────────

export function FlowBUP({ role }: { role: Role }) {
  // All state hooks must come BEFORE any early returns
  const [mainTab, setMainTab] = useState<"kandidat" | "berkas" | "arsip">(
    "kandidat",
  );
  const [selectedPegawai, setSelectedPegawai] =
    useState<PegawaiWithStatus | null>(null);
  const [activeBerkas, setActiveBerkas] = useState<BerkasUsulan | null>(null);
  const [showGrouping, setShowGrouping] = useState(false);
  const [showValidation, setShowValidation] = useState<BerkasUsulan | null>(
    null,
  );
  const [showTambahKasus, setShowTambahKasus] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [berkaslist, setBerkaslist] = useState<BerkasUsulan[]>(MOCK_BERKAS);
  const [kandidatList, setKandidatList] = useState(KANDIDAT_WITH_STATUS);

  // Filters for Kandidat
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [satkerFilter, setSatkerFilter] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("");

  // Filters for Berkas & Arsip
  const [berkasSearch, setBerkasSearch] = useState("");
  const [berkasJenisFilter, setBerkasJenisFilter] = useState("");
  const [berkasStatusFilter, setBerkasStatusFilter] = useState("");
  const [berkasTanggalFilter, setBerkasTanggalFilter] = useState("");

  const isSdmSatker = role === "sdm-satker-1";

  // Early return AFTER all hooks
  if (role === "sdm-ue1") {
    return <FlowBUPUe1 />;
  }

  if (activeBerkas) {
    return (
      <div className="p-6">
        <BerkasDetailPage
          berkas={activeBerkas}
          onBack={() => setActiveBerkas(null)}
          role={role}
        />
      </div>
    );
  }

  const handleTambahKasus = (entry: PegawaiWithStatus) => {
    setKandidatList((prev) => [entry, ...prev]);
  };

  const filtered = (kandidatList || []).filter((p) => {
    if (!p) return false;
    if (jenisFilter && p.jenisKasus !== jenisFilter) return false;
    if (statusFilter && p.statusDokumen !== statusFilter) return false;
    if (
      satkerFilter &&
      !p.satker?.toLowerCase().includes(satkerFilter.toLowerCase())
    )
      return false;
    if (
      search &&
      !p.nama?.toLowerCase().includes(search.toLowerCase()) &&
      !p.nip?.includes(search)
    )
      return false;
    return true;
  });

  const allChecked =
    filtered.length > 0 && filtered.every((p: any) => checkedIds.has(p.id));
  const toggleAll = () =>
    setCheckedIds(allChecked ? new Set() : new Set(filtered.map((p) => p.id)));
  const toggleOne = (id: string) => {
    const s = new Set(checkedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setCheckedIds(s);
  };

  const handleGroupConfirm = (
    groups: {
      name: string;
      count: number;
      jenis: "BUP" | "Uzur" | "Meninggal";
    }[],
  ) => {
    const newEntries: BerkasUsulan[] = groups.map((g, i) => ({
      id: `new-${Date.now()}-${i}`,
      nomorUsulan: `USP-2027-${String(berkaslist.length + i + 1).padStart(3, "0")}`,
      namaberkas: g.name,
      jenis: g.jenis,
      jumlahPegawai: g.count,
      status: "Draft" as StatusUsulan,
      tanggalDibuat: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      lengkap: Math.floor(g.count * 0.85),
      belumLengkap: Math.ceil(g.count * 0.15),
      pegawaiIds: Array.from(checkedIds).slice(0, 4),
    }));
    setBerkaslist((prev) => [...prev, ...newEntries]);
    setMainTab("berkas");
    setCheckedIds(new Set());
  };

  const handleSubmitBerkas = (id: string) => {
    setBerkaslist((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "Diajukan ke UE1" as StatusUsulan } : b,
      ),
    );
  };

  return (
    <div className="p-6 space-y-5">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <Users size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">
            Flow 2: Usulan Pemberhentian — BUP, Meninggal, Uzur
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            Kelola kandidat pemberhentian dari hasil monitoring (Flow 1) dan
            buat berkas usulan untuk diajukan ke hierarki yang lebih tinggi.
          </p>
        </div>
      </div>

      {/* Main tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(["kandidat", "berkas", "arsip"] as const).map((tab) => {
          const berkasAktif = (berkaslist || []).filter(
            (b) => b && b.status !== "SK Terbit",
          );
          const berkasArsip = (berkaslist || []).filter(
            (b) => b && b.status === "SK Terbit",
          );
          return (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mainTab === tab ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab === "kandidat"
                ? "Kandidat Pemberhentian"
                : tab === "berkas"
                  ? "Berkas Usulan"
                  : "Arsip"}
              {tab === "berkas" && (
                <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {berkasAktif.length}
                </span>
              )}
              {tab === "arsip" && (
                <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {berkasArsip.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: KANDIDAT ─────────────────────────────────────────────────── */}
      {mainTab === "kandidat" && (
        <>
          {/* Filter panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Filter</p>
              <button
                onClick={() => {
                  setJenisFilter("");
                  setStatusFilter("");
                  setSatkerFilter("");
                  setPeriodeFilter("");
                  setSearch("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Jenis Kasus
                </label>
                <select
                  value={jenisFilter}
                  onChange={(e) => setJenisFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="BUP">BUP</option>
                  <option value="Uzur">Uzur</option>
                  <option value="Meninggal">Meninggal Dunia</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Status Dokumen
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="Belum Lengkap">Belum Lengkap</option>
                  <option value="Lengkap">Lengkap</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Periode BUP
                </label>
                <input
                  value={periodeFilter}
                  onChange={(e) => setPeriodeFilter(e.target.value)}
                  placeholder="Misal: Jan 2027"
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Satker
                </label>
                <input
                  value={satkerFilter}
                  onChange={(e) => setSatkerFilter(e.target.value)}
                  placeholder="Nama satker..."
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Bulk action bar */}
          {checkedIds.size > 0 && (
            <div className="bg-[#162D54] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm font-semibold text-white">
                {checkedIds.size} pegawai dipilih
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowGrouping(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <PackagePlus size={14} /> Buat Berkas Usulan
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                  <Download size={14} /> Export Excel
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                  <Mail size={14} /> Kirim Reminder
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                  <UserPlus size={14} /> Assign PIC
                </button>
              </div>
            </div>
          )}

          {/* Kandidat table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Daftar Kandidat Pemberhentian
                </h3>
                <p className="text-xs text-gray-500">
                  {filtered.length} dari {kandidatList.length} pegawai
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <Search size={14} className="text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari Nama / NIP..."
                    className="bg-transparent text-xs focus:outline-none w-40 text-gray-700 placeholder-gray-400"
                  />
                </div>
                {isSdmSatker && (
                  <button
                    onClick={() => setShowTambahKasus(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ background: "#162D54" }}
                  >
                    <Plus size={14} /> Laporkan Kasus
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={toggleAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      NIP / Nama
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Jabatan / Satker
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Gol / Pangkat
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Jenis Kasus
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      TMT
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Sisa Waktu
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Status Dokumen
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-12 text-center text-gray-400"
                      >
                        <Search size={32} className="mx-auto mb-2 opacity-30" />
                        <p>Tidak ada data yang sesuai filter</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-blue-50/30 transition-colors ${checkedIds.has(p.id) ? "bg-blue-50/50" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={checkedIds.has(p.id)}
                            onChange={() => toggleOne(p.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">
                            {p.nama}
                          </p>
                          <p className="text-gray-400 mt-0.5">{p.nip}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700">{p.jabatan}</p>
                          <p className="text-gray-400 mt-0.5">{p.satker}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {p.pangkatGolongan}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                            style={{ background: getKasusColor(p.jenisKasus) }}
                          >
                            {getKasusLabel(p.jenisKasus)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {p.tanggalBUP}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="font-semibold"
                            style={{ color: getSisaBulanColor(p.sisaBulan) }}
                          >
                            {getSisaBulanLabel(p.sisaBulan, p.jenisKasus)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.statusDokumen === "Lengkap" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {p.statusDokumen === "Lengkap" ? (
                              <Check size={10} />
                            ) : (
                              <AlertCircle size={10} />
                            )}
                            {p.statusDokumen}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedPegawai(p)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                            style={{ background: "#162D54" }}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Menampilkan {filtered.length} dari {kandidatList.length} pegawai
              </p>
              {checkedIds.size > 0 && (
                <button
                  onClick={() => setShowGrouping(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <PackagePlus size={13} /> Buat berkas dari {checkedIds.size}{" "}
                  terpilih
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── TAB 2: BERKAS USULAN ─────────────────────────────────────────────── */}
      {mainTab === "berkas" && (
        <>
          {/* Filter panel for Berkas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                Filter Berkas Usulan
              </p>
              <button
                onClick={() => {
                  setBerkasSearch("");
                  setBerkasJenisFilter("");
                  setBerkasStatusFilter("");
                  setBerkasTanggalFilter("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-4">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Pencarian
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <Search size={14} className="text-gray-400 shrink-0" />
                  <input
                    value={berkasSearch}
                    onChange={(e) => setBerkasSearch(e.target.value)}
                    placeholder="Cari nomor usulan, nama berkas..."
                    className="bg-transparent text-xs focus:outline-none flex-1 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Jenis
                </label>
                <select
                  value={berkasJenisFilter}
                  onChange={(e) => setBerkasJenisFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="BUP">BUP</option>
                  <option value="Uzur">Uzur</option>
                  <option value="Meninggal">Meninggal</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Status
                </label>
                <select
                  value={berkasStatusFilter}
                  onChange={(e) => setBerkasStatusFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="Draft">Draft</option>
                  <option value="Diajukan ke UE1">Diajukan ke UE1</option>
                  <option value="Review UE1">Review UE1</option>
                  <option value="Diterima UE1">Diterima UE1</option>
                  <option value="Review Biro SDM">Review Biro SDM</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Tanggal Dibuat
                </label>
                <input
                  type="date"
                  value={berkasTanggalFilter}
                  onChange={(e) => setBerkasTanggalFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">
                Berkas Usulan Aktif
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {
                  (berkaslist || []).filter((b) => {
                    if (!b) return false;
                    if (b.status === "SK Terbit") return false;
                    if (
                      berkasSearch &&
                      !b.nomorUsulan
                        ?.toLowerCase()
                        .includes(berkasSearch.toLowerCase()) &&
                      !b.namaberkas
                        ?.toLowerCase()
                        .includes(berkasSearch.toLowerCase())
                    )
                      return false;
                    if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                      return false;
                    if (berkasStatusFilter && b.status !== berkasStatusFilter)
                      return false;
                    return true;
                  }).length
                }{" "}
                berkas aktif
              </p>
            </div>
            <button
              onClick={() => setShowGrouping(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: "#162D54" }}
            >
              <Plus size={14} /> Buat Berkas Usulan Baru
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Nomor Usulan
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Nama Berkas
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Jumlah Pegawai
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {berkaslist.filter((b) => {
                    if (b.status === "SK Terbit") return false;
                    if (
                      berkasSearch &&
                      !b.nomorUsulan
                        .toLowerCase()
                        .includes(berkasSearch.toLowerCase()) &&
                      !b.namaberkas
                        .toLowerCase()
                        .includes(berkasSearch.toLowerCase())
                    )
                      return false;
                    if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                      return false;
                    if (berkasStatusFilter && b.status !== berkasStatusFilter)
                      return false;
                    return true;
                  }).length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400"
                      >
                        <FileText
                          size={32}
                          className="mx-auto mb-2 opacity-30"
                        />
                        <p>Tidak ada berkas usulan yang sesuai filter</p>
                        {berkaslist.filter((b) => b.status !== "SK Terbit")
                          .length === 0 && (
                          <button
                            onClick={() => setShowGrouping(true)}
                            className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Buat berkas pertama
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    berkaslist
                      .filter((b) => {
                        if (b.status === "SK Terbit") return false;
                        if (
                          berkasSearch &&
                          !b.nomorUsulan
                            .toLowerCase()
                            .includes(berkasSearch.toLowerCase()) &&
                          !b.namaberkas
                            .toLowerCase()
                            .includes(berkasSearch.toLowerCase())
                        )
                          return false;
                        if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                          return false;
                        if (
                          berkasStatusFilter &&
                          b.status !== berkasStatusFilter
                        )
                          return false;
                        return true;
                      })
                      .map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                          onClick={() => setActiveBerkas(b)}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">
                              {b.nomorUsulan}
                            </p>
                            <p className="text-gray-400 mt-0.5">
                              {b.tanggalDibuat}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {b.namaberkas}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                              style={{ background: getKasusColor(b.jenis) }}
                            >
                              {b.jenis}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-gray-800">
                                {b.jumlahPegawai} pegawai
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-green-600 font-semibold">
                                  ✓ {b.lengkap} lengkap
                                </span>
                                {b.belumLengkap > 0 && (
                                  <span className="text-[9px] text-red-600 font-semibold">
                                    ⚠ {b.belumLengkap} belum
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                              style={{
                                background: statusUsulanColor(b.status),
                              }}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className="flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setActiveBerkas(b)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors hover:opacity-90"
                                style={{ background: "#162D54" }}
                              >
                                Buka <ChevronRight size={12} />
                              </button>
                              {b.status === "Draft" && (
                                <button
                                  onClick={() => setShowValidation(b)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  Ajukan
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 3: ARSIP ─────────────────────────────────────────────────────── */}
      {mainTab === "arsip" && (
        <>
          {/* Filter panel for Arsip */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                Filter Arsip
              </p>
              <button
                onClick={() => {
                  setBerkasSearch("");
                  setBerkasJenisFilter("");
                  setBerkasTanggalFilter("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-4">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Pencarian
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <Search size={14} className="text-gray-400 shrink-0" />
                  <input
                    value={berkasSearch}
                    onChange={(e) => setBerkasSearch(e.target.value)}
                    placeholder="Cari nomor usulan, nama berkas..."
                    className="bg-transparent text-xs focus:outline-none flex-1 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Jenis
                </label>
                <select
                  value={berkasJenisFilter}
                  onChange={(e) => setBerkasJenisFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="BUP">BUP</option>
                  <option value="Uzur">Uzur</option>
                  <option value="Meninggal">Meninggal</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Tanggal SK Terbit
                </label>
                <input
                  type="date"
                  value={berkasTanggalFilter}
                  onChange={(e) => setBerkasTanggalFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Arsip Berkas Selesai
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {
                berkaslist.filter((b) => {
                  if (b.status !== "SK Terbit") return false;
                  if (
                    berkasSearch &&
                    !b.nomorUsulan
                      .toLowerCase()
                      .includes(berkasSearch.toLowerCase()) &&
                    !b.namaberkas
                      .toLowerCase()
                      .includes(berkasSearch.toLowerCase())
                  )
                    return false;
                  if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                    return false;
                  return true;
                }).length
              }{" "}
              berkas telah selesai
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Nomor Usulan
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Nama Berkas
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Jumlah Pegawai
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Tanggal Dibuat
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(berkaslist || []).filter((b) => {
                    if (!b) return false;
                    if (b.status !== "SK Terbit") return false;
                    if (
                      berkasSearch &&
                      !b.nomorUsulan
                        ?.toLowerCase()
                        .includes(berkasSearch.toLowerCase()) &&
                      !b.namaberkas
                        ?.toLowerCase()
                        .includes(berkasSearch.toLowerCase())
                    )
                      return false;
                    if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                      return false;
                    return true;
                  }).length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-400"
                      >
                        <FileText
                          size={32}
                          className="mx-auto mb-2 opacity-30"
                        />
                        <p>Belum ada berkas yang selesai</p>
                      </td>
                    </tr>
                  ) : (
                    (berkaslist || [])
                      .filter((b) => {
                        if (!b) return false;
                        if (b.status !== "SK Terbit") return false;
                        if (
                          berkasSearch &&
                          !b.nomorUsulan
                            ?.toLowerCase()
                            .includes(berkasSearch.toLowerCase()) &&
                          !b.namaberkas
                            ?.toLowerCase()
                            .includes(berkasSearch.toLowerCase())
                        )
                          return false;
                        if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                          return false;
                        return true;
                      })
                      .map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-green-50/30 transition-colors cursor-pointer"
                          onClick={() => setActiveBerkas(b)}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">
                              {b.nomorUsulan}
                            </p>
                            <p className="text-gray-400 mt-0.5">
                              {b.tanggalDibuat}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {b.namaberkas}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                              style={{ background: getKasusColor(b.jenis) }}
                            >
                              {b.jenis}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-gray-800">
                              {b.jumlahPegawai} pegawai
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                            {b.tanggalDibuat}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                              <Check size={10} /> {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveBerkas(b);
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                              Buka
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            {berkaslist.filter((b) => b.status === "SK Terbit").length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Menampilkan{" "}
                  {
                    (berkaslist || []).filter((b) => {
                      if (!b) return false;
                      if (b.status !== "SK Terbit") return false;
                      if (
                        berkasSearch &&
                        !b.nomorUsulan
                          ?.toLowerCase()
                          .includes(berkasSearch.toLowerCase()) &&
                        !b.namaberkas
                          ?.toLowerCase()
                          .includes(berkasSearch.toLowerCase())
                      )
                        return false;
                      if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                        return false;
                      return true;
                    }).length
                  }{" "}
                  dari{" "}
                  {berkaslist.filter((b) => b.status === "SK Terbit").length}{" "}
                  berkas arsip
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {selectedPegawai && (
        <CaseDetail
          pegawai={selectedPegawai}
          role={role}
          statusDokumen={selectedPegawai.statusDokumen}
          onClose={() => setSelectedPegawai(null)}
        />
      )}
      {showGrouping && (
        <SmartGroupingModal
          onClose={() => setShowGrouping(false)}
          onConfirm={handleGroupConfirm}
        />
      )}
      {showTambahKasus && (
        <TambahKasusModal
          onClose={() => setShowTambahKasus(false)}
          onSave={handleTambahKasus}
        />
      )}
      {showValidation && (
        <ValidationModal
          berkas={showValidation}
          onClose={() => setShowValidation(null)}
          onSubmit={() => handleSubmitBerkas(showValidation.id)}
        />
      )}
    </div>
  );
}
