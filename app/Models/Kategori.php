<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategori';
    protected $primaryKey = 'kategori_id';

    protected $fillable = [
        'nama_kategori',
        'deskripsi',
    ];

    // Relasi: satu kategori punya banyak artikel
    public function artikel()
    {
        return $this->hasMany(Artikel::class, 'kategori_id', 'kategori_id');
    }
}
