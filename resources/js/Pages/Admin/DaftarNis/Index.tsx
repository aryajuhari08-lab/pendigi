import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const accent = '#a8265c';
const accentBorder = '#e3c7d2';

interface DaftarNisItem {
    nis_id: number;
    nis: string;
    nama_siswa: string;
    user?: { nama_lengkap: string } | null;
}

export default function Index({ daftarNis }: { daftarNis: DaftarNisItem[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nis: '',
        nama_siswa: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.daftarNis.store'), {
            onSuccess: () => reset(),
        });
    };

    const hapus = (id: number) => {
        if (confirm('Hapus NIS ini dari daftar?')) {
            router.delete(route('admin.daftarNis.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kelola Daftar NIS</h2>}
        >
            <Head title="Kelola Daftar NIS" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <p className="mb-4 text-sm text-gray-500">
                        Tambahkan NIS dan nama siswa yang sah di sini sebelum mereka bisa Register. Saat register, sistem akan mencocokkan NIS + Nama yang diketik dengan data di bawah ini.
                    </p>

                    <form
                        onSubmit={submit}
                        className="mb-6 flex flex-col gap-3 bg-white p-5 shadow sm:flex-row sm:items-end"
                        style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}
                    >
                        <div className="flex-1">
                            <label className="mb-1 block text-xs text-gray-500">NIS</label>
                            <input
                                type="text"
                                value={data.nis}
                                onChange={(e) => setData('nis', e.target.value)}
                                className="w-full rounded-md border-gray-300 text-sm"
                            />
                            {errors.nis && <p className="mt-1 text-xs text-red-600">{errors.nis}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="mb-1 block text-xs text-gray-500">Nama Siswa</label>
                            <input
                                type="text"
                                value={data.nama_siswa}
                                onChange={(e) => setData('nama_siswa', e.target.value)}
                                className="w-full rounded-md border-gray-300 text-sm"
                            />
                            {errors.nama_siswa && <p className="mt-1 text-xs text-red-600">{errors.nama_siswa}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm text-white hover:opacity-90"
                            style={{ backgroundColor: accent }}
                        >
                            Tambah
                        </button>
                    </form>

                    <div className="overflow-hidden bg-white shadow" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                        <table className="min-w-full divide-y text-sm" style={{ borderColor: accentBorder }}>
                            <thead className="bg-[#faf7f8] text-left text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">NIS</th>
                                    <th className="px-4 py-3">Nama Siswa</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: accentBorder }}>
                                {daftarNis.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                                            Belum ada NIS terdaftar.
                                        </td>
                                    </tr>
                                )}
                                {daftarNis.map((item) => (
                                    <tr key={item.nis_id}>
                                        <td className="px-4 py-3 font-mono">{item.nis}</td>
                                        <td className="px-4 py-3">{item.nama_siswa}</td>
                                        <td className="px-4 py-3">
                                            {item.user ? (
                                                <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-700">
                                                    Sudah daftar
                                                </span>
                                            ) : (
                                                <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                                                    Belum dipakai
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {!item.user && (
                                                <button
                                                    onClick={() => hapus(item.nis_id)}
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            )}
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