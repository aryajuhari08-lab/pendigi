import { router } from '@inertiajs/react';

const ACCENT = '#a8265c';

// Tombol simpan/lepas bookmark. Tamu yang menekannya diarahkan ke halaman login.
export default function TombolSimpan({
    rute,
    id,
    sudahBookmark,
    isLoggedIn,
}: {
    rute: 'artikel.bookmark' | 'cerita.bookmark';
    id: number;
    sudahBookmark: boolean;
    isLoggedIn: boolean;
}) {
    const klik = () => {
        if (!isLoggedIn) return router.visit(route('login'));
        router.post(route(rute, id), {}, { preserveScroll: true });
    };

    return (
        <button
            type="button"
            onClick={klik}
            aria-pressed={sudahBookmark}
            title={!isLoggedIn ? 'Login untuk menyimpan' : sudahBookmark ? 'Lepas dari Tersimpan' : 'Simpan ke Pustaka Saya'}
            className="flex items-center gap-1 font-mono text-xs"
            style={{ color: sudahBookmark ? ACCENT : '#6b7280' }}
        >
            {sudahBookmark ? '◆ TERSIMPAN' : '◇ SIMPAN'}
        </button>
    );
}
