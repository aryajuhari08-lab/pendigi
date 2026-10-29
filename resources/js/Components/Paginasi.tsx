import { ACCENT, BORDER_SOFT, clipPanelSm } from '@/Components/PendigiUI';
import { Link, usePage } from '@inertiajs/react';

// Bagian dari objek paginator Laravel yang dipakai di sini
export interface DataPaginasi {
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

// Nomor halaman (mulai dari 1) yang ditampilkan: semua kalau sedikit, kalau banyak diringkas dengan "…"
export function nomorTampil(aktif: number, total: number): (number | '…')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const urut = Array.from(new Set([1, total, aktif - 1, aktif, aktif + 1]))
        .filter((n) => n >= 1 && n <= total)
        .sort((a, b) => a - b);

    const hasil: (number | '…')[] = [];
    urut.forEach((n, i) => {
        if (i > 0 && n - urut[i - 1] > 1) hasil.push('…');
        hasil.push(n);
    });
    return hasil;
}

export default function Paginasi({ paginasi, satuan }: { paginasi: DataPaginasi; satuan: string }) {
    const { url } = usePage();

    // Tautan halaman tetap membawa filter yang sedang aktif (pencarian, kategori, genre)
    const alamat = (halaman: number) => {
        const u = new URL(url, 'http://pendigi.local');
        if (halaman <= 1) u.searchParams.delete('page');
        else u.searchParams.set('page', String(halaman));
        return `${u.pathname}${u.search}`;
    };

    if (paginasi.total === 0) return null;

    const { current_page: aktif, last_page: terakhir } = paginasi;

    const gaya = (aktifTombol: boolean) => ({
        ...clipPanelSm,
        border: `1px solid ${BORDER_SOFT}`,
        backgroundColor: aktifTombol ? ACCENT : '#fff',
        color: aktifTombol ? '#fff' : ACCENT,
    });

    return (
        <nav aria-label={`Halaman ${satuan.toLowerCase()}`} className="mt-8 flex flex-col items-center gap-3">
            {terakhir > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs">
                    {aktif > 1 ? (
                        <Link href={alamat(aktif - 1)} className="px-3 py-1.5 transition hover:opacity-80" style={gaya(false)}>
                            ←
                        </Link>
                    ) : (
                        <span className="px-3 py-1.5 opacity-30" style={gaya(false)}>
                            ←
                        </span>
                    )}

                    {nomorTampil(aktif, terakhir).map((n, i) =>
                        n === '…' ? (
                            <span key={`titik-${i}`} className="px-1 text-gray-300">
                                …
                            </span>
                        ) : (
                            <Link
                                key={n}
                                href={alamat(n)}
                                aria-label={`Halaman ${n}`}
                                aria-current={n === aktif ? 'page' : undefined}
                                className="min-w-[2rem] px-2.5 py-1.5 text-center transition hover:opacity-80"
                                style={gaya(n === aktif)}
                            >
                                {n}
                            </Link>
                        ),
                    )}

                    {aktif < terakhir ? (
                        <Link href={alamat(aktif + 1)} className="px-3 py-1.5 transition hover:opacity-80" style={gaya(false)}>
                            →
                        </Link>
                    ) : (
                        <span className="px-3 py-1.5 opacity-30" style={gaya(false)}>
                            →
                        </span>
                    )}
                </div>
            )}

            <p className="font-mono text-[10px] tracking-wider text-gray-400">
                MENAMPILKAN {paginasi.from}–{paginasi.to} DARI {paginasi.total} {satuan.toUpperCase()}
            </p>
        </nav>
    );
}
