import { embedVideo } from '@/utils/embedVideo';
import Avatar from '@/Components/Avatar';
import DetailModerasi, { CatatanSebelumnya, formatTanggal, Info, stripHtml } from '@/Components/DetailModerasi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface ArtikelItem {
    artikel_id: number;
    judul_artikel: string;
    isi_artikel: string;
    gambar: string | null;
    sumber: string | null;
    genre: string | null;
    catatan_admin: string | null;
    created_at?: string | null;
    penulis?: { nama_lengkap: string; foto_profil?: string | null };
    kategori?: { nama_kategori: string };
}

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';
const cardStyle = { ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' };
const bgStyle = {
    backgroundColor: '#ede3e6',
    backgroundImage: 'linear-gradient(#ddc2cb 1px, transparent 1px), linear-gradient(90deg, #ddc2cb 1px, transparent 1px)',
    backgroundSize: '24px 24px',
};

function Aksi({ onDetail, onApprove, onReject }: { onDetail: () => void; onApprove: () => void; onReject: () => void }) {
    return (
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <button
                onClick={onDetail}
                className="px-3 py-1 font-mono text-[11px] tracking-wider text-gray-600 transition hover:bg-gray-50"
                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
            >
                DETAIL
            </button>
            <button
                onClick={onApprove}
                className="px-3 py-1 font-mono text-[11px] tracking-wider transition hover:bg-[#eaf6ee]"
                style={{ ...clipPanelSm, border: '1px solid #1f7a3f', color: '#1f7a3f' }}
            >
                APPROVE
            </button>
            <button
                onClick={onReject}
                className="px-3 py-1 font-mono text-[11px] tracking-wider transition hover:bg-[#fbeaef]"
                style={{ ...clipPanelSm, border: `1px solid ${ACCENT}`, color: ACCENT }}
            >
                REJECT
            </button>
        </div>
    );
}

function Kosong({ teks }: { teks: string }) {
    return (
        <div className="bg-white p-10 text-center font-mono text-xs text-gray-400" style={cardStyle}>
            {teks}
        </div>
    );
}

export default function Artikel({ artikel }: { artikel: ArtikelItem[] }) {
    const [detail, setDetail] = useState<ArtikelItem | null>(null);

    const approve = (item: ArtikelItem) => {
        if (confirm(`Publish artikel "${item.judul_artikel}"?`)) {
            router.put(route('admin.moderasi.artikel.approve', item.artikel_id), {}, { onSuccess: () => setDetail(null) });
        }
    };

    const reject = (item: ArtikelItem) => {
        const catatan = prompt(`Alasan menolak artikel "${item.judul_artikel}" (opsional):`);
        if (catatan !== null) {
            router.put(route('admin.moderasi.artikel.reject', item.artikel_id), { catatan_admin: catatan }, { onSuccess: () => setDetail(null) });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    MODERASI ARTIKEL
                </h2>
            }
        >
            <Head title="Moderasi Artikel" />

            <div className="min-h-screen py-10" style={bgStyle}>
                <div className="mx-auto max-w-4xl px-4">
                    <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">
                        <span style={{ color: ACCENT }}>// </span>
                        ARTIKEL MENUNGGU PERSETUJUAN ({artikel.length})
                    </p>

                    {artikel.length === 0 && <Kosong teks="TIDAK ADA ARTIKEL YANG MENUNGGU MODERASI SAAT INI" />}

                    <div className="flex flex-col gap-4">
                        {artikel.map((item) => (
                            <div key={item.artikel_id} className="bg-white p-5" style={cardStyle}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <button onClick={() => setDetail(item)} className="text-left font-semibold text-gray-800 hover:underline">
                                            {item.judul_artikel}
                                        </button>
                                        <p className="mt-1 font-mono text-[11px] tracking-wider text-gray-400">
                                            OLEH {(item.penulis?.nama_lengkap ?? '-').toUpperCase()} ·{' '}
                                            {(item.kategori?.nama_kategori ?? '-').toUpperCase()}
                                        </p>
                                    </div>
                                    <Aksi onDetail={() => setDetail(item)} onApprove={() => approve(item)} onReject={() => reject(item)} />
                                </div>
                                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{stripHtml(item.isi_artikel)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {detail && (
                <DetailModerasi
                    show
                    onClose={() => setDetail(null)}
                    jenis="artikel"
                    judul={detail.judul_artikel}
                    onApprove={() => approve(detail)}
                    onReject={() => reject(detail)}
                >
                    <div className="flex flex-col gap-4">
                        <CatatanSebelumnya catatan={detail.catatan_admin} />
                        {detail.gambar && (
                            <img src={`/storage/${detail.gambar}`} alt={detail.judul_artikel} className="max-h-60 w-full object-cover" />
                        )}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <Info label="PENULIS">
                                <span className="flex items-center gap-2">
                                    <Avatar nama={detail.penulis?.nama_lengkap ?? '?'} foto={detail.penulis?.foto_profil} size={22} />
                                    {detail.penulis?.nama_lengkap ?? '-'}
                                </span>
                            </Info>
                            <Info label="KATEGORI">{detail.kategori?.nama_kategori ?? '-'}</Info>
                            <Info label="GENRE">{detail.genre || '-'}</Info>
                            <Info label="SUMBER">{detail.sumber || '-'}</Info>
                            <Info label="DIKIRIM">{formatTanggal(detail.created_at)}</Info>
                        </div>
                        <div
                            className="prose-pendigi border-t pt-4 text-gray-700"
                            style={{ borderColor: '#f0dee5' }}
                            dangerouslySetInnerHTML={{ __html: embedVideo(detail.isi_artikel) }}
                        />
                    </div>
                </DetailModerasi>
            )}
        </AuthenticatedLayout>
    );
}
