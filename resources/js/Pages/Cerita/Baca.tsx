import Avatar from '@/Components/Avatar';
import InteraksiCerita from '@/Components/InteraksiCerita';
import IsiBabBerhalaman from '@/Components/IsiBabBerhalaman';
import KomentarSection, { KomentarItem } from '@/Components/KomentarSection';
import { Head, Link, usePage } from '@inertiajs/react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#e3c7d2';

interface CeritaRingkas {
    cerita_id: number;
    judul_cerita: string;
    sampul: string | null;
}

interface BabData {
    bab_id: number;
    nomor_bab: number;
    judul_bab: string;
    isi_bab: string;
    views: number;
}

interface BabTautan {
    bab_id: number;
    nomor_bab: number;
}

interface PageProps {
    cerita: CeritaRingkas;
    penulis: { nama_lengkap: string; foto_profil?: string | null };
    bab: BabData;
    babSebelum: BabTautan | null;
    babSesudah: BabTautan | null;
    komentar: KomentarItem[];
    likesCount: number;
    sudahLike: boolean;
    sudahBookmark: boolean;
    ratingAvg: number;
    ratingCount: number;
    ratingSaya: number | null;
    isPenulis: boolean;
}

export default function Baca({
    cerita,
    penulis,
    bab,
    babSebelum,
    babSesudah,
    komentar,
    likesCount,
    sudahLike,
    sudahBookmark,
    ratingAvg,
    ratingCount,
    ratingSaya,
    isPenulis,
}: PageProps) {
    const isLoggedIn = !!usePage().props.auth.user;

    return (
        <>
            <Head title={`${cerita.judul_cerita} - Bab ${bab.nomor_bab}`} />

            <div
                className="min-h-screen"
                style={{
                    backgroundColor: '#f5f2f3',
                    backgroundImage:
                        'linear-gradient(#ecdfe4 1px, transparent 1px), linear-gradient(90deg, #ecdfe4 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <div className="mx-auto max-w-3xl p-4">
                    <div className="flex items-center gap-4 bg-white p-3 shadow-sm" style={{ ...clipPanel, border: `1px solid ${BORDER}` }}>
                        <Link href={route('home')} className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                            PENDIGI
                        </Link>
                        <div className="h-6 w-px" style={{ backgroundColor: BORDER }} />
                        <Link href={route('cerita.show', cerita.cerita_id)} className="truncate font-mono text-xs tracking-wider text-gray-500 hover:text-[#a8265c]">
                            {cerita.judul_cerita.toUpperCase()}
                        </Link>
                    </div>

                    <IsiBabBerhalaman
                        key={bab.bab_id}
                        html={bab.isi_bab}
                        kepala={
                            <>
                                <p className="font-mono text-xs tracking-wider text-gray-400">BAB {bab.nomor_bab}</p>
                                <h1 className="mt-1 text-2xl font-bold text-gray-800">{bab.judul_bab}</h1>
                                <p className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-wider text-gray-400">
                                    <Avatar nama={penulis.nama_lengkap} foto={penulis.foto_profil} size={22} />
                                    OLEH {penulis.nama_lengkap.toUpperCase()} · 👁 {bab.views}
                                </p>
                            </>
                        }
                    >
                        <div className="mt-4">
                            <InteraksiCerita
                                ceritaId={cerita.cerita_id}
                                likesCount={likesCount}
                                sudahLike={sudahLike}
                                sudahBookmark={sudahBookmark}
                                ratingAvg={ratingAvg}
                                ratingCount={ratingCount}
                                ratingSaya={ratingSaya}
                                isLoggedIn={isLoggedIn}
                            />
                        </div>

                        {/* Navigasi antar bab */}
                        <div className="mt-4 flex items-stretch gap-3">
                            {babSebelum ? (
                                <Link
                                    href={route('cerita.baca', [cerita.cerita_id, babSebelum.bab_id])}
                                    className="flex-1 bg-white px-4 py-3 text-center font-mono text-xs tracking-wider transition hover:bg-[#faf7f8]"
                                    style={{ ...clipPanelSm, border: `1px solid ${BORDER}`, color: ACCENT }}
                                >
                                    ← BAB {babSebelum.nomor_bab}
                                </Link>
                            ) : (
                                <div className="flex-1" />
                            )}

                            <Link
                                href={route('cerita.show', cerita.cerita_id)}
                                className="flex-1 bg-white px-4 py-3 text-center font-mono text-xs tracking-wider text-gray-500 transition hover:bg-[#faf7f8]"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            >
                                DAFTAR BAB
                            </Link>

                            {babSesudah ? (
                                <Link
                                    href={route('cerita.baca', [cerita.cerita_id, babSesudah.bab_id])}
                                    className="flex-1 px-4 py-3 text-center font-mono text-xs tracking-wider text-white transition hover:opacity-90"
                                    style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                                >
                                    BAB {babSesudah.nomor_bab} →
                                </Link>
                            ) : (
                                <div className="flex-1" />
                            )}
                        </div>

                        <div className="mt-6 pb-10">
                            <KomentarSection
                                komentar={komentar}
                                storeUrl={route('bab.komentar', bab.bab_id)}
                                isLoggedIn={isLoggedIn}
                                bolehBalas={isPenulis}
                            />
                        </div>
                    </IsiBabBerhalaman>
                </div>
            </div>
        </>
    );
}