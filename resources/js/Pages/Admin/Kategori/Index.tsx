import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface KategoriItem {
    kategori_id: number;
    nama_kategori: string;
    deskripsi: string | null;
    artikel_count: number;
}

// Panel bersudut terpotong ala Rhodes Island terminal - konsisten dengan Home.tsx
const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

export default function Index({ kategori }: { kategori: KategoriItem[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const { data, setData, post, put, reset, processing, errors } = useForm({
        nama_kategori: '',
        deskripsi: '',
    });

    const submitCreate = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.kategori.store'), {
            onSuccess: () => reset(),
        });
    };

    const startEdit = (item: KategoriItem) => {
        setEditingId(item.kategori_id);
        setData({ nama_kategori: item.nama_kategori, deskripsi: item.deskripsi ?? '' });
    };

    const submitEdit = (e: FormEvent, id: number) => {
        e.preventDefault();
        put(route('admin.kategori.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus kategori ini? Kategori yang masih punya artikel tidak bisa dihapus.')) {
            router.delete(route('admin.kategori.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    KELOLA KATEGORI
                </h2>
            }
        >
            <Head title="Kelola Kategori" />

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
                    <form
                        onSubmit={submitCreate}
                        className="mb-4 flex flex-col gap-3 bg-white p-4  sm:flex-row"
                        style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                    >
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="NAMA KATEGORI BARU"
                                value={data.nama_kategori}
                                onChange={(e) => setData('nama_kategori', e.target.value)}
                                className="w-full bg-[#faf7f8] px-3 py-2 font-mono text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            />
                            {errors.nama_kategori && (
                                <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>{errors.nama_kategori}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="DESKRIPSI (OPSIONAL)"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                className="w-full bg-[#faf7f8] px-3 py-2 font-mono text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 font-mono text-xs tracking-wider text-white transition hover:opacity-90 disabled:opacity-40"
                            style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                        >
                            TAMBAH
                        </button>
                    </form>

                    <div className="overflow-hidden bg-white" style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}>
                        <table className="min-w-full divide-y text-sm" style={{ borderColor: '#f0dee5' }}>
                            <thead className="text-left font-mono text-[11px] tracking-wider text-gray-400" style={{ backgroundColor: '#faf7f8' }}>
                                <tr>
                                    <th className="px-4 py-3">NAMA KATEGORI</th>
                                    <th className="px-4 py-3">DESKRIPSI</th>
                                    <th className="px-4 py-3">JML ARTIKEL</th>
                                    <th className="px-4 py-3">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: '#f0dee5' }}>
                                {kategori.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center font-mono text-xs text-gray-400">
                                            BELUM ADA KATEGORI.
                                        </td>
                                    </tr>
                                )}
                                {kategori.map((item) => (
                                    <tr key={item.kategori_id}>
                                        {editingId === item.kategori_id ? (
                                            <td colSpan={4} className="px-4 py-3">
                                                <form
                                                    onSubmit={(e) => submitEdit(e, item.kategori_id)}
                                                    className="flex flex-col gap-2 sm:flex-row"
                                                >
                                                    <input
                                                        type="text"
                                                        value={data.nama_kategori}
                                                        onChange={(e) => setData('nama_kategori', e.target.value)}
                                                        className="flex-1 bg-[#faf7f8] px-2 py-1 font-mono text-xs text-gray-700 focus:outline-none"
                                                        style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.deskripsi}
                                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                                        className="flex-1 bg-[#faf7f8] px-2 py-1 font-mono text-xs text-gray-700 focus:outline-none"
                                                        style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-1 font-mono text-[11px] tracking-wider text-white"
                                                        style={{ ...clipPanelSm, backgroundColor: '#1f7a3f' }}
                                                    >
                                                        SIMPAN
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingId(null)}
                                                        className="px-3 py-1 font-mono text-[11px] tracking-wider text-gray-500"
                                                        style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                                    >
                                                        BATAL
                                                    </button>
                                                </form>
                                            </td>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3 font-medium">{item.nama_kategori}</td>
                                                <td className="px-4 py-3 text-gray-500">{item.deskripsi ?? '-'}</td>
                                                <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.artikel_count}</td>
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="mr-3 hover:underline"
                                                        style={{ color: '#2563eb' }}
                                                    >
                                                        EDIT
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.kategori_id)}
                                                        className="hover:underline"
                                                        style={{ color: ACCENT }}
                                                    >
                                                        HAPUS
                                                    </button>
                                                </td>
                                            </>
                                        )}
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