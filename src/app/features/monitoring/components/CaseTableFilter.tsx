import { Download, Search } from "lucide-react";
import { JENIS_OPTIONS, STATUS_OPTIONS } from "../../../constants/jenisKasus";

interface CaseTableFilterProps {
    search: string;
    setSearch: (s: string) => void;
    jenisFilter: string;
    setJenisFilter: (s: string) => void;
    statusFilter: string;
    setStatusFilter: (s: string) => void;
};

export function CaseTableFilter({ search, setSearch, jenisFilter, setJenisFilter, statusFilter, setStatusFilter }: CaseTableFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 mr-auto">Daftar Pemantauan Pegawai</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari NIP / Nama / Satker..."
                className="bg-transparent text-xs focus:outline-none w-44 text-gray-700 placeholder-gray-400"
              />
            </div>
            <select
              value={jenisFilter}
              onChange={e => setJenisFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none"
            >
              {JENIS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
              <Download size={13} />
              Export
            </button>
          </div>
        </div>
    );
}