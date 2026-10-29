const ACCENT = '#a8265c';

// Lingkaran foto profil. Kalau belum punya foto, tampil huruf pertama nama.
export default function Avatar({
    nama,
    foto,
    size = 40,
    className = '',
}: {
    nama: string;
    foto?: string | null;
    size?: number;
    className?: string;
}) {
    const inisial = nama.trim().charAt(0).toUpperCase() || '?';

    return foto ? (
        <img
            src={`/storage/${foto}`}
            alt={nama}
            width={size}
            height={size}
            className={`shrink-0 rounded-full object-cover ${className}`}
            style={{ width: size, height: size }}
        />
    ) : (
        <span
            aria-hidden="true"
            className={`inline-flex shrink-0 items-center justify-center rounded-full font-mono font-bold text-white ${className}`}
            style={{ width: size, height: size, backgroundColor: ACCENT, fontSize: Math.round(size * 0.4) }}
        >
            {inisial}
        </span>
    );
}
