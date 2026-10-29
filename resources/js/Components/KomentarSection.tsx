import Avatar from '@/Components/Avatar';
import { ACCENT, BORDER_SOFT, Button, inputClass, inputStyle, Notice, Panel } from '@/Components/PendigiUI';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export interface KomentarItem {
    komentar_id: number;
    komentar: string;
    create_at: string;
    penulis?: { nama_lengkap: string; foto_profil?: string | null };
    balasan?: KomentarItem[];
}

function formatWaktu(waktu: string) {
    return new Date(waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Pembuat({ item, ukuran }: { item: KomentarItem; ukuran: number }) {
    return (
        <div className="flex items-center gap-2">
            <Avatar nama={item.penulis?.nama_lengkap ?? '?'} foto={item.penulis?.foto_profil} size={ukuran} />
            <span className="text-sm font-medium text-gray-800">{item.penulis?.nama_lengkap ?? '-'}</span>
            <span className="font-mono text-[10px] text-gray-400">{formatWaktu(item.create_at)}</span>
        </div>
    );
}

function FormBalas({ komentarId, onSelesai }: { komentarId: number; onSelesai: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({ komentar: '' });

    const kirim: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('komentar.balas', komentarId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSelesai();
            },
        });
    };

    return (
        <form onSubmit={kirim} className="mt-3 flex flex-col gap-2">
            <textarea
                value={data.komentar}
                onChange={(e) => setData('komentar', e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="Tulis balasan..."
                className={inputClass}
                style={inputStyle}
            />
            {errors.komentar && <p className="font-mono text-[11px]" style={{ color: ACCENT }}>{errors.komentar}</p>}
            <div className="flex gap-2">
                <Button type="submit" disabled={processing || !data.komentar.trim()}>
                    KIRIM BALASAN
                </Button>
                <Button type="button" variant="ghost" onClick={onSelesai}>
                    BATAL
                </Button>
            </div>
        </form>
    );
}

export default function KomentarSection({
    komentar,
    storeUrl,
    isLoggedIn,
    bolehBalas,
}: {
    komentar: KomentarItem[];
    storeUrl: string;
    isLoggedIn: boolean;
    bolehBalas: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({ komentar: '' });
    const [pesan, setPesan] = useState<string | null>(null);
    const [balasId, setBalasId] = useState<number | null>(null);

    const total = komentar.reduce((n, k) => n + 1 + (k.balasan?.length ?? 0), 0);

    const kirim: FormEventHandler = (e) => {
        e.preventDefault();
        post(storeUrl, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPesan('Komentar terkirim, menunggu persetujuan admin.');
            },
        });
    };

    return (
        <Panel title={`KOMENTAR (${total})`} description="Komentar tampil setelah disetujui admin.">
            {isLoggedIn ? (
                <form onSubmit={kirim} className="flex flex-col gap-2">
                    <textarea
                        value={data.komentar}
                        onChange={(e) => {
                            setData('komentar', e.target.value);
                            setPesan(null);
                        }}
                        rows={3}
                        maxLength={1000}
                        placeholder="Tulis komentarmu tentang bab ini..."
                        className={inputClass}
                        style={inputStyle}
                    />
                    {errors.komentar && <p className="font-mono text-[11px]" style={{ color: ACCENT }}>{errors.komentar}</p>}
                    {pesan && <Notice tone="success">{pesan}</Notice>}
                    <div>
                        <Button type="submit" disabled={processing || !data.komentar.trim()}>
                            KIRIM KOMENTAR
                        </Button>
                    </div>
                </form>
            ) : (
                <p className="text-sm text-gray-500">
                    <Link href={route('login')} className="underline" style={{ color: ACCENT }}>
                        Login
                    </Link>{' '}
                    dulu untuk ikut berkomentar.
                </p>
            )}

            <div className="mt-6 flex flex-col gap-5">
                {komentar.length === 0 && (
                    <p className="font-mono text-xs tracking-wider text-gray-400">BELUM ADA KOMENTAR.</p>
                )}

                {komentar.map((item) => (
                    <div key={item.komentar_id} className="border-b pb-4 last:border-0" style={{ borderColor: BORDER_SOFT }}>
                        <Pembuat item={item} ukuran={32} />
                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{item.komentar}</p>

                        {bolehBalas && balasId !== item.komentar_id && (
                            <button
                                type="button"
                                onClick={() => setBalasId(item.komentar_id)}
                                className="mt-2 font-mono text-[11px] tracking-wider hover:underline"
                                style={{ color: ACCENT }}
                            >
                                BALAS
                            </button>
                        )}

                        {balasId === item.komentar_id && (
                            <FormBalas komentarId={item.komentar_id} onSelesai={() => setBalasId(null)} />
                        )}

                        {item.balasan && item.balasan.length > 0 && (
                            <div className="mt-3 flex flex-col gap-3 border-l-2 pl-4" style={{ borderColor: BORDER_SOFT }}>
                                {item.balasan.map((balasan) => (
                                    <div key={balasan.komentar_id}>
                                        <Pembuat item={balasan} ukuran={24} />
                                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{balasan.komentar}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Panel>
    );
}
