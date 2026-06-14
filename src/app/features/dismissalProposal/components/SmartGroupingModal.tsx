import { AlertCircle, CheckSquare, PackagePlus, Square, X } from "lucide-react";
import { useState } from "react";
import { getKasusColor } from "../../../utils/case.util";

export function SmartGroupingModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (
    groups: {
      name: string;
      count: number;
      jenis: "BUP" | "Uzur" | "Meninggal";
    }[],
  ) => void;
}) {
  const suggestions = [
    { name: "BUP Januari 2027", count: 35, jenis: "BUP" as const },
    { name: "BUP Februari 2027", count: 22, jenis: "BUP" as const },
    { name: "Uzur Triwulan I", count: 3, jenis: "Uzur" as const },
    { name: "Meninggal Dunia", count: 1, jenis: "Meninggal" as const },
  ];
  const [chosen, setChosen] = useState<Set<number>>(new Set([0, 1]));

  const toggle = (i: number) => {
    const next = new Set(chosen);
    next.has(i) ? next.delete(i) : next.add(i);
    setChosen(next);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: "#162D54" }}
        >
          <div>
            <p className="text-white font-semibold">
              Smart Grouping — Buat Berkas Usulan
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Sistem menyarankan pengelompokan otomatis berdasarkan jenis kasus
              dan periode
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
            <AlertCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Pilih grouping yang ingin dibuat menjadi berkas usulan. Anda dapat
              memilih lebih dari satu.
            </p>
          </div>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => toggle(i)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${chosen.has(i) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-3">
                  {chosen.has(i) ? (
                    <CheckSquare size={20} className="text-blue-600 shrink-0" />
                  ) : (
                    <Square size={20} className="text-gray-300 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      → {s.count} pegawai
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: getKasusColor(s.jenis) }}
                  >
                    {s.jenis}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm(suggestions.filter((_, i) => chosen.has(i)));
              onClose();
            }}
            disabled={chosen.size === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40 ml-auto"
            style={{ background: "#162D54" }}
          >
            <PackagePlus size={14} /> Buat {chosen.size} Berkas Usulan
          </button>
        </div>
      </div>
    </div>
  );
}
