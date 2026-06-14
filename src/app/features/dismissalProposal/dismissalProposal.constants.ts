import { MOCK_PEGAWAI } from "../../data/mockData";
import type { Dokumen } from "../../types/proposalFile.types";
import type {
  BerkasUsulan,
  LifecycleItem,
  PegawaiWithStatus,
} from "./dismissal-proposal.types";

export const BASE_DOKUMEN: Dokumen[] = [
  { id: "d1", label: "Clearance BMN", wajib: true, status: "uploaded" },
  { id: "d2", label: "Clearance Ikatan Dinas", wajib: true, status: "missing" },
  {
    id: "d3",
    label: "Surat Pernyataan Tidak Pernah Hukdis Sedang/Berat",
    wajib: true,
    status: "uploaded",
  },
  { id: "d4", label: "Data Tapem (TASPEN)", wajib: true, status: "uploaded" },
  {
    id: "d5",
    label: "Data Profil Riwayat Jabatan (HRIS)",
    wajib: true,
    status: "uploaded",
  },
  { id: "d6", label: "Data PPF (CLPB)", wajib: true, status: "missing" },
  {
    id: "d7",
    label: "Fotokopi KTP yang masih berlaku",
    wajib: false,
    status: "uploaded",
  },
  { id: "d8", label: "Pas Foto 3x4 Terbaru", wajib: false, status: "missing" },
];

export const BUP_KASUS = ["BUP", "Meninggal", "Uzur"] as const;

export const KANDIDAT_DATA = MOCK_PEGAWAI.filter((p) =>
  BUP_KASUS.includes(p.jenisKasus as (typeof BUP_KASUS)[number]),
);

export const KANDIDAT_WITH_STATUS: PegawaiWithStatus[] = KANDIDAT_DATA.map(
  (p, i) => ({
    ...p,
    statusDokumen: (i % 3 === 2 ? "Belum Lengkap" : "Lengkap") as
      | "Lengkap"
      | "Belum Lengkap",
  }),
);

export const LIFECYCLE: LifecycleItem[] = [
  { status: "Draft", actor: "Unit SDM Satker", flow: "Flow 2" },
  { status: "Dokumen Lengkap", actor: "Unit SDM Satker", flow: "Flow 2" },
  { status: "Diajukan ke UE1", actor: "Unit SDM Satker", flow: "Flow 2" },
  { status: "Review UE1", actor: "Unit SDM UE1", flow: "Flow 2" },
  { status: "Diterima UE1", actor: "Unit SDM UE1", flow: "Flow 2" },
  { status: "Review Biro SDM", actor: "Biro SDM", flow: "Flow 6" },
  { status: "Usul Pertek", actor: "Biro SDM", flow: "Flow 6" },
  { status: "SK Terbit", actor: "Biro SDM", flow: "Flow 6" },
];

const BERKAS_PEGAWAI_IDS: Record<string, string[]> = {
  u1: ["1", "2", "3", "4", "5", "6"],
  u2: ["7", "8", "9", "10"],
  u3: ["11", "12"],
};

export const MOCK_BERKAS: BerkasUsulan[] = [
  {
    id: "u1",
    nomorUsulan: "USP-2027-001",
    namaberkas: "BUP Januari 2027",
    jenis: "BUP",
    jumlahPegawai: 35,
    status: "Draft",
    tanggalDibuat: "02 Jan 2027",
    lengkap: 32,
    belumLengkap: 3,
    pegawaiIds: BERKAS_PEGAWAI_IDS.u1,
  },
  {
    id: "u2",
    nomorUsulan: "USP-2027-002",
    namaberkas: "BUP Februari 2027",
    jenis: "BUP",
    jumlahPegawai: 22,
    status: "Diajukan ke UE1",
    tanggalDibuat: "01 Feb 2027",
    lengkap: 22,
    belumLengkap: 0,
    pegawaiIds: BERKAS_PEGAWAI_IDS.u2,
  },
  {
    id: "u3",
    nomorUsulan: "USP-2027-003",
    namaberkas: "Uzur Triwulan I",
    jenis: "Uzur",
    jumlahPegawai: 5,
    status: "Review UE1",
    tanggalDibuat: "15 Mar 2027",
    lengkap: 5,
    belumLengkap: 0,
    pegawaiIds: BERKAS_PEGAWAI_IDS.u3,
  },
];

export const PENYEBAB_UZUR = [
  "Sakit Berkepanjangan (> 1 tahun)",
  "Gangguan Jiwa / Mental",
  "Lumpuh / Cacat Tetap",
  "Penyakit Kronis Terminal",
  "Tidak mampu menjalankan tugas secara permanen",
];
