import { useState } from "react";
import { BerkasUsulan, PegawaiWithStatus } from "../proposalFile.types";
import { KANDIDAT_WITH_STATUS, MOCK_BERKAS } from "../dismissalProposal.constants";

export function useDismissalProposalFlow() {
      const [mainTab, setMainTab] = useState<"kandidat" | "berkas" | "arsip">(
        "kandidat",
      );
      const [selectedPegawai, setSelectedPegawai] =
        useState<PegawaiWithStatus | null>(null);
      const [activeBerkas, setActiveBerkas] = useState<BerkasUsulan | null>(null);
      const [showGrouping, setShowGrouping] = useState(false);
      const [showValidation, setShowValidation] = useState<BerkasUsulan | null>(
        null,
      );
      const [showTambahKasus, setShowTambahKasus] = useState(false);
      const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
      const [berkaslist, setBerkaslist] = useState<BerkasUsulan[]>(MOCK_BERKAS);
      const [kandidatList, setKandidatList] = useState(KANDIDAT_WITH_STATUS);
    
      // Filters for Kandidat
      const [search, setSearch] = useState("");
      const [jenisFilter, setJenisFilter] = useState("");
      const [statusFilter, setStatusFilter] = useState("");
      const [satkerFilter, setSatkerFilter] = useState("");
      const [periodeFilter, setPeriodeFilter] = useState("");
    
      // Filters for Berkas & Arsip
      const [berkasSearch, setBerkasSearch] = useState("");
      const [berkasJenisFilter, setBerkasJenisFilter] = useState("");
      const [berkasStatusFilter, setBerkasStatusFilter] = useState("");
      const [berkasTanggalFilter, setBerkasTanggalFilter] = useState("");

    return {
        mainTab,
        setMainTab,
        selectedPegawai,
        setSelectedPegawai,
        activeBerkas,
        setActiveBerkas,
        showGrouping,
        setShowGrouping,
        showValidation,
        setShowValidation,
        showTambahKasus,
        setShowTambahKasus,
        checkedIds,
        setCheckedIds,
        berkaslist,
        setBerkaslist,
        kandidatList,
        setKandidatList,
        search,
        setSearch,
        jenisFilter,
        setJenisFilter,
        statusFilter,
        setStatusFilter,
        satkerFilter,
        setSatkerFilter,
        periodeFilter,
        setPeriodeFilter,
        berkasSearch,
        setBerkasSearch,
        berkasJenisFilter,
        setBerkasJenisFilter,
        berkasStatusFilter,
        setBerkasStatusFilter,
        berkasTanggalFilter,
        setBerkasTanggalFilter,
      };

}