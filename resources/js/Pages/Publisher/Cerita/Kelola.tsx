import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

interface CeritaData {
    cerita_id: number;
    judul_cerita: string;
    sinopsis: string;
    genre: string;
    tag: string | null;
    sampul: string | null;
    rating_usia: 'semua_umur' | 'remaja' | 'dewasa';
    status_progres: 'berlangsung' | 'tamat';
    status: 'draft' | 'pending_review' | 'published' | 'rejected';
    catatan_admin: string | null;
    views: number;
}

interface BabItem {
    bab_id: number;
    nomor_bab: number;
    judul_bab: string;
    views: number;
    status: 'draft' | 'pending_review' | 'published' | 'rejected';
    catatan_admin: string | null;
    created_at: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: '#e5e7eb', text: '#4b5563', label: 'DRAFT' },
    pending_review: { bg: '#fde8c8', text: '#92620a', label: 'PENDING REVIEW' },
    published: { bg: '#d7f0df', text: '#1f7a3f', label: 'PUBLISHED' },
    rejected: { bg: '#fbd5e4', text: '#a8265c', label: 'REJECTED' },
};

const RATING_LABEL: Record<string, string> = {
    semua_umur: 'Semua Umur',
    remaja: 'Remaja',
    dewasa: 'Dewasa',
};

function StatusBadge({ status }: { status: string }) {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE.draft;
    return (
        <span className="px-2 py-0.5 font-mono text-[10px] tracking-wider" style={{ backgroundColor: s.bg, color: s.text }}>
            {s.label}
        </span>
    );
}

export default function Kelola({ cerita, bab }: { cerita: CeritaData; bab: BabItem[] }) {
    const tags = cerita.tag ? cerita.tag.split(',').map((t) => t.trim()).filter(Boolean) : [];

    const toggleProgres = () => {
        router.put(route('publisher.cerita.toggleProgres', cerita.cerita_id), {}, { preserveScroll: true });
    };

    const hapusCerita = () => {
        if (confirm(`Hapus cerita "${cerita.judul_cerita}" beserta semua babnya? Tindakan ini tidak bisa dibatalkan.`)) {
            router.delete(route('publisher.cerita.destroy', cerita.cerita_id));
        }
    };

    const hapusBab = (babId: number, judul: string) => {
        if (confirm(`Hapus bab "${judul}"?`)) {
            router.delete(route('publisher.bab.destroy', babId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    KELOLA CERITA
                </h2>
            }
        >
            <Head title={`Kelola - ${cerita.judul_cerita}`} />

            <div
                className="min-h-screen py-10"
                style={{
                    backgroundColor: '#ede3e6',
                    backgroundImage:
                        'linear-gradient(#ddc2cb 1px, transparent 1px), linear-gradient(90deg, #ddc2cb 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <div className="mx-auto max-w-4xl px-4">
                    {cerita.status === 'rejected' && cerita.catatan_admin && (
                        <div
                            className="mb-4 bg-white p-4 font-mono text-xs"
                            style={{ ...clipPanel, border: `1px solid ${ACCENT}`, color: ACCENT }}
                        >
                            <p className="font-semibold tracking-wider">// CERITA DITOLAK ADMIN</p>
                            <p className="mt-1 text-gray-600">{cerita.catatan_admin}</p>
                        </div>
                    )}

                    {/* Info cerita */}
                    <div
                        className="mb-6 flex flex-col gap-4 bg-white p-6 sm:flex-row"
                        style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                    >
                        <div className="h-40 w-28 shrink-0 overflow-hidden bg-[#faf7f8]" style={{ border: `1px solid ${BORDER}` }}>
                            {cerita.sampul ? (
                                <img src={`/storage/${cerita.sampul}`} alt={cerita.judul_cerita} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center font-mono text-[10px] text-gray-300">
                                    NO COVER
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <StatusBadge status={cerita.status} />
                                <span
                                    className="px-2 py-0.5 font-mono text-[10px] tracking-wider"
                                    style={{ backgroundColor: '#f3e6eb', color: ACCENT }}
                                >
                                    {cerita.status_progres === 'berlangsung' ? 'SEDANG BERLANGSUNG' : 'TAMAT'}
                                </span>
                            </div>

                            <p className="text-lg font-semibold text-gray-800">{cerita.judul_cerita}</p>
                            <p className="mt-1 font-mono text-[11px] tracking-wider text-gray-400">
                                {cerita.genre.toUpperCase()} · {RATING_LABEL[cerita.rating_usia].toUpperCase()} · {cerita.views} VIEWS
                            </p>

                            {tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {tags.map((t) => (
                                        <span key={t} className="bg-[#faf7f8] px-2 py-0.5 font-mono text-[10px] text-gray-500" style={{ border: `1px solid ${BORDER}` }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className="mt-3 line-clamp-2 text-sm text-gray-600">{cerita.sinopsis}</p>

                            <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs">
                                <Link href={route('publisher.cerita.edit', cerita.cerita_id)} className="hover:underline" style={{ color: ACCENT }}>
                                    EDIT INFO
                                </Link>
                                {cerita.status === 'published' && (
                                    <button onClick={toggleProgres} className="text-gray-500 hover:underline">
                                        {cerita.status_progres === 'berlangsung' ? 'TANDAI TAMAT' : 'TANDAI BERLANGSUNG LAGI'}
                                    </button>
                                )}
                                <button onClick={hapusCerita} className="text-gray-500 hover:underline">
                                    HAPUS CERITA
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Daftar bab */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="font-mono text-xs tracking-wider text-gray-500">
                            <span style={{ color: ACCENT }}>// </span>
                            DAFTAR BAB ({bab.length})
                        </p>
                        <Link
                            href={route('publisher.bab.create', cerita.cerita_id)}
                            className="px-4 py-2 font-mono text-xs tracking-wider text-white transition hover:opacity-90"
                            style={{ backgroundColor: ACCENT }}
                        >
                            TULIS BAB BARU
                        </Link>
                    </div>

                    {bab.length === 0 ? (
                        <div
                            className="bg-white p-10 text-center font-mono text-xs text-gray-400"
                            style={{ ...clipPanel, border: `1px solid ${BORDER}` }}
                        >
                            BELUM ADA BAB. MULAI TULIS BAB PERTAMA.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {bab.map((item) => (
                                <div
                                    key={item.bab_id}
                                    className="flex flex-col gap-2 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                                    style={{ ...clipPanel, border: `1px solid ${BORDER}` }}
                                >
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className="font-mono text-xs text-gray-400">BAB {item.nomor_bab}</span>
                                            <StatusBadge status={item.status} />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800">{item.judul_bab}</p>
                                        <p className="mt-0.5 font-mono text-[10px] tracking-wider text-gray-400">
                                            {item.views} VIEWS
                                        </p>
                                        {item.status === 'rejected' && item.catatan_admin && (
                                            <p className="mt-1 text-xs" style={{ color: ACCENT }}>
                                                Catatan: {item.catatan_admin}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 gap-3 font-mono text-xs">
                                        <Link href={route('publisher.bab.edit', item.bab_id)} className="hover:underline" style={{ color: ACCENT }}>
                                            EDIT
                                        </Link>
                                        <button onClick={() => hapusBab(item.bab_id, item.judul_bab)} className="text-gray-500 hover:underline">
                                            HAPUS
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}