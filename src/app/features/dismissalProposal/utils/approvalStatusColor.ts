import type { StatusUsulan } from "../dismissal-proposal.types";

const STATUS_USULAN_COLOR_MAP: Record<StatusUsulan, string> = {
  Draft: "#6B7280",
  "Dokumen Lengkap": "#3B82F6",
  "Diajukan ke UE1": "#8B5CF6",
  "Review UE1": "#EC4899",
  "Diterima UE1": "#10B981",
  "Review Biro SDM": "#F59E0B",
  "Usul Pertek": "#EF4444",
  "SK Terbit": "#059669",
};

export function statusUsulanColor(status: StatusUsulan): string {
  return STATUS_USULAN_COLOR_MAP[status];
}
