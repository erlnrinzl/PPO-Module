import { ArrowRight } from "lucide-react";
import { Pegawai } from "../../../types/employee.types";
import { View } from "../../../types/view.types";
import { Badge } from "../../../components/ui/Badge";
import { getKasusColor, getKasusLabel, getStatusColor } from "../../../utils/case.util";
import { getFlowForKasus } from "../hooks/useMonitoringData";

interface CaseDetailModalProps {
    selectedPegawai: Pegawai;
    setSelectedPegawai: (v: Pegawai | null) => void;
    onNavigate: (v: View) => void;
};

export function CaseDetailModal({ selectedPegawai, setSelectedPegawai, onNavigate }: CaseDetailModalProps) {
  return (
    <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPegawai(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: '#162D54' }}>
              <div>
                <p className="text-white font-semibold">{selectedPegawai.nama}</p>
                <p className="text-white/60 text-xs">{selectedPegawai.nip} · {selectedPegawai.jabatan}</p>
              </div>
              <button onClick={() => setSelectedPegawai(null)} className="text-white/60 hover:text-white">
                <ArrowRight size={18} className="rotate-180" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Unit Kerja', value: selectedPegawai.unitKerja },
                  { label: 'Satker', value: selectedPegawai.satker },
                  { label: 'Pangkat / Golongan', value: selectedPegawai.pangkatGolongan },
                  { label: 'Tanggal Lahir', value: selectedPegawai.tanggalLahir },
                  { label: 'Tanggal BUP', value: selectedPegawai.tanggalBUP },
                  { label: 'Nomor Kasus', value: selectedPegawai.nomorKasus },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2">Jenis & Status Kasus</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label={getKasusLabel(selectedPegawai.jenisKasus)} color={getKasusColor(selectedPegawai.jenisKasus)} />
                  <Badge label={selectedPegawai.statusProses} color={getStatusColor(selectedPegawai.statusProses)} />
                </div>
                {selectedPegawai.keterangan && (
                  <p className="text-xs text-gray-600 mt-2">{selectedPegawai.keterangan}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ background: '#162D54' }}
                  onClick={() => {
                    const flow = getFlowForKasus(selectedPegawai.jenisKasus);
                    if (flow) { onNavigate(flow); setSelectedPegawai(null); }
                  }}
                >
                  Proses di Flow Terkait
                </button>
                <button
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
                  onClick={() => setSelectedPegawai(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}