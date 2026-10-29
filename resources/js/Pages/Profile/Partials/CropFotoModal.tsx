import Modal from '@/Components/Modal';
import { ACCENT, Button } from '@/Components/PendigiUI';
import { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';

const VIEW = 280; // sisi area potong (px)
const OUT = 512; // sisi gambar hasil (px)

interface Pos {
    x: number;
    y: number;
}

function CropBody({
    file,
    onClose,
    onSave,
    processing,
    error,
}: {
    file: File;
    onClose: () => void;
    onSave: (blob: Blob) => void;
    processing: boolean;
    error?: string;
}) {
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [src, setSrc] = useState('');
    const [gagalMuat, setGagalMuat] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
    const [grid, setGrid] = useState(true);
    const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

    // Skala dasar: gambar menutupi seluruh area potong (seperti object-fit: cover)
    const base = img ? Math.max(VIEW / img.naturalWidth, VIEW / img.naturalHeight) : 1;
    const scale = base * zoom;
    const lebar = img ? img.naturalWidth * scale : 0;
    const tinggi = img ? img.naturalHeight * scale : 0;

    // Posisi dibatasi supaya tidak ada ruang kosong di dalam area potong
    const batasi = (p: Pos, s: number): Pos => {
        if (!img) return p;
        const minX = VIEW - img.naturalWidth * s;
        const minY = VIEW - img.naturalHeight * s;
        return { x: Math.min(0, Math.max(minX, p.x)), y: Math.min(0, Math.max(minY, p.y)) };
    };

    useEffect(() => {
        const url = URL.createObjectURL(file);
        const im = new Image();
        im.onload = () => {
            const b = Math.max(VIEW / im.naturalWidth, VIEW / im.naturalHeight);
            setPos({ x: (VIEW - im.naturalWidth * b) / 2, y: (VIEW - im.naturalHeight * b) / 2 });
            setZoom(1);
            setImg(im);
            setSrc(url);
        };
        im.onerror = () => setGagalMuat(true);
        im.src = url;
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const ubahZoom = (z: number) => {
        if (!img) return;
        // Pertahankan titik tengah yang sedang terlihat
        const cx = (VIEW / 2 - pos.x) / scale;
        const cy = (VIEW / 2 - pos.y) / scale;
        const s = base * z;
        setPos(batasi({ x: VIEW / 2 - cx * s, y: VIEW / 2 - cy * s }, s));
        setZoom(z);
    };

    const mulaiGeser = (e: PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
    };
    const geser = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        if (!d) return;
        setPos(batasi({ x: d.ox + e.clientX - d.px, y: d.oy + e.clientY - d.py }, scale));
    };
    const selesaiGeser = () => {
        drag.current = null;
    };

    const geserLewatKeyboard = (e: KeyboardEvent<HTMLDivElement>) => {
        const langkah = 10;
        const arah: Record<string, Pos> = {
            ArrowLeft: { x: langkah, y: 0 },
            ArrowRight: { x: -langkah, y: 0 },
            ArrowUp: { x: 0, y: langkah },
            ArrowDown: { x: 0, y: -langkah },
        };
        const d = arah[e.key];
        if (!d) return;
        e.preventDefault();
        setPos((p) => batasi({ x: p.x + d.x, y: p.y + d.y }, scale));
    };

    const simpan = () => {
        if (!img) return;
        const canvas = document.createElement('canvas');
        canvas.width = OUT;
        canvas.height = OUT;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, OUT, OUT);
        ctx.drawImage(img, -pos.x / scale, -pos.y / scale, VIEW / scale, VIEW / scale, 0, 0, OUT, OUT);
        canvas.toBlob((blob) => blob && onSave(blob), 'image/jpeg', 0.9);
    };

    const r = VIEW / 2;

    return (
        <div className="p-6">
            <h2 className="font-mono text-sm font-bold tracking-wider" style={{ color: ACCENT }}>
                // ATUR FOTO PROFIL
            </h2>
            <p className="mt-1 text-sm text-gray-500">Geser foto dan atur zoom sampai pas di dalam lingkaran.</p>

            {gagalMuat ? (
                <p className="mt-6 text-sm" style={{ color: ACCENT }}>
                    Foto tidak bisa dibuka. Coba pilih file gambar lain.
                </p>
            ) : (
                <>
                    <div className="mt-5 flex justify-center">
                        <div
                            tabIndex={0}
                            role="application"
                            aria-label="Area potong foto. Gunakan tombol panah untuk menggeser."
                            onPointerDown={mulaiGeser}
                            onPointerMove={geser}
                            onPointerUp={selesaiGeser}
                            onPointerCancel={selesaiGeser}
                            onKeyDown={geserLewatKeyboard}
                            className="relative cursor-grab overflow-hidden bg-gray-900 outline-offset-2 active:cursor-grabbing"
                            style={{ width: VIEW, height: VIEW, touchAction: 'none' }}
                        >
                            {img && (
                                <img
                                    src={src}
                                    alt=""
                                    draggable={false}
                                    style={{
                                        position: 'absolute',
                                        left: pos.x,
                                        top: pos.y,
                                        width: lebar,
                                        height: tinggi,
                                        maxWidth: 'none',
                                        userSelect: 'none',
                                        pointerEvents: 'none',
                                    }}
                                />
                            )}

                            <svg width={VIEW} height={VIEW} className="pointer-events-none absolute inset-0" aria-hidden="true">
                                <defs>
                                    <mask id="lubang-crop">
                                        <rect width={VIEW} height={VIEW} fill="white" />
                                        <circle cx={r} cy={r} r={r - 1} fill="black" />
                                    </mask>
                                    <clipPath id="klip-crop">
                                        <circle cx={r} cy={r} r={r - 1} />
                                    </clipPath>
                                </defs>
                                <rect width={VIEW} height={VIEW} fill="rgba(20,8,14,0.6)" mask="url(#lubang-crop)" />
                                {grid && (
                                    <g clipPath="url(#klip-crop)" stroke="rgba(255,255,255,0.7)" strokeWidth="1">
                                        <line x1={VIEW / 3} y1="0" x2={VIEW / 3} y2={VIEW} />
                                        <line x1={(VIEW * 2) / 3} y1="0" x2={(VIEW * 2) / 3} y2={VIEW} />
                                        <line x1="0" y1={VIEW / 3} x2={VIEW} y2={VIEW / 3} />
                                        <line x1="0" y1={(VIEW * 2) / 3} x2={VIEW} y2={(VIEW * 2) / 3} />
                                    </g>
                                )}
                                <circle cx={r} cy={r} r={r - 1} fill="none" stroke="white" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>

                    <div className="mx-auto mt-5 flex max-w-[280px] items-center gap-3">
                        <span className="font-mono text-[10px] tracking-wider text-gray-400">ZOOM</span>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => ubahZoom(parseFloat(e.target.value))}
                            aria-label="Zoom"
                            className="flex-1"
                            style={{ accentColor: ACCENT }}
                        />
                    </div>

                    <label className="mx-auto mt-3 flex max-w-[280px] cursor-pointer items-center gap-2 font-mono text-[11px] tracking-wider text-gray-500">
                        <input
                            type="checkbox"
                            checked={grid}
                            onChange={(e) => setGrid(e.target.checked)}
                            style={{ accentColor: ACCENT }}
                        />
                        TAMPILKAN GRID 3×3
                    </label>
                </>
            )}

            {error && (
                <p className="mt-4 font-mono text-[11px]" style={{ color: ACCENT }}>
                    {error}
                </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose} disabled={processing}>
                    BATAL
                </Button>
                <Button type="button" onClick={simpan} disabled={!img || processing}>
                    {processing ? 'MENGUNGGAH...' : 'SIMPAN FOTO'}
                </Button>
            </div>
        </div>
    );
}

export default function CropFotoModal({
    file,
    onClose,
    onSave,
    processing,
    error,
}: {
    file: File | null;
    onClose: () => void;
    onSave: (blob: Blob) => void;
    processing: boolean;
    error?: string;
}) {
    return (
        <Modal show={file !== null} onClose={processing ? () => {} : onClose} maxWidth="sm">
            {file && (
                <CropBody
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    file={file}
                    onClose={onClose}
                    onSave={onSave}
                    processing={processing}
                    error={error}
                />
            )}
        </Modal>
    );
}
