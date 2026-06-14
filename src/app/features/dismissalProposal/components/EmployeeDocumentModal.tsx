import { X } from "lucide-react";
import { getKasusColor, getKasusLabel } from "../../../utils/case.util";
import { BASE_DOKUMEN } from "../dismissalProposal.constants";
import { PegawaiWithStatus } from "../proposalFile.types";
import { DokumenChecklist } from "./DocumentChecklist";

export function PegawaiDokModal({
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