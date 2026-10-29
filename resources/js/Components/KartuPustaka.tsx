import { clipPanelSm } from '@/Components/PendigiUI';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

const ACCENT = '#a8265c';
const BORDER_SOFT = '#e3c7d2';

export interface ItemPustaka {
    riwayat_id?: number;
    bookmark_id?: number;
    jenis: 'artikel' | 'cerita';
    id: number;
    judul: string;
    gambar: string | null;
    bab?: { bab_id: number; nomor_bab: number; judul_bab: string } | null;
    waktu: string;
}

// Tujuan klik: artikel -> halaman artikel; cerita -> bab terakhir (kalau ada), selain itu halaman cerita.
export function tujuan(item: ItemPustaka): string {
    if (item.jenis === 'artikel') return route('artikel.show', item.id);
    if (item.bab) return route('cerita.baca', [item.id, item.bab.bab_id]);
    return route('cerita.show', item.id);
}

export function waktuRelatif(waktu: string): string {
    const selisih = Math.floor((Date.now() - new Date(waktu).getTime()) / 1000);
    if (selisih < 60) return 'baru saja';
    if (selisih < 3600) return `${Math.floor(selisih / 60)} menit lalu`;
    if (selisih < 86400) return `${Math.floor(selisih / 3600)} jam lalu`;
    if (selisih < 7 * 86400) return `${Math.floor(selisih / 86400)} hari lalu`;
    return new Date(waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function KartuPustaka({
    item,
    ringkas = false,
    children,
}: {
    item: ItemPustaka;
    ringkas?: boolean;
    children?: ReactNode;
}) {
    const lebar = ringkas ? 'h-14 w-11' : 'h-20 w-16';

    return (
        <div
            className="flex items-center gap-3 bg-white p-3 shadow-sm transition hover:shadow-md"
            style={{ ...clipPanelSm, border: `1px solid ${BORDER_SOFT}` }}
        >
            <Link href={tujuan(item)} className="flex min-w-0 flex-1 items-center gap-3">
                <div className={`${lebar} shrink-0 overflow-hidden bg-[#faf7f8]`} style={{ border: `1px solid ${BORDER_SOFT}` }}>
                    {item.gambar ? (
                        <img src={`/storage/${item.gambar}`} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center font-mono text-[8px] text-gray-300">NO IMG</div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-wider" style={{ color: ACCENT }}>
                        {item.jenis === 'cerita'
                            ? item.bab
                                ? `LANJUT · BAB ${item.bab.nomor_bab}`
                                : 'FIKSI'
                            : 'ARTIKEL'}
                    </p>
                    <p className={`${ringkas ? 'line-clamp-2 text-xs' : 'line-clamp-2 text-sm'} font-semibold text-gray-800`}>{item.judul}</p>
                    {!ringkas && item.jenis === 'cerita' && item.bab && (
                        <p className="line-clamp-1 text-xs text-gray-500">{item.bab.judul_bab}</p>
                    )}
                    <p className="mt-0.5 font-mono text-[10px] text-gray-400">{waktuRelatif(item.waktu)}</p>
                </div>
            </Link>
            {children}
        </div>
    );
}
