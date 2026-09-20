import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const accent = '#a8265c';
const accentBorder = '#e3c7d2';

interface BannerItem {
    banner_id: number;
    judul: string;
    gambar: string;
    link_url: string | null;
    aktif: boolean;
}

export default function Index({ banner }: { banner: BannerItem[] }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        judul: string;
        gambar: File | null;
        link_url: string;
    }>({
        judul: '',
        gambar: null,
        link_url: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.banner.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const toggleAktif = (id: number) => {
        router.put(route('admin.banner.toggle', id));
    };

    const hapus = (id: number) => {
        if (confirm('Hapus banner ini?')) {
            router.delete(route('admin.banner.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kelola Banner</h2>}
        >
            <Head title="Kelola Banner" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="mb-6 flex flex-col gap-4 bg-white p-5 shadow"
                        style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}
                    >
                        <p className="font-mono text-xs tracking-wider text-gray-500">TAMBAH BANNER BARU</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs text-gray-500">Judul</label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    className="w-full rounded-md border-gray-300 text-sm"
                                />
                                {errors.judul && <p className="mt-1 text-xs text-red-600">{errors.judul}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-500">Link Tujuan (opsional)</label>
                                <input
                                    type="text"
                                    value={data.link_url}
                                    onChange={(e) => setData('link_url', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-md border-gray-300 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-500">
                                Gambar Banner (disarankan rasio lebar, maks 3MB)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('gambar', e.target.files?.[0] ?? null)}
                                className="w-full text-sm"
                            />
                            {errors.gambar && <p className="mt-1 text-xs text-red-600">{errors.gambar}</p>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm text-white hover:opacity-90"
                                style={{ backgroundColor: accent }}
                            >
                                Tambah Banner
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col gap-3">
                        {banner.length === 0 && (
                            <p className="text-center text-sm text-gray-400">Belum ada banner.</p>
                        )}
                        {banner.map((item) => (
                            <div
                                key={item.banner_id}
                                className="flex items-center gap-4 bg-white p-3 shadow"
                                style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}
                            >
                                <img
                                    src={`/storage/${item.gambar}`}
                                    alt={item.judul}
                                    className="h-16 w-28 rounded object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{item.judul}</p>
                                    {item.link_url && (
                                        <p className="truncate text-xs text-gray-400">{item.link_url}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => toggleAktif(item.banner_id)}
                                    className="rounded px-3 py-1 text-xs"
                                    style={
                                        item.aktif
                                            ? { backgroundColor: '#eaf6ee', color: '#1f7a3f' }
                                            : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                                    }
                                >
                                    {item.aktif ? 'Aktif' : 'Nonaktif'}
                                </button>
                                <button
                                    onClick={() => hapus(item.banner_id)}
                                    className="text-xs text-red-600 hover:underline"
                                >
                                    Hapus
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}