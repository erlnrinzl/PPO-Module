import { useState } from 'react';
import { X, Download, Printer, ZoomIn, ZoomOut, FileText, AlertCircle } from 'lucide-react';

export interface BerkasFile {
  id: string;
  nama: string;
  tipe: string;
  tanggal: string;
  ukuran: string;
  status: 'uploaded' | 'pending' | 'verified' | 'rejected';
  keterangan?: string;
}

interface Props {
  doc: BerkasFile;
  onClose: () => void;
}

function getMockContent(nama: string) {
  const n = nama.toLowerCase();
  if (n.includes('sk') || n.includes('surat keputusan') || n.includes('keputusan')) {
    return {
      jenis: 'SURAT KEPUTUSAN',
      nomor: 'SK/PPO/2024/KM.1/0042',
      isi: `Menimbang:\na. bahwa berdasarkan data kepegawaian yang tercatat dalam sistem, pegawai yang bersangkutan telah memenuhi persyaratan administratif;\nb. bahwa dalam rangka tertib administrasi kepegawaian, perlu diterbitkan Surat Keputusan;\n\nMengingat:\n1. Undang-Undang Nomor 5 Tahun 2014 tentang Aparatur Sipil Negara;\n2. Peraturan Pemerintah Nomor 11 Tahun 2017 tentang Manajemen PNS;\n3. Peraturan BKN dan ketentuan yang berlaku;\n\nMEMUTUSKAN / MENETAPKAN:\n\nKESATU: Pegawai yang tercantum dinyatakan memenuhi persyaratan administrasi.\nKEDUA: Keputusan ini berlaku sejak tanggal ditetapkan.\nKETIGA: Apabila terdapat kekeliruan dalam Keputusan ini akan diperbaiki sebagaimana mestinya.`,
    };
  }
  if (n.includes('ktp') || n.includes('identitas')) {
    return {
      jenis: 'KARTU TANDA PENDUDUK',
      nomor: 'NIK: 3271020304850001',
      isi: 'Dokumen identitas resmi yang diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil Kota setempat.\n\nDokumen ini merupakan salinan yang telah dilegalisasi dan diverifikasi keasliannya oleh unit kepegawaian yang berwenang.',
    };
  }
  if (n.includes('laporan polisi') || n.includes('berita acara') || n.includes('laporan kepolisian')) {
    return {
      jenis: 'LAPORAN KEPOLISIAN',
      nomor: 'LP/B/456/IV/2024/POLRESTA',
      isi: `Pada hari ini telah diterima Laporan dari pihak yang berwenang:\n\nNama Pelapor: Pimpinan Unit Kerja\nJabatan: Kepala Sub Bagian TU\nUnit Kerja: Unit Kerja Terkait\n\nMenerangkan bahwa:\n— Kejadian telah dilaporkan kepada pihak berwajib sesuai prosedur yang berlaku\n— Surat laporan ini merupakan bukti resmi pelaporan\n— Data lebih lanjut dapat dikonfirmasi kepada pejabat berwenang\n\nDemikian laporan ini dibuat untuk dipergunakan sebagaimana mestinya.`,
    };
  }
  if (n.includes('akte') || n.includes('akta') || n.includes('kematian')) {
    return {
      jenis: 'AKTA / SURAT KETERANGAN',
      nomor: 'No. Dok: 3271/AKT/2024/0087',
      isi: 'Dokumen resmi yang diterbitkan oleh instansi berwenang sebagai bukti peristiwa kependudukan yang sah secara hukum.\n\nDokumen ini telah diverifikasi keasliannya dan disimpan dalam sistem informasi kepegawaian untuk keperluan proses administrasi pemberhentian dan pensiun.',
    };
  }
  if (n.includes('clearance') || n.includes('bmn') || n.includes('ikatan')) {
    return {
      jenis: 'SURAT KETERANGAN CLEARANCE',
      nomor: 'No. Clear: PPO/CLR/2024/0031',
      isi: `Yang bertanda tangan di bawah ini menerangkan bahwa:\n\nPegawai yang bersangkutan dinyatakan BEBAS dari:\n— Kewajiban Barang Milik Negara (BMN)\n— Ikatan Dinas / Kewajiban lainnya\n— Tunggakan administrasi\n\nSurat keterangan ini diterbitkan berdasarkan pemeriksaan yang telah dilakukan oleh unit terkait dan dinyatakan bahwa tidak terdapat kewajiban yang belum diselesaikan.`,
    };
  }
  if (n.includes('tapem') || n.includes('taspen') || n.includes('pensiun')) {
    return {
      jenis: 'DATA TAPEM / TASPEN',
      nomor: 'No. Peserta TASPEN: 0123456789',
      isi: 'Data kepesertaan TASPEN yang berisi informasi:\n\n— Nomor Peserta TASPEN\n— Iuran yang telah dibayarkan\n— Manfaat yang berhak diterima\n— Data keluarga / ahli waris\n— Riwayat kepangkatan untuk perhitungan pensiun\n\nData ini telah diverifikasi dan sesuai dengan data SIASN.',
    };
  }
  if (n.includes('hris') || n.includes('riwayat jabatan') || n.includes('profil')) {
    return {
      jenis: 'DATA PROFIL / RIWAYAT JABATAN',
      nomor: 'No. Ref: HRIS/PPO/2024/0156',
      isi: 'Data riwayat jabatan dan kepangkatan yang diambil dari sistem HRIS mencakup:\n\n— Riwayat jabatan struktural/fungsional\n— Riwayat kepangkatan dan golongan\n— Masa kerja keseluruhan\n— Unit kerja terakhir\n— Penilaian prestasi kerja 3 tahun terakhir',
    };
  }
  if (n.includes('permohonan') || n.includes('pengunduran') || n.includes('mpp')) {
    return {
      jenis: 'SURAT PERMOHONAN',
      nomor: 'No. Surat: PPO/PRM/2024/0019',
      isi: `Kepada Yth.\nKepala Biro Sumber Daya Manusia\nKementerian Keuangan RI\n\nDengan hormat,\nSaya yang bertanda tangan di bawah ini mengajukan permohonan dengan segala pertimbangan yang telah dipikirkan matang-matang.\n\nBesar harapan saya agar permohonan ini dapat dipertimbangkan dan diproses sesuai ketentuan yang berlaku.\n\nDemikian permohonan ini saya sampaikan, atas perhatian dan kebijaksanaannya saya ucapkan terima kasih.`,
    };
  }
  return {
    jenis: 'DOKUMEN KEPEGAWAIAN',
    nomor: `No. Dok: PPO/${new Date().getFullYear()}/0001`,
    isi: 'Dokumen ini merupakan bagian dari berkas administrasi kepegawaian dalam rangka proses pemberhentian dan pensiun di lingkungan Kementerian Keuangan Republik Indonesia.\n\nDokumen telah diverifikasi keasliannya oleh pejabat yang berwenang dan disimpan dalam sistem informasi kepegawaian untuk keperluan administrasi.',
  };
}

export function DocumentViewer({ doc, onClose }: Props) {
  const [zoom, setZoom] = useState(100);
  const content = getMockContent(doc.nama);
  const isPending = doc.status === 'pending';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: '820px', maxWidth: '96vw', height: '88vh', background: '#2D2D2D' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b shrink-0" style={{ background: '#3C3C3C', borderColor: '#555' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#162D54' }}>
              <FileText size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate leading-tight">{doc.nama}</p>
              <p className="text-gray-400 text-[11px]">{doc.tipe} · {doc.ukuran} · Diunggah {doc.tanggal}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-4">
            {!isPending && (
              <>
                <button
                  onClick={() => setZoom(z => Math.max(60, z - 10))}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Perkecil"
                >
                  <ZoomOut size={15} />
                </button>
                <span className="text-gray-400 text-[11px] w-10 text-center tabular-nums">{zoom}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(180, z + 10))}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Perbesar"
                >
                  <ZoomIn size={15} />
                </button>
                <div className="w-px h-5 mx-1" style={{ background: '#555' }} />
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Unduh">
                  <Download size={15} />
                </button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Cetak">
                  <Printer size={15} />
                </button>
                <div className="w-px h-5 mx-1" style={{ background: '#555' }} />
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-red-600 transition-colors"
              title="Tutup"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Document canvas */}
        <div className="flex-1 overflow-auto flex justify-center py-6 px-4" style={{ background: '#525659' }}>
          {isPending ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center self-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#3C3C3C' }}>
                <AlertCircle size={32} className="text-gray-500" />
              </div>
              <div>
                <p className="text-white font-semibold">Dokumen Belum Diunggah</p>
                <p className="text-gray-400 text-sm mt-1 max-w-[280px]">
                  Berkas <span className="text-gray-200 font-medium">"{doc.nama}"</span> belum tersedia karena belum diunggah oleh pihak terkait.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="bg-white shadow-2xl"
              style={{
                width: `${(595 * zoom) / 100}px`,
                minHeight: `${(842 * zoom) / 100}px`,
                padding: `${(48 * zoom) / 100}px ${(56 * zoom) / 100}px`,
                fontFamily: '"Times New Roman", serif',
                fontSize: `${(12.5 * zoom) / 100}px`,
                lineHeight: 1.65,
                color: '#111',
                flexShrink: 0,
              }}
            >
              {/* KOP SURAT */}
              <div style={{ display: 'flex', alignItems: 'center', gap: `${(14 * zoom) / 100}px`, marginBottom: `${(10 * zoom) / 100}px` }}>
                <div style={{
                  width: `${(52 * zoom) / 100}px`,
                  height: `${(52 * zoom) / 100}px`,
                  borderRadius: '50%',
                  background: '#162D54',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: `${(13 * zoom) / 100}px`,
                  letterSpacing: '0.02em',
                  flexShrink: 0,
                }}>BKN</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: `${(14 * zoom) / 100}px`, letterSpacing: '0.02em' }}>BADAN KEPEGAWAIAN NEGARA</div>
                  <div style={{ fontSize: `${(10.5 * zoom) / 100}px`, color: '#555', marginTop: '2px' }}>Jl. Mayjen Sutoyo No. 12, Cililitan, Jakarta Timur 13640</div>
                  <div style={{ fontSize: `${(10.5 * zoom) / 100}px`, color: '#555' }}>Telp. (021) 8093008 | www.bkn.go.id</div>
                </div>
              </div>
              <div style={{ borderTop: `${(3 * zoom) / 100}px solid #162D54`, marginBottom: `${(3 * zoom) / 100}px` }} />
              <div style={{ borderTop: `${(1 * zoom) / 100}px solid #162D54`, marginBottom: `${(22 * zoom) / 100}px` }} />

              {/* Judul Dokumen */}
              <div style={{ textAlign: 'center', marginBottom: `${(20 * zoom) / 100}px` }}>
                <div style={{ fontWeight: '700', fontSize: `${(13.5 * zoom) / 100}px`, textDecoration: 'underline', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {content.jenis}
                </div>
                <div style={{ fontSize: `${(11 * zoom) / 100}px`, color: '#444', marginTop: `${(5 * zoom) / 100}px` }}>
                  Nomor: {content.nomor}
                </div>
              </div>

              {/* Perihal */}
              <table style={{ width: '100%', marginBottom: `${(18 * zoom) / 100}px`, borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '110px', paddingBottom: `${(6 * zoom) / 100}px`, verticalAlign: 'top' }}>Perihal</td>
                    <td style={{ width: '12px', paddingBottom: `${(6 * zoom) / 100}px`, verticalAlign: 'top' }}>:</td>
                    <td style={{ paddingBottom: `${(6 * zoom) / 100}px`, fontWeight: '600' }}>{doc.nama}</td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top', color: '#555' }}>Tanggal</td>
                    <td style={{ color: '#555' }}>:</td>
                    <td style={{ color: '#555' }}>{doc.tanggal}</td>
                  </tr>
                </tbody>
              </table>

              {/* Isi */}
              <div style={{ whiteSpace: 'pre-line', marginBottom: `${(36 * zoom) / 100}px`, textAlign: 'justify' }}>
                {content.isi}
              </div>

              {/* Tanda Tangan */}
              <div style={{ marginTop: `${(36 * zoom) / 100}px`, textAlign: 'right' }}>
                <div>Jakarta, {doc.tanggal}</div>
                <div style={{ marginTop: `${(4 * zoom) / 100}px` }}>a.n. Kepala Biro Sumber Daya Manusia</div>
                <div style={{ height: `${(56 * zoom) / 100}px` }} />
                <div style={{ fontWeight: '700', textDecoration: 'underline' }}>Dr. Pejabat Yang Berwenang, M.M.</div>
                <div style={{ fontSize: `${(10.5 * zoom) / 100}px`, color: '#444' }}>NIP. 197501012000031001</div>
              </div>

              {/* Footer */}
              <div style={{
                marginTop: `${(40 * zoom) / 100}px`,
                borderTop: '1px solid #ccc',
                paddingTop: `${(8 * zoom) / 100}px`,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: `${(9.5 * zoom) / 100}px`,
                color: '#888',
              }}>
                <span>Dokumen ini dicetak dari Sistem PPO — Pemberhentian &amp; Pensiun Otomatis</span>
                <span>Hal. 1 dari 1</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
