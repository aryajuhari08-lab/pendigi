import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

interface KomentarItem {
    komentar_id: number;
    komentar: string;
    penulis?: { nama_lengkap: string };
    artikel?: { judul_artikel: string };
}

// Panel bersudut terpotong ala Rhodes Island terminal - konsisten dengan Home.tsx
const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

export default function Komentar({ komentar }: { komentar: KomentarItem[] }) {
    const handleApprove = (id: number) => {
        router.put(route('admin.moderasi.komentar.approve', id));
    };

    const handleReject = (id: number) => {
        if (confirm('Tolak dan sembunyikan komentar ini?')) {
            router.put(route('admin.moderasi.komentar.reject', id));
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
                    <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">
                        <span style={{ color: ACCENT }}>// </span>
                        KOMENTAR MENUNGGU PERSETUJUAN ({komentar.length})
                    </p>

                    {komentar.length === 0 && (
                        <div
                            className="bg-white p-10 text-center font-mono text-xs text-gray-400"
                            style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                        >
                            TIDAK ADA KOMENTAR YANG MENUNGGU MODERASI SAAT INI
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {komentar.map((item) => (
                            <div
                                key={item.komentar_id}
                                className="bg-white p-5"
                                style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-mono text-[11px] tracking-wider text-gray-400">
                                            {(item.penulis?.nama_lengkap ?? '-').toUpperCase()} PADA ARTIKEL{' '}
                                            <span style={{ color: ACCENT }}>
                                                {item.artikel?.judul_artikel ?? '-'}
                                            </span>
                                        </p>
                                        <p className="mt-2 text-sm text-gray-800">{item.komentar}</p>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
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
        </AuthenticatedLayout>
    );
}