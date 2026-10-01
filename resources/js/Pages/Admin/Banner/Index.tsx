import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface BannerData {
    banner_id: number;
    judul: string;
    deskripsi: string | null;
    gambar: string;
    link_url: string | null;
    urutan: number;
    aktif: boolean;
}

const ACCENT = '#a8265c';
const BORDER = '#c9829d';
const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };

export default function Index({ banners }: { banners: BannerData[] }) {
    const [editingBanner, setEditingBanner] = useState<BannerData | null>(null);

    // Form Tambah
    const createForm = useForm({
        judul: '',
        deskripsi: '',
        gambar: null as File | null,
        link_url: '',
        urutan: 0,
        aktif: true,
    });

    // Form Edit
    const editForm = useForm({
        judul: '',
        deskripsi: '',
        gambar: null as File | null,
        link_url: '',
        urutan: 0,
        aktif: true,
    });

    // Handle Submit Tambah
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.banner.store'), {
            forceFormData: true,
            onSuccess: () => createForm.reset(),
        });
    };

    // Buka Modal Edit
    const openEditModal = (banner: BannerData) => {
        setEditingBanner(banner);
        editForm.setData({
            judul: banner.judul,
            deskripsi: banner.deskripsi ?? '',
            gambar: null,
            link_url: banner.link_url ?? '',
            urutan: banner.urutan,
            aktif: banner.aktif,
        });
    };

    // Handle Submit Edit (Spoofing POST dengan _method: PUT)
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBanner) return;

        router.post(
            route('admin.banner.update', editingBanner.banner_id),
            {
                _method: 'put',
                judul: editForm.data.judul,
                deskripsi: editForm.data.deskripsi,
                gambar: editForm.data.gambar,
                link_url: editForm.data.link_url,
                urutan: editForm.data.urutan,
                aktif: editForm.data.aktif ? 1 : 0,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => setEditingBanner(null),
            }
        );
    };

    // Handle Hapus
    const handleDelete = (bannerId: number) => {
        if (confirm('Apakah kamu yakin ingin menghapus banner ini?')) {
            router.delete(route('admin.banner.destroy', bannerId));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>MANAJEMEN BANNER</h2>}
        >
            <Head title="Manajemen Banner" />

            <div className="min-h-screen py-8" style={{ backgroundColor: '#ede3e6' }}>
                <div className="mx-auto max-w-7xl px-4 flex flex-col gap-8">
                    
                    {/* FORM TAMBAH BANNER */}
                    <div className="bg-white p-6" style={{ ...clipPanel, border: `1.5px solid ${BORDER}` }}>
                        <h3 className="font-mono text-sm font-bold tracking-wider mb-4" style={{ color: ACCENT }}>
                            // TAMBAH BANNER BARU
                        </h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-mono text-xs text-gray-600 mb-1">Judul Banner *</label>
                                <input
                                    type="text"
                                    value={createForm.data.judul}
                                    onChange={(e) => createForm.setData('judul', e.target.value)}
                                    className="w-full bg-[#faf7f8] px-3 py-2 text-sm border focus:outline-none"
                                    style={{ ...clipPanelSm, borderColor: BORDER }}
                                    required
                                />
                                <InputError message={createForm.errors.judul} className="mt-1" />
                            </div>

                            <div>
                                <label className="block font-mono text-xs text-gray-600 mb-1">Link URL (Opsional)</label>
                                <input
                                    type="url"
                                    value={createForm.data.link_url}
                                    onChange={(e) => createForm.setData('link_url', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-[#faf7f8] px-3 py-2 text-sm border focus:outline-none"
                                    style={{ ...clipPanelSm, borderColor: BORDER }}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-mono text-xs text-gray-600 mb-1">Deskripsi Banner (Opsional)</label>
                                <textarea
                                    rows={2}
                                    value={createForm.data.deskripsi}
                                    onChange={(e) => createForm.setData('deskripsi', e.target.value)}
                                    className="w-full bg-[#faf7f8] px-3 py-2 text-sm border focus:outline-none"
                                    style={{ ...clipPanelSm, borderColor: BORDER }}
                                />
                            </div>

                            <div>
                                <label className="block font-mono text-xs text-gray-600 mb-1">Gambar Banner *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => createForm.setData('gambar', e.target.files?.[0] ?? null)}
                                    className="w-full text-xs font-mono"
                                    required
                                />
                                <InputError message={createForm.errors.gambar} className="mt-1" />
                            </div>

                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="block font-mono text-xs text-gray-600 mb-1">Urutan</label>
                                    <input
                                        type="number"
                                        value={createForm.data.urutan}
                                        onChange={(e) => createForm.setData('urutan', parseInt(e.target.value) || 0)}
                                        className="w-24 bg-[#faf7f8] px-3 py-2 text-sm border focus:outline-none"
                                        style={{ ...clipPanelSm, borderColor: BORDER }}
                                    />
                                </div>
                                <label className="flex items-center gap-2 mt-5 font-mono text-xs text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={createForm.data.aktif}
                                        onChange={(e) => createForm.setData('aktif', e.target.checked)}
                                    />
                                    Aktifkan Banner
                                </label>
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-5 py-2 font-mono text-xs tracking-wider text-white"
                                    style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                                >
                                    SIMPAN BANNER
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* TABEL MANAJEMEN BANNER */}
                    <div className="bg-white p-6" style={{ ...clipPanel, border: `1.5px solid ${BORDER}` }}>
                        <h3 className="font-mono text-sm font-bold tracking-wider mb-4" style={{ color: ACCENT }}>
                            // DAFTAR BANNER
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono text-xs border-collapse">
                                <thead>
                                    <tr className="border-b" style={{ borderColor: BORDER }}>
                                        <th className="p-2">GAMBAR</th>
                                        <th className="p-2">JUDUL & DESKRIPSI</th>
                                        <th className="p-2">LINK</th>
                                        <th className="p-2">URUTAN</th>
                                        <th className="p-2">STATUS</th>
                                        <th className="p-2 text-right">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banners.map((b) => (
                                        <tr key={b.banner_id} className="border-b" style={{ borderColor: '#f0dee5' }}>
                                            <td className="p-2">
                                                <img src={`/storage/${b.gambar}`} alt={b.judul} className="h-12 w-20 object-cover" />
                                            </td>
                                            <td className="p-2">
                                                <div className="font-bold text-gray-800">{b.judul}</div>
                                                <div className="text-gray-500 text-[11px] line-clamp-1">{b.deskripsi || '-'}</div>
                                            </td>
                                            <td className="p-2 text-gray-500 max-w-xs truncate">{b.link_url || '-'}</td>
                                            <td className="p-2">{b.urutan}</td>
                                            <td className="p-2">
                                                <span className={`px-2 py-0.5 text-[10px] ${b.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {b.aktif ? 'AKTIF' : 'NON-AKTIF'}
                                                </span>
                                            </td>
                                            <td className="p-2 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(b)}
                                                        className="px-3 py-1 bg-amber-500 text-white text-[11px]"
                                                        style={clipPanelSm}
                                                    >
                                                        EDIT
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(b.banner_id)}
                                                        className="px-3 py-1 bg-red-600 text-white text-[11px]"
                                                        style={clipPanelSm}
                                                    >
                                                        HAPUS
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {banners.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-gray-400">Belum ada banner.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL EDIT BANNER */}
            <Modal show={!!editingBanner} onClose={() => setEditingBanner(null)} maxWidth="lg">
                <form onSubmit={handleUpdate} className="p-6 font-mono">
                    <h3 className="text-sm font-bold tracking-wider mb-4" style={{ color: ACCENT }}>
                        // EDIT BANNER #{editingBanner?.banner_id}
                    </h3>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Judul Banner *</label>
                            <input
                                type="text"
                                value={editForm.data.judul}
                                onChange={(e) => editForm.setData('judul', e.target.value)}
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm border focus:outline-none"
                                style={{ ...clipPanelSm, borderColor: BORDER }}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Deskripsi Banner</label>
                            <textarea
                                rows={2}
                                value={editForm.data.deskripsi}
                                onChange={(e) => editForm.setData('deskripsi', e.target.value)}
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm border focus:outline-none"
                                style={{ ...clipPanelSm, borderColor: BORDER }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Link URL</label>
                            <input
                                type="url"
                                value={editForm.data.link_url}
                                onChange={(e) => editForm.setData('link_url', e.target.value)}
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm border focus:outline-none"
                                style={{ ...clipPanelSm, borderColor: BORDER }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Ganti Gambar (Biarkan kosong jika tidak diubah)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('gambar', e.target.files?.[0] ?? null)}
                                className="w-full text-xs font-mono"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Urutan</label>
                                <input
                                    type="number"
                                    value={editForm.data.urutan}
                                    onChange={(e) => editForm.setData('urutan', parseInt(e.target.value) || 0)}
                                    className="w-24 bg-[#faf7f8] px-3 py-2 text-sm border focus:outline-none"
                                    style={{ ...clipPanelSm, borderColor: BORDER }}
                                />
                            </div>
                            <label className="flex items-center gap-2 mt-5 text-xs text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editForm.data.aktif}
                                    onChange={(e) => editForm.setData('aktif', e.target.checked)}
                                />
                                Aktifkan Banner
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEditingBanner(null)}
                            className="px-4 py-2 text-xs border text-gray-600"
                            style={clipPanelSm}
                        >
                            BATAL
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="px-4 py-2 text-xs text-white"
                            style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                        >
                            SIMPAN PERUBAHAN
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}