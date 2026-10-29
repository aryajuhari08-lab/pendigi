import { embedVideo } from '@/utils/embedVideo';
import Avatar from '@/Components/Avatar';
import DetailModerasi, { CatatanSebelumnya, formatTanggal, Info, stripHtml } from '@/Components/DetailModerasi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface BabItem {
    bab_id: number;
    nomor_bab: number;
    judul_bab: string;
    isi_bab: string;
    catatan_admin: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    cerita?: { judul_cerita: string; cerita_id: number; penulis?: { nama_lengkap: string; foto_profil?: string | null } };
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

export default function Bab({ bab }: { bab: BabItem[] }) {
    const [detail, setDetail] = useState<BabItem | null>(null);

    const approve = (item: BabItem) => {
        if (confirm(`Publish bab "${item.judul_bab}"?`)) {
            router.put(route('admin.moderasi.bab.approve', item.bab_id), {}, { onSuccess: () => setDetail(null) });
        }
    };

    const reject = (item: BabItem) => {
        const catatan = prompt(`Alasan menolak bab "${item.judul_bab}" (opsional):`);
        if (catatan !== null) {
            router.put(route('admin.moderasi.bab.reject', item.bab_id), { catatan_admin: catatan }, { onSuccess: () => setDetail(null) });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    MODERASI BAB
                </h2>
            }
        >
            <Head title="Moderasi Bab" />

            <div className="min-h-screen py-10" style={bgStyle}>
                <div className="mx-auto max-w-4xl px-4">
                    <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">
                        <span style={{ color: ACCENT }}>// </span>
                        BAB MENUNGGU PERSETUJUAN ({bab.length})
                    </p>

                    {bab.length === 0 && <Kosong teks="TIDAK ADA BAB YANG MENUNGGU MODERASI SAAT INI" />}

                    <div className="flex flex-col gap-4">
                        {bab.map((item) => (
                            <div key={item.bab_id} className="bg-white p-5" style={cardStyle}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="font-mono text-[11px] tracking-wider" style={{ color: ACCENT }}>
                                            {(item.cerita?.judul_cerita ?? '-').toUpperCase()} · BAB {item.nomor_bab}
                                        </p>
                                        <button onClick={() => setDetail(item)} className="mt-1 text-left font-semibold text-gray-800 hover:underline">
                                            {item.judul_bab}
                                        </button>
                                    </div>
                                    <Aksi onDetail={() => setDetail(item)} onApprove={() => approve(item)} onReject={() => reject(item)} />
                                </div>
                                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{stripHtml(item.isi_bab)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {detail && (
                <DetailModerasi
                    show
                    onClose={() => setDetail(null)}
                    jenis="bab"
                    judul={detail.judul_bab}
                    onApprove={() => approve(detail)}
                    onReject={() => reject(detail)}
                >
                    <div className="flex flex-col gap-4">
                        <CatatanSebelumnya catatan={detail.catatan_admin} />
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <Info label="CERITA">{detail.cerita?.judul_cerita ?? '-'}</Info>
                            <Info label="BAB KE">{detail.nomor_bab}</Info>
                            <Info label="PENULIS">
                                <span className="flex items-center gap-2">
                                    <Avatar nama={detail.cerita?.penulis?.nama_lengkap ?? '?'} foto={detail.cerita?.penulis?.foto_profil} size={22} />
                                    {detail.cerita?.penulis?.nama_lengkap ?? '-'}
                                </span>
                            </Info>
                            <Info label="TERAKHIR DIUBAH">{formatTanggal(detail.updated_at ?? detail.created_at)}</Info>
                            <Info label="PANJANG ISI">{stripHtml(detail.isi_bab).split(' ').filter(Boolean).length} kata</Info>
                        </div>
                        <div
                            className="prose-pendigi border-t pt-4 text-gray-700"
                            style={{ borderColor: '#f0dee5' }}
                            dangerouslySetInnerHTML={{ __html: embedVideo(detail.isi_bab) }}
                        />
                    </div>
                </DetailModerasi>
            )}
        </AuthenticatedLayout>
    );
}
