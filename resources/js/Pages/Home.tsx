import Lonceng from '@/Components/Lonceng';
import Paginasi, { DataPaginasi } from '@/Components/Paginasi';
import KartuPustaka, { ItemPustaka } from '@/Components/KartuPustaka';
import Avatar from '@/Components/Avatar';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

interface KategoriOption {
    kategori_id: number;
    nama_kategori: string;
    children?: { kategori_id: number; nama_kategori: string }[];
}

interface ArtikelItem {
    artikel_id: number;
    judul_artikel: string;
    gambar: string | null;
    tanggal_publikasi: string;
    kategori?: { nama_kategori: string };
    penulis?: { nama_lengkap: string; foto_profil?: string | null };
    likes_count: number;
    rating_count: number;
}

interface BannerItem {
    banner_id: number;
    judul: string;
    deskripsi: string | null;
    gambar: string;
    link_url: string | null;
}

interface PageProps {
    artikel: DataPaginasi & { data: ArtikelItem[] };
    kategori: KategoriOption[];
    banner: BannerItem[];
    filters: { search?: string; kategori?: string };
    lanjutBaca: ItemPustaka[];
    auth: { user: { nama_lengkap: string; role: string; foto_profil?: string | null } | null };
    flash: { success?: string; error?: string };
}

// Panel bersudut terpotong ala Rhodes Island terminal - dipakai berulang, jadi disatukan di sini
const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };

function BannerCarousel({ banner }: { banner: BannerItem[] }) {
    const [active, setActive] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (banner.length <= 1) return;
        timerRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % banner.length);
        }, 5000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [banner.length]);

    if (banner.length === 0) return null;

    const current = banner[active];
    const content = (
        <div className="relative h-48 w-full overflow-hidden sm:h-64" style={{ ...clipPanel, border: '1px solid #e3c7d2' }}>
            <img src={`/storage/${current.gambar}`} alt={current.judul} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="font-mono text-xs tracking-wide text-white sm:text-sm">{current.judul}</p>
                {current.deskripsi && (
                    <p className="mt-1 line-clamp-2 text-xs text-white/80 sm:text-sm">{current.deskripsi}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="mt-4">
            {current.link_url ? (
                <a href={current.link_url} target="_blank" rel="noreferrer">
                    {content}
                </a>
            ) : (
                content
            )}
            {banner.length > 1 && (
                <div className="mt-2 flex justify-center gap-2">
                    {banner.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            aria-label={`Banner ${i + 1}`}
                            className="h-1.5 w-6 transition"
                            style={{ backgroundColor: i === active ? '#a8265c' : '#e3c7d2' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Home({ artikel, kategori, banner, filters, lanjutBaca, auth, flash }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    const jalankanPencarian = (kata: string) => {
        router.get(
            route('home'),
            { search: kata, kategori: filters.kategori },
            { preserveState: true, replace: true },
        );
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

    const filterKategori = (kategoriId: string | null) => {
        router.get(route('home'), { search, kategori: kategoriId }, { preserveState: true, replace: true });
    };

    const logout = () => {
        router.post(route('logout'));
    };

    const bisaKeDashboard = auth.user && (auth.user.role === 'admin' || auth.user.role === 'publisher');

    // Kategori induk yang lagi aktif dipilih, entah lewat tab induknya sendiri
    // atau lewat salah satu sub-kategorinya (dipilih dari dropdown).
    const parentAktif = kategori.find(
        (k) =>
            String(k.kategori_id) === filters.kategori ||
            k.children?.some((c) => String(c.kategori_id) === filters.kategori),
    );

    return (
        <>
            <Head title="Pendigi - Portal Informasi" />

            <div
                className="min-h-screen"
                style={{
                    backgroundColor: '#f5f2f3',
                    backgroundImage:
                        'linear-gradient(#ecdfe4 1px, transparent 1px), linear-gradient(90deg, #ecdfe4 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <div className="mx-auto max-w-6xl px-4 py-4">
                    {(flash.success || flash.error) && (
                        <div
                            className="mb-3 p-3 font-mono text-xs"
                            style={{
                                ...clipPanelSm,
                                backgroundColor: flash.success ? '#eaf6ee' : '#fbeaef',
                                color: flash.success ? '#1f7a3f' : '#a8265c',
                            }}
                        >
                            {flash.success ?? flash.error}
                        </div>
                    )}

                    {/* Baris 1: logo + search + auth */}
                    <div
                        className="flex items-center gap-4 bg-white p-3 shadow-sm"
                        style={{ ...clipPanel, border: '1px solid #e3c7d2' }}
                    >
                        <Link
                            href={route('home')}
                            className="shrink-0 font-mono text-lg font-bold tracking-widest"
                            style={{ color: '#a8265c' }}
                        >
                            PENDIGI
                        </Link>
                        <div className="h-6 w-px" style={{ backgroundColor: '#e3c7d2' }} />
                        <span className="shrink-0 font-mono text-xs tracking-wider" style={{ color: '#a8265c' }}>
                            ARTIKEL
                        </span>
                        <Link
                            href={route('cerita.index')}
                            className="shrink-0 font-mono text-xs tracking-wider text-gray-500 hover:text-[#a8265c]"
                        >
                            FIKSI
                        </Link>
                        <form onSubmit={submitSearch} className="flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="CARI ARTIKEL..."
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
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 tracking-wider transition hover:bg-[#faf7f8]"
                                        style={{ ...clipPanelSm, border: '1px solid #e3c7d2', color: '#a8265c' }}
                                    >
                                        LOGOUT
                                    </button>
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

                    <BannerCarousel banner={banner} />

                    {/* Baris 2: filter kategori */}
                    <div className="mt-3 flex gap-6 overflow-x-auto font-mono text-xs tracking-wider">
                        <button
                            onClick={() => filterKategori(null)}
                            className="pb-1"
                            style={
                                !filters.kategori
                                    ? { color: '#a8265c', borderBottom: '2px solid #a8265c', fontWeight: 600 }
                                    : { color: '#6b7280' }
                            }
                        >
                            // SEMUA
                        </button>
                        {kategori.map((k) => {
                            const aktif =
                                filters.kategori === String(k.kategori_id) ||
                                k.children?.some((c) => String(c.kategori_id) === filters.kategori);
                            return (
                                <button
                                    key={k.kategori_id}
                                    onClick={() => filterKategori(String(k.kategori_id))}
                                    className="whitespace-nowrap pb-1"
                                    style={
                                        aktif
                                            ? { color: '#a8265c', borderBottom: '2px solid #a8265c', fontWeight: 600 }
                                            : { color: '#6b7280' }
                                    }
                                >
                                    {k.nama_kategori.toUpperCase()}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dropdown sub-kategori - cuma muncul kalau kategori induk yang aktif punya anak */}
                    {parentAktif && parentAktif.children && parentAktif.children.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 font-mono text-xs">
                            <span className="text-gray-400">// SUB-KATEGORI</span>
                            <select
                                value={filters.kategori ?? ''}
                                onChange={(e) => filterKategori(e.target.value)}
                                className="bg-[#faf7f8] px-2 py-1 text-gray-700 focus:outline-none"
                                style={{ ...clipPanelSm, border: '1px solid #e3c7d2' }}
                            >
                                <option value={String(parentAktif.kategori_id)}>
                                    SEMUA {parentAktif.nama_kategori.toUpperCase()}
                                </option>
                                {parentAktif.children.map((c) => (
                                    <option key={c.kategori_id} value={String(c.kategori_id)}>
                                        {c.nama_kategori.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Lanjutkan membaca: hanya untuk user yang login dan punya riwayat, disembunyikan saat mencari/memfilter */}
                    {lanjutBaca.length > 0 && !filters.search && !filters.kategori && artikel.current_page === 1 && (
                        <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="font-mono text-xs tracking-wider text-gray-500">
                                    <span style={{ color: '#a8265c' }}>// </span>
                                    LANJUTKAN MEMBACA
                                </p>
                                <Link
                                    href={route('pustaka.index')}
                                    className="font-mono text-[11px] tracking-wider hover:underline"
                                    style={{ color: '#a8265c' }}
                                >
                                    PUSTAKA SAYA →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {lanjutBaca.map((item) => (
                                    <KartuPustaka key={`${item.jenis}-${item.id}`} item={item} ringkas />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid artikel */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {artikel.data.length === 0 && (
                            <div
                                className="col-span-full bg-white p-10 text-center font-mono text-xs text-gray-400 shadow-sm"
                                style={{ ...clipPanel, border: '1px solid #e3c7d2' }}
                            >
                                TIDAK ADA ARTIKEL YANG COCOK.
                            </div>
                        )}
                        {artikel.data.map((item) => (
                            <Link
                                key={item.artikel_id}
                                href={route('artikel.show', item.artikel_id)}
                                className="group overflow-hidden bg-white shadow-sm transition hover:shadow-md"
                                style={{ ...clipPanel, border: '1px solid #e3c7d2' }}
                            >
                                <div className="relative flex h-32 items-center justify-center bg-[#faf7f8] text-gray-300">
                                    <div
                                        className="absolute left-0 top-0 px-2 py-0.5 font-mono text-[10px] tracking-wider text-white"
                                        style={{ backgroundColor: '#a8265c' }}
                                    >
                                        {item.kategori?.nama_kategori?.toUpperCase()}
                                    </div>
                                    {item.gambar ? (
                                        <img
                                            src={`/storage/${item.gambar}`}
                                            alt={item.judul_artikel}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-mono text-xs">[ NO IMAGE ]</span>
                                    )}
                                </div>
                                <div className="border-t p-3" style={{ borderColor: '#f0dee5' }}>
                                    <p className="text-sm font-medium text-gray-800">{item.judul_artikel}</p>
                                    <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-gray-500">
                                        <Avatar nama={item.penulis?.nama_lengkap ?? '?'} foto={item.penulis?.foto_profil} size={18} />
                                        <span className="truncate">{item.penulis?.nama_lengkap ?? '-'}</span>
                                    </div>
                                    <p className="mt-1 font-mono text-[10px] text-gray-400">
                                        {new Date(item.tanggal_publikasi)
                                            .toLocaleDateString('id-ID')
                                            .replace(/\//g, '.')}
                                    </p>
                                    <div className="mt-2 flex gap-3 font-mono text-[10px]" style={{ color: '#a8265c' }}>
                                        <span>♥ {item.likes_count}</span>
                                        <span>★ {item.rating_count}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Paginasi paginasi={artikel} satuan="artikel" />

                    {artikel.current_page >= artikel.last_page && (
                        <p className="mt-8 text-center font-mono text-[10px] tracking-widest text-gray-400">
                            -- END OF FEED --
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}