import { Check, FileText, Search } from "lucide-react";
import { getKasusColor } from "../../../utils/case.util";
import type { BerkasUsulan } from "../dismissal-proposal.types";

interface ArchiveTabProps {
  berkasList: BerkasUsulan[];
  berkasSearch: string;
  berkasJenisFilter: string;
  berkasTanggalFilter: string;
  onSetBerkasSearch: (value: string) => void;
  onSetBerkasJenisFilter: (value: string) => void;
  onSetBerkasTanggalFilter: (value: string) => void;
  onResetFilters: () => void;
  onOpenBerkas: (berkas: BerkasUsulan) => void;
}

function matchesArchiveFilter(
  berkas: BerkasUsulan,
  berkasSearch: string,
  berkasJenisFilter: string,
) {
  if (berkas.status !== "SK Terbit") return false;
  if (
    berkasSearch &&
    !berkas.nomorUsulan.toLowerCase().includes(berkasSearch.toLowerCase()) &&
    !berkas.namaberkas.toLowerCase().includes(berkasSearch.toLowerCase())
  )
    return false;
  if (berkasJenisFilter && berkas.jenis !== berkasJenisFilter) return false;
  return true;
}

export function ArchiveTab({
  berkasList,
  berkasSearch,
  berkasJenisFilter,
  berkasTanggalFilter,
  onSetBerkasSearch,
  onSetBerkasJenisFilter,
  onSetBerkasTanggalFilter,
  onResetFilters,
  onOpenBerkas,
}: ArchiveTabProps) {
  const filtered = berkasList.filter((b) =>
    matchesArchiveFilter(b, berkasSearch, berkasJenisFilter),
  );
  const totalArchived = berkasList.filter(
    (b) => b.status === "SK Terbit",
  ).length;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Filter Arsip</p>
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
              <Search size={14} className="text-gray-400 shrink-0" />
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
              Tanggal SK Terbit
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

      <div>
        <h3 className="font-semibold text-gray-800">Arsip Berkas Selesai</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {filtered.length} berkas telah selesai
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Belum ada berkas yang selesai</p>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-green-50/30 transition-colors cursor-pointer"
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
                          onOpenBerkas(b);
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
        {totalArchived > 0 && (
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Menampilkan {filtered.length} dari {totalArchived} berkas arsip
            </p>
          </div>
        )}
      </div>
    </>
  );
}
