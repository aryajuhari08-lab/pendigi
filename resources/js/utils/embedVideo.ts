// Server menyimpan video dalam satu bentuk baku (lihat App\Support\KontenBersih), jadi pola ini sengaja ketat:
// hanya YouTube dengan ID 11 karakter yang diubah menjadi pemutar, selain itu tidak disentuh.
const POLA_VIDEO =
    /<figure class="media"><oembed url="https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})"><\/oembed><\/figure>/g;

export function embedVideo(html: string): string {
    return html.replace(
        POLA_VIDEO,
        (_cocok, id: string) =>
            `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="Video YouTube" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
    );
}
