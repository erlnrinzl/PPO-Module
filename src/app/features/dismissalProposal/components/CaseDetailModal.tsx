import { useState } from "react";
import { Pegawai } from "../../../types/employee.types";
import { Role } from "../../../types/role.types";
import { StatusUsulan } from "../proposalFile.types";
import { getBerkasReqForJenis } from "../utils/getDocumentRequirements";
import { BerkasReq } from "../../../types/proposalFile.types";
import { getKasusColor, getKasusLabel } from "../../../utils/case.util";
import { WorkflowStepper } from "../../../components/WorkflowStepper";
import { FLOW_STEPS } from "../../../constants/approvalTemplates";
import { AlertCircle, Check, ChevronDown, Eye, FileText, Send, Upload, X } from "lucide-react";

export function CaseDetail({
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