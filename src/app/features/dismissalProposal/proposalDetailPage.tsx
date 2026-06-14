import { useState } from "react";
import { BerkasUsulan, PegawaiWithStatus } from "./proposalFile.types";
import { useProposalDetail } from "./hooks/useProposalDetail";
import { AlertCircle, ArrowLeft, Check, ClipboardList, Search, Users } from "lucide-react";
import { Role } from "../../types/role.types";
import { getKasusColor, getKasusLabel } from "../../utils/case.util";
import { statusUsulanColor } from "./utils/approvalStatusColor";
import { LIFECYCLE } from "./dismissalProposal.constants";
import { CaseDetail } from "./components/CaseDetailModal";

export function BerkasDetailPage({
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