import { ArrowRight, Eye, Search } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { getKasusColor, getKasusLabel, getSisaBulanColor, getSisaBulanLabel, getStatusColor } from "../../../utils/case.util";
import { Role } from "../../../types/role.types";
import { View } from "../../../types/view.types";
import { Pegawai } from "../../../types/employee.types";
import { getFlowForKasus } from "../hooks/useMonitoringData";

interface CaseTableProps {
    filtered: Pegawai[];
    setSelectedPegawai: (p: Pegawai) => void;
    onNavigate: (v: View) => void;
    role: Role;
};

export function CaseTable({ filtered, setSelectedPegawai, onNavigate, role }: CaseTableProps) {
    return (
                  <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">No.</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">NIP / Nama</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jabatan / Satker</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Gol / Pangkat</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tgl BUP</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Sisa Waktu</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Jenis Kasus</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Tahapan</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    <Search size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Tidak ada data yang sesuai filter</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const sisaColor = getSisaBulanColor(p.sisaBulan);
                  const kasusColor = getKasusColor(p.jenisKasus);
                  const statusColor = getStatusColor(p.statusProses);
                  const targetFlow = getFlowForKasus(p.jenisKasus);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
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
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.pangkatGolongan}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.tanggalBUP}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold" style={{ color: sisaColor }}>
                          {getSisaBulanLabel(p.sisaBulan, p.jenisKasus)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge label={getKasusLabel(p.jenisKasus)} color={kasusColor} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge label={p.statusProses} color={statusColor} />
                      </td>
                      <td className="px-4 py-3">
                        {p.totalTahapan > 0 ? (
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
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedPegawai(p); }}
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Eye size={13} />
                            <span>Detail</span>
                          </button>
                          {targetFlow && role !== 'pegawai' && (
                            <button
                              onClick={e => { e.stopPropagation(); onNavigate(targetFlow); }}
                              className="flex items-center gap-1 text-white px-2 py-1 rounded-lg transition-colors"
                              style={{ background: kasusColor }}
                            >
                              <span>Proses</span>
                              <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
    );
}