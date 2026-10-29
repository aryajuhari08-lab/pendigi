import KartuPustaka, { ItemPustaka } from '@/Components/KartuPustaka';
import { ACCENT, BORDER, Button, clipPanel } from '@/Components/PendigiUI';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Tab = 'lanjut' | 'tersimpan';
type Saringan = 'semua' | 'artikel' | 'cerita';

function Kosong({ teks, tautan }: { teks: string; tautan: { href: string; label: string }[] }) {
    return (
        <div className="bg-white p-10 text-center shadow-sm" style={{ ...clipPanel, border: `1.5px solid ${BORDER}` }}>
            <p className="font-mono text-xs tracking-wider text-gray-400">{teks}</p>
            <div className="mt-4 flex justify-center gap-4 font-mono text-[11px] tracking-wider">
                {tautan.map((t) => (
                    <Link key={t.href} href={t.href} className="hover:underline" style={{ color: ACCENT }}>
                        {t.label} →
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function Index({ riwayat, bookmark }: { riwayat: ItemPustaka[]; bookmark: ItemPustaka[] }) {
    const [tab, setTab] = useState<Tab>('lanjut');
    const [saringan, setSaringan] = useState<Saringan>('semua');

    const hapusRiwayat = (id: number) => router.delete(route('pustaka.riwayat.hapus', id), { preserveScroll: true });

    const kosongkan = () => {
        if (confirm('Hapus seluruh riwayat baca? Bookmark tidak ikut terhapus.')) {
            router.delete(route('pustaka.riwayat.kosongkan'), { preserveScroll: true });
        }
    };

    const lepas = (item: ItemPustaka) =>
        router.post(
            item.jenis === 'artikel' ? route('artikel.bookmark', item.id) : route('cerita.bookmark', item.id),
            {},
            { preserveScroll: true },
        );

    const tersaring = bookmark.filter((b) => saringan === 'semua' || b.jenis === saringan);

    const tabClass = (aktif: boolean) =>
        `pb-2 font-mono text-xs tracking-wider transition ${aktif ? 'border-b-2 font-bold' : 'text-gray-400 hover:text-gray-600'}`;

    const tautanJelajah = [
        { href: route('home'), label: 'JELAJAHI ARTIKEL' },
        { href: route('cerita.index'), label: 'JELAJAHI FIKSI' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    PUSTAKA SAYA
                </h2>
            }
        >
            <Head title="Pustaka Saya" />

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
                    <div className="flex gap-6 border-b" style={{ borderColor: BORDER }}>
                        <button
                            onClick={() => setTab('lanjut')}
                            className={tabClass(tab === 'lanjut')}
                            style={tab === 'lanjut' ? { color: ACCENT, borderColor: ACCENT } : undefined}
                        >
                            LANJUT BACA ({riwayat.length})
                        </button>
                        <button
                            onClick={() => setTab('tersimpan')}
                            className={tabClass(tab === 'tersimpan')}
                            style={tab === 'tersimpan' ? { color: ACCENT, borderColor: ACCENT } : undefined}
                        >
                            TERSIMPAN ({bookmark.length})
                        </button>
                    </div>

                    {tab === 'lanjut' && (
                        <div className="mt-5">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <p className="font-mono text-[11px] tracking-wider text-gray-500">
                                    <span style={{ color: ACCENT }}>// </span>
                                    BACAAN TERAKHIRMU (MAKS. 30)
                                </p>
                                {riwayat.length > 0 && (
                                    <Button type="button" variant="ghost" onClick={kosongkan}>
                                        KOSONGKAN
                                    </Button>
                                )}
                            </div>

                            {riwayat.length === 0 ? (
                                <Kosong
                                    teks="BELUM ADA RIWAYAT. ARTIKEL DAN BAB YANG KAMU BUKA AKAN TERCATAT DI SINI."
                                    tautan={tautanJelajah}
                                />
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {riwayat.map((item) => (
                                        <KartuPustaka key={item.riwayat_id} item={item}>
                                            <button
                                                onClick={() => hapusRiwayat(item.riwayat_id as number)}
                                                title="Hapus dari riwayat"
                                                aria-label="Hapus dari riwayat"
                                                className="shrink-0 px-2 font-mono text-sm text-gray-300 transition hover:text-[#a8265c]"
                                            >
                                                ✕
                                            </button>
                                        </KartuPustaka>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {tab === 'tersimpan' && (
                        <div className="mt-5">
                            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-wider">
                                {(['semua', 'artikel', 'cerita'] as Saringan[]).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSaringan(s)}
                                        className="px-3 py-1 transition"
                                        style={{
                                            border: `1px solid ${BORDER}`,
                                            backgroundColor: saringan === s ? ACCENT : '#fff',
                                            color: saringan === s ? '#fff' : ACCENT,
                                        }}
                                    >
                                        {s === 'semua' ? 'SEMUA' : s === 'artikel' ? 'ARTIKEL' : 'FIKSI'}
                                    </button>
                                ))}
                            </div>

                            {tersaring.length === 0 ? (
                                <Kosong
                                    teks={
                                        bookmark.length === 0
                                            ? 'BELUM ADA YANG DISIMPAN. TEKAN "SIMPAN" DI HALAMAN ARTIKEL ATAU CERITA.'
                                            : 'TIDAK ADA YANG COCOK DENGAN SARINGAN INI.'
                                    }
                                    tautan={tautanJelajah}
                                />
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {tersaring.map((item) => (
                                        <KartuPustaka key={item.bookmark_id} item={item}>
                                            <button
                                                onClick={() => lepas(item)}
                                                title="Lepas dari Tersimpan"
                                                className="shrink-0 px-2 font-mono text-[11px] tracking-wider hover:underline"
                                                style={{ color: ACCENT }}
                                            >
                                                LEPAS
                                            </button>
                                        </KartuPustaka>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
