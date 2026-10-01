import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

const RATING_USIA_OPTIONS = [
    { value: 'semua_umur', label: 'Semua Umur' },
    { value: 'remaja', label: 'Remaja' },
    { value: 'dewasa', label: 'Dewasa' },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-1 block font-mono text-[11px] tracking-wider text-gray-500">
            // {children}
        </label>
    );
}

export default function Create({ genreOptions }: { genreOptions: string[] }) {
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, post, processing, errors } = useForm<{
        judul_cerita: string;
        sinopsis: string;
        genre: string;
        tag: string;
        rating_usia: string;
        sampul: File | null;
        aksi: 'draft' | 'submit';
    }>({
        judul_cerita: '',
        sinopsis: '',
        genre: genreOptions[0] ?? '',
        tag: '',
        rating_usia: 'semua_umur',
        sampul: null,
        aksi: 'draft',
    });

    const handleSampulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('sampul', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = (aksi: 'draft' | 'submit') => {
        setData('aksi', aksi);
        post(route('publisher.cerita.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    TULIS CERITA BARU
                </h2>
            }
        >
            <Head title="Tulis Cerita Baru" />

            <div
                className="min-h-screen py-10"
                style={{
                    backgroundColor: '#ede3e6',
                    backgroundImage:
                        'linear-gradient(#ddc2cb 1px, transparent 1px), linear-gradient(90deg, #ddc2cb 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <div className="mx-auto max-w-3xl px-4">
                    <Link
                        href={route('dashboard')}
                        className="mb-4 inline-block font-mono text-xs text-gray-500 hover:underline"
                    >
                        KEMBALI KE DASHBOARD
                    </Link>

                    <form
                        className="flex flex-col gap-6 bg-white p-6"
                        style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                    >
                        <div>
                            <FieldLabel>Judul Cerita</FieldLabel>
                            <input
                                type="text"
                                value={data.judul_cerita}
                                onChange={(e) => setData('judul_cerita', e.target.value)}
                                placeholder="Judul cerita..."
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            />
                            <InputError message={errors.judul_cerita} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div>
                            <FieldLabel>Sinopsis</FieldLabel>
                            <textarea
                                value={data.sinopsis}
                                onChange={(e) => setData('sinopsis', e.target.value)}
                                rows={5}
                                placeholder="Ceritakan garis besar ceritamu..."
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            />
                            <p className="mt-1 font-mono text-[10px] tracking-wider text-gray-400">
                                {data.sinopsis.length} / 2000 KARAKTER
                            </p>
                            <InputError message={errors.sinopsis} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <FieldLabel>Genre</FieldLabel>
                                <select
                                    value={data.genre}
                                    onChange={(e) => setData('genre', e.target.value)}
                                    className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none"
                                    style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                >
                                    {genreOptions.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.genre} className="mt-1 font-mono text-[11px]" />
                            </div>

                            <div>
                                <FieldLabel>Rating Usia</FieldLabel>
                                <select
                                    value={data.rating_usia}
                                    onChange={(e) => setData('rating_usia', e.target.value)}
                                    className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none"
                                    style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                >
                                    {RATING_USIA_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.rating_usia} className="mt-1 font-mono text-[11px]" />
                            </div>
                        </div>

                        <div>
                            <FieldLabel>Tag (opsional, pisahkan dengan koma)</FieldLabel>
                            <input
                                type="text"
                                value={data.tag}
                                onChange={(e) => setData('tag', e.target.value)}
                                placeholder="mis: teen_drama, friendship"
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            />
                            <InputError message={errors.tag} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div>
                            <FieldLabel>Sampul (opsional, maks 2MB)</FieldLabel>
                            <div
                                className="flex items-center gap-4 bg-[#faf7f8] p-3"
                                style={{ ...clipPanelSm, border: `1px dashed ${BORDER}` }}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview sampul" className="h-28 w-20 object-cover" style={clipPanelSm} />
                                ) : (
                                    <div
                                        className="flex h-28 w-20 shrink-0 items-center justify-center font-mono text-[10px] text-gray-300"
                                        style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                    >
                                        [ NO IMAGE ]
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSampulChange}
                                    className="font-mono text-xs text-gray-500 file:mr-3 file:border-0 file:bg-[#a8265c] file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:tracking-wider file:text-white"
                                />
                            </div>
                            <InputError message={errors.sampul} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4" style={{ borderColor: '#f0dee5' }}>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => submit('draft')}
                                className="px-4 py-2 font-mono text-xs tracking-wider transition hover:bg-[#faf7f8] disabled:opacity-40"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}`, color: ACCENT }}
                            >
                                SIMPAN SEBAGAI DRAFT
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => submit('submit')}
                                className="px-4 py-2 font-mono text-xs tracking-wider text-white transition hover:opacity-90 disabled:opacity-40"
                                style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                            >
                                KIRIM UNTUK DITINJAU
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}