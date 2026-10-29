import { ACCENT, BORDER_SOFT, Button, clipPanel, clipPanelSm } from '@/Components/PendigiUI';
import { bagiBlok, ekstrakBlok, hitungKata } from '@/utils/bagiHalaman';
import { embedVideo } from '@/utils/embedVideo';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

const SKALA_HURUF = [0.9, 1, 1.1, 1.25];
const KUNCI_HURUF = 'pendigi_ukuran_huruf';
const KATA_PER_MENIT = 200;

// Nomor halaman yang ditampilkan: semua kalau sedikit, kalau banyak ringkas dengan "…"
function nomorTampil(aktif: number, total: number): (number | '…')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);

    const urut = Array.from(new Set([0, total - 1, aktif - 1, aktif, aktif + 1]))
        .filter((i) => i >= 0 && i < total)
        .sort((a, b) => a - b);

    const hasil: (number | '…')[] = [];
    urut.forEach((n, i) => {
        if (i > 0 && n - urut[i - 1] > 1) hasil.push('…');
        hasil.push(n);
    });
    return hasil;
}

export default function IsiBabBerhalaman({
    html,
    kepala,
    children,
}: {
    html: string;
    kepala: ReactNode;
    children: ReactNode; // bagian setelah isi (like, rating, navigasi bab, komentar): tampil di halaman terakhir
}) {
    const topRef = useRef<HTMLDivElement>(null);
    const pertama = useRef(true);

    const { halaman, totalKata } = useMemo(() => {
        const utuh = embedVideo(html);
        if (typeof window === 'undefined') {
            return { halaman: [utuh], totalKata: hitungKata(utuh.replace(/<[^>]*>/g, ' ')) };
        }
        const blok = ekstrakBlok(utuh);
        return { halaman: bagiBlok(blok), totalKata: blok.reduce((n, b) => n + b.kata, 0) };
    }, [html]);

    const banyak = halaman.length > 1;

    // Halaman awal diambil dari #hal-N di alamat, supaya muat ulang atau tautan yang dibagikan tetap di halaman itu
    const [idx, setIdx] = useState(() => {
        if (typeof window === 'undefined') return 0;
        const cocok = /^#hal-(\d+)$/.exec(window.location.hash);
        const n = cocok ? parseInt(cocok[1], 10) - 1 : 0;
        return n >= 0 && n < halaman.length ? n : 0;
    });
    const [ukuran, setUkuran] = useState(1);

    useEffect(() => {
        try {
            const tersimpan = localStorage.getItem(KUNCI_HURUF);
            if (tersimpan !== null) {
                const n = parseInt(tersimpan, 10);
                if (n >= 0 && n < SKALA_HURUF.length) setUkuran(n);
            }
        } catch {
            // penyimpanan browser tidak tersedia: pakai ukuran bawaan
        }
    }, []);

    const ubahUkuran = (n: number) => {
        const baru = Math.min(SKALA_HURUF.length - 1, Math.max(0, n));
        setUkuran(baru);
        try {
            localStorage.setItem(KUNCI_HURUF, String(baru));
        } catch {
            // abaikan
        }
    };

    // Tiap pindah halaman: catat di alamat (tanpa menyentuh state Inertia) dan gulir ke awal isi
    useEffect(() => {
        if (banyak) {
            window.history.replaceState(
                window.history.state,
                '',
                `${window.location.pathname}${window.location.search}#hal-${idx + 1}`,
            );
        }
        if (pertama.current) {
            pertama.current = false;
            return;
        }
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [idx, banyak]);

    // Panah kiri/kanan untuk pindah halaman (tidak aktif saat mengetik)
    useEffect(() => {
        if (!banyak) return;
        const tekan = (e: KeyboardEvent) => {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            const t = e.target as HTMLElement | null;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
            if (e.key === 'ArrowRight') setIdx((i) => Math.min(halaman.length - 1, i + 1));
            if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
        };
        window.addEventListener('keydown', tekan);
        return () => window.removeEventListener('keydown', tekan);
    }, [banyak, halaman.length]);

    const terakhir = idx === halaman.length - 1;
    const menit = Math.max(1, Math.round(totalKata / KATA_PER_MENIT));

    return (
        <>
            <div
                ref={topRef}
                className="mt-4 scroll-mt-4 bg-white p-6 shadow-sm sm:p-10"
                style={{ ...clipPanel, border: `1px solid ${BORDER_SOFT}` }}
            >
                {kepala}

                {/* Bilah info baca */}
                <div
                    className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 font-mono text-[11px] tracking-wider text-gray-400"
                    style={{ borderColor: '#f0dee5' }}
                >
                    <span>
                        ≈ {menit} MENIT BACA · {totalKata.toLocaleString('id-ID')} KATA
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="mr-1">HURUF</span>
                        <button
                            type="button"
                            onClick={() => ubahUkuran(ukuran - 1)}
                            disabled={ukuran === 0}
                            aria-label="Perkecil huruf"
                            className="h-7 w-7 transition hover:bg-[#faf7f8] disabled:opacity-30"
                            style={{ ...clipPanelSm, border: `1px solid ${BORDER_SOFT}`, color: ACCENT }}
                        >
                            A−
                        </button>
                        <button
                            type="button"
                            onClick={() => ubahUkuran(ukuran + 1)}
                            disabled={ukuran === SKALA_HURUF.length - 1}
                            aria-label="Perbesar huruf"
                            className="h-7 w-7 transition hover:bg-[#faf7f8] disabled:opacity-30"
                            style={{ ...clipPanelSm, border: `1px solid ${BORDER_SOFT}`, color: ACCENT }}
                        >
                            A+
                        </button>
                    </div>
                </div>

                {banyak && (
                    <div className="mt-3 flex items-center gap-3">
                        <div className="h-1 flex-1 bg-[#f3e8ec]">
                            <div
                                className="h-1 transition-all duration-300"
                                style={{ width: `${((idx + 1) / halaman.length) * 100}%`, backgroundColor: ACCENT }}
                            />
                        </div>
                        <span className="font-mono text-[11px] tracking-wider text-gray-500">
                            HALAMAN {idx + 1} / {halaman.length}
                        </span>
                    </div>
                )}

                <div
                    className="prose-pendigi mt-6 text-gray-700"
                    style={{ fontSize: `${SKALA_HURUF[ukuran]}rem` }}
                    dangerouslySetInnerHTML={{ __html: halaman[idx] }}
                />

                {terakhir && (
                    <p className="mt-8 text-center font-mono text-[11px] tracking-[0.3em] text-gray-300">— AKHIR BAB —</p>
                )}

                {banyak && (
                    <nav
                        aria-label="Halaman bab"
                        className="mt-8 flex items-center justify-between gap-3 border-t pt-5"
                        style={{ borderColor: '#f0dee5' }}
                    >
                        <Button type="button" variant="ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
                            ← SEBELUMNYA
                        </Button>

                        <div className="hidden items-center gap-1 sm:flex">
                            {nomorTampil(idx, halaman.length).map((n, i) =>
                                n === '…' ? (
                                    <span key={`titik-${i}`} className="px-1 font-mono text-xs text-gray-300">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setIdx(n)}
                                        aria-label={`Halaman ${n + 1}`}
                                        aria-current={n === idx ? 'page' : undefined}
                                        className="h-8 w-8 font-mono text-xs transition"
                                        style={{
                                            ...clipPanelSm,
                                            border: `1px solid ${BORDER_SOFT}`,
                                            backgroundColor: n === idx ? ACCENT : '#fff',
                                            color: n === idx ? '#fff' : ACCENT,
                                        }}
                                    >
                                        {n + 1}
                                    </button>
                                ),
                            )}
                        </div>
                        <span className="font-mono text-[11px] tracking-wider text-gray-500 sm:hidden">
                            {idx + 1} / {halaman.length}
                        </span>

                        <Button
                            type="button"
                            variant={terakhir ? 'ghost' : 'primary'}
                            disabled={terakhir}
                            onClick={() => setIdx(idx + 1)}
                        >
                            BERIKUTNYA →
                        </Button>
                    </nav>
                )}

                {banyak && (
                    <p className="mt-3 hidden text-center font-mono text-[10px] tracking-wider text-gray-300 sm:block">
                        TIPS: TEKAN ← → DI KEYBOARD UNTUK PINDAH HALAMAN
                    </p>
                )}
            </div>

            {terakhir && children}
        </>
    );
}
