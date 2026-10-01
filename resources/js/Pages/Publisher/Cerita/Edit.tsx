import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: '#e5e7eb', text: '#4b5563', label: 'DRAFT' },
    pending_review: { bg: '#fde8c8', text: '#92620a', label: 'PENDING REVIEW' },
    published: { bg: '#d7f0df', text: '#1f7a3f', label: 'PUBLISHED' },
    rejected: { bg: '#fbd5e4', text: '#a8265c', label: 'REJECTED' },
};

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

interface CeritaData {
    cerita_id: number;
    judul_cerita: string;
    sinopsis: string;
    genre: string;
    tag: string | null;
    sampul: string | null;
    rating_usia: 'semua_umur' | 'remaja' | 'dewasa';
    status: 'draft' | 'pending_review' | 'published' | 'rejected';
    catatan_admin: string | null;
}

export default function Edit({ cerita, genreOptions }: { cerita: CeritaData; genreOptions: string[] }) {
    const [preview, setPreview] = useState<string | null>(cerita.sampul ? `/storage/${cerita.sampul}` : null);
    const { data, setData, transform, post, processing, errors } = useForm<{
        judul_cerita: string;
        sinopsis: string;
        genre: string;
        tag: string;
        rating_usia: string;
        sampul: File | null;
        aksi: 'draft' | 'submit';
    }>({
        judul_cerita: cerita.judul_cerita,
        sinopsis: cerita.sinopsis,
        genre: cerita.genre,
        tag: cerita.tag ?? '',
        rating_usia: cerita.rating_usia,
        sampul: null,
        aksi: 'draft',
    });

    const handleSampulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('sampul', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = (aksi: 'draft' | 'submit') => {
        // Ada upload sampul: kirim sebagai POST + _method=put, aksi diisi lewat transform.
        transform((currentData) => ({ ...currentData, aksi, _method: 'put' }));
        post(route('publisher.cerita.update', cerita.cerita_id), { forceFormData: true });
    };

    const statusInfo = STATUS_STYLE[cerita.status] ?? STATUS_STYLE.draft;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    EDIT INFO CERITA
                </h2>
            }
        >
            <Head title={`Edit - ${cerita.judul_cerita}`} />

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
                        href={route('publisher.cerita.kelola', cerita.cerita_id)}
                        className="mb-4 inline-block font-mono text-xs text-gray-500 hover:underline"
                    >
                        KEMBALI KE KELOLA CERITA
                    </Link>

                    {cerita.status === 'rejected' && cerita.catatan_admin && (
                        <div
                            className="mb-4 bg-white p-4 font-mono text-xs"
                            style={{ ...clipPanel, border: `1px solid ${ACCENT}`, color: ACCENT }}
                        >
                            <p className="font-semibold tracking-wider">// CERITA DITOLAK ADMIN</p>
                            <p className="mt-1 text-gray-600">{cerita.catatan_admin}</p>
                        </div>
                    )}

                    <form
                        className="flex flex-col gap-6 bg-white p-6"
                        style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                    >
                        <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: '#f0dee5' }}>
                            <span
                                className="px-2 py-0.5 font-mono text-[10px] tracking-wider"
                                style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                            >
                                {statusInfo.label}
                            </span>
                            <span className="font-mono text-[11px] tracking-wider text-gray-400">
                                cerita_{cerita.cerita_id}.md
                            </span>
                        </div>

                        {cerita.status === 'published' && (
                            <div
                                className="bg-[#faf7f8] p-3 font-mono text-[11px] text-gray-500"
                                style={{ ...clipPanelSm, border: `1px dashed ${BORDER}` }}
                            >
                                Cerita ini sudah tayang. Kalau kamu simpan sebagai draft, cerita akan disembunyikan dari publik
                                sampai dikirim ulang dan disetujui admin lagi.
                            </div>
                        )}

                        <div>
                            <FieldLabel>Judul Cerita</FieldLabel>
                            <input
                                type="text"
                                value={data.judul_cerita}
                                onChange={(e) => setData('judul_cerita', e.target.value)}
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none"
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
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none"
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
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none"
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