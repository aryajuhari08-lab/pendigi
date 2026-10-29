<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cerita extends Model
{
    protected $table = 'cerita';
    protected $primaryKey = 'cerita_id';

    protected $fillable = [
        'user_id',
        'judul_cerita',
        'sinopsis',
        'genre',
        'tag',
        'sampul',
        'rating_usia',
        'status_progres',
        'status',
        'catatan_admin',
    ];

    // Relasi: cerita ditulis oleh satu user (publisher)
    public function penulis()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Relasi: satu cerita punya banyak bab
    public function bab()
    {
        return $this->hasMany(Bab::class, 'cerita_id', 'cerita_id')->orderBy('nomor_bab');
    }

    // Cuma bab yang sudah published, buat ditampilkan ke pembaca umum
    public function babPublished()
    {
        return $this->bab()->where('status', 'published');
    }

    // Relasi: satu cerita punya banyak rating
    public function ratingCerita()
    {
        return $this->hasMany(RatingCerita::class, 'cerita_id', 'cerita_id');
    }

    // Helper: rata-rata rating cerita ini
    // Relasi: daftar like (satu user maksimal satu like per cerita)
    public function likeCerita()
    {
        return $this->hasMany(LikeCerita::class, 'cerita_id', 'cerita_id');
    }

    public function rataRating()
    {
        return $this->ratingCerita()->avg('skor');
    }

    // Helper: tag disimpan dipisah koma di database, di sini diubah jadi array biar gampang dipakai di frontend
    public function getTagArrayAttribute(): array
    {
        if (! $this->tag) {
            return [];
        }

        return array_filter(array_map('trim', explode(',', $this->tag)));
    }

    // Scope: hanya cerita yang sudah published (untuk halaman publik)
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}