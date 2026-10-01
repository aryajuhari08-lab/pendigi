import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface SubKategoriItem {
    kategori_id: number;
    nama_kategori: string;
    artikel_count: number;
}

interface KategoriItem {
    kategori_id: number;
    nama_kategori: string;
    deskripsi: string | null;
    artikel_count: number;
    children: SubKategoriItem[];
}

const ACCENT = '#a8265c';
const BORDER = '#c9829d';
const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };

export default function Index({ kategori }: { kategori: KategoriItem[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingSubId, setEditingSubId] = useState<number | null>(null);
    const [showSubForm, setShowSubForm] = useState<number | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        nama_kategori: '',
        deskripsi: '',
        parent_id: '' as string | number,
    });

    // Submit Kategori Utama Baru
    const submitCreate = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.kategori.store'), {
            onSuccess: () => {
                reset();
                setShowSubForm(null);
            },
        });
    };

    // Submit Sub-Kategori Baru (Menggunakan router.post langsung agar parent_id tidak 'lost state')
    const submitSub = (e: FormEvent, parentId: number) => {
        e.preventDefault();
        router.post(
            route('admin.kategori.store'),
            {
                nama_kategori: data.nama_kategori,
                deskripsi: '',
                parent_id: parentId,
            },
            {
                onSuccess: () => {
                    reset();
                    setShowSubForm(null);
                },
            }
        );
    };

    // Buka Mode Edit Kategori Utama
    const startEdit = (item: { kategori_id: number; nama_kategori: string; deskripsi?: string | null }) => {
        setEditingId(item.kategori_id);
        setEditingSubId(null);
        setData({ nama_kategori: item.nama_kategori, deskripsi: item.deskripsi ?? '', parent_id: '' });
    };

    // Buka Mode Edit Sub-Kategori
    const startEditSub = (sub: SubKategoriItem) => {
        setEditingSubId(sub.kategori_id);
        setEditingId(null);
        setData({ nama_kategori: sub.nama_kategori, deskripsi: '', parent_id: '' });
    };

    // Submit Edit
    const submitEdit = (e: FormEvent, id: number) => {
        e.preventDefault();
        put(route('admin.kategori.update', id), {
            onSuccess: () => {
                setEditingId(null);
                setEditingSubId(null);
                reset();
            },
        });
    };

    // Hapus Kategori / Sub-Kategori
    const handleDelete = (id: number) => {
        if (confirm('Hapus kategori ini beserta seluruh artikel terkait?')) {
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

            <div className="min-h-screen py-8" style={{ backgroundColor: '#ede3e6' }}>
                <div className="mx-auto max-w-4xl px-4">
                    
                    {/* FORM TAMBAH KATEGORI UTAMA */}
                    <form
                        onSubmit={submitCreate}
                        className="mb-6 bg-white p-5 shadow-sm"
                        style={{ ...clipPanel, border: `1.5px solid ${BORDER}` }}
                    >
                        <h3 className="mb-3 font-mono text-xs font-bold tracking-wider" style={{ color: ACCENT }}>
                            // TAMBAH KATEGORI UTAMA BARU
                        </h3>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Nama kategori utama"
                                    value={data.nama_kategori}
                                    onChange={(e) => setData('nama_kategori', e.target.value)}
                                    className="w-full bg-[#faf7f8] px-3 py-2 font-mono text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                                    style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                    required
                                />
                                <InputError message={errors.nama_kategori} className="mt-1 font-mono text-[11px]" />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Deskripsi (opsional)"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    className="w-full bg-[#faf7f8] px-3 py-2 font-mono text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                                    style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 font-mono text-xs tracking-wider text-white transition hover:opacity-90 disabled:opacity-40"
                                style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                            >
                                TAMBAH
                            </button>
                        </div>
                    </form>

                    {/* DAFTAR KATEGORI & SUB-KATEGORI */}
                    <div className="flex flex-col gap-4 font-mono">
                        {kategori.map((item) => (
                            <div
                                key={item.kategori_id}
                                className="bg-white shadow-sm"
                                style={{ ...clipPanel, border: `1px solid ${BORDER}` }}
                            >
                                {/* HEADER / KATEGORI UTAMA */}
                                {editingId === item.kategori_id ? (
                                    <form onSubmit={(e) => submitEdit(e, item.kategori_id)} className="flex gap-2 p-4 bg-[#faf7f8]">
                                        <input
                                            type="text"
                                            value={data.nama_kategori}
                                            onChange={(e) => setData('nama_kategori', e.target.value)}
                                            className="flex-1 px-3 py-1.5 text-xs border focus:outline-none"
                                            style={{ borderColor: BORDER }}
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={data.deskripsi}
                                            onChange={(e) => setData('deskripsi', e.target.value)}
                                            className="flex-1 px-3 py-1.5 text-xs border focus:outline-none"
                                            style={{ borderColor: BORDER }}
                                            placeholder="Deskripsi"
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-1 bg-green-600 text-white text-[11px]"
                                            style={clipPanelSm}
                                        >
                                            SIMPAN
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 text-[11px]"
                                            style={clipPanelSm}
                                        >
                                            BATAL
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#f0dee5' }}>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-gray-800">{item.nama_kategori}</span>
                                                <span className="px-2 py-0.5 text-[10px] bg-[#fbd5e4]" style={{ color: ACCENT }}>
                                                    {item.artikel_count} ARTIKEL
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">{item.deskripsi || '-'}</p>
                                        </div>
                                        <div className="flex gap-3 text-xs">
                                            <button
                                                onClick={() => {
                                                    reset();
                                                    setShowSubForm(showSubForm === item.kategori_id ? null : item.kategori_id);
                                                }}
                                                className="text-blue-600 hover:underline"
                                            >
                                                SUB-KATEGORI
                                            </button>
                                            <button
                                                onClick={() => startEdit(item)}
                                                className="text-amber-600 hover:underline"
                                            >
                                                EDIT
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.kategori_id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                HAPUS
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* FORM INPUT SUB-KATEGORI */}
                                {showSubForm === item.kategori_id && (
                                    <form onSubmit={(e) => submitSub(e, item.kategori_id)} className="flex gap-2 border-b bg-[#faf7f8] p-3">
                                        <input
                                            type="text"
                                            placeholder={`Nama sub-kategori baru di bawah ${item.nama_kategori}`}
                                            value={data.nama_kategori}
                                            onChange={(e) => setData('nama_kategori', e.target.value)}
                                            className="flex-1 bg-white px-3 py-1.5 text-xs border focus:outline-none"
                                            style={{ borderColor: BORDER }}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-1.5 text-xs text-white"
                                            style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                                        >
                                            TAMBAH SUB
                                        </button>
                                    </form>
                                )}

                                {/* DAFTAR SUB-KATEGORI */}
                                {item.children.length > 0 && (
                                    <div className="divide-y bg-[#fcfafb]">
                                        {item.children.map((sub) => (
                                            <div key={sub.kategori_id} className="p-2.5 pl-8">
                                                {editingSubId === sub.kategori_id ? (
                                                    <form onSubmit={(e) => submitEdit(e, sub.kategori_id)} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={data.nama_kategori}
                                                            onChange={(e) => setData('nama_kategori', e.target.value)}
                                                            className="flex-1 px-3 py-1 text-xs border focus:outline-none"
                                                            style={{ borderColor: BORDER }}
                                                            required
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="px-3 py-1 bg-green-600 text-white text-[10px]"
                                                            style={clipPanelSm}
                                                        >
                                                            SIMPAN
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingSubId(null)}
                                                            className="px-3 py-1 bg-gray-300 text-gray-700 text-[10px]"
                                                            style={clipPanelSm}
                                                        >
                                                            BATAL
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-700 font-medium">↳ {sub.nama_kategori}</span>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] text-gray-400">{sub.artikel_count} artikel</span>
                                                            <button
                                                                onClick={() => startEditSub(sub)}
                                                                className="text-amber-600 text-[11px] hover:underline"
                                                            >
                                                                EDIT
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(sub.kategori_id)}
                                                                className="text-red-600 text-[11px] hover:underline"
                                                            >
                                                                HAPUS
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {kategori.length === 0 && (
                            <div className="bg-white p-6 text-center text-xs text-gray-400" style={clipPanel}>
                                Belum ada kategori yang ditambahkan.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}