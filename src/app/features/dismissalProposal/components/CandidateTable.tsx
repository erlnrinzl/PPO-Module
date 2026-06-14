import { AlertCircle, Check, PackagePlus, Plus, Search } from "lucide-react";
import {
  getKasusColor,
  getKasusLabel,
  getSisaBulanColor,
  getSisaBulanLabel,
} from "../../../utils/case.util";
import type { PegawaiWithStatus } from "../dismissal-proposal.types";

interface CandidateTableProps {
  filtered: PegawaiWithStatus[];
  kandidatCount: number;
  checkedIds: Set<string>;
  allChecked: boolean;
  search: string;
  isSdmSatker: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  setSearch: (value: string) => void;
  onShowTambahKasus: () => void;
  onSelectPegawai: (pegawai: PegawaiWithStatus) => void;
  onShowGrouping: () => void;
}

export function CandidateTable({
  filtered,
  kandidatCount,
  checkedIds,
  allChecked,
  search,
  isSdmSatker,
  onToggleAll,
  onToggleOne,
  setSearch,
  onShowTambahKasus,
  onSelectPegawai,
  onShowGrouping,
}: CandidateTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-gray-800">
            Daftar Kandidat Pemberhentian
          </h3>
          <p className="text-xs text-gray-500">
            {filtered.length} dari {kandidatCount} pegawai
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
          Menampilkan {filtered.length} dari {kandidatCount} pegawai
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
  );
}
