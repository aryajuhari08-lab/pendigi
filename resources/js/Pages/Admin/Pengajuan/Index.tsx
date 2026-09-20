import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const accent = '#a8265c';
const accentBorder = '#e3c7d2';

interface PengajuanItem {
    pengajuan_id: number;
    portofolio_teks: string;
    portofolio_file: string | null;
    user?: { nama_lengkap: string; email: string };
}

function linkifyTeks(teks: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = teks.split(urlRegex);
    return parts.map((part, i) =>
        urlRegex.test(part) ? (
            <a
                key={i}
                href={part}
                target="_blank"
                rel="noreferrer"
                className="underline hover:opacity-80"
                style={{ color: accent }}
            >
                {part}
            </a>
        ) : (
            part
        ),
    );
}

export default function Index({ pengajuan }: { pengajuan: PengajuanItem[] }) {
    const handleApprove = (id: number, nama: string) => {
        if (confirm(`Setujui "${nama}" jadi Publisher?`)) {
            router.put(route('admin.pengajuan.approve', id));
        }
    };

    const handleReject = (id: number) => {
        const catatan = prompt('Alasan menolak (opsional):');
        if (catatan !== null) {
            router.put(route('admin.pengajuan.reject', id), { catatan_admin: catatan });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pengajuan Jadi Publisher
                </h2>
            }
        >
            <Head title="Pengajuan Publisher" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">
                        MENUNGGU PERSETUJUAN ({pengajuan.length})
                    </p>

                    {pengajuan.length === 0 && (
                        <div
                            className="bg-white p-8 text-center text-gray-400 shadow"
                            style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}
                        >
                            Tidak ada pengajuan yang menunggu saat ini.
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {pengajuan.map((item) => (
                            <div
                                key={item.pengajuan_id}
                                className="bg-white p-5 shadow"
                                style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.user?.nama_lengkap}</p>
                                        <p className="text-xs text-gray-400">{item.user?.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(item.pengajuan_id, item.user?.nama_lengkap ?? '')}
                                            className="rounded-md border border-green-600 px-3 py-1 text-sm text-green-600 hover:bg-green-50"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(item.pengajuan_id)}
                                            className="rounded-md border border-red-600 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-3 whitespace-pre-wrap text-sm text-gray-600">
                                    {linkifyTeks(item.portofolio_teks)}
                                </p>
                                {item.portofolio_file && (
                                    <a
                                        href={`/storage/${item.portofolio_file}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 inline-block text-xs hover:underline"
                                        style={{ color: accent }}
                                    >
                                        📎 Lihat file lampiran
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}