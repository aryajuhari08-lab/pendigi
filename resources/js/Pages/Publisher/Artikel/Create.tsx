import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface KategoriOption {
    kategori_id: number;
    nama_kategori: string;
    children?: { kategori_id: number; nama_kategori: string }[];
}

// Panel bersudut terpotong ala Rhodes Island terminal - konsisten dengan Home.tsx
const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-1 block font-mono text-[11px] tracking-wider text-gray-500">
            // {children}
        </label>
    );
}

export default function Create({ kategori }: { kategori: KategoriOption[] }) {
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, post, transform, processing, errors } = useForm<{
        judul_artikel: string;
        kategori_id: string;
        isi_artikel: string;
        sumber: string;
        genre: string;
        gambar: File | null;
        aksi: 'draft' | 'submit';
    }>({
        judul_artikel: '',
        kategori_id: '',
        isi_artikel: '',
        sumber: '',
        genre: '',
        gambar: null,
        aksi: 'draft',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('gambar', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    let namaKategoriTerpilih: string | undefined;
    let namaIndukTerpilih: string | undefined;
    for (const k of kategori) {
        if (String(k.kategori_id) === data.kategori_id) {
            namaKategoriTerpilih = k.nama_kategori;
            break;
        }
        const sub = k.children?.find((c) => String(c.kategori_id) === data.kategori_id);
        if (sub) {
            namaKategoriTerpilih = sub.nama_kategori;
            namaIndukTerpilih = k.nama_kategori;
            break;
        }
    }
    const isFiksi = namaKategoriTerpilih === 'Fiksi' || namaIndukTerpilih === 'Fiksi';
    const isNonFiksi = namaKategoriTerpilih === 'Non Fiksi' || namaIndukTerpilih === 'Non Fiksi';
    const labelSumber = isNonFiksi ? 'Judul Buku / Sumber Referensi' : 'Sumber';

    const submit = (e: FormEvent, aksi: 'draft' | 'submit') => {
        e.preventDefault();
        transform((currentData) => ({ ...currentData, aksi }));
        post(route('publisher.artikel.store'), {
            forceFormData: true,
        });
    };

    // Hitung panjang teks tanpa tag HTML, buat validasi minimal karakter di sisi tampilan
    const panjangTeks = data.isi_artikel.replace(/<[^>]*>/g, '').trim().length;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    TULIS ARTIKEL BARU
                </h2>
            }
        >
            <Head title="Tulis Artikel" />

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
                    <form className="flex flex-col gap-6 bg-white p-6" style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}>
                        <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: '#f0dee5' }}>
                            <span
                                className="px-2 py-0.5 font-mono text-[10px] tracking-wider text-white"
                                style={{ backgroundColor: ACCENT }}
                            >
                                DRAFT
                            </span>
                            <span className="font-mono text-[11px] tracking-wider text-gray-400">
                                artikel_baru.md
                            </span>
                        </div>

                        <div>
                            <FieldLabel>Judul Artikel</FieldLabel>
                            <input
                                type="text"
                                value={data.judul_artikel}
                                onChange={(e) => setData('judul_artikel', e.target.value)}
                                placeholder="Masukkan judul artikel..."
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            />
                            <InputError message={errors.judul_artikel} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div>
                            <FieldLabel>Kategori</FieldLabel>
                            <select
                                value={data.kategori_id}
                                onChange={(e) => setData('kategori_id', e.target.value)}
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            >
                                <option value="">-- Pilih kategori --</option>
                                {kategori.flatMap((k) => [
                                    <option key={k.kategori_id} value={k.kategori_id}>
                                        {k.nama_kategori}
                                    </option>,
                                    ...(k.children ?? []).map((sub) => (
                                        <option key={sub.kategori_id} value={sub.kategori_id}>
                                            &nbsp;&nbsp;↳ {sub.nama_kategori}
                                        </option>
                                    )),
                                ])}
                            </select>
                            <InputError message={errors.kategori_id} className="mt-1 font-mono text-[11px]" />
                        </div>

                        {isFiksi && (
                            <div>
                                <FieldLabel>Genre</FieldLabel>
                                <select
                                    value={data.genre}
                                    onChange={(e) => setData('genre', e.target.value)}
                                    className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none"
                                    style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                >
                                    <option value="">-- Pilih genre --</option>
                                    <option value="Horror">Horror</option>
                                    <option value="Romantis">Romantis</option>
                                    <option value="Fantasi">Fantasi</option>
                                    <option value="Komedi">Komedi</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                                <InputError message={errors.genre} className="mt-1 font-mono text-[11px]" />
                            </div>
                        )}

                        <div>
                            <FieldLabel>{labelSumber}</FieldLabel>
                            <input
                                type="text"
                                value={data.sumber}
                                onChange={(e) => setData('sumber', e.target.value)}
                                placeholder={isNonFiksi ? 'Contoh: buku "Sapiens" oleh Yuval Noah Harari' : 'Contoh: hasil wawancara, pengamatan langsung, dll'}
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            />
                            <InputError message={errors.sumber} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div>
                            <FieldLabel>Gambar Sampul (opsional, maks 2MB)</FieldLabel>
                            <div
                                className="flex items-center gap-4 bg-[#faf7f8] p-3"
                                style={{ ...clipPanelSm, border: `1px dashed ${BORDER}` }}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview gambar" className="h-20 w-32 object-cover" style={clipPanelSm} />
                                ) : (
                                    <div
                                        className="flex h-20 w-32 shrink-0 items-center justify-center font-mono text-[10px] text-gray-300"
                                        style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                                    >
                                        [ NO IMAGE ]
                                    </div>
                                )}
                                <input
                                    id="gambar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="font-mono text-xs text-gray-500 file:mr-3 file:border-0 file:bg-[#a8265c] file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:tracking-wider file:text-white"
                                />
                            </div>
                            <InputError message={errors.gambar} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div>
                            <FieldLabel>Isi Artikel</FieldLabel>
                            <div style={{ ...clipPanelSm, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={data.isi_artikel}
                                    onChange={(_event, editor) => {
                                        setData('isi_artikel', editor.getData());
                                    }}
                                    config={{
                                        placeholder: 'Tulis isi artikelmu di sini... (minimal 50 karakter)',
                                    }}
                                />
                            </div>
                            <p className="mt-1 font-mono text-[10px] tracking-wider text-gray-400">
                                {panjangTeks} KARAKTER
                            </p>
                            <InputError message={errors.isi_artikel} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4" style={{ borderColor: '#f0dee5' }}>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={(e) => submit(e, 'draft')}
                                className="px-4 py-2 font-mono text-xs tracking-wider transition hover:bg-[#faf7f8] disabled:opacity-40"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}`, color: ACCENT }}
                            >
                                SIMPAN SEBAGAI DRAFT
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={(e) => submit(e, 'submit')}
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