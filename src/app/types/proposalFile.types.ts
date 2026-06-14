export type DokStatus = "uploaded" | "missing" | "verified";
export type Dokumen = {
  id: string;
  label: string;
  wajib: boolean;
  status: DokStatus;
};

export interface BerkasReq {
  id: string;
  nama: string;
  source: "satu-kemenkeu" | "upload";
}
