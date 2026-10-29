import Avatar from '@/Components/Avatar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface RiwayatItem {
    komentar_id: number;
    parent_id: number | null;
    komentar: string;
    status: 'approved' | 'rejected';
    create_at: string;
    direview_pada: string | null;
    penulis?: { nama_lengkap: string; foto_profil?: string | null };
    artikel?: { judul_artikel: string } | null;
    bab?: { nomor_bab: number; cerita?: { judul_cerita: string } } | null;
    peninjau?: { nama_lengkap: string } | null;
}

interface Paginasi<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';
const HIJAU = '#1f7a3f';

const FILTER: { nilai: string | null; label: string }[] = [
    { nilai: null, label: 'SEMUA' },
    { nilai: 'approved', label: 'DISETUJUI' },
    { nilai: 'rejected', label: 'DITOLAK' },
];

function formatWaktu(waktu: string) {
    return new Date(waktu).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function RiwayatKomentar({
    riwayat,
    filters,
}: {
    riwayat: Paginasi<RiwayatItem>;
    filters: { status: string | null };
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    RIWAYAT KOMENTAR
                </h2>
            }
        >
            <Head title="Riwayat Komentar" />

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
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="font-mono text-xs tracking-wider text-gray-500">
                            <span style={{ color: ACCENT }}>// </span>
                            KEPUTUSAN MODERASI ({riwayat.total})
                        </p>
                        <Link
                            href={route('admin.moderasi.komentar')}
                            className="font-mono text-[11px] tracking-wider hover:underline"
                            style={{ color: ACCENT }}
                        >
                            ← KEMBALI KE ANTREAN
                        </Link>
                    </div>

                    <div className="mb-4 flex gap-2">
                        {FILTER.map((f) => {
                            const aktif = (filters.status ?? null) === f.nilai;
                            return (
                                <Link
                                    key={f.label}
                                    href={route('admin.moderasi.komentar.riwayat', f.nilai ? { status: f.nilai } : {})}
                                    className="px-3 py-1 font-mono text-[11px] tracking-wider transition"
                                    style={{
                                        ...clipPanelSm,
                                        border: `1px solid ${BORDER}`,
                                        backgroundColor: aktif ? ACCENT : '#fff',
                                        color: aktif ? '#fff' : ACCENT,
                                    }}
                                >
                                    {f.label}
                                </Link>
                            );
                        })}
                    </div>

                    {riwayat.data.length === 0 && (
                        <div
                            className="bg-white p-10 text-center font-mono text-xs text-gray-400"
                            style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                        >
                            BELUM ADA KOMENTAR YANG DIPUTUSKAN
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {riwayat.data.map((item) => {
                            const disetujui = item.status === 'approved';
                            const target = item.bab
                                ? `${item.bab.cerita?.judul_cerita ?? '-'} · Bab ${item.bab.nomor_bab}`
                                : (item.artikel?.judul_artikel ?? '-');

                            return (
                                <div
                                    key={item.komentar_id}
                                    className="bg-white p-5"
                                    style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className="px-2 py-0.5 font-mono text-[10px] tracking-wider"
                                            style={{
                                                backgroundColor: disetujui ? '#eaf6ee' : '#fbeaef',
                                                color: disetujui ? HIJAU : ACCENT,
                                            }}
                                        >
                                            {disetujui ? 'DISETUJUI' : 'DITOLAK'}
                                        </span>
                                        {item.parent_id && (
                                            <span className="bg-gray-100 px-2 py-0.5 font-mono text-[10px] tracking-wider text-gray-500">
                                                BALASAN
                                            </span>
                                        )}
                                        <span className="bg-gray-100 px-2 py-0.5 font-mono text-[10px] tracking-wider text-gray-500">
                                            {item.bab ? 'FIKSI' : 'ARTIKEL'}
                                        </span>
                                    </div>

                                    <p className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-wider text-gray-400">
                                        <Avatar nama={item.penulis?.nama_lengkap ?? '?'} foto={item.penulis?.foto_profil} size={24} />
                                        <span>
                                            {(item.penulis?.nama_lengkap ?? '-').toUpperCase()} PADA{' '}
                                            <span style={{ color: ACCENT }}>{target}</span>
                                        </span>
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-800">{item.komentar}</p>

                                    <div
                                        className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 font-mono text-[10px] tracking-wider text-gray-400"
                                        style={{ borderColor: '#f0dee5' }}
                                    >
                                        <span>DIKIRIM {formatWaktu(item.create_at)}</span>
                                        {item.direview_pada ? (
                                            <span style={{ color: disetujui ? HIJAU : ACCENT }}>
                                                {disetujui ? 'DISETUJUI' : 'DITOLAK'} OLEH{' '}
                                                {(item.peninjau?.nama_lengkap ?? 'ADMIN (AKUN DIHAPUS)').toUpperCase()} ·{' '}
                                                {formatWaktu(item.direview_pada)}
                                            </span>
                                        ) : (
                                            <span>PENINJAU TIDAK TERCATAT</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {riwayat.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between font-mono text-[11px] tracking-wider">
                            {riwayat.prev_page_url ? (
                                <Link href={riwayat.prev_page_url} style={{ color: ACCENT }} className="hover:underline">
                                    ← SEBELUMNYA
                                </Link>
                            ) : (
                                <span />
                            )}
                            <span className="text-gray-500">
                                HAL {riwayat.current_page} / {riwayat.last_page}
                            </span>
                            {riwayat.next_page_url ? (
                                <Link href={riwayat.next_page_url} style={{ color: ACCENT }} className="hover:underline">
                                    BERIKUTNYA →
                                </Link>
                            ) : (
                                <span />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
