// -----------------------------------------------
import { useMonitoringData } from '../hooks/useMonitoringData';
import type { Role } from '../../../types/role.types';
import type { View } from '../../../types/view.types';
import { MonitoringStatRow } from './MonitoringStatRow';
import { TrendChart } from './TrendChart';
import { CaseDistributionChart } from './CaseDistributionChart';
import { CaseTable } from './CaseTable';
import { CaseTableFilter } from './CaseTableFilter';
import { Pagination } from '../../../components/ui/pagination';
import { CaseDetailModal } from './CaseDetailModal';
// -----------------------------------------------


interface MonitoringDashboardProps {
  role: Role;
  onNavigate: (v: View) => void;
}

export function MonitoringDashboard({ role, onNavigate }: MonitoringDashboardProps) {

    const { allData, filtered, kritis, segera, dalamProses, perluTindak,
          search, setSearch, jenisFilter, setJenisFilter,
          statusFilter, setStatusFilter,
          selectedPegawai, setSelectedPegawai } = useMonitoringData(role);

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <MonitoringStatRow
        kritis={kritis}
        segera={segera}
        dalamProses={dalamProses}
        perluTindak={perluTindak}
        allDataLength={allData.length}
      />

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TrendChart />
        <CaseDistributionChart />
      </div>

      {/* Table section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <CaseTableFilter search={search} setSearch={setSearch} jenisFilter={jenisFilter} setJenisFilter={setJenisFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

        <div className="overflow-x-auto">
          <CaseTable filtered={filtered} setSelectedPegawai={setSelectedPegawai} onNavigate={onNavigate} role={role} />
        </div>

        <Pagination filteredLength={filtered.length} allDataLength={allData.length} />
      </div>

      {/* Detail Modal */}
      {selectedPegawai && (
        <CaseDetailModal selectedPegawai={selectedPegawai} setSelectedPegawai={setSelectedPegawai} onNavigate={onNavigate} />
      )}
    </div>
  );
}
