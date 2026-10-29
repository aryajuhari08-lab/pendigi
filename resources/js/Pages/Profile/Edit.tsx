import Avatar from '@/Components/Avatar';
import { ACCENT, BORDER_SOFT, Button, clipPanel, Notice } from '@/Components/PendigiUI';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ChangeEvent, useRef, useState } from 'react';
import CropFotoModal from './Partials/CropFotoModal';
import DeleteUserForm from './Partials/DeleteUserForm';
import PengajuanPublisherForm, { PengajuanTerakhir } from './Partials/PengajuanPublisherForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const ROLE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
    admin: { bg: '#f0d9ee', text: '#7a1f8a', label: 'ADMIN' },
    publisher: { bg: '#d9e6f5', text: '#1f4e8a', label: 'PUBLISHER' },
    reader: { bg: '#e5e7eb', text: '#4b5563', label: 'READER' },
};

export default function Edit({
    mustVerifyEmail,
    status,
    pengajuan,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    pengajuan: PengajuanTerakhir | null;
}>) {
    const page = usePage();
    const user = page.props.auth.user;
    const flash = (page.props as unknown as { flash?: { success?: string; error?: string } }).flash;
    const badge = ROLE_BADGE[user.role] ?? ROLE_BADGE.reader;

    const inputFoto = useRef<HTMLInputElement>(null);
    const [fileFoto, setFileFoto] = useState<File | null>(null);
    const [mengunggah, setMengunggah] = useState(false);
    const [fotoError, setFotoError] = useState<string | undefined>();

    const pilihFoto = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        e.target.value = ''; // supaya memilih file yang sama dua kali tetap memicu event
        if (!f) return;
        if (!f.type.startsWith('image/')) {
            setFotoError('File harus berupa gambar.');
            return;
        }
        if (f.size > 10 * 1024 * 1024) {
            setFotoError('Ukuran foto terlalu besar (maks 10 MB).');
            return;
        }
        setFotoError(undefined);
        setFileFoto(f);
    };

    const simpanFoto = (blob: Blob) => {
        const berkas = new File([blob], 'foto-profil.jpg', { type: 'image/jpeg' });
        router.post(
            route('profile.foto'),
            { foto: berkas },
            {
                forceFormData: true,
                preserveScroll: true,
                onStart: () => setMengunggah(true),
                onFinish: () => setMengunggah(false),
                onSuccess: () => {
                    setFileFoto(null);
                    setFotoError(undefined);
                },
                onError: (errs) => setFotoError(errs.foto ?? 'Gagal mengunggah foto.'),
            },
        );
    };

    const hapusFoto = () => {
        if (confirm('Hapus foto profil?')) {
            router.delete(route('profile.foto.destroy'), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    PROFIL AKUN
                </h2>
            }
        >
            <Head title="Profil" />

            <div className="py-10">
                <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4">
                    {flash?.success && <Notice tone="success">{flash.success}</Notice>}
                    {flash?.error && <Notice tone="error">{flash.error}</Notice>}

                    {/* Ringkasan akun + foto profil */}
                    <div
                        className="flex flex-col items-center gap-5 bg-white p-6 shadow-sm sm:flex-row"
                        style={{ ...clipPanel, border: `1px solid ${BORDER_SOFT}` }}
                    >
                        <Avatar nama={user.nama_lengkap} foto={user.foto_profil} size={96} />
                        <div className="min-w-0 text-center sm:text-left">
                            <p className="truncate text-xl font-semibold text-gray-800">{user.nama_lengkap}</p>
                            <p className="truncate text-sm text-gray-500">{user.email}</p>
                            <span
                                className="mt-2 inline-block px-2 py-0.5 font-mono text-[10px] tracking-wider"
                                style={{ backgroundColor: badge.bg, color: badge.text }}
                            >
                                {badge.label}
                            </span>

                            <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                                <Button type="button" variant="ghost" onClick={() => inputFoto.current?.click()}>
                                    {user.foto_profil ? 'GANTI FOTO' : 'TAMBAH FOTO'}
                                </Button>
                                {user.foto_profil && (
                                    <Button type="button" variant="ghost" onClick={hapusFoto}>
                                        HAPUS FOTO
                                    </Button>
                                )}
                            </div>
                            {!fileFoto && fotoError && (
                                <p className="mt-2 font-mono text-[11px]" style={{ color: ACCENT }}>
                                    {fotoError}
                                </p>
                            )}
                            <input
                                ref={inputFoto}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={pilihFoto}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <CropFotoModal
                        file={fileFoto}
                        onClose={() => {
                            setFileFoto(null);
                            setFotoError(undefined);
                        }}
                        onSave={simpanFoto}
                        processing={mengunggah}
                        error={fotoError}
                    />

                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                    <PengajuanPublisherForm pengajuan={pengajuan} />
                    <UpdatePasswordForm />
                    <DeleteUserForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
