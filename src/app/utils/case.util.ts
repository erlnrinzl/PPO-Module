import { JenisKasus, StatusProses } from "../types/employee.types";

export const getSisaBulanColor = (bulan: number): string => {
  if (bulan <= 0) return "#6B7280";
  if (bulan <= 3) return "#EF4444";
  if (bulan <= 6) return "#F97316";
  if (bulan <= 12) return "#F59E0B";
  return "#10B981";
};

export const getSisaBulanLabel = (bulan: number, jenis: JenisKasus): string => {
  if (jenis !== "BUP" && jenis !== "MPP") return "-";
  if (bulan <= 0) return "Sudah BUP";
  if (bulan <= 3) return `${bulan} bulan (Kritis)`;
  if (bulan <= 6) return `${bulan} bulan (Segera)`;
  if (bulan <= 12) return `${bulan} bulan (Perhatian)`;
  return `${bulan} bulan`;
};

export const getStatusColor = (status: StatusProses): string => {
  switch (status) {
    case "Belum Diproses":
      return "#6B7280";
    case "Dalam Proses":
      return "#3B82F6";
    case "Menunggu Verifikasi":
      return "#F59E0B";
    case "Menunggu Persetujuan":
      return "#8B5CF6";
    case "Selesai":
      return "#10B981";
    case "Ditolak":
      return "#EF4444";
    case "Perlu Tindak Lanjut":
      return "#F97316";
    default:
      return "#6B7280";
  }
};

export const getKasusColor = (kasus: JenisKasus): string => {
  switch (kasus) {
    case "BUP":
      return "#2563EB";
    case "Meninggal":
      return "#6B7280";
    case "Uzur":
      return "#7C3AED";
    case "Tewas":
      return "#991B1B";
    case "PengunduranDiri":
      return "#7C3AED";
    case "Hilang":
      return "#374151";
    case "Ditemukan":
      return "#059669";
    case "MPP":
      return "#0891B2";
    case "Normal":
      return "#10B981";
    default:
      return "#6B7280";
  }
};

export const getKasusLabel = (kasus: JenisKasus): string => {
  switch (kasus) {
    case "BUP":
      return "Batas Usia Pensiun";
    case "Meninggal":
      return "Meninggal Dunia";
    case "Uzur":
      return "Uzur / Sakit";
    case "Tewas":
      return "Tewas";
    case "PengunduranDiri":
      return "Pengunduran Diri";
    case "Hilang":
      return "Hilang";
    case "Ditemukan":
      return "Ditemukan";
    case "MPP":
      return "Masa Persiapan Pensiun";
    case "Normal":
      return "Normal";
    default:
      return kasus;
  }
};