import { useState } from "react";
import {
  FileText,
  Check,
  AlertCircle,
  Users,
  Search,
  Download,
  Mail,
  UserPlus,
  Plus,
  PackagePlus,
  ChevronRight,
} from "lucide-react";
import { FlowBUPUe1 } from "./FlowBUPUe1";
import type { Role } from "../types/role.types";
import {
  getKasusColor,
  getKasusLabel,
  getSisaBulanColor,
  getSisaBulanLabel,
} from "../utils/case.util";

//--------------------------------------------------------------------------------
import {
  KANDIDAT_WITH_STATUS,
  MOCK_BERKAS,
} from "../features/dismissalProposal/dismissalProposal.constants";
import {
  type BerkasUsulan,
  type PegawaiWithStatus,
  type StatusUsulan,
} from "../features/dismissalProposal/proposalFile.types";
import { statusUsulanColor } from "../features/dismissalProposal/utils/approvalStatusColor";
import { CaseDetail } from "../features/dismissalProposal/components/CaseDetailModal";
import { SmartGroupingModal } from "../features/dismissalProposal/components/SmartGroupingModal";
import { ValidationModal } from "../features/dismissalProposal/components/SubmissionValidationModal";
import { TambahKasusModal } from "../features/dismissalProposal/components/ReportNewCaseModal";
import { useDismissalProposalFlow } from "../features/dismissalProposal/hooks/useDismissalProposalFlow";

//--------------------------------------------------------------------------------

// ─── Form kasus baru (Meninggal / Uzur) ───────────────────────────────────────
// ─── Main component ────────────────────────────────────────────────────────────

export function FlowBUP({ role }: { role: Role }) {
  // All state hooks must come BEFORE any early returns
  const {
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
  } = useDismissalProposalFlow();

  const isSdmSatker = role === "sdm-satker-1";

  // // Early return AFTER all hooks
  // if (role === "sdm-ue1") {
  //   return <FlowBUPUe1 />;
  // }

  // if (activeBerkas) {
  //   return (
  //     <div className="p-6">
  //       <BerkasDetailPage
  //         berkas={activeBerkas}
  //         onBack={() => setActiveBerkas(null)}
  //         role={role}
  //       />
  //     </div>
  //   );
  // }

  const handleTambahKasus = (entry: PegawaiWithStatus) => {
    setKandidatList((prev) => [entry, ...prev]);
  };

  const filtered = (kandidatList || []).filter((p) => {
    if (!p) return false;
    if (jenisFilter && p.jenisKasus !== jenisFilter) return false;
    if (statusFilter && p.statusDokumen !== statusFilter) return false;
    if (
      satkerFilter &&
      !p.satker?.toLowerCase().includes(satkerFilter.toLowerCase())
    )
      return false;
    if (
      search &&
      !p.nama?.toLowerCase().includes(search.toLowerCase()) &&
      !p.nip?.includes(search)
    )
      return false;
    return true;
  });

  const allChecked =
    filtered.length > 0 && filtered.every((p: any) => checkedIds.has(p.id));
  const toggleAll = () =>
    setCheckedIds(allChecked ? new Set() : new Set(filtered.map((p) => p.id)));
  const toggleOne = (id: string) => {
    const s = new Set(checkedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setCheckedIds(s);
  };

  const handleGroupConfirm = (
    groups: {
      name: string;
      count: number;
      jenis: "BUP" | "Uzur" | "Meninggal";
    }[],
  ) => {
    const newEntries: BerkasUsulan[] = groups.map((g, i) => ({
      id: `new-${Date.now()}-${i}`,
      nomorUsulan: `USP-2027-${String(berkaslist.length + i + 1).padStart(3, "0")}`,
      namaberkas: g.name,
      jenis: g.jenis,
      jumlahPegawai: g.count,
      status: "Draft" as StatusUsulan,
      tanggalDibuat: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      lengkap: Math.floor(g.count * 0.85),
      belumLengkap: Math.ceil(g.count * 0.15),
      pegawaiIds: Array.from(checkedIds).slice(0, 4),
    }));
    setBerkaslist((prev) => [...prev, ...newEntries]);
    setMainTab("berkas");
    setCheckedIds(new Set());
  };

  const handleSubmitBerkas = (id: string) => {
    setBerkaslist((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "Diajukan ke UE1" as StatusUsulan } : b,
      ),
    );
  };

  return (
    <div className="p-6 space-y-5">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <Users size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">
            Flow 2: Usulan Pemberhentian — BUP, Meninggal, Uzur
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            Kelola kandidat pemberhentian dari hasil monitoring (Flow 1) dan
            buat berkas usulan untuk diajukan ke hierarki yang lebih tinggi.
          </p>
        </div>
      </div>

      {/* Main tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(["kandidat", "berkas", "arsip"] as const).map((tab) => {
          const berkasAktif = (berkaslist || []).filter(
            (b) => b && b.status !== "SK Terbit",
          );
          const berkasArsip = (berkaslist || []).filter(
            (b) => b && b.status === "SK Terbit",
          );
          return (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mainTab === tab ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab === "kandidat"
                ? "Kandidat Pemberhentian"
                : tab === "berkas"
                  ? "Berkas Usulan"
                  : "Arsip"}
              {tab === "berkas" && (
                <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {berkasAktif.length}
                </span>
              )}
              {tab === "arsip" && (
                <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {berkasArsip.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: KANDIDAT ─────────────────────────────────────────────────── */}
      {mainTab === "kandidat" && (
        <>
          {/* Filter panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Filter</p>
              <button
                onClick={() => {
                  setJenisFilter("");
                  setStatusFilter("");
                  setSatkerFilter("");
                  setPeriodeFilter("");
                  setSearch("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Jenis Kasus
                </label>
                <select
                  value={jenisFilter}
                  onChange={(e) => setJenisFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="BUP">BUP</option>
                  <option value="Uzur">Uzur</option>
                  <option value="Meninggal">Meninggal Dunia</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Status Dokumen
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="Belum Lengkap">Belum Lengkap</option>
                  <option value="Lengkap">Lengkap</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Periode BUP
                </label>
                <input
                  value={periodeFilter}
                  onChange={(e) => setPeriodeFilter(e.target.value)}
                  placeholder="Misal: Jan 2027"
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Satker
                </label>
                <input
                  value={satkerFilter}
                  onChange={(e) => setSatkerFilter(e.target.value)}
                  placeholder="Nama satker..."
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Bulk action bar */}
          {checkedIds.size > 0 && (
            <div className="bg-[#162D54] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm font-semibold text-white">
                {checkedIds.size} pegawai dipilih
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowGrouping(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <PackagePlus size={14} /> Buat Berkas Usulan
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                  <Download size={14} /> Export Excel
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                  <Mail size={14} /> Kirim Reminder
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                  <UserPlus size={14} /> Assign PIC
                </button>
              </div>
            </div>
          )}

          {/* Kandidat table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Daftar Kandidat Pemberhentian
                </h3>
                <p className="text-xs text-gray-500">
                  {filtered.length} dari {kandidatList.length} pegawai
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <Search size={14} className="text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari Nama / NIP..."
                    className="bg-transparent text-xs focus:outline-none w-40 text-gray-700 placeholder-gray-400"
                  />
                </div>
                {isSdmSatker && (
                  <button
                    onClick={() => setShowTambahKasus(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ background: "#162D54" }}
                  >
                    <Plus size={14} /> Laporkan Kasus
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={toggleAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      NIP / Nama
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Jabatan / Satker
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Gol / Pangkat
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Jenis Kasus
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      TMT
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Sisa Waktu
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Status Dokumen
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-12 text-center text-gray-400"
                      >
                        <Search size={32} className="mx-auto mb-2 opacity-30" />
                        <p>Tidak ada data yang sesuai filter</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-blue-50/30 transition-colors ${checkedIds.has(p.id) ? "bg-blue-50/50" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={checkedIds.has(p.id)}
                            onChange={() => toggleOne(p.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">
                            {p.nama}
                          </p>
                          <p className="text-gray-400 mt-0.5">{p.nip}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700">{p.jabatan}</p>
                          <p className="text-gray-400 mt-0.5">{p.satker}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {p.pangkatGolongan}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                            style={{ background: getKasusColor(p.jenisKasus) }}
                          >
                            {getKasusLabel(p.jenisKasus)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {p.tanggalBUP}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="font-semibold"
                            style={{ color: getSisaBulanColor(p.sisaBulan) }}
                          >
                            {getSisaBulanLabel(p.sisaBulan, p.jenisKasus)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.statusDokumen === "Lengkap" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {p.statusDokumen === "Lengkap" ? (
                              <Check size={10} />
                            ) : (
                              <AlertCircle size={10} />
                            )}
                            {p.statusDokumen}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedPegawai(p)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                            style={{ background: "#162D54" }}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Menampilkan {filtered.length} dari {kandidatList.length} pegawai
              </p>
              {checkedIds.size > 0 && (
                <button
                  onClick={() => setShowGrouping(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <PackagePlus size={13} /> Buat berkas dari {checkedIds.size}{" "}
                  terpilih
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── TAB 2: BERKAS USULAN ─────────────────────────────────────────────── */}
      {mainTab === "berkas" && (
        <>
          {/* Filter panel for Berkas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                Filter Berkas Usulan
              </p>
              <button
                onClick={() => {
                  setBerkasSearch("");
                  setBerkasJenisFilter("");
                  setBerkasStatusFilter("");
                  setBerkasTanggalFilter("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-4">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Pencarian
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <Search size={14} className="text-gray-400 shrink-0" />
                  <input
                    value={berkasSearch}
                    onChange={(e) => setBerkasSearch(e.target.value)}
                    placeholder="Cari nomor usulan, nama berkas..."
                    className="bg-transparent text-xs focus:outline-none flex-1 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Jenis
                </label>
                <select
                  value={berkasJenisFilter}
                  onChange={(e) => setBerkasJenisFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="BUP">BUP</option>
                  <option value="Uzur">Uzur</option>
                  <option value="Meninggal">Meninggal</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Status
                </label>
                <select
                  value={berkasStatusFilter}
                  onChange={(e) => setBerkasStatusFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="Draft">Draft</option>
                  <option value="Diajukan ke UE1">Diajukan ke UE1</option>
                  <option value="Review UE1">Review UE1</option>
                  <option value="Diterima UE1">Diterima UE1</option>
                  <option value="Review Biro SDM">Review Biro SDM</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Tanggal Dibuat
                </label>
                <input
                  type="date"
                  value={berkasTanggalFilter}
                  onChange={(e) => setBerkasTanggalFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">
                Berkas Usulan Aktif
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {
                  (berkaslist || []).filter((b) => {
                    if (!b) return false;
                    if (b.status === "SK Terbit") return false;
                    if (
                      berkasSearch &&
                      !b.nomorUsulan
                        ?.toLowerCase()
                        .includes(berkasSearch.toLowerCase()) &&
                      !b.namaberkas
                        ?.toLowerCase()
                        .includes(berkasSearch.toLowerCase())
                    )
                      return false;
                    if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                      return false;
                    if (berkasStatusFilter && b.status !== berkasStatusFilter)
                      return false;
                    return true;
                  }).length
                }{" "}
                berkas aktif
              </p>
            </div>
            <button
              onClick={() => setShowGrouping(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: "#162D54" }}
            >
              <Plus size={14} /> Buat Berkas Usulan Baru
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Nomor Usulan
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Nama Berkas
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Jumlah Pegawai
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {berkaslist.filter((b) => {
                    if (b.status === "SK Terbit") return false;
                    if (
                      berkasSearch &&
                      !b.nomorUsulan
                        .toLowerCase()
                        .includes(berkasSearch.toLowerCase()) &&
                      !b.namaberkas
                        .toLowerCase()
                        .includes(berkasSearch.toLowerCase())
                    )
                      return false;
                    if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                      return false;
                    if (berkasStatusFilter && b.status !== berkasStatusFilter)
                      return false;
                    return true;
                  }).length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400"
                      >
                        <FileText
                          size={32}
                          className="mx-auto mb-2 opacity-30"
                        />
                        <p>Tidak ada berkas usulan yang sesuai filter</p>
                        {berkaslist.filter((b) => b.status !== "SK Terbit")
                          .length === 0 && (
                          <button
                            onClick={() => setShowGrouping(true)}
                            className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Buat berkas pertama
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    berkaslist
                      .filter((b) => {
                        if (b.status === "SK Terbit") return false;
                        if (
                          berkasSearch &&
                          !b.nomorUsulan
                            .toLowerCase()
                            .includes(berkasSearch.toLowerCase()) &&
                          !b.namaberkas
                            .toLowerCase()
                            .includes(berkasSearch.toLowerCase())
                        )
                          return false;
                        if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                          return false;
                        if (
                          berkasStatusFilter &&
                          b.status !== berkasStatusFilter
                        )
                          return false;
                        return true;
                      })
                      .map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                          onClick={() => setActiveBerkas(b)}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">
                              {b.nomorUsulan}
                            </p>
                            <p className="text-gray-400 mt-0.5">
                              {b.tanggalDibuat}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {b.namaberkas}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                              style={{ background: getKasusColor(b.jenis) }}
                            >
                              {b.jenis}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-gray-800">
                                {b.jumlahPegawai} pegawai
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-green-600 font-semibold">
                                  ✓ {b.lengkap} lengkap
                                </span>
                                {b.belumLengkap > 0 && (
                                  <span className="text-[9px] text-red-600 font-semibold">
                                    ⚠ {b.belumLengkap} belum
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                              style={{
                                background: statusUsulanColor(b.status),
                              }}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className="flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setActiveBerkas(b)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors hover:opacity-90"
                                style={{ background: "#162D54" }}
                              >
                                Buka <ChevronRight size={12} />
                              </button>
                              {b.status === "Draft" && (
                                <button
                                  onClick={() => setShowValidation(b)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  Ajukan
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 3: ARSIP ─────────────────────────────────────────────────────── */}
      {mainTab === "arsip" && (
        <>
          {/* Filter panel for Arsip */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                Filter Arsip
              </p>
              <button
                onClick={() => {
                  setBerkasSearch("");
                  setBerkasJenisFilter("");
                  setBerkasTanggalFilter("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-4">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Pencarian
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <Search size={14} className="text-gray-400 shrink-0" />
                  <input
                    value={berkasSearch}
                    onChange={(e) => setBerkasSearch(e.target.value)}
                    placeholder="Cari nomor usulan, nama berkas..."
                    className="bg-transparent text-xs focus:outline-none flex-1 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Jenis
                </label>
                <select
                  value={berkasJenisFilter}
                  onChange={(e) => setBerkasJenisFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                >
                  <option value="">Semua</option>
                  <option value="BUP">BUP</option>
                  <option value="Uzur">Uzur</option>
                  <option value="Meninggal">Meninggal</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Tanggal SK Terbit
                </label>
                <input
                  type="date"
                  value={berkasTanggalFilter}
                  onChange={(e) => setBerkasTanggalFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Arsip Berkas Selesai
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {
                berkaslist.filter((b) => {
                  if (b.status !== "SK Terbit") return false;
                  if (
                    berkasSearch &&
                    !b.nomorUsulan
                      .toLowerCase()
                      .includes(berkasSearch.toLowerCase()) &&
                    !b.namaberkas
                      .toLowerCase()
                      .includes(berkasSearch.toLowerCase())
                  )
                    return false;
                  if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                    return false;
                  return true;
                }).length
              }{" "}
              berkas telah selesai
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Nomor Usulan
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Nama Berkas
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Jumlah Pegawai
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                      Tanggal Dibuat
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-500 font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(berkaslist || []).filter((b) => {
                    if (!b) return false;
                    if (b.status !== "SK Terbit") return false;
                    if (
                      berkasSearch &&
                      !b.nomorUsulan
                        ?.toLowerCase()
                        .includes(berkasSearch.toLowerCase()) &&
                      !b.namaberkas
                        ?.toLowerCase()
                        .includes(berkasSearch.toLowerCase())
                    )
                      return false;
                    if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                      return false;
                    return true;
                  }).length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-400"
                      >
                        <FileText
                          size={32}
                          className="mx-auto mb-2 opacity-30"
                        />
                        <p>Belum ada berkas yang selesai</p>
                      </td>
                    </tr>
                  ) : (
                    (berkaslist || [])
                      .filter((b) => {
                        if (!b) return false;
                        if (b.status !== "SK Terbit") return false;
                        if (
                          berkasSearch &&
                          !b.nomorUsulan
                            ?.toLowerCase()
                            .includes(berkasSearch.toLowerCase()) &&
                          !b.namaberkas
                            ?.toLowerCase()
                            .includes(berkasSearch.toLowerCase())
                        )
                          return false;
                        if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                          return false;
                        return true;
                      })
                      .map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-green-50/30 transition-colors cursor-pointer"
                          onClick={() => setActiveBerkas(b)}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">
                              {b.nomorUsulan}
                            </p>
                            <p className="text-gray-400 mt-0.5">
                              {b.tanggalDibuat}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {b.namaberkas}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                              style={{ background: getKasusColor(b.jenis) }}
                            >
                              {b.jenis}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-gray-800">
                              {b.jumlahPegawai} pegawai
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                            {b.tanggalDibuat}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                              <Check size={10} /> {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveBerkas(b);
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                              Buka
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            {berkaslist.filter((b) => b.status === "SK Terbit").length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Menampilkan{" "}
                  {
                    (berkaslist || []).filter((b) => {
                      if (!b) return false;
                      if (b.status !== "SK Terbit") return false;
                      if (
                        berkasSearch &&
                        !b.nomorUsulan
                          ?.toLowerCase()
                          .includes(berkasSearch.toLowerCase()) &&
                        !b.namaberkas
                          ?.toLowerCase()
                          .includes(berkasSearch.toLowerCase())
                      )
                        return false;
                      if (berkasJenisFilter && b.jenis !== berkasJenisFilter)
                        return false;
                      return true;
                    }).length
                  }{" "}
                  dari{" "}
                  {berkaslist.filter((b) => b.status === "SK Terbit").length}{" "}
                  berkas arsip
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {selectedPegawai && (
        <CaseDetail
          pegawai={selectedPegawai}
          role={role}
          statusDokumen={selectedPegawai.statusDokumen}
          onClose={() => setSelectedPegawai(null)}
        />
      )}
      {showGrouping && (
        <SmartGroupingModal
          onClose={() => setShowGrouping(false)}
          onConfirm={handleGroupConfirm}
        />
      )}
      {showTambahKasus && (
        <TambahKasusModal
          onClose={() => setShowTambahKasus(false)}
          onSave={handleTambahKasus}
        />
      )}
      {showValidation && (
        <ValidationModal
          berkas={showValidation}
          onClose={() => setShowValidation(null)}
          onSubmit={() => handleSubmitBerkas(showValidation.id)}
        />
      )}
    </div>
  );
}
