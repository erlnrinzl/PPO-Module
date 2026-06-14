import { useState } from "react";
import { DokStatus, Dokumen } from "../../../types/proposalFile.types";
import { CheckSquare, Square } from "lucide-react";

export function DokumenChecklist({
  dokumen,
  editable,
}: {
  dokumen: Dokumen[];
  editable: boolean;
}) {
  const [docs, setDocs] = useState(dokumen);
  const toggle = (id: string) => {
    if (!editable) return;
    setDocs((d) =>
      d.map((x) =>
        x.id === id
          ? {
              ...x,
              status:
                x.status === "uploaded" ? "missing" : ("uploaded" as DokStatus),
            }
          : x,
      ),
    );
  };
  const uploaded = docs.filter((d) => d.status !== "missing").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-700">
          Kelengkapan Berkas ({uploaded}/{docs.length})
        </p>
        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${(uploaded / docs.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => toggle(doc.id)}
            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${editable ? "cursor-pointer" : "cursor-default"} ${doc.status !== "missing" ? "bg-green-50 border-green-200" : "bg-red-50/50 border-red-200"}`}
          >
            {doc.status !== "missing" ? (
              <CheckSquare size={16} className="text-green-600 shrink-0" />
            ) : (
              <Square size={16} className="text-red-400 shrink-0" />
            )}
            <p className="text-xs font-medium text-gray-700 flex-1">
              {doc.label}
            </p>
            <div className="flex items-center gap-1.5">
              {doc.wajib && (
                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                  Wajib
                </span>
              )}
              {doc.status === "verified" ? (
                <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Verified
                </span>
              ) : doc.status === "uploaded" ? (
                <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Uploaded
                </span>
              ) : (
                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                  Belum
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}