import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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

const inputClass = 'w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none';
const inputStyle = { ...clipPanelSm, border: `1px solid ${BORDER}` };

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="flex flex-col gap-4">
                <div>
                    <FieldLabel>Nama Lengkap</FieldLabel>
                    <input
                        id="nama_lengkap"
                        value={data.nama_lengkap}
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                        required
                        className={inputClass}
                        style={inputStyle}
                    />
                    {errors.nama_lengkap && (
                        <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>{errors.nama_lengkap}</p>
                    )}
                </div>

                <div>
                    <FieldLabel>Email</FieldLabel>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        autoComplete="username"
                        placeholder="nama@gmail.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className={inputClass}
                        style={inputStyle}
                    />
                    {errors.email && (
                        <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>{errors.email}</p>
                    )}
                </div>

                <div>
                    <FieldLabel>Password</FieldLabel>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        className={inputClass}
                        style={inputStyle}
                    />
                    {errors.password && (
                        <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>{errors.password}</p>
                    )}
                </div>

                <div>
                    <FieldLabel>Konfirmasi Password</FieldLabel>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        className={inputClass}
                        style={inputStyle}
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <p className="font-mono text-[10px] tracking-wider text-gray-400">
                    AKUN BARU OTOMATIS JADI READER. INGIN MENULIS? AJUKAN JADI PUBLISHER DARI HALAMAN PROFIL SETELAH LOGIN.
                </p>

                <div className="mt-2 flex items-center justify-between">
                    <Link
                        href={route('login')}
                        className="font-mono text-[11px] tracking-wider text-gray-500 underline hover:text-gray-800"
                    >
                        SUDAH PUNYA AKUN?
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 font-mono text-xs tracking-wider text-white transition hover:opacity-90 disabled:opacity-40"
                        style={{ ...clipPanelSm, backgroundColor: ACCENT }}
                    >
                        REGISTER
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
