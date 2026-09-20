<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artikel extends Model
{
    protected $table = 'artikel';
    protected $primaryKey = 'artikel_id';

    protected $fillable = [
        'user_id',
        'kategori_id',
        'judul_artikel',
        'isi_artikel',
        'sumber',      // baru
        'genre',       // baru
        'gambar',
        'status',
        'catatan_admin',
        'tanggal_publikasi',
        'views',
    ];

    protected $casts = [
        'tanggal_publikasi' => 'datetime',
    ];

    // Relasi: artikel ditulis oleh satu user (publisher)
    public function penulis()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Relasi: artikel masuk ke satu kategori
    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kategori_id', 'kategori_id');
    }

    // Relasi: satu artikel punya banyak komentar
    public function komentar()
    {
        return $this->hasMany(Komentar::class, 'artikel_id', 'artikel_id');
    }

    // Relasi: satu artikel punya banyak like
    public function likes()
    {
        return $this->hasMany(Likes::class, 'artikel_id', 'artikel_id');
    }

    // Relasi: satu artikel punya banyak rating
    public function rating()
    {
        return $this->hasMany(Rating::class, 'artikel_id', 'artikel_id');
    }

    // Helper: rata-rata rating artikel ini
    public function rataRating()
    {
        return $this->rating()->avg('skor');
    }

    // Scope: hanya artikel yang sudah published (untuk halaman reader)
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
