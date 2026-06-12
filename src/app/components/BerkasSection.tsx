import { useState } from 'react';
import { FileText, Eye, CheckCircle, Clock, XCircle, ShieldCheck, ChevronDown, ChevronUp, Upload, Paperclip } from 'lucide-react';
import { DocumentViewer, type BerkasFile } from './DocumentViewer';
export type { BerkasFile };

interface Props {
  berkas: BerkasFile[];
  title?: string;
  canUpload?: boolean;
}

const STATUS_CFG = {
  uploaded:  { label: 'Terupload',    bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  dot: 'bg-green-500',  Icon: CheckCircle },
  verified:  { label: 'Terverifikasi',bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   dot: 'bg-blue-500',   Icon: ShieldCheck },
  pending:   { label: 'Belum Upload', bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-500',   dot: 'bg-gray-300',   Icon: Clock },
  rejected:  { label: 'Ditolak',      bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    dot: 'bg-red-500',    Icon: XCircle },
};

export function BerkasSection({ berkas, title = 'Berkas Terlampir', canUpload = false }: Props) {
  const [viewing, setViewing] = useState<BerkasFile | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const uploaded = berkas.filter(b => b.status !== 'pending').length;
  const pct = Math.round((uploaded / berkas.length) * 100);

  return (
    <>
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Paperclip size={15} className="text-[#162D54]" />
            <span className="text-sm font-semibold text-gray-800">{title}</span>
            <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5 tabular-nums">
              {uploaded}/{berkas.length} berkas
            </span>
            {/* Progress bar */}
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pct === 100 ? '#22C55E' : '#162D54' }}
              />
            </div>
          </div>
          {collapsed
            ? <ChevronDown size={15} className="text-gray-400" />
            : <ChevronUp size={15} className="text-gray-400" />}
        </button>

        {/* List */}
        {!collapsed && (
          <div className="divide-y divide-gray-100">
            {berkas.map(b => {
              const cfg = STATUS_CFG[b.status];
              const StatusIcon = cfg.Icon;
              return (
                <div
                  key={b.id}
                  className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50/60 transition-colors"
                >
                  {/* File icon */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EFF3FB' }}>
                    <FileText size={17} style={{ color: '#162D54' }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{b.nama}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                        <StatusIcon size={9} />
                        {cfg.label}
                      </span>
                      {b.status !== 'pending' && (
                        <span className="text-[10px] text-gray-400">{b.tipe} · {b.ukuran} · {b.tanggal}</span>
                      )}
                      {b.keterangan && (
                        <span className="text-[10px] text-red-500 truncate">{b.keterangan}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {canUpload && b.status === 'pending' && (
                      <button className="flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-[#162D54] hover:text-[#162D54] transition-colors">
                        <Upload size={11} />
                        Unggah
                      </button>
                    )}
                    <button
                      onClick={() => setViewing(b)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl text-white transition-colors hover:opacity-90"
                      style={{ background: '#162D54' }}
                    >
                      <Eye size={12} />
                      Lihat Berkas
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Document viewer portal */}
      {viewing && <DocumentViewer doc={viewing} onClose={() => setViewing(null)} />}
    </>
  );
}
