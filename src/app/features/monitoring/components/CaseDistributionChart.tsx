export function CaseDistributionChart() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Distribusi Jenis Kasus</h3>
          <div className="space-y-3">
            {[
              { label: 'BUP', count: 7, color: '#3B82F6' },
              { label: 'MPP', count: 2, color: '#0891B2' },
              { label: 'Pengunduran Diri', count: 2, color: '#8B5CF6' },
              { label: 'Meninggal', count: 1, color: '#6B7280' },
              { label: 'Tewas', count: 1, color: '#991B1B' },
              { label: 'Uzur', count: 1, color: '#7C3AED' },
              { label: 'Hilang', count: 1, color: '#374151' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-800">{item.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(item.count / 7) * 100}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
    );
}