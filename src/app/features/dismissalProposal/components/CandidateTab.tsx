import {
  AlertCircle,
  Check,
  Download,
  Mail,
  PackagePlus,
  Plus,
  Search,
  UserPlus,
} from "lucide-react";
import {
  getKasusColor,
  getKasusLabel,
  getSisaBulanColor,
  getSisaBulanLabel,
} from "../../../utils/case.util";
import type { PegawaiWithStatus } from "../dismissal-proposal.types";

interface CandidateTabProps {
  jenisFilter: string;
  statusFilter: string;
  satkerFilter: string;
  periodeFilter: string;
  search: string;
  checkedIds: Set<string>;
  allChecked: boolean;
  filtered: PegawaiWithStatus[];
  kandidatListCount: number;
  isSdmSatker: boolean;
  onSetJenisFilter: (value: string) => void;
  onSetStatusFilter: (value: string) => void;
  onSetSatkerFilter: (value: string) => void;
  onSetPeriodeFilter: (value: string) => void;
  onSetSearch: (value: string) => void;
  onResetFilters: () => void;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onShowGrouping: () => void;
  onShowTambahKasus: () => void;
  onSelectPegawai: (pegawai: PegawaiWithStatus) => void;
}

export function CandidateTab({
  jenisFilter,
  statusFilter,
  satkerFilter,
  periodeFilter,
  search,
  checkedIds,
  allChecked,
  filtered,
  kandidatListCount,
  isSdmSatker,
  onSetJenisFilter,
  onSetStatusFilter,
  onSetSatkerFilter,
  onSetPeriodeFilter,
  onSetSearch,
  onResetFilters,
  onToggleAll,
  onToggleOne,
  onShowGrouping,
  onShowTambahKasus,
  onSelectPegawai,
}: CandidateTabProps) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Filter</p>
          <button
            onClick={onResetFilters}
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
              onChange={(e) => onSetJenisFilter(e.target.value)}
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
              onChange={(e) => onSetStatusFilter(e.target.value)}
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
              onChange={(e) => onSetPeriodeFilter(e.target.value)}
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
              onChange={(e) => onSetSatkerFilter(e.target.value)}
              placeholder="Nama satker..."
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {checkedIds.size > 0 && (
        <div className="bg-[#162D54] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm font-semibold text-white">
            {checkedIds.size} pegawai dipilih
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onShowGrouping}
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-gray-800">
              Daftar Kandidat Pemberhentian
            </h3>
            <p className="text-xs text-gray-500">
              {filtered.length} dari {kandidatListCount} pegawai
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => onSetSearch(e.target.value)}
                placeholder="Cari Nama / NIP..."
                className="bg-transparent text-xs focus:outline-none w-40 text-gray-700 placeholder-gray-400"
              />
            </div>
            {isSdmSatker && (
              <button
                onClick={onShowTambahKasus}
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
                    onChange={onToggleAll}
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
                  <td colSpan={9} className="py-12 text-center text-gray-400">
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
                        onChange={() => onToggleOne(p.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{p.nama}</p>
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
                        onClick={() => onSelectPegawai(p)}
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
            Menampilkan {filtered.length} dari {kandidatListCount} pegawai
          </p>
          {checkedIds.size > 0 && (
            <button
              onClick={onShowGrouping}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <PackagePlus size={13} /> Buat berkas dari {checkedIds.size}{" "}
              terpilih
            </button>
          )}
        </div>
      </div>
    </>
  );
}
