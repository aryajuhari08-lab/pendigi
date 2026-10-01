import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface KomentarItem {
    komentar_id: number;
    komentar: string;
    create_at: string;
    user_id: number;
    penulis?: { nama_lengkap: string };
    balasan?: KomentarItem[];
}

interface ArtikelData {
    artikel_id: number;
    user_id: number;
    judul_artikel: string;
    isi_artikel: string;
    gambar: string | null;
    tanggal_publikasi: string;
    views: number;
    sumber: string;
    genre: string | null;
    penulis?: { nama_lengkap: string };
    kategori?: { nama_kategori: string };
}

interface ArtikelTerkaitItem {
    artikel_id: number;
    judul_artikel: string;
    gambar: string | null;
}

interface PageProps {
    artikel: ArtikelData;
    komentar: KomentarItem[];
    likesCount: number;
    ratingAvg: number;
    ratingCount: number;
    sudahLike: boolean;
    ratingSaya: number | null;
    isPenulis: boolean;
    artikelTerkait: ArtikelTerkaitItem[];
    auth: { user: { nama_lengkap: string; role: string } | null };
    flash: { success?: string; error?: string };
}

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const accent = '#a8265c';
const accentBorder = '#e3c7d2';

function formatWaktu(tanggal: string) {
    return new Date(tanggal)
        .toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
}

export default function Show({
    artikel,
    komentar,
    likesCount,
    ratingAvg,
    ratingCount,
    sudahLike,
    ratingSaya,
    artikelTerkait,
    auth,
    flash,
}: PageProps) {
    const [teksKomentar, setTeksKomentar] = useState('');
    const [balasKeId, setBalasKeId] = useState<number | null>(null);
    const [teksBalasan, setTeksBalasan] = useState('');

    const toggleLike = () => {
        if (!auth.user) return;
        router.post(route('artikel.like', artikel.artikel_id), {}, { preserveScroll: true });
    };

    const beriRating = (skor: number) => {
        if (!auth.user) return;
        router.post(route('artikel.rating', artikel.artikel_id), { skor }, { preserveScroll: true });
    };

    const kirimKomentar = (e: FormEvent) => {
        e.preventDefault();
        router.post(
            route('artikel.komentar', artikel.artikel_id),
            { komentar: teksKomentar },
            { preserveScroll: true, onSuccess: () => setTeksKomentar('') },
        );
    };

    const kirimBalasan = (e: FormEvent, komentarId: number) => {
        e.preventDefault();
        router.post(
            route('komentar.balas', komentarId),
            { komentar: teksBalasan },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setTeksBalasan('');
                    setBalasKeId(null);
                },
            },
        );
    };

    return (
        <>
            <Head title={artikel.judul_artikel} />

            <div
                className="min-h-screen"
                style={{
                    backgroundColor: '#f5f2f3',
                    backgroundImage:
                        'linear-gradient(#ecdfe4 1px, transparent 1px), linear-gradient(90deg, #ecdfe4 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <div className="mx-auto max-w-6xl px-4 py-6">
                    <Link
                        href={route('home')}
                        className="font-mono text-xs tracking-wider text-gray-500 hover:underline"
                    >
                        KEMBALI
                    </Link>

                    {(flash.success || flash.error) && (
                        <div
                            className="mt-3 p-3 font-mono text-xs"
                            style={{
                                ...clipPanelSm,
                                backgroundColor: flash.success ? '#eaf6ee' : '#fbeaef',
                                color: flash.success ? '#1f7a3f' : accent,
                            }}
                        >
                            {flash.success ?? flash.error}
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <article className="overflow-hidden bg-white shadow-sm" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                                {artikel.gambar && (
                                    <img
                                        src={`/storage/${artikel.gambar}`}
                                        alt={artikel.judul_artikel}
                                        className="h-auto w-full"
                                    />
                                )}
                                <div className="p-6">
                                    <p className="font-mono text-[10px] tracking-wider text-gray-400">
                                        {artikel.kategori?.nama_kategori?.toUpperCase()}
                                        {artikel.genre && <> :: {artikel.genre.toUpperCase()}</>} ::{' '}
                                        {new Date(artikel.tanggal_publikasi).toLocaleDateString('id-ID').replace(/\//g, '.')}{' '}
                                        :: {artikel.views} VIEWS
                                    </p>
                                    <h1 className="mt-2 text-2xl font-semibold text-gray-800">{artikel.judul_artikel}</h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        oleh {artikel.penulis?.nama_lengkap}
                                        <span className="mx-1.5 text-gray-300">|</span>
                                        Sumber: {artikel.sumber}
                                    </p>

                                    <div
                                        className="prose prose-sm mt-4 max-w-none text-gray-700 prose-headings:text-gray-800 prose-a:text-[#a8265c] prose-strong:text-gray-800"
                                        dangerouslySetInnerHTML={{ __html: artikel.isi_artikel }}
                                    />

                                    <div className="mt-6 flex flex-wrap items-center gap-6 border-t pt-4" style={{ borderColor: accentBorder }}>
                                        <button
                                            onClick={toggleLike}
                                            disabled={!auth.user}
                                            title={auth.user ? undefined : 'Login untuk memberi like'}
                                            className={`flex items-center gap-1 font-mono text-xs ${!auth.user ? 'cursor-not-allowed opacity-60' : ''}`}
                                            style={{ color: sudahLike ? accent : '#6b7280' }}
                                        >
                                            {sudahLike ? '♥' : '♡'} {likesCount} LIKE
                                        </button>

                                        <div className="flex items-center gap-1 font-mono text-xs">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <button
                                                    key={n}
                                                    onClick={() => beriRating(n)}
                                                    disabled={!auth.user}
                                                    style={{ color: n <= (ratingSaya ?? 0) ? accent : '#d1d5db' }}
                                                    className={!auth.user ? 'cursor-not-allowed opacity-60' : ''}
                                                    title={auth.user ? `Beri rating ${n}` : 'Login untuk memberi rating'}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                            <span className="ml-1 text-gray-400">
                                                {ratingAvg} ({ratingCount})
                                            </span>
                                        </div>

                                        {!auth.user && (
                                            <p className="w-full font-mono text-[10px] text-gray-400 sm:w-auto">
                                                <Link href={route('login')} style={{ color: accent }} className="hover:underline">
                                                    LOGIN
                                                </Link>{' '}
                                                UNTUK MEMBERI LIKE DAN RATING
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </article>

                            <div className="mt-6 bg-white p-6 shadow-sm" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                                <p className="mb-4 font-mono text-xs tracking-wider text-gray-800">
                                    KOMENTAR ({komentar.length})
                                </p>

                                {auth.user ? (
                                    <form onSubmit={kirimKomentar} className="mb-6 flex gap-2">
                                        <input
                                            type="text"
                                            value={teksKomentar}
                                            onChange={(e) => setTeksKomentar(e.target.value)}
                                            placeholder="Tulis komentar..."
                                            className="flex-1 px-3 py-2 text-sm focus:outline-none"
                                            style={{ ...clipPanelSm, border: `1px solid ${accentBorder}` }}
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 font-mono text-xs tracking-wider text-white transition hover:opacity-90"
                                            style={{ ...clipPanelSm, backgroundColor: accent }}
                                        >
                                            KIRIM
                                        </button>
                                    </form>
                                ) : (
                                    <p className="mb-6 text-sm text-gray-500">
                                        <Link href={route('login')} style={{ color: accent }} className="hover:underline">
                                            Login
                                        </Link>{' '}
                                        dulu untuk memberi komentar
                                    </p>
                                )}

                                <div className="flex flex-col gap-4">
                                    {komentar.length === 0 && (
                                        <p className="font-mono text-xs text-gray-400">
                                            BELUM ADA KOMENTAR
                                        </p>
                                    )}
                                    {komentar.map((item) => (
                                        <div key={item.komentar_id} className="border-b pb-3 last:border-0" style={{ borderColor: '#f0dee5' }}>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {item.penulis?.nama_lengkap}
                                                </p>
                                                <p className="font-mono text-[10px] text-gray-400">{formatWaktu(item.create_at)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">{item.komentar}</p>

                                            {auth.user && (
                                                <button
                                                    onClick={() =>
                                                        setBalasKeId(balasKeId === item.komentar_id ? null : item.komentar_id)
                                                    }
                                                    className="mt-1 font-mono text-[10px] tracking-wider hover:underline"
                                                    style={{ color: accent }}
                                                >
                                                    BALAS
                                                </button>
                                            )}

                                            {balasKeId === item.komentar_id && (
                                                <form
                                                    onSubmit={(e) => kirimBalasan(e, item.komentar_id)}
                                                    className="ml-4 mt-2 flex gap-2"
                                                >
                                                    <input
                                                        type="text"
                                                        value={teksBalasan}
                                                        onChange={(e) => setTeksBalasan(e.target.value)}
                                                        placeholder="Tulis balasan..."
                                                        className="flex-1 px-3 py-1 text-sm focus:outline-none"
                                                        style={{ ...clipPanelSm, border: `1px solid ${accentBorder}` }}
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-1 font-mono text-[10px] tracking-wider text-white"
                                                        style={{ ...clipPanelSm, backgroundColor: accent }}
                                                    >
                                                        KIRIM
                                                    </button>
                                                </form>
                                            )}

                                            {item.balasan && item.balasan.length > 0 && (
                                                <div className="ml-4 mt-3 flex flex-col gap-2 border-l-2 pl-4" style={{ borderColor: '#f0dee5' }}>
                                                    {item.balasan.map((balasan) => (
                                                        <div key={balasan.komentar_id}>
                                                            <div className="flex items-baseline gap-2">
                                                                <p className="text-xs font-medium text-gray-700">
                                                                    {balasan.penulis?.nama_lengkap}{' '}
                                                                    {balasan.user_id === artikel.user_id && (
                                                                        <span
                                                                            className="font-mono text-[9px] font-normal tracking-wider"
                                                                            style={{ color: accent }}
                                                                        >
                                                                            (PENULIS)
                                                                        </span>
                                                                    )}
                                                                </p>
                                                                <p className="font-mono text-[10px] text-gray-400">
                                                                    {formatWaktu(balasan.create_at)}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{balasan.komentar}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div
                                className="flex h-64 flex-col items-center justify-center bg-white font-mono text-gray-400"
                                style={{ ...clipPanel, border: `1px dashed ${accentBorder}` }}
                            >
                                <span className="text-xs uppercase tracking-widest">IKLAN</span>
                                <span className="mt-1 text-[10px]">300 x 250</span>
                            </div>

                            {artikelTerkait.length > 0 && (
                                <div className="bg-white p-4 shadow-sm" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                                    <p className="mb-3 font-mono text-[10px] tracking-wider text-gray-800">ARTIKEL SERUPA</p>
                                    <div className="flex flex-col gap-3">
                                        {artikelTerkait.map((item) => (
                                            <Link
                                                key={item.artikel_id}
                                                href={route('artikel.show', item.artikel_id)}
                                                className="flex gap-2 hover:opacity-80"
                                            >
                                                <div className="h-12 w-16 shrink-0 overflow-hidden bg-[#faf7f8]" style={clipPanelSm}>
                                                    {item.gambar && (
                                                        <img
                                                            src={`/storage/${item.gambar}`}
                                                            alt={item.judul_artikel}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <p className="line-clamp-2 text-xs text-gray-700">{item.judul_artikel}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}