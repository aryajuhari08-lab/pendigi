import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

interface CeritaItem {
    cerita_id: number;
    judul_cerita: string;
    sinopsis: string;
    genre: string;
    rating_usia: 'semua_umur' | 'remaja' | 'dewasa';
    sampul: string | null;
    penulis?: { nama_lengkap: string };
}

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

const RATING_LABEL: Record<string, string> = {
    semua_umur: 'SEMUA UMUR',
    remaja: 'REMAJA',
    dewasa: 'DEWASA',
};

export default function Cerita({ cerita }: { cerita: CeritaItem[] }) {
    const handleApprove = (id: number, judul: string) => {
        if (confirm(`Publish cerita "${judul}"?`)) {
            router.put(route('admin.moderasi.cerita.approve', id));
        }
    };

    const handleReject = (id: number, judul: string) => {
        const catatan = prompt(`Alasan menolak cerita "${judul}" (opsional):`);
        if (catatan !== null) {
            router.put(route('admin.moderasi.cerita.reject', id), { catatan_admin: catatan });
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
                    <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">
                        <span style={{ color: ACCENT }}>// </span>
                        CERITA MENUNGGU PERSETUJUAN ({cerita.length})
                    </p>

                    {cerita.length === 0 && (
                        <div
                            className="bg-white p-10 text-center font-mono text-xs text-gray-400"
                            style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                        >
                            TIDAK ADA CERITA YANG MENUNGGU MODERASI SAAT INI
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {cerita.map((item) => (
                            <div
                                key={item.cerita_id}
                                className="flex gap-4 bg-white p-5"
                                style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                            >
                                <div className="h-24 w-16 shrink-0 overflow-hidden bg-[#faf7f8]" style={{ border: `1px solid ${BORDER}` }}>
                                    {item.sampul ? (
                                        <img src={`/storage/${item.sampul}`} alt={item.judul_cerita} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center font-mono text-[8px] text-gray-300">NO COVER</div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.judul_cerita}</p>
                                            <p className="mt-1 font-mono text-[11px] tracking-wider text-gray-400">
                                                OLEH {(item.penulis?.nama_lengkap ?? '-').toUpperCase()} · {item.genre.toUpperCase()} ·{' '}
                                                {RATING_LABEL[item.rating_usia]}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => handleApprove(item.cerita_id, item.judul_cerita)}
                                                className="px-3 py-1 font-mono text-[11px] tracking-wider transition hover:bg-[#eaf6ee]"
                                                style={{ ...clipPanelSm, border: '1px solid #1f7a3f', color: '#1f7a3f' }}
                                            >
                                                APPROVE
                                            </button>
                                            <button
                                                onClick={() => handleReject(item.cerita_id, item.judul_cerita)}
                                                className="px-3 py-1 font-mono text-[11px] tracking-wider transition hover:bg-[#fbeaef]"
                                                style={{ ...clipPanelSm, border: `1px solid ${ACCENT}`, color: ACCENT }}
                                            >
                                                REJECT
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-3 line-clamp-3 text-sm text-gray-600">{item.sinopsis}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}