<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bab extends Model
{
    protected $table = 'bab';
    protected $primaryKey = 'bab_id';

    protected $fillable = [
        'cerita_id',
        'nomor_bab',
        'judul_bab',
        'isi_bab',
        'views',
        'status',
        'catatan_admin',
    ];

    // Relasi: satu bab milik satu cerita
    public function cerita()
    {
        return $this->belongsTo(Cerita::class, 'cerita_id', 'cerita_id');
    }

    // Relasi: komentar pembaca pada bab ini
    public function komentar()
    {
        return $this->hasMany(Komentar::class, 'bab_id', 'bab_id');
    }

    // Scope: hanya bab yang sudah published (untuk halaman publik)
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}