interface PaginationProps {
    filteredLength: number;
    allDataLength: number;
}

export function Pagination({ filteredLength, allDataLength }: PaginationProps) {
    return (
    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Menampilkan {filteredLength} dari {allDataLength} pegawai</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${n === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
    );
}