import { Step } from "../components/WorkflowStepper";

export const FLOW_STEPS: Step[] = [
  { id: 1, label: "Monitoring Pegawai", actor: "SDM Satker/UE1" },
  {
    id: 2,
    label: "Lengkapi Berkas",
    actor: "SDM Satker/UE1",
    desc: "Clearance BMN, Ikatan Dinas, dll.",
  },
  { id: 3, label: "Ajukan ke Biro SDM", actor: "SDM Satker/UE1" },
  { id: 4, label: "Verifikasi Biro SDM", actor: "Biro SDM" },
  { id: 5, label: "Penetapan SK", actor: "Biro SDM", desc: "Flow 6" },
];
