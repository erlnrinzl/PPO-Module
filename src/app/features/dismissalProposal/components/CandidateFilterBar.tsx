interface CandidateFilterBarProps {
  jenisFilter: string;
  statusFilter: string;
  periodeFilter: string;
  satkerFilter: string;
  setJenisFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setPeriodeFilter: (value: string) => void;
  setSatkerFilter: (value: string) => void;
  onReset: () => void;
}

export function CandidateFilterBar({
  jenisFilter,
  statusFilter,
  periodeFilter,
  satkerFilter,
  setJenisFilter,
  setStatusFilter,
  setPeriodeFilter,
  setSatkerFilter,
  onReset,
}: CandidateFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">Filter</p>
        <button
          onClick={onReset}
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
            onChange={(e) => setJenisFilter(e.target.value)}
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
            onChange={(e) => setStatusFilter(e.target.value)}
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
            onChange={(e) => setPeriodeFilter(e.target.value)}
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
            onChange={(e) => setSatkerFilter(e.target.value)}
            placeholder="Nama satker..."
            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
