import Avatar from '@/Components/Avatar';
import DetailModerasi, { CatatanSebelumnya, formatTanggal, Info, stripHtml } from '@/Components/DetailModerasi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface CeritaItem {
    cerita_id: number;
    judul_cerita: string;
    sinopsis: string;
    genre: string;
    tag: string | null;
    rating_usia: 'semua_umur' | 'remaja' | 'dewasa';
    status_progres: string | null;
    sampul: string | null;
    catatan_admin: string | null;
    jumlah_bab?: number;
    created_at?: string | null;
    penulis?: { nama_lengkap: string; foto_profil?: string | null };
}

const RATING_LABEL: Record<string, string> = {
    semua_umur: 'SEMUA UMUR',
    remaja: 'REMAJA',
    dewasa: 'DEWASA',
};

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

export default function Cerita({ cerita }: { cerita: CeritaItem[] }) {
    const [detail, setDetail] = useState<CeritaItem | null>(null);

    const approve = (item: CeritaItem) => {
        if (confirm(`Publish cerita "${item.judul_cerita}"?`)) {
            router.put(route('admin.moderasi.cerita.approve', item.cerita_id), {}, { onSuccess: () => setDetail(null) });
        }
    };

    const reject = (item: CeritaItem) => {
        const catatan = prompt(`Alasan menolak cerita "${item.judul_cerita}" (opsional):`);
        if (catatan !== null) {
            router.put(route('admin.moderasi.cerita.reject', item.cerita_id), { catatan_admin: catatan }, { onSuccess: () => setDetail(null) });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    MODERASI CERITA
                </h2>
            }
        >
            <Head title="Moderasi Cerita" />

            <div className="min-h-screen py-10" style={bgStyle}>
                <div className="mx-auto max-w-4xl px-4">
                    <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">
                        <span style={{ color: ACCENT }}>// </span>
                        CERITA MENUNGGU PERSETUJUAN ({cerita.length})
                    </p>

                    {cerita.length === 0 && <Kosong teks="TIDAK ADA CERITA YANG MENUNGGU MODERASI SAAT INI" />}

                    <div className="flex flex-col gap-4">
                        {cerita.map((item) => (
                            <div key={item.cerita_id} className="flex gap-4 bg-white p-5" style={cardStyle}>
                                <div className="h-24 w-16 shrink-0 overflow-hidden bg-[#faf7f8]" style={{ border: `1px solid ${BORDER}` }}>
                                    {item.sampul ? (
                                        <img src={`/storage/${item.sampul}`} alt={item.judul_cerita} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center font-mono text-[8px] text-gray-300">NO COVER</div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <button onClick={() => setDetail(item)} className="text-left font-semibold text-gray-800 hover:underline">
                                                {item.judul_cerita}
                                            </button>
                                            <p className="mt-1 font-mono text-[11px] tracking-wider text-gray-400">
                                                OLEH {(item.penulis?.nama_lengkap ?? '-').toUpperCase()} · {item.genre.toUpperCase()} ·{' '}
                                                {RATING_LABEL[item.rating_usia]}
                                            </p>
                                        </div>
                                        <Aksi onDetail={() => setDetail(item)} onApprove={() => approve(item)} onReject={() => reject(item)} />
                                    </div>
                                    <p className="mt-3 line-clamp-3 text-sm text-gray-600">{item.sinopsis}</p>
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
                    jenis="cerita"
                    judul={detail.judul_cerita}
                    onApprove={() => approve(detail)}
                    onReject={() => reject(detail)}
                >
                    <div className="flex flex-col gap-4">
                        <CatatanSebelumnya catatan={detail.catatan_admin} />
                        <div className="flex gap-4">
                            <div className="h-40 w-28 shrink-0 overflow-hidden bg-[#faf7f8]" style={{ border: `1px solid ${BORDER}` }}>
                                {detail.sampul ? (
                                    <img src={`/storage/${detail.sampul}`} alt={detail.judul_cerita} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center font-mono text-[9px] text-gray-300">NO COVER</div>
                                )}
                            </div>
                            <div className="grid flex-1 grid-cols-2 content-start gap-4">
                                <Info label="PENULIS">
                                    <span className="flex items-center gap-2">
                                        <Avatar nama={detail.penulis?.nama_lengkap ?? '?'} foto={detail.penulis?.foto_profil} size={22} />
                                        {detail.penulis?.nama_lengkap ?? '-'}
                                    </span>
                                </Info>
                                <Info label="GENRE">{detail.genre}</Info>
                                <Info label="RATING USIA">{RATING_LABEL[detail.rating_usia] ?? detail.rating_usia}</Info>
                                <Info label="PROGRES">{detail.status_progres ?? '-'}</Info>
                                <Info label="JUMLAH BAB">{detail.jumlah_bab ?? 0}</Info>
                                <Info label="DIKIRIM">{formatTanggal(detail.created_at)}</Info>
                            </div>
                        </div>
                        {detail.tag && <Info label="TAG">{detail.tag}</Info>}
                        <div className="border-t pt-4" style={{ borderColor: '#f0dee5' }}>
                            <Info label="SINOPSIS LENGKAP">
                                <p className="whitespace-pre-wrap">{detail.sinopsis}</p>
                            </Info>
                        </div>
                    </div>
                </DetailModerasi>
            )}
        </AuthenticatedLayout>
    );
}
