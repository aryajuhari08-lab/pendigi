<?php

namespace App\Notifications;

use App\Models\Artikel;
use App\Models\Bab;
use App\Models\Cerita;
use App\Models\PengajuanPublisher;
use Illuminate\Notifications\Notification;

/**
 * Pemberitahuan untuk penulis (atau pengaju publisher) saat admin menyetujui atau menolak
 * sesuatu. Disimpan di database dan tampil di ikon lonceng; tidak mengirim email, jadi tidak
 * bergantung pada setelan email di hosting.
 */
class KeputusanModerasi extends Notification
{
    public function __construct(
        public string $jenis, // artikel | cerita | bab | pengajuan
        public bool $disetujui,
        public string $judul,
        public ?string $catatan,
        public string $url, // alamat relatif tujuan saat notifikasi diklik
    ) {}

    public static function artikel(Artikel $artikel, bool $disetujui): self
    {
        return new self(
            'artikel',
            $disetujui,
            $artikel->judul_artikel,
            $disetujui ? null : $artikel->catatan_admin,
            $disetujui
                ? route('artikel.show', $artikel->artikel_id, false)
                : route('publisher.artikel.edit', $artikel->artikel_id, false),
        );
    }

    public static function cerita(Cerita $cerita, bool $disetujui): self
    {
        return new self(
            'cerita',
            $disetujui,
            $cerita->judul_cerita,
            $disetujui ? null : $cerita->catatan_admin,
            $disetujui
                ? route('cerita.show', $cerita->cerita_id, false)
                : route('publisher.cerita.kelola', $cerita->cerita_id, false),
        );
    }

    public static function bab(Bab $bab, bool $disetujui): self
    {
        return new self(
            'bab',
            $disetujui,
            "{$bab->cerita->judul_cerita} · Bab {$bab->nomor_bab}",
            $disetujui ? null : $bab->catatan_admin,
            $disetujui
                ? route('cerita.baca', [$bab->cerita_id, $bab->bab_id], false)
                : route('publisher.bab.edit', $bab->bab_id, false),
        );
    }

    public static function pengajuan(PengajuanPublisher $pengajuan, bool $disetujui): self
    {
        return new self(
            'pengajuan',
            $disetujui,
            'Pengajuan Publisher',
            $disetujui ? null : $pengajuan->catatan_admin,
            $disetujui ? route('dashboard', [], false) : route('profile.edit', [], false),
        );
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'jenis' => $this->jenis,
            'disetujui' => $this->disetujui,
            'judul' => $this->judul,
            'catatan' => $this->catatan,
            'url' => $this->url,
        ];
    }
}
