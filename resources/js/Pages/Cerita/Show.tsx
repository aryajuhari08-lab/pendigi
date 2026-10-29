import TombolSimpan from '@/Components/TombolSimpan';
import Avatar from '@/Components/Avatar';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#e3c7d2';

const RATING_LABEL: Record<string, string> = {
    semua_umur: 'Semua Umur',
    remaja: 'Remaja',
    dewasa: 'Dewasa',
};

interface CeritaData {
    cerita_id: number;
    judul_cerita: string;
    sinopsis: string;
    genre: string;
    tag: string | null;
    sampul: string | null;
    rating_usia: 'semua_umur' | 'remaja' | 'dewasa';
    status_progres: 'berlangsung' | 'tamat';
    views: number;
    updated_at: string;
    penulis?: { nama_lengkap: string; foto_profil?: string | null };
}

interface BabItem {
    bab_id: number;
    nomor_bab: number;
    judul_bab: string;
    views: number;
    created_at: string;
}

interface PageProps {
    cerita: CeritaData;
    bab: BabItem[];
    ratingAvg: number;
    ratingCount: number;
    ratingSaya: number | null;
    likesCount: number;
    sudahLike: boolean;
    sudahBookmark: boolean;
    babTerakhir: { bab_id: number; nomor_bab: number } | null;
    auth: { user: { nama_lengkap: string; role: string } | null };
}

function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Show({ cerita, bab, ratingAvg, ratingCount, ratingSaya, likesCount, sudahLike, sudahBookmark, babTerakhir, auth }: PageProps) {
    const [tab, setTab] = useState<'ringkasan' | 'bab'>('ringkasan');
    const tags = cerita.tag ? cerita.tag.split(',').map((t) => t.trim()).filter(Boolean) : [];

    const toggleLike = () => {
        if (!auth.user) return router.visit(route('login'));
        router.post(route('cerita.like', cerita.cerita_id), {}, { preserveScroll: true });
    };

    const beriRating = (skor: number) => {
        if (!auth.user) return;
        router.post(route('cerita.rating', cerita.cerita_id), { skor }, { preserveScroll: true });
    };

    return (
        <>
            <Head title={cerita.judul_cerita} />

            <div
                className="min-h-screen"
                style={{
                    backgroundColor: '#f5f2f3',
                    backgroundImage:
                        'linear-gradient(#ecdfe4 1px, transparent 1px), linear-gradient(90deg, #ecdfe4 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <div className="mx-auto max-w-4xl p-4">
                    <div className="flex items-center gap-4 bg-white p-3 shadow-sm" style={{ ...clipPanel, border: `1px solid ${BORDER}` }}>
                        <Link href={route('home')} className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                            PENDIGI
                        </Link>
                        <div className="h-6 w-px" style={{ backgroundColor: BORDER }} />
                        <Link href={route('cerita.index')} className="font-mono text-xs tracking-wider text-gray-500 hover:text-[#a8265c]">
                            KEMBALI KE FIKSI
                        </Link>
                    </div>

                    {/* Info utama */}
                    <div
                        className="mt-4 flex flex-col gap-5 bg-white p-6 shadow-sm sm:flex-row"
                        style={{ ...clipPanel, border: `1px solid ${BORDER}` }}
                    >
                        <div className="h-56 w-40 shrink-0 overflow-hidden bg-[#faf7f8]" style={{ border: `1px solid ${BORDER}` }}>
                            {cerita.sampul ? (
                                <img src={`/storage/${cerita.sampul}`} alt={cerita.judul_cerita} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center font-mono text-[10px] text-gray-300">NO COVER</div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">{cerita.judul_cerita}</h1>
                            <p className="mt-2 flex items-center gap-2 font-mono text-xs tracking-wider text-gray-500">
                                <Avatar nama={cerita.penulis?.nama_lengkap ?? '?'} foto={cerita.penulis?.foto_profil} size={24} />
                                {cerita.penulis?.nama_lengkap}
                            </p>

                            <div className="mt-3 flex items-center gap-4 font-mono text-xs text-gray-500">
                                <span>👁 {cerita.views}</span>
                                <span>★ {ratingAvg} ({ratingCount})</span>
                                <button type="button" onClick={toggleLike} title={sudahLike ? 'Batal suka' : 'Suka cerita ini'} style={{ color: sudahLike ? ACCENT : undefined }}>
                                    ♥ {likesCount}
</button>
<TombolSimpan rute="cerita.bookmark" id={cerita.cerita_id} sudahBookmark={sudahBookmark} isLoggedIn={!!auth.user} />
                                <span>≡ {bab.length} BAB</span>
                            </div>

                            {bab.length > 0 && (
                                <div className="mt-4 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={route('cerita.baca', [cerita.cerita_id, babTerakhir?.bab_id ?? bab[0].bab_id])}
                                        className="inline-block px-5 py-2 font-mono text-xs tracking-wider text-white transition hover:opacity-90"
                                        style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                                    >
                                        {babTerakhir ? `LANJUT MEMBACA · BAB ${babTerakhir.nomor_bab}` : 'MULAI MEMBACA'}
                                    </Link>
                                    {babTerakhir && (
                                        <Link
                                            href={route('cerita.baca', [cerita.cerita_id, bab[0].bab_id])}
                                            className="font-mono text-[11px] tracking-wider text-gray-500 underline hover:text-gray-800"
                                        >
                                            DARI AWAL
                                        </Link>
                                    )}
                                </div>
                            )}

                            {auth.user && (
                                <div className="mt-4 flex items-center gap-1 font-mono text-sm">
                                    <span className="mr-1 text-xs text-gray-400">RATING KAMU:</span>
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button key={n} onClick={() => beriRating(n)} style={{ color: n <= (ratingSaya ?? 0) ? ACCENT : '#d1d5db' }}>
                                            ★
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-4 flex gap-6 border-b font-mono text-xs tracking-wider" style={{ borderColor: BORDER }}>
                        <button
                            onClick={() => setTab('ringkasan')}
                            className="pb-2"
                            style={tab === 'ringkasan' ? { color: ACCENT, borderBottom: `2px solid ${ACCENT}`, fontWeight: 600 } : { color: '#6b7280' }}
                        >
                            RINGKASAN
                        </button>
                        <button
                            onClick={() => setTab('bab')}
                            className="pb-2"
                            style={tab === 'bab' ? { color: ACCENT, borderBottom: `2px solid ${ACCENT}`, fontWeight: 600 } : { color: '#6b7280' }}
                        >
                            BAB
                        </button>
                    </div>

                    {tab === 'ringkasan' ? (
                        <div className="mt-4 bg-white p-6 shadow-sm" style={{ ...clipPanel, border: `1px solid ${BORDER}` }}>
                            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-wider text-gray-500">
                                <span className="px-2 py-0.5" style={{ backgroundColor: '#fbeaef', color: ACCENT }}>
                                    {RATING_LABEL[cerita.rating_usia].toUpperCase()}
                                </span>
                                <span>{cerita.status_progres === 'berlangsung' ? 'SEDANG BERLANGSUNG' : 'TAMAT'}</span>
                                <span>· DIPERBARUI {formatTanggal(cerita.updated_at).toUpperCase()}</span>
                            </div>
                            <p className="mt-2 font-mono text-[11px] tracking-wider" style={{ color: ACCENT }}>
                                {cerita.genre.toUpperCase()}
                            </p>

                            {tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {tags.map((t) => (
                                        <span key={t} className="bg-[#faf7f8] px-2 py-0.5 font-mono text-[10px] text-gray-500" style={{ border: `1px solid ${BORDER}` }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">{cerita.sinopsis}</p>
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden bg-white shadow-sm" style={{ ...clipPanel, border: `1px solid ${BORDER}` }}>
                            {bab.length === 0 ? (
                                <p className="p-6 text-center font-mono text-xs text-gray-400">BELUM ADA BAB YANG TAYANG.</p>
                            ) : (
                                <table className="min-w-full text-sm">
                                    <thead className="font-mono text-[11px] tracking-wider text-white" style={{ backgroundColor: ACCENT }}>
                                        <tr>
                                            <th className="px-4 py-3 text-left">BAB</th>
                                            <th className="px-4 py-3 text-left">JUDUL</th>
                                            <th className="px-4 py-3 text-left">TANGGAL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderColor: '#f0dee5' }}>
                                        {bab.map((item, i) => (
                                            <tr key={item.bab_id} className={i % 2 === 1 ? 'bg-[#faf7f8]' : ''}>
                                                <td className="px-4 py-3 text-gray-500">{item.nomor_bab}</td>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={route('cerita.baca', [cerita.cerita_id, item.bab_id])}
                                                        className="font-medium text-gray-800 hover:underline"
                                                    >
                                                        {item.judul_bab}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs text-gray-400">{formatTanggal(item.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}