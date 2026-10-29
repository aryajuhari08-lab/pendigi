import { BarChartHorizontal, BarChartVertical, labelBulan } from '@/Components/Charts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface BulanStat {
    bulan: string;
    jumlah: number;
}

interface DashboardProps {
    ringkasan: {
        totalArtikel: number;
        menungguModerasiArtikel: number;
        menungguModerasiKomentar: number;
        menungguModerasiCerita?: number;
        menungguModerasiBab?: number;
        totalUser: number;
    };
    artikelPerKategori: { nama: string; jumlah: number }[];
    userPerRole: Record<string, number>;
    artikelPerBulan: BulanStat[];
    userBaruPerBulan: BulanStat[];
    komentarPerStatus: Record<string, number>;
    artikelTerpopuler: { artikel_id: number; judul_artikel: string; views: number }[];
    ceritaTerpopuler: { cerita_id: number; judul_cerita: string; views: number }[];
    ceritaPerGenre: { genre: string; jumlah: number }[];
}

function PanelGrafik({
    judul,
    subjudul,
    className = '',
    children,
}: {
    judul: string;
    subjudul?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={`rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs ${className}`}>
            <div className="mb-5">
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">{judul}</h3>
                {subjudul && <p className="mt-0.5 text-xs text-slate-500">{subjudul}</p>}
            </div>
            {children}
        </div>
    );
}

function StatItem({
    label,
    value,
    badge,
    highlight = false,
}: {
    label: string;
    value: number;
    badge?: string;
    highlight?: boolean;
}) {
    return (
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                {badge && (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        {badge}
                    </span>
                )}
            </div>
            <p className={`mt-3 text-3xl font-bold tracking-tight ${highlight ? 'text-[#a8265c]' : 'text-slate-900'}`}>
                {value.toLocaleString('id-ID')}
            </p>
        </div>
    );
}

function ActionCard({
    href,
    judul,
    deskripsi,
    badgeCount,
}: {
    href: string;
    judul: string;
    deskripsi: string;
    badgeCount?: number;
}) {
    return (
        <Link
            href={href}
            className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
        >
            <div>
                <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#a8265c]">
                        {judul}
                    </h4>
                    {badgeCount !== undefined && badgeCount > 0 && (
                        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-100 px-1.5 text-xs font-semibold text-amber-800">
                            {badgeCount}
                        </span>
                    )}
                </div>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{deskripsi}</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-slate-400 group-hover:text-[#a8265c]">
                <span>Kelola</span>
                <svg
                    className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}

const Kosong = () => <p className="py-4 text-xs text-slate-400">Belum ada data untuk ditampilkan.</p>;

export default function Dashboard({
    ringkasan,
    artikelPerKategori,
    userPerRole,
    artikelPerBulan,
    userBaruPerBulan,
    komentarPerStatus,
    artikelTerpopuler,
    ceritaTerpopuler,
    ceritaPerGenre,
}: DashboardProps) {
    const roleLabel: Record<string, string> = { admin: 'Administrator', publisher: 'Penulis / Publisher', reader: 'Pembaca' };
    const statusLabel: Record<string, string> = { approved: 'Disetujui', pending: 'Menunggu', rejected: 'Ditolak' };

    const perBulan = (data: BulanStat[]) => data.map((d) => ({ label: labelBulan(d.bulan), value: d.jumlah }));
    const adaData = (data: BulanStat[]) => data.some((d) => d.jumlah > 0);

    const menungguArtikel = ringkasan.menungguModerasiArtikel ?? 0;
    const menungguKomentar = ringkasan.menungguModerasiKomentar ?? 0;
    const menungguCerita = ringkasan.menungguModerasiCerita ?? 0;
    const menungguBab = ringkasan.menungguModerasiBab ?? 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">Dashboard Panel Moderasi</h2>
                        <p className="text-xs text-slate-500">Ikhtisar statistik publikasi, pengguna, dan antrean moderasi platform Pendigi.</p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Admin - Pendigi" />

            <div className="py-8 bg-slate-50/50 min-h-[calc(100vh-65px)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Ringkasan Metrics */}
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Ringkasan Konten & Pengguna
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatItem
                                label="Total Artikel Published"
                                value={ringkasan.totalArtikel}
                                highlight
                            />
                            <StatItem
                                label="Artikel Menunggu Moderasi"
                                value={menungguArtikel}
                                badge={menungguArtikel > 0 ? 'Perlu Ditinjau' : undefined}
                            />
                            <StatItem
                                label="Komentar Menunggu Moderasi"
                                value={menungguKomentar}
                                badge={menungguKomentar > 0 ? 'Perlu Ditinjau' : undefined}
                            />
                            <StatItem
                                label="Total Pengguna Terdaftar"
                                value={ringkasan.totalUser}
                            />
                        </div>
                    </section>

                    {/* Quick Access / Management Navigation */}
                    <section>
                        <div className="mb-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Pintasan Navigasi & Moderasi
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <ActionCard
                                href={route('admin.moderasi.artikel')}
                                judul="Moderasi Artikel"
                                deskripsi="Tinjau dan setujui naskah artikel dari publisher."
                                badgeCount={menungguArtikel}
                            />
                            <ActionCard
                                href={route('admin.moderasi.komentar')}
                                judul="Moderasi Komentar"
                                deskripsi="Filter dan kelola tanggapan pembaca."
                                badgeCount={menungguKomentar}
                            />
                            <ActionCard
                                href={route('admin.moderasi.cerita')}
                                judul="Moderasi Fiksi & Cerita"
                                deskripsi="Pemeriksaan karya fiksi yang diajukan."
                                badgeCount={menungguCerita}
                            />
                            <ActionCard
                                href={route('admin.moderasi.bab')}
                                judul="Moderasi Bab Cerita"
                                deskripsi="Validasi bab lanjutan dari penulis."
                                badgeCount={menungguBab}
                            />
                            <ActionCard
                                href={route('admin.kategori.index')}
                                judul="Manajemen Kategori"
                                deskripsi="Atur struktur dan hierarki taksonomi artikel."
                            />
                            <ActionCard
                                href={route('admin.users.index')}
                                judul="Manajemen Pengguna"
                                deskripsi="Kelola akun, hak akses, dan verifikasi profil."
                            />
                            <ActionCard
                                href={route('admin.banner.index')}
                                judul="Kelola Banner"
                                deskripsi="Atur banner pengumuman dan promosi utama."
                            />
                            <ActionCard
                                href={route('admin.pengajuan.index')}
                                judul="Pengajuan Publisher"
                                deskripsi="Verifikasi permohonan akun penulis baru."
                            />
                        </div>
                    </section>

                    {/* Analytics / Charts Grid */}
                    <section className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <PanelGrafik
                                judul="Tren Publikasi Artikel"
                                subjudul="Jumlah artikel dipublikasikan dalam 6 bulan terakhir"
                                className="lg:col-span-2"
                            >
                                {adaData(artikelPerBulan) ? <BarChartVertical data={perBulan(artikelPerBulan)} /> : <Kosong />}
                            </PanelGrafik>

                            <PanelGrafik
                                judul="Distribui Pengguna"
                                subjudul="Rincian jumlah pengguna berdasarkan peranan"
                            >
                                <div className="divide-y divide-slate-100">
                                    {Object.entries(userPerRole).map(([role, jumlah]) => (
                                        <div key={role} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                            <span className="text-xs font-medium text-slate-600">{roleLabel[role] ?? role}</span>
                                            <span className="text-sm font-semibold text-slate-900">{jumlah.toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>
                            </PanelGrafik>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <PanelGrafik
                                judul="Pendaftaran Pengguna Baru"
                                subjudul="Pertumbuhan akun terdaftar 6 bulan terakhir"
                                className="lg:col-span-2"
                            >
                                {adaData(userBaruPerBulan) ? <BarChartVertical data={perBulan(userBaruPerBulan)} /> : <Kosong />}
                            </PanelGrafik>

                            <PanelGrafik
                                judul="Status Moderasi Komentar"
                                subjudul="Distribusi status komentar di seluruh platform"
                            >
                                {Object.keys(komentarPerStatus).length > 0 ? (
                                    <BarChartHorizontal
                                        labelClass="w-24 text-xs"
                                        data={['approved', 'pending', 'rejected'].map((s) => ({
                                            label: statusLabel[s],
                                            value: komentarPerStatus[s] ?? 0,
                                        }))}
                                    />
                                ) : (
                                    <Kosong />
                                )}
                            </PanelGrafik>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <PanelGrafik
                                judul="Artikel Terpopuler"
                                subjudul="5 artikel dengan akumulasi pembaca (views) tertinggi"
                            >
                                {artikelTerpopuler.length > 0 ? (
                                    <BarChartHorizontal
                                        labelClass="w-36 text-xs truncate"
                                        data={artikelTerpopuler.map((a) => ({ label: a.judul_artikel, value: a.views }))}
                                    />
                                ) : (
                                    <Kosong />
                                )}
                            </PanelGrafik>

                            <PanelGrafik
                                judul="Cerita Fiksi Terpopuler"
                                subjudul="5 cerita fiksi dengan tingkat pembaca terbanyak"
                            >
                                {ceritaTerpopuler.length > 0 ? (
                                    <BarChartHorizontal
                                        labelClass="w-36 text-xs truncate"
                                        data={ceritaTerpopuler.map((c) => ({ label: c.judul_cerita, value: c.views }))}
                                    />
                                ) : (
                                    <Kosong />
                                )}
                            </PanelGrafik>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <PanelGrafik
                                judul="Artikel per Kategori Topik"
                                subjudul="Sebaran artikel berdasarkan taksonomi kategori"
                            >
                                {artikelPerKategori.length > 0 ? (
                                    <BarChartHorizontal
                                        labelClass="w-32 text-xs truncate"
                                        data={artikelPerKategori.map((k) => ({ label: k.nama, value: k.jumlah }))}
                                    />
                                ) : (
                                    <Kosong />
                                )}
                            </PanelGrafik>

                            <PanelGrafik
                                judul="Cerita Fiksi per Genre"
                                subjudul="Sebaran cerita berdasarkan genre fiksi"
                            >
                                {ceritaPerGenre.length > 0 ? (
                                    <BarChartHorizontal
                                        labelClass="w-32 text-xs truncate"
                                        data={ceritaPerGenre.map((g) => ({ label: g.genre, value: g.jumlah }))}
                                    />
                                ) : (
                                    <Kosong />
                                )}
                            </PanelGrafik>
                        </div>
                    </section>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
