<?php

namespace App\Support;

/**
 * Membersihkan HTML dari editor (artikel & bab) sekaligus menangani video YouTube.
 *
 * Tag <oembed> dari CKEditor tidak boleh lolos mentah, jadi: link YouTube divalidasi dan diambil ID-nya,
 * isi lainnya dibersihkan HTMLPurifier, lalu video ditulis ulang dalam bentuk standar yang kita bangun sendiri
 * dari ID tervalidasi. Bentuk standar itu tetap dikenali editor saat tulisan dibuka untuk diedit,
 * dan diubah menjadi pemutar oleh frontend saat dibaca. Link selain YouTube dibuang.
 */
class KontenBersih
{
    private const HOST_YOUTUBE = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be'];

    public static function bersihkan(string $html): string
    {
        // 1. Lepas pembungkus <figure class="media"> supaya yang tersisa hanya <oembed>
        $html = preg_replace(
            '#<figure[^>]*class="[^"]*\bmedia\b[^"]*"[^>]*>\s*(<oembed\b.*?</oembed>)\s*</figure>#is',
            '$1',
            $html
        ) ?? $html;

        // 2. Ganti tiap <oembed> dengan penanda teks berisi ID YouTube yang valid (atau hapus kalau bukan YouTube)
        $html = preg_replace_callback(
            '#<oembed\b[^>]*?\burl="([^"]*)"[^>]*?(?:/>|>\s*</oembed>)#is',
            function (array $m): string {
                $id = self::idYoutube(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5));

                return $id ? "[[YT:{$id}]]" : '';
            },
            $html
        ) ?? $html;

        // 3. Bersihkan seperti biasa
        $html = clean($html);

        // 4. Penanda -> bentuk standar video
        $video = fn (string $id): string => '<figure class="media"><oembed url="https://www.youtube.com/watch?v='.$id.'"></oembed></figure>';

        $html = preg_replace_callback(
            '#<p>\s*\[\[YT:([A-Za-z0-9_-]{11})\]\]\s*</p>#',
            fn (array $m): string => $video($m[1]),
            $html
        ) ?? $html;

        return preg_replace_callback(
            '#\[\[YT:([A-Za-z0-9_-]{11})\]\]#',
            fn (array $m): string => $video($m[1]),
            $html
        ) ?? $html;
    }

    private static function idYoutube(string $url): ?string
    {
        $bagian = parse_url(trim($url));

        if (! $bagian || ! in_array(strtolower($bagian['scheme'] ?? ''), ['http', 'https'], true)) {
            return null;
        }

        $host = strtolower($bagian['host'] ?? '');
        if (! in_array($host, self::HOST_YOUTUBE, true)) {
            return null;
        }

        $path = $bagian['path'] ?? '';

        if (str_ends_with($host, 'youtu.be')) {
            $id = ltrim($path, '/');
        } elseif (preg_match('#^/(?:embed|shorts|live)/([^/?]+)#', $path, $m)) {
            $id = $m[1];
        } else {
            parse_str($bagian['query'] ?? '', $query);
            $id = $query['v'] ?? null;
        }

        return is_string($id) && preg_match('/^[A-Za-z0-9_-]{11}$/', $id) ? $id : null;
    }
}
