import Lonceng from '@/Components/Lonceng';
import Paginasi, { DataPaginasi } from '@/Components/Paginasi';
import Avatar from '@/Components/Avatar';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };

const GENRE_LIST = ['Romance', 'Horror', 'Thriller', 'Mystery', 'Science Fiction', 'Comedy', 'Adventure', 'Drama', 'Fantasy', 
    'Historical', 'Action', 'Slice of Life', 'Supernatural', 'Crime', 'Magic Realism', 'Philosophical', ];

const RATING_LABEL: Record<string, string> = {
    semua_umur: 'SEMUA UMUR',
    remaja: 'REMAJA',
    dewasa: 'DEWASA',
};

interface CeritaItem {
    cerita_id: number;
    judul_cerita: string;
    sinopsis: string;
    genre: string;
    sampul: string | null;
    rating_usia: 'semua_umur' | 'remaja' | 'dewasa';
    status_progres: 'berlangsung' | 'tamat';
    views: number;
    jumlah_bab: number;
    penulis?: { nama_lengkap: string; foto_profil?: string | null };
}

interface PageProps {
    cerita: DataPaginasi & { data: CeritaItem[] };
    filters: { search?: string; genre?: string };
    auth: { user: { nama_lengkap: string; role: string; foto_profil?: string | null } | null };
}

export default function Index({ cerita, filters, auth }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    const jalankanPencarian = (kata: string) => {
        router.get(route('cerita.index'), { search: kata, genre: filters.genre }, { preserveState: true, replace: true });
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => jalankanPencarian(search), 400);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        if (timerRef.current) clearTimeout(timerRef.current);
        jalankanPencarian(search);
    };

    const filterGenre = (genre: string | null) => {
        router.get(route('cerita.index'), { search, genre }, { preserveState: true, replace: true });
    };

    const bisaKeDashboard = auth.user && (auth.user.role === 'admin' || auth.user.role === 'publisher');

    return (
        <>
            <Head title="Fiksi - Pendigi" />

            <div
                className="min-h-screen"
                style={{
                    backgroundColor: '#f5f2f3',
                    backgroundImage:
                        'linear-gradient(#ecdfe4 1px, transparent 1px), linear-gradient(90deg, #ecdfe4 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <div className="mx-auto max-w-6xl p-4">
                    {/* Baris 1: logo + search + auth */}
                    <div className="flex items-center gap-4 bg-white p-3 shadow-sm" style={{ ...clipPanel, border: '1px solid #e3c7d2' }}>
                        <Link href={route('home')} className="shrink-0 font-mono text-lg font-bold tracking-widest" style={{ color: '#a8265c' }}>
                            PENDIGI
                        </Link>
                        <div className="h-6 w-px" style={{ backgroundColor: '#e3c7d2' }} />
                        <Link href={route('home')} className="shrink-0 font-mono text-xs tracking-wider text-gray-500 hover:text-[#a8265c]">
                            ARTIKEL
                        </Link>
                        <span className="shrink-0 font-mono text-xs tracking-wider" style={{ color: '#a8265c' }}>
                            FIKSI
                        </span>
                        <form onSubmit={submitSearch} className="flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="CARI CERITA..."
                                className="w-full bg-[#faf7f8] px-3 py-2 font-mono text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: '1px solid #e3c7d2' }}
                            />
                        </form>
                        <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
                            {auth.user ? (
                                <>
                                    <Lonceng />
    <Link
    href={route('pustaka.index')}
    className="tracking-wider text-gray-500 hover:text-[#a8265c]"
>
    PUSTAKA
</Link>
<Link
    href={route('profile.edit')}
    title="Profil akun"
    className="flex items-center gap-2 tracking-wide text-gray-500 hover:text-[#a8265c]"
>
    <Avatar nama={auth.user.nama_lengkap} foto={auth.user.foto_profil} size={28} />
    <span className="hidden sm:inline">{auth.user.nama_lengkap}</span>
</Link>
                                    {bisaKeDashboard && (
                                        <Link
                                            href={route('dashboard')}
                                            className="px-4 py-2 tracking-wider text-white transition hover:opacity-90"
                                            style={{ ...clipPanelSm, backgroundColor: '#a8265c' }}
                                        >
                                            DASHBOARD
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 tracking-wider transition hover:bg-[#faf7f8]"
                                        style={{ ...clipPanelSm, border: '1px solid #e3c7d2', color: '#a8265c' }}
                                    >
                                        LOGIN
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 tracking-wider text-white transition hover:opacity-90"
                                        style={{ ...clipPanelSm, backgroundColor: '#a8265c' }}
                                    >
                                        REGISTER
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="my-1 h-[3px]" style={{ background: 'linear-gradient(90deg, #c2447a 0%, #c2447a 40%, transparent 40%, transparent 100%)' }} />

                    {/* Filter genre */}
                    <div className="mt-3 flex gap-6 overflow-x-auto font-mono text-xs tracking-wider">
                        <button
                            onClick={() => filterGenre(null)}
                            className="pb-1"
                            style={!filters.genre ? { color: '#a8265c', borderBottom: '2px solid #a8265c', fontWeight: 600 } : { color: '#6b7280' }}
                        >
                            // SEMUA GENRE
                        </button>
                        {GENRE_LIST.map((g) => (
                            <button
                                key={g}
                                onClick={() => filterGenre(g)}
                                className="pb-1 whitespace-nowrap"
                                style={filters.genre === g ? { color: '#a8265c', borderBottom: '2px solid #a8265c', fontWeight: 600 } : { color: '#6b7280' }}
                            >
                                {g.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Grid cerita */}
                    {cerita.data.length === 0 ? (
                        <div
                            className="mt-4 bg-white p-10 text-center font-mono text-xs text-gray-400"
                            style={{ ...clipPanel, border: '1px solid #e3c7d2' }}
                        >
                            TIDAK ADA CERITA YANG COCOK.
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {cerita.data.map((item) => (
                                <Link
                                    key={item.cerita_id}
                                    href={route('cerita.show', item.cerita_id)}
                                    className="flex flex-col bg-white shadow-sm transition hover:shadow-md"
                                    style={{ ...clipPanel, border: '1px solid #e3c7d2' }}
                                >
                                    <div className="h-44 w-full overflow-hidden bg-[#faf7f8]">
                                        {item.sampul ? (
                                            <img src={`/storage/${item.sampul}`} alt={item.judul_cerita} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center font-mono text-[10px] text-gray-300">
                                                NO COVER
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-3">
                                        <p className="line-clamp-2 text-sm font-semibold text-gray-800">{item.judul_cerita}</p>
                                        <p className="mt-1 font-mono text-[10px] tracking-wider text-gray-400">
                                            <Avatar nama={item.penulis?.nama_lengkap ?? '?'} foto={item.penulis?.foto_profil} size={18} className="mr-1.5 align-middle" />
                                            {item.penulis?.nama_lengkap ?? '-'}
                                        </p>
                                        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2 font-mono text-[9px] tracking-wider">
                                            <span className="px-1.5 py-0.5" style={{ backgroundColor: '#f3e6eb', color: '#a8265c' }}>
                                                {item.genre.toUpperCase()}
                                            </span>
                                            <span className="px-1.5 py-0.5" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                                                {RATING_LABEL[item.rating_usia]}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 font-mono text-[10px] text-gray-400">
                                            {item.jumlah_bab} BAB · {item.views} VIEWS
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Paginasi paginasi={cerita} satuan="cerita" />
                </div>
            </div>
        </>
    );
}