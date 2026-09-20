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
        nis: '',
        password: '',
        password_confirmation: '',
        role: 'reader',
        portofolio_teks: '',
        portofolio_file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="flex flex-col gap-4">
                <p className="font-mono text-[10px] tracking-wider text-gray-400">
                    KHUSUS SISWA/WARGA SMKN 11 BANDUNG — NIS AKAN DICOCOKKAN DENGAN DATA SEKOLAH
                </p>

                <div>
                    <FieldLabel>Nama Lengkap (sesuai data sekolah)</FieldLabel>
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
                    <FieldLabel>NIS</FieldLabel>
                    <input
                        id="nis"
                        value={data.nis}
                        onChange={(e) => setData('nis', e.target.value)}
                        required
                        className={inputClass}
                        style={inputStyle}
                    />
                    {errors.nis && (
                        <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>{errors.nis}</p>
                    )}
                </div>

                <div>
                    <FieldLabel>Email</FieldLabel>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        autoComplete="username"
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
                    <FieldLabel>Daftar Sebagai</FieldLabel>
                    <select
                        id="role"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        required
                        className={inputClass}
                        style={inputStyle}
                    >
                        <option value="reader">Reader (membaca artikel)</option>
                        <option value="publisher">Publisher (menulis artikel)</option>
                    </select>
                    {errors.role && (
                        <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>{errors.role}</p>
                    )}
                </div>

                {data.role === 'publisher' && (
                    <div className="flex flex-col gap-4 border-l-2 pl-4" style={{ borderColor: BORDER }}>
                        <p className="font-mono text-[10px] tracking-wider text-gray-400">
                            AKUN AKAN AKTIF SEBAGAI READER DULU, MENUNGGU ADMIN MENINJAU PORTOFOLIO INI.
                        </p>

                        <div>
                            <FieldLabel>Ceritakan Pengalaman Menulismu</FieldLabel>
                            <textarea
                                id="portofolio_teks"
                                value={data.portofolio_teks}
                                onChange={(e) => setData('portofolio_teks', e.target.value)}
                                rows={4}
                                placeholder="Contoh: pernah menulis di mading sekolah, blog pribadi, sertakan juga link karya kalau ada..."
                                className={inputClass}
                                style={inputStyle}
                            />
                            {errors.portofolio_teks && (
                                <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>
                                    {errors.portofolio_teks}
                                </p>
                            )}
                        </div>

                        <div>
                            <FieldLabel>Upload Contoh Tulisan (opsional, PDF/DOC, maks 2MB)</FieldLabel>
                            <input
                                id="portofolio_file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setData('portofolio_file', e.target.files?.[0] ?? null)}
                                className="w-full text-sm"
                            />
                            {errors.portofolio_file && (
                                <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>
                                    {errors.portofolio_file}
                                </p>
                            )}
                        </div>
                    </div>
                )}

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