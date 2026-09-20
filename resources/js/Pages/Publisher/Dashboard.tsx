import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const accent = '#a8265c';
const accentBorder = '#e3c7d2';

interface ArtikelItem {
    artikel_id: number;
    judul_artikel: string;
    status: string;
    views: number;
    kategori?: { nama_kategori: string };
}

export default function Dashboard({ artikel = [] }: { artikel?: ArtikelItem[] }) {
    const statusColor = (status: string) => {
        const styles: Record<string, string> = {
            published: '#1f7a3f',
            pending_review: '#a8760a',
            draft: '#6b7280',
            rejected: '#a8265c',
        };
        return styles[status] ?? '#6b7280';
    };

    const statusBg = (status: string) => {
        const styles: Record<string, string> = {
            published: '#eaf6ee',
            pending_review: '#fbf3e0',
            draft: '#f3f4f6',
            rejected: '#fbeaef',
        };
        return styles[status] ?? '#f3f4f6';
    };

    const bisaDiedit = (status: string) => status === 'draft' || status === 'rejected';

    const hapusArtikel = (id: number, judul: string) => {
        if (confirm(`Hapus artikel "${judul}"? Komentar, like, dan rating yang sudah ada juga ikut terhapus. Tindakan ini tidak bisa dibatalkan.`)) {
            router.delete(route('publisher.artikel.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: accent }}>
                    DASHBOARD PUBLISHER
                </h2>
            }
        >
            <Head title="Dashboard Publisher" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="font-mono text-xs tracking-wider text-gray-500">ARTIKEL SAYA</p>
                        <Link
                            href={route('publisher.artikel.create')}
                            className="px-4 py-2 font-mono text-xs tracking-wider text-white hover:opacity-90"
                            style={{ ...clipPanelSm, backgroundColor: accent }}
                        >
                            TULIS ARTIKEL
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                        <table className="min-w-full divide-y text-sm" style={{ borderColor: accentBorder }}>
                            <thead className="bg-[#faf7f8] text-left font-mono text-[10px] tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">JUDUL</th>
                                    <th className="px-4 py-3">KATEGORI</th>
                                    <th className="px-4 py-3">STATUS</th>
                                    <th className="px-4 py-3">VIEWS</th>
                                    <th className="px-4 py-3">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: accentBorder }}>
                                {artikel.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                                            Belum ada artikel. Mulai tulis artikel pertamamu.
                                        </td>
                                    </tr>
                                )}
                                {artikel.map((item) => (
                                    <tr key={item.artikel_id}>
                                        <td className="px-4 py-3">{item.judul_artikel}</td>
                                        <td className="px-4 py-3">{item.kategori?.nama_kategori ?? '-'}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="rounded px-2 py-1 font-mono text-[10px] tracking-wider"
                                                style={{ backgroundColor: statusBg(item.status), color: statusColor(item.status) }}
                                            >
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{item.views}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {bisaDiedit(item.status) && (
                                                    <Link
                                                        href={route('publisher.artikel.edit', item.artikel_id)}
                                                        className="font-mono text-xs hover:underline"
                                                        style={{ color: accent }}
                                                    >
                                                        EDIT
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => hapusArtikel(item.artikel_id, item.judul_artikel)}
                                                    className="font-mono text-xs text-gray-500 hover:underline hover:text-gray-700"
                                                >
                                                    HAPUS
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}