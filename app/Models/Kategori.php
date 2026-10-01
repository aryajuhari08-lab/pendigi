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
        'parent_id',
    ];

    public function artikel()
    {
        return $this->hasMany(Artikel::class, 'kategori_id', 'kategori_id');
    }

    // Kategori induk (null kalau ini kategori utama, bukan sub-kategori)
    public function parent()
    {
        return $this->belongsTo(Kategori::class, 'parent_id', 'kategori_id');
    }

    // Daftar sub-kategori di bawah kategori ini
    public function children()
    {
        return $this->hasMany(Kategori::class, 'parent_id', 'kategori_id');
    }

    public function scopeUtama($query)
    {
        return $query->whereNull('parent_id');
    }
}