import { ACCENT, BORDER_SOFT, Button, clipPanel } from '@/Components/PendigiUI';
import TombolSimpan from '@/Components/TombolSimpan';
import { router } from '@inertiajs/react';

export default function InteraksiCerita({
    ceritaId,
    likesCount,
    sudahLike,
    sudahBookmark,
    ratingAvg,
    ratingCount,
    ratingSaya,
    isLoggedIn,
}: {
    ceritaId: number;
    likesCount: number;
    sudahLike: boolean;
    sudahBookmark: boolean;
    ratingAvg: number;
    ratingCount: number;
    ratingSaya: number | null;
    isLoggedIn: boolean;
}) {
    // Tamu diarahkan login dulu
    const butuhLogin = () => router.visit(route('login'));

    const toggleLike = () => {
        if (!isLoggedIn) return butuhLogin();
        router.post(route('cerita.like', ceritaId), {}, { preserveScroll: true });
    };

    const beriRating = (skor: number) => {
        if (!isLoggedIn) return butuhLogin();
        router.post(route('cerita.rating', ceritaId), { skor }, { preserveScroll: true });
    };

    return (
        <div
            className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 shadow-sm"
            style={{ ...clipPanel, border: `1px solid ${BORDER_SOFT}` }}
        >
            <div className="flex flex-wrap items-center gap-4">
                <Button type="button" variant={sudahLike ? 'primary' : 'ghost'} onClick={toggleLike} aria-pressed={sudahLike}>
                    ♥ {sudahLike ? 'DISUKAI' : 'SUKA'} · {likesCount}
                </Button>
                <TombolSimpan rute="cerita.bookmark" id={ceritaId} sudahBookmark={sudahBookmark} isLoggedIn={isLoggedIn} />
            </div>

            <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-xs text-gray-400">{isLoggedIn ? 'RATING KAMU:' : 'RATING:'}</span>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => beriRating(n)}
                        aria-label={`Beri rating ${n}`}
                        style={{ color: n <= (ratingSaya ?? 0) ? ACCENT : '#d1d5db' }}
                    >
                        ★
                    </button>
                ))}
                <span className="ml-1 text-xs text-gray-500">
                    {ratingAvg} ({ratingCount})
                </span>
            </div>
        </div>
    );
}
