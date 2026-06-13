import { useState } from 'react';
import type { JenisKasus, Pegawai } from '../../../types/employee.types';
import { View } from '../../../types/view.types';
import { MOCK_PEGAWAI } from '../../../data/mockData';
import { Role } from '../../../types/role.types';

export function getFlowForKasus(k: JenisKasus): View | null {
  if (k === 'BUP' || k === 'Meninggal' || k === 'Uzur') return 'bup';
  if (k === 'Tewas') return 'tewas';
  if (k === 'PengunduranDiri') return 'pengunduran-diri';
  if (k === 'Hilang' || k === 'Ditemukan') return 'hilang';
  if (k === 'MPP') return 'mpp';
  return null;
}


export function useMonitoringData(role: Role) {
  const [search, setSearch] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  
  const allData = role === 'pegawai'
  ? MOCK_PEGAWAI.filter(p => p.id === '8')
  : role === 'atasan'
  ? MOCK_PEGAWAI.filter(p => ['8', '14', '9'].includes(p.id))
  : MOCK_PEGAWAI;

  const filtered = allData.filter(p => {
    const matchSearch =
      !search ||
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nip.includes(search) ||
      p.satker.toLowerCase().includes(search.toLowerCase());
    const matchJenis = !jenisFilter || p.jenisKasus === jenisFilter;
    const matchStatus = !statusFilter || p.statusProses === statusFilter;
    return matchSearch && matchJenis && matchStatus;
  });

  const kritis = allData.filter(p => p.sisaBulan <= 3 && p.sisaBulan > 0).length;
  const segera = allData.filter(p => p.sisaBulan > 3 && p.sisaBulan <= 12).length;
  const dalamProses = allData.filter(p => p.statusProses === 'Dalam Proses' || p.statusProses === 'Menunggu Verifikasi' || p.statusProses === 'Menunggu Persetujuan').length;
  const perluTindak = allData.filter(p => p.statusProses === 'Perlu Tindak Lanjut' || p.statusProses === 'Belum Diproses').length;
  
  return {
    allData,
    filtered,
    kritis,
    segera,
    dalamProses,
    perluTindak,
    search,
    setSearch,
    jenisFilter,
    setJenisFilter,
    statusFilter,
    setStatusFilter,
    selectedPegawai,
    setSelectedPegawai
  };
}
