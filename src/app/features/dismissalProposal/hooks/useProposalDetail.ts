import { useMemo } from "react";
import {
  KANDIDAT_WITH_STATUS,
  LIFECYCLE,
} from "../dismissalProposal.constants";
import type {
  BerkasUsulan,
  PegawaiWithStatus,
} from "../dismissal-proposal.types";

interface UseProposalDetailParams {
  berkas: BerkasUsulan;
  pegawaiSearch: string;
}

export function useProposalDetail({
  berkas,
  pegawaiSearch,
}: UseProposalDetailParams) {
  const currentIdx = useMemo(
    () => LIFECYCLE.findIndex((l) => l.status === berkas.status),
    [berkas.status],
  );

  const resolvedPegawai = useMemo(
    () =>
      (berkas.pegawaiIds || [])
        .map((id) => KANDIDAT_WITH_STATUS.find((p) => p.id === id))
        .filter((p): p is PegawaiWithStatus => p !== undefined),
    [berkas.pegawaiIds],
  );

  const filteredPegawai = useMemo(
    () =>
      resolvedPegawai.filter(
        (p) =>
          !pegawaiSearch ||
          p.nama.toLowerCase().includes(pegawaiSearch.toLowerCase()) ||
          p.nip.includes(pegawaiSearch),
      ),
    [pegawaiSearch, resolvedPegawai],
  );

  return {
    currentIdx,
    resolvedPegawai,
    filteredPegawai,
    totalDisplay: berkas.jumlahPegawai,
    sampleShown: resolvedPegawai.length,
  };
}
