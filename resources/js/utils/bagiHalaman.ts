// Memecah isi bab (HTML) menjadi beberapa halaman agar pembaca tidak perlu scroll sangat panjang.
// Pemecahan dilakukan di browser, hanya di batas antar-blok (paragraf, heading, gambar, dst.),
// jadi tidak ada kalimat atau tabel yang terpotong, dan tidak butuh perubahan database.

export const TARGET_KATA = 650; // kira-kira kata per halaman
export const AMBANG_KATA = 1000; // bab sependek ini tetap satu halaman
export const BOBOT_MEDIA = 120; // gambar/tabel/video dihitung setara sekian kata

export interface Blok {
    html: string;
    tag: string;
    kata: number;
    media: boolean;
}

export function hitungKata(teks: string | null | undefined): number {
    return (teks ?? '').split(/\s+/).filter(Boolean).length;
}

const escapeHtml = (teks: string) =>
    teks.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Hanya jalan di browser (butuh DOMParser).
export function ekstrakBlok(html: string): Blok[] {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const hasil: Blok[] = [];

    Array.from(doc.body.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            hasil.push({
                html: el.outerHTML,
                tag: el.tagName,
                kata: hitungKata(el.textContent),
                media: el.querySelector('img, iframe, table') !== null,
            });
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            // Teks yang tidak terbungkus elemen dijadikan paragraf supaya tetap tampil rapi
            hasil.push({
                html: `<p>${escapeHtml(node.textContent)}</p>`,
                tag: 'P',
                kata: hitungKata(node.textContent),
                media: false,
            });
        }
    });

    return hasil;
}

const bobot = (b: Blok) => b.kata + (b.media ? BOBOT_MEDIA : 0);
const adalahHeading = (b: Blok) => /^H[1-6]$/.test(b.tag);

// Mengembalikan daftar halaman (masing-masing string HTML). Selalu minimal satu halaman.
export function bagiBlok(blok: Blok[]): string[] {
    const total = blok.reduce((n, b) => n + bobot(b), 0);

    if (total <= AMBANG_KATA) {
        return [blok.map((b) => b.html).join('')];
    }

    // Bagi rata: jumlah halaman dari target, lalu tiap halaman diisi mendekati ukuran idealnya,
    // sehingga halaman terakhir tidak tinggal sepotong kecil.
    const jumlah = Math.ceil(total / TARGET_KATA);
    const ideal = total / jumlah;

    const halaman: string[] = [];
    let sekarang: Blok[] = [];
    let isi = 0;

    for (const b of blok) {
        // Pindah halaman kalau menambah blok ini membuat halaman melewati ukuran ideal
        // (batas dipilih yang paling dekat dengan ideal).
        if (sekarang.length > 0 && isi + bobot(b) / 2 > ideal && halaman.length < jumlah - 1) {
            // Heading tidak boleh menggantung sendirian di ujung halaman: ikut ke halaman berikutnya.
            let terbawa: Blok | null = null;
            if (sekarang.length > 1 && adalahHeading(sekarang[sekarang.length - 1])) {
                terbawa = sekarang.pop() as Blok;
            }
            halaman.push(sekarang.map((x) => x.html).join(''));
            sekarang = terbawa ? [terbawa] : [];
            isi = terbawa ? bobot(terbawa) : 0;
        }
        sekarang.push(b);
        isi += bobot(b);
    }

    halaman.push(sekarang.map((x) => x.html).join(''));
    return halaman;
}
