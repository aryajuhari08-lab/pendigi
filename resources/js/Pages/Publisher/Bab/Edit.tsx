import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-1 block font-mono text-[11px] tracking-wider text-gray-500">
            // {children}
        </label>
    );
}

interface BabData {
    bab_id: number;
    nomor_bab: number;
    judul_bab: string;
    isi_bab: string;
    status: 'draft' | 'pending_review' | 'published' | 'rejected';
    catatan_admin: string | null;
}

interface CeritaRingkas {
    cerita_id: number;
    judul_cerita: string;
}

export default function Edit({ bab, cerita }: { bab: BabData; cerita: CeritaRingkas }) {
    const { data, setData, transform, put, processing, errors } = useForm({
        judul_bab: bab.judul_bab,
        isi_bab: bab.isi_bab,
        aksi: 'draft' as 'draft' | 'submit',
    });

    const submit = (aksi: 'draft' | 'submit') => {
        // Tidak ada upload file di sini, PUT biasa aman. aksi diisi lewat transform supaya tidak tertinggal.
        transform((currentData) => ({ ...currentData, aksi }));
        put(route('publisher.bab.update', bab.bab_id));
    };

    const panjangTeks = data.isi_bab.replace(/<[^>]*>/g, '').trim().length;
    const statusInfo = STATUS_STYLE[bab.status] ?? STATUS_STYLE.draft;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    EDIT BAB
                </h2>
            }
        >
            <Head title={`Edit Bab - ${cerita.judul_cerita}`} />

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

                    {bab.status === 'rejected' && bab.catatan_admin && (
                        <div
                            className="mb-4 bg-white p-4 font-mono text-xs"
                            style={{ ...clipPanel, border: `1px solid ${ACCENT}`, color: ACCENT }}
                        >
                            <p className="font-semibold tracking-wider">// BAB DITOLAK ADMIN</p>
                            <p className="mt-1 text-gray-600">{bab.catatan_admin}</p>
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
                                {cerita.judul_cerita} — Bab {bab.nomor_bab}
                            </span>
                        </div>

                        <div
                            className="bg-[#faf7f8] p-3 font-mono text-[11px] text-gray-500"
                            style={{ ...clipPanelSm, border: `1px dashed ${BORDER}` }}
                        >
                            Bab yang sudah tayang pun, kalau diedit dan dikirim ulang, akan berstatus PENDING REVIEW dan perlu
                            ditinjau admin lagi sebelum tampil ke publik.
                        </div>

                        <div>
                            <FieldLabel>Judul Bab</FieldLabel>
                            <input
                                type="text"
                                value={data.judul_bab}
                                onChange={(e) => setData('judul_bab', e.target.value)}
                                className="w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none"
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