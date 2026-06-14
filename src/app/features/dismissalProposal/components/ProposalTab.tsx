import { ChevronRight, FileText, Plus } from "lucide-react";
import { getKasusColor } from "../../../utils/case.util";
import type { BerkasUsulan } from "../dismissal-proposal.types";
import { statusUsulanColor } from "../utils/approvalStatusColor";

interface ProposalTabProps {
  berkasList: BerkasUsulan[];
  berkasSearch: string;
  berkasJenisFilter: string;
  berkasStatusFilter: string;
  berkasTanggalFilter: string;
  onSetBerkasSearch: (value: string) => void;
  onSetBerkasJenisFilter: (value: string) => void;
  onSetBerkasStatusFilter: (value: string) => void;
  onSetBerkasTanggalFilter: (value: string) => void;
  onResetFilters: () => void;
  onShowGrouping: () => void;
  onOpenBerkas: (berkas: BerkasUsulan) => void;
  onShowValidation: (berkas: BerkasUsulan) => void;
}

function matchesProposalFilter(
  berkas: BerkasUsulan,
  berkasSearch: string,
  berkasJenisFilter: string,
  berkasStatusFilter: string,
) {
  if (berkas.status === "SK Terbit") return false;
  if (
    berkasSearch &&
    !berkas.nomorUsulan.toLowerCase().includes(berkasSearch.toLowerCase()) &&
    !berkas.namaberkas.toLowerCase().includes(berkasSearch.toLowerCase())
  )
    return false;
  if (berkasJenisFilter && berkas.jenis !== berkasJenisFilter) return false;
  if (berkasStatusFilter && berkas.status !== berkasStatusFilter) return false;
  return true;
}

export function ProposalTab({
  berkasList,
  berkasSearch,
  berkasJenisFilter,
  berkasStatusFilter,
  berkasTanggalFilter,
  onSetBerkasSearch,
  onSetBerkasJenisFilter,
  onSetBerkasStatusFilter,
  onSetBerkasTanggalFilter,
  onResetFilters,
  onShowGrouping,
  onOpenBerkas,
  onShowValidation,
}: ProposalTabProps) {
  const filtered = berkasList.filter((b) =>
    matchesProposalFilter(
      b,
      berkasSearch,
      berkasJenisFilter,
      berkasStatusFilter,
    ),
  );

  const activeCount = filtered.length;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">
            Filter Berkas Usulan
          </p>
          <button
            onClick={onResetFilters}
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
              <FileText size={14} className="text-gray-400 shrink-0" />
              <input
                value={berkasSearch}
                onChange={(e) => onSetBerkasSearch(e.target.value)}
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
              onChange={(e) => onSetBerkasJenisFilter(e.target.value)}
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
              onChange={(e) => onSetBerkasStatusFilter(e.target.value)}
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
              onChange={(e) => onSetBerkasTanggalFilter(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Berkas Usulan Aktif</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {activeCount} berkas aktif
          </p>
        </div>
        <button
          onClick={onShowGrouping}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Tidak ada berkas usulan yang sesuai filter</p>
                    {berkasList.filter((b) => b.status !== "SK Terbit")
                      .length === 0 && (
                      <button
                        onClick={onShowGrouping}
                        className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Buat berkas pertama
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => onOpenBerkas(b)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {b.nomorUsulan}
                      </p>
                      <p className="text-gray-400 mt-0.5">{b.tanggalDibuat}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.namaberkas}</td>
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
                        style={{ background: statusUsulanColor(b.status) }}
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
                          onClick={() => onOpenBerkas(b)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors hover:opacity-90"
                          style={{ background: "#162D54" }}
                        >
                          Buka <ChevronRight size={12} />
                        </button>
                        {b.status === "Draft" && (
                          <button
                            onClick={() => onShowValidation(b)}
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
  );
}
