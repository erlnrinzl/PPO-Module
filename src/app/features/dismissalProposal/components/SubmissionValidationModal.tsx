import { AlertCircle, Check, Send } from "lucide-react";
import { BerkasUsulan } from "../proposalFile.types";

export function ValidationModal({
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