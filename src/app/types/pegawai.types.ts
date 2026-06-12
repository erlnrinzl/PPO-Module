export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  unitKerja: string;
  satker: string;
  eselon: string;
  pangkatGolongan: string;
  tmtGolongan: string;
  tanggalLahir: string;
  tanggalBUP: string;
  sisaBulan: number;
  jenisKelamin: "L" | "P";
  statusKepegawaian: string;
  jenisKasus: JenisKasus;
  statusProses: StatusProses;
  tahapanSaat: number;
  totalTahapan: number;
  nomorKasus: string;
  tanggalKasus: string;
  keterangan?: string;
  jenisPengunduranDiri?: "Dengan Hak Pensiun" | "Tanpa Hak Pensiun";
}
