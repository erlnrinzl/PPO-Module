import type { Pegawai } from "../../types/employee.types";

export type StatusUsulan =
  | "Draft"
  | "Dokumen Lengkap"
  | "Diajukan ke UE1"
  | "Review UE1"
  | "Diterima UE1"
  | "Review Biro SDM"
  | "Usul Pertek"
  | "SK Terbit";

export type JenisLaporan = "Meninggal" | "Uzur";

export type PegawaiWithStatus = Pegawai & {
  statusDokumen: "Lengkap" | "Belum Lengkap";
};

export interface BerkasUsulan {
  id: string;
  nomorUsulan: string;
  namaberkas: string;
  jenis: "BUP" | "Uzur" | "Meninggal";
  jumlahPegawai: number;
  status: StatusUsulan;
  tanggalDibuat: string;
  lengkap: number;
  belumLengkap: number;
  pegawaiIds: string[];
}

export interface LifecycleItem {
  status: StatusUsulan;
  actor: string;
  flow: string;
}
