import { Button, Field, inputClass, inputStyle, Panel, SavedMark } from '@/Components/PendigiUI';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        nama_lengkap: user.nama_lengkap,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <Panel title="INFORMASI PROFIL" description="Perbarui nama dan alamat email akunmu.">
            <form onSubmit={submit} className="flex flex-col gap-5">
                <Field label="Nama Lengkap" htmlFor="nama_lengkap" error={errors.nama_lengkap}>
                    <input
                        id="nama_lengkap"
                        value={data.nama_lengkap}
                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                        required
                        autoComplete="name"
                        className={inputClass}
                        style={inputStyle}
                    />
                </Field>

                <Field label="Email" htmlFor="email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className={inputClass}
                        style={inputStyle}
                    />
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="text-sm text-gray-600">
                        Alamat email kamu belum terverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="underline hover:text-gray-900"
                        >
                            Kirim ulang email verifikasi.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 font-medium text-green-700">
                                Link verifikasi baru sudah dikirim ke emailmu.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        SIMPAN
                    </Button>
                    <SavedMark show={recentlySuccessful} />
                </div>
            </form>
        </Panel>
    );
}
