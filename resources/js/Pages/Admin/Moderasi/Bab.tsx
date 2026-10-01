import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

interface BabItem {
    bab_id: number;
    nomor_bab: number;
    judul_bab: string;
    isi_bab: string;
    cerita?: { judul_cerita: string; cerita_id: number };
}

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

export default function Bab({ bab }: { bab: BabItem[] }) {
    const handleApprove = (id: number, judul: string) => {
        if (confirm(`Publish bab "${judul}"?`)) {
            router.put(route('admin.moderasi.bab.approve', id));
        }
    };

    const handleReject = (id: number, judul: string) => {
        const catatan = prompt(`Alasan menolak bab "${judul}" (opsional):`);
        if (catatan !== null) {
            router.put(route('admin.moderasi.bab.reject', id), { catatan_admin: catatan });
        }
    };

    // isi_bab dari CKEditor berupa HTML, cukup ditampilkan cuplikan teksnya saja tanpa tag
    const cuplikan = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    MODERASI BAB
                </h2>
            }
        >
            <Head title="Moderasi Bab" />

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
                        BAB MENUNGGU PERSETUJUAN ({bab.length})
                    </p>

                    {bab.length === 0 && (
                        <div
                            className="bg-white p-10 text-center font-mono text-xs text-gray-400"
                            style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                        >
                            TIDAK ADA BAB YANG MENUNGGU MODERASI SAAT INI
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {bab.map((item) => (
                            <div
                                key={item.bab_id}
                                className="bg-white p-5"
                                style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-mono text-[11px] tracking-wider" style={{ color: ACCENT }}>
                                            {(item.cerita?.judul_cerita ?? '-').toUpperCase()} · BAB {item.nomor_bab}
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-800">{item.judul_bab}</p>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => handleApprove(item.bab_id, item.judul_bab)}
                                            className="px-3 py-1 font-mono text-[11px] tracking-wider transition hover:bg-[#eaf6ee]"
                                            style={{ ...clipPanelSm, border: '1px solid #1f7a3f', color: '#1f7a3f' }}
                                        >
                                            APPROVE
                                        </button>
                                        <button
                                            onClick={() => handleReject(item.bab_id, item.judul_bab)}
                                            className="px-3 py-1 font-mono text-[11px] tracking-wider transition hover:bg-[#fbeaef]"
                                            style={{ ...clipPanelSm, border: `1px solid ${ACCENT}`, color: ACCENT }}
                                        >
                                            REJECT
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{cuplikan(item.isi_bab)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}