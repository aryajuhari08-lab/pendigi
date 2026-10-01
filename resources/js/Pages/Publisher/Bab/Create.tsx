import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

interface CeritaRingkas {
    cerita_id: number;
    judul_cerita: string;
}

export default function Create({ cerita, nomorBerikutnya }: { cerita: CeritaRingkas; nomorBerikutnya: number }) {
    const { data, setData, post, transform, processing, errors } = useForm<{
        judul_bab: string;
        isi_bab: string;
        aksi: 'draft' | 'submit';
    }>({
        judul_bab: '',
        isi_bab: '',
        aksi: 'draft',
    });

    const submit = (e: FormEvent, aksi: 'draft' | 'submit') => {
        e.preventDefault();
        transform((currentData) => ({ ...currentData, aksi }));
        post(route('publisher.bab.store', cerita.cerita_id));
    };

    const panjangTeks = data.isi_bab.replace(/<[^>]*>/g, '').trim().length;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    TULIS BAB BARU
                </h2>
            }
        >
            <Head title={`Tulis Bab - ${cerita.judul_cerita}`} />

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

                    <form
                        className="flex flex-col gap-6 bg-white p-6"
                        style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}
                    >
                        <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: '#f0dee5' }}>
                            <span
                                className="px-2 py-0.5 font-mono text-[10px] tracking-wider text-white"
                                style={{ backgroundColor: ACCENT }}
                            >
                                BAB {nomorBerikutnya}
                            </span>
                            <span className="font-mono text-[11px] tracking-wider text-gray-400">
                                {cerita.judul_cerita} — Bab {nomorBerikutnya}
                            </span>
                        </div>

                        <div>
                            <FieldLabel>Judul Bab</FieldLabel>
                            <input
                                type="text"
                                value={data.judul_bab}
                                onChange={(e) => setData('judul_bab', e.target.value)}
                                placeholder="Judul bab..."
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                                style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                            />
                            <InputError message={errors.judul_bab} className="mt-1 font-mono text-[11px]" />
                        </div>

                        <div>
                            <FieldLabel>Isi Bab</FieldLabel>
                            <div style={{ ...clipPanelSm, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={data.isi_bab}
                                    onChange={(_event, editor) => {
                                        setData('isi_bab', editor.getData());
                                    }}
                                    config={{
                                        placeholder: 'Tulis isi bab di sini... (minimal 20 karakter)',
                                    }}
                                />
                            </div>
                            <p className="mt-1 font-mono text-[10px] tracking-wider text-gray-400">
                                {panjangTeks} KARAKTER
                            </p>
                            <InputError message={errors.isi_bab} className="mt-1 font-mono text-[11px]" />
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