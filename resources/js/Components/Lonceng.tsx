import { waktuRelatif } from '@/Components/KartuPustaka';
import { ACCENT, BORDER, BORDER_SOFT, clipPanelSm } from '@/Components/PendigiUI';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ItemNotifikasi {
    id: string;
    dibaca: boolean;
    waktu: string;
    jenis: string;
    disetujui: boolean;
    judul: string;
    catatan: string | null;
}

interface DataNotifikasi {
    belumDibaca: number;
    terbaru: ItemNotifikasi[];
}

const NAMA_JENIS: Record<string, string> = { artikel: 'Artikel', cerita: 'Cerita', bab: 'Bab' };

function kalimat(n: ItemNotifikasi): string {
    if (n.jenis === 'pengajuan') {
        return n.disetujui
            ? 'Pengajuanmu menjadi Publisher disetujui. Selamat bergabung!'
            : 'Pengajuanmu menjadi Publisher ditolak.';
    }
    const jenis = NAMA_JENIS[n.jenis] ?? 'Tulisan';
    return n.disetujui
        ? `${jenis} "${n.judul}" disetujui dan sudah terbit.`
        : `${jenis} "${n.judul}" ditolak. Buka untuk merevisinya.`;
}

// Ikon lonceng + daftar pemberitahuan. Panel dirender lewat portal ke <body> dengan posisi tetap,
// karena bar atas beberapa halaman memakai clip-path yang akan memotong dropdown biasa.
export default function Lonceng() {
    const data = (usePage().props as unknown as { notifikasi?: DataNotifikasi | null }).notifikasi;

    const [buka, setBuka] = useState(false);
    const [posisi, setPosisi] = useState({ top: 0, right: 8 });
    const tombolRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!buka) return;

        const tutup = () => setBuka(false);
        const klikLuar = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!panelRef.current?.contains(t) && !tombolRef.current?.contains(t)) tutup();
        };
        const gulir = (e: Event) => {
            if (!panelRef.current?.contains(e.target as Node)) tutup();
        };
        const tekan = (e: KeyboardEvent) => {
            if (e.key === 'Escape') tutup();
        };

        document.addEventListener('mousedown', klikLuar);
        document.addEventListener('keydown', tekan);
        window.addEventListener('scroll', gulir, true);
        window.addEventListener('resize', tutup);
        return () => {
            document.removeEventListener('mousedown', klikLuar);
            document.removeEventListener('keydown', tekan);
            window.removeEventListener('scroll', gulir, true);
            window.removeEventListener('resize', tutup);
        };
    }, [buka]);

    if (!data) return null;

    const toggle = () => {
        if (!buka && tombolRef.current) {
            const r = tombolRef.current.getBoundingClientRect();
            setPosisi({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) });
        }
        setBuka(!buka);
    };

    const bacaSemua = () => router.post(route('notifikasi.baca-semua'), {}, { preserveScroll: true });

    return (
        <>
            <button
                ref={tombolRef}
                type="button"
                onClick={toggle}
                aria-label={`Notifikasi${data.belumDibaca > 0 ? `, ${data.belumDibaca} belum dibaca` : ''}`}
                aria-expanded={buka}
                className="relative flex h-8 w-8 items-center justify-center text-gray-500 transition hover:text-[#a8265c]"
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
                    <path d="M10.3 20a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {data.belumDibaca > 0 && (
                    <span
                        className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 font-mono text-[9px] font-bold text-white"
                        style={{ backgroundColor: ACCENT }}
                    >
                        {data.belumDibaca > 9 ? '9+' : data.belumDibaca}
                    </span>
                )}
            </button>

            {buka &&
                createPortal(
                    <div
                        ref={panelRef}
                        role="dialog"
                        aria-label="Daftar notifikasi"
                        className="fixed z-50 w-80 max-w-[calc(100vw-1rem)] bg-white shadow-xl"
                        style={{ top: posisi.top, right: posisi.right, ...clipPanelSm, border: `1.5px solid ${BORDER}` }}
                    >
                        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: BORDER_SOFT }}>
                            <p className="font-mono text-[11px] font-bold tracking-wider" style={{ color: ACCENT }}>
                                // NOTIFIKASI
                            </p>
                            {data.belumDibaca > 0 && (
                                <button
                                    type="button"
                                    onClick={bacaSemua}
                                    className="font-mono text-[10px] tracking-wider text-gray-500 underline hover:text-gray-800"
                                >
                                    TANDAI SEMUA DIBACA
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {data.terbaru.length === 0 ? (
                                <p className="px-4 py-8 text-center font-mono text-[11px] tracking-wider text-gray-400">
                                    BELUM ADA NOTIFIKASI
                                </p>
                            ) : (
                                data.terbaru.map((n) => (
                                    <Link
                                        key={n.id}
                                        href={route('notifikasi.buka', n.id)}
                                        onClick={() => setBuka(false)}
                                        className={`block border-b px-4 py-3 transition hover:bg-[#faf7f8] ${n.dibaca ? '' : 'bg-[#fdf4f8]'}`}
                                        style={{ borderColor: BORDER_SOFT }}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span
                                                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                                style={{ backgroundColor: n.dibaca ? 'transparent' : ACCENT }}
                                                aria-hidden="true"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-mono text-[10px] font-bold tracking-wider" style={{ color: n.disetujui ? '#1f7a3f' : ACCENT }}>
                                                    {n.disetujui ? 'DISETUJUI' : 'DITOLAK'}
                                                </p>
                                                <p className={`text-sm text-gray-700 ${n.dibaca ? '' : 'font-medium'}`}>{kalimat(n)}</p>
                                                {!n.disetujui && n.catatan && (
                                                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">Catatan admin: {n.catatan}</p>
                                                )}
                                                <p className="mt-1 font-mono text-[10px] text-gray-400">{waktuRelatif(n.waktu)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
