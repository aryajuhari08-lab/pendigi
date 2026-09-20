import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const accent = '#a8265c';
const accentBorder = '#e3c7d2';

interface KategoriStat {
    nama: string;
    jumlah: number;
}

interface BulanStat {
    bulan: string;
    jumlah: number;
}

interface DashboardProps {
    ringkasan: {
        totalArtikel: number;
        menungguModerasiArtikel: number;
        menungguModerasiKomentar: number;
        totalUser: number;
    };
    artikelPerKategori: KategoriStat[];
    userPerRole: Record<string, number>;
    artikelPerBulan: BulanStat[];
}

function BarChartHorizontal({ data }: { data: KategoriStat[] }) {
    const max = Math.max(...data.map((d) => d.jumlah), 1);
    return (
        <div className="flex flex-col gap-3">
            {data.map((d) => (
                <div key={d.nama} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 font-mono text-[11px] text-gray-500">{d.nama}</span>
                    <div className="h-4 flex-1 bg-[#f3e8ec]">
                        <div
                            className="h-4"
                            style={{ width: `${(d.jumlah / max) * 100}%`, backgroundColor: accent }}
                        />
                    </div>
                    <span className="w-6 shrink-0 text-right text-xs font-semibold text-gray-700">{d.jumlah}</span>
                </div>
            ))}
        </div>
    );
}

function BarChartVertical({ data }: { data: BulanStat[] }) {
    const max = Math.max(...data.map((d) => d.jumlah), 1);
    const formatBulan = (b: string) => {
        const [y, m] = b.split('-');
        const nama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${nama[parseInt(m, 10) - 1]} ${y.slice(2)}`;
    };
    return (
        <div className="flex h-40 items-end gap-4">
            {data.map((d) => (
                <div key={d.bulan} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">{d.jumlah}</span>
                    <div
                        className="w-full"
                        style={{
                            height: `${Math.max((d.jumlah / max) * 100, 4)}%`,
                            backgroundColor: accent,
                        }}
                    />
                    <span className="font-mono text-[10px] text-gray-400">{formatBulan(d.bulan)}</span>
                </div>
            ))}
        </div>
    );
}

export default function Dashboard({ ringkasan, artikelPerKategori, userPerRole, artikelPerBulan }: DashboardProps) {
    const roleLabel: Record<string, string> = { admin: 'Admin', publisher: 'Publisher', reader: 'Reader' };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard Admin</h2>}
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Ringkasan angka */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="bg-white p-5 shadow" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">TOTAL ARTIKEL</p>
                            <p className="mt-1 text-3xl font-bold" style={{ color: accent }}>{ringkasan.totalArtikel}</p>
                        </div>
                        <div className="bg-white p-5 shadow" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">MENUNGGU ARTIKEL</p>
                            <p className="mt-1 text-3xl font-bold text-amber-600">{ringkasan.menungguModerasiArtikel}</p>
                        </div>
                        <div className="bg-white p-5 shadow" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">MENUNGGU KOMENTAR</p>
                            <p className="mt-1 text-3xl font-bold text-amber-600">{ringkasan.menungguModerasiKomentar}</p>
                        </div>
                        <div className="bg-white p-5 shadow" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">TOTAL USER</p>
                            <p className="mt-1 text-3xl font-bold text-gray-700">{ringkasan.totalUser}</p>
                        </div>
                    </div>

                    {/* Grafik */}
                    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div className="bg-white p-5 shadow lg:col-span-2" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">ARTIKEL PUBLISHED PER BULAN (6 BULAN TERAKHIR)</p>
                            {artikelPerBulan.length > 0 ? (
                                <BarChartVertical data={artikelPerBulan} />
                            ) : (
                                <p className="text-sm text-gray-400">Belum ada data.</p>
                            )}
                        </div>
                        <div className="bg-white p-5 shadow" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">USER PER ROLE</p>
                            <div className="flex flex-col gap-3">
                                {Object.entries(userPerRole).map(([role, jumlah]) => (
                                    <div key={role} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{roleLabel[role] ?? role}</span>
                                        <span className="text-lg font-bold" style={{ color: accent }}>{jumlah}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-white p-5 shadow" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                        <p className="mb-4 font-mono text-xs tracking-wider text-gray-500">ARTIKEL PUBLISHED PER KATEGORI</p>
                        {artikelPerKategori.length > 0 ? (
                            <BarChartHorizontal data={artikelPerKategori} />
                        ) : (
                            <p className="text-sm text-gray-400">Belum ada data.</p>
                        )}
                    </div>

                    {/* Menu */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href={route('admin.moderasi.artikel')} className="bg-white p-6 shadow hover:shadow-md" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">MODERASI</p>
                            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>Artikel</p>
                        </Link>
                        <Link href={route('admin.moderasi.komentar')} className="bg-white p-6 shadow hover:shadow-md" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">MODERASI</p>
                            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>Komentar</p>
                        </Link>
                        <Link href={route('admin.kategori.index')} className="bg-white p-6 shadow hover:shadow-md" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">KELOLA</p>
                            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>Kategori</p>
                        </Link>
                        <Link href={route('admin.users.index')} className="bg-white p-6 shadow hover:shadow-md" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">KELOLA</p>
                            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>User</p>
                        </Link>
                        <Link href={route('admin.banner.index')} className="bg-white p-6 shadow hover:shadow-md" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">KELOLA</p>
                            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>Banner</p>
                        </Link>
                        <Link href={route('admin.pengajuan.index')} className="bg-white p-6 shadow hover:shadow-md" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">TINJAU</p>
                            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>Pengajuan Publisher</p>
                        </Link>
                        <Link href={route('admin.daftarNis.index')} className="bg-white p-6 shadow hover:shadow-md" style={{ ...clipPanel, border: `1px solid ${accentBorder}` }}>
                            <p className="font-mono text-[10px] tracking-wider text-gray-400">KELOLA</p>
                            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>Daftar NIS</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}