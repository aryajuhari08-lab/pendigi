import Avatar from '@/Components/Avatar';
import DetailModerasi, { formatTanggal, Info } from '@/Components/DetailModerasi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface KomentarItem {
    komentar_id: number;
    parent_id: number | null;
    komentar: string;
    create_at: string;
    penulis?: { nama_lengkap: string; foto_profil?: string | null };
    artikel?: { artikel_id: number; judul_artikel: string } | null;
    bab?: { bab_id: number; cerita_id: number; nomor_bab: number; judul_bab: string; cerita?: { judul_cerita: string } } | null;
    induk?: { komentar: string; penulis?: { nama_lengkap: string } } | null;
}

// Panel bersudut terpotong ala Rhodes Island terminal - konsisten dengan Home.tsx
const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';
const cardStyle = { ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' };

const labelTarget = (item: KomentarItem) =>
    item.bab
        ? `${item.bab.cerita?.judul_cerita ?? '-'} · Bab ${item.bab.nomor_bab}`
        : (item.artikel?.judul_artikel ?? '-');

export default function Komentar({ komentar }: { komentar: KomentarItem[] }) {
    const [detail, setDetail] = useState<KomentarItem | null>(null);

    const handleApprove = (id: number) => {
        router.put(route('admin.moderasi.komentar.approve', id), {}, { onSuccess: () => setDetail(null) });
    };

    const handleReject = (id: number) => {
        if (confirm('Tolak dan sembunyikan komentar ini?')) {
            router.put(route('admin.moderasi.komentar.reject', id), {}, { onSuccess: () => setDetail(null) });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    MODERASI KOMENTAR
                </h2>
            }
        >
            <Head title="Moderasi Komentar" />

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
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="font-mono text-xs tracking-wider text-gray-500">
                            <span style={{ color: ACCENT }}>// </span>
                            KOMENTAR MENUNGGU PERSETUJUAN ({komentar.length})
                        </p>
                        <Link
                            href={route('admin.moderasi.komentar.riwayat')}
                            className="font-mono text-[11px] tracking-wider hover:underline"
                            style={{ color: ACCENT }}
                        >
                            LIHAT RIWAYAT →
                        </Link>
                    </div>

                    {komentar.length === 0 && (
                        <div className="bg-white p-10 text-center font-mono text-xs text-gray-400" style={cardStyle}>
                            TIDAK ADA KOMENTAR YANG MENUNGGU MODERASI SAAT INI
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {komentar.map((item) => (
                            <div key={item.komentar_id} className="bg-white p-5" style={cardStyle}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="font-mono text-[11px] tracking-wider text-gray-400">
                                            <Avatar
                                                nama={item.penulis?.nama_lengkap ?? '?'}
                                                foto={item.penulis?.foto_profil}
                                                size={24}
                                                className="mr-2 align-middle"
                                            />
                                            {(item.penulis?.nama_lengkap ?? '-').toUpperCase()}{' '}
                                            {item.bab ? 'PADA BAB' : 'PADA ARTIKEL'}{' '}
                                            <span style={{ color: ACCENT }}>{labelTarget(item)}</span>
                                            {item.parent_id && <span className="ml-2 bg-gray-100 px-1.5 py-0.5 text-[10px]">BALASAN</span>}
                                        </p>
                                        <button
                                            onClick={() => setDetail(item)}
                                            className="mt-2 line-clamp-3 text-left text-sm text-gray-800 hover:underline"
                                        >
                                            {item.komentar}
                                        </button>
                                    </div>
                                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                                        <button
                                            onClick={() => setDetail(item)}
                                            className="px-3 py-1 font-mono text-[11px] tracking-wider text-gray-600 transition hover:bg-gray-50"
                                            style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                        >
                                            DETAIL
                                        </button>
                                        <button
                                            onClick={() => handleApprove(item.komentar_id)}
                                            className="px-3 py-1 font-mono text-[11px] tracking-wider transition hover:bg-[#eaf6ee]"
                                            style={{ ...clipPanelSm, border: '1px solid #1f7a3f', color: '#1f7a3f' }}
                                        >
                                            APPROVE
                                        </button>
                                        <button
                                            onClick={() => handleReject(item.komentar_id)}
                                            className="px-3 py-1 font-mono text-[11px] tracking-wider transition hover:bg-[#fbeaef]"
                                            style={{ ...clipPanelSm, border: `1px solid ${ACCENT}`, color: ACCENT }}
                                        >
                                            REJECT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {detail && (
                <DetailModerasi
                    show
                    onClose={() => setDetail(null)}
                    jenis="komentar"
                    judul={`Komentar dari ${detail.penulis?.nama_lengkap ?? '-'}`}
                    onApprove={() => handleApprove(detail.komentar_id)}
                    onReject={() => handleReject(detail.komentar_id)}
                >
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Info label="PENGIRIM">
                                <span className="flex items-center gap-2">
                                    <Avatar nama={detail.penulis?.nama_lengkap ?? '?'} foto={detail.penulis?.foto_profil} size={22} />
                                    {detail.penulis?.nama_lengkap ?? '-'}
                                </span>
                            </Info>
                            <Info label="DIKIRIM">{formatTanggal(detail.create_at)}</Info>
                            <Info label={detail.bab ? 'PADA BAB' : 'PADA ARTIKEL'}>{labelTarget(detail)}</Info>
                            <Info label="HALAMAN">
                                <a
                                    href={
                                        detail.bab
                                            ? route('cerita.baca', [detail.bab.cerita_id, detail.bab.bab_id])
                                            : detail.artikel
                                              ? route('artikel.show', detail.artikel.artikel_id)
                                              : '#'
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline"
                                    style={{ color: ACCENT }}
                                >
                                    Buka di tab baru ↗
                                </a>
                            </Info>
                        </div>

                        {detail.induk && (
                            <div className="bg-[#faf7f8] p-3 text-sm" style={{ ...clipPanelSm, border: `1px dashed ${BORDER}` }}>
                                <p className="font-mono text-[10px] tracking-wider text-gray-400">
                                    MEMBALAS KOMENTAR {(detail.induk.penulis?.nama_lengkap ?? '-').toUpperCase()}
                                </p>
                                <p className="mt-1 whitespace-pre-wrap text-gray-600">{detail.induk.komentar}</p>
                            </div>
                        )}

                        <div className="border-t pt-4" style={{ borderColor: '#f0dee5' }}>
                            <Info label="ISI KOMENTAR LENGKAP">
                                <p className="whitespace-pre-wrap text-base text-gray-800">{detail.komentar}</p>
                            </Info>
                        </div>
                    </div>
                </DetailModerasi>
            )}
        </AuthenticatedLayout>
    );
}
