<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Komentar extends Model
{
    protected $table = 'komentar';
    protected $primaryKey = 'komentar_id';

    // Tabel ini cuma punya kolom create_at, tidak ada updated_at
    const CREATED_AT = 'create_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'artikel_id',
        'bab_id',
        'parent_id',
        'komentar',
        'status',
        'direview_oleh',
        'direview_pada',
    ];

    protected $casts = [
        'direview_pada' => 'datetime',
    ];

    // Relasi: komentar ditulis oleh satu user (reader atau publisher yang membalas)
    public function penulis()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Relasi: komentar ini milik satu artikel
    public function artikel()
    {
        return $this->belongsTo(Artikel::class, 'artikel_id', 'artikel_id');
    }

    // Relasi: komentar ini milik satu bab cerita (kalau bukan komentar artikel)
    public function bab()
    {
        return $this->belongsTo(Bab::class, 'bab_id', 'bab_id');
    }

    // Relasi: admin yang menyetujui/menolak komentar ini
    public function peninjau()
    {
        return $this->belongsTo(User::class, 'direview_oleh', 'user_id');
    }

    // Relasi: komentar ini adalah balasan dari komentar lain (kalau ada)
    public function induk()
    {
        return $this->belongsTo(Komentar::class, 'parent_id', 'komentar_id');
    }

    // Relasi: daftar balasan untuk komentar ini (misal balasan publisher)
    public function balasan()
    {
        return $this->hasMany(Komentar::class, 'parent_id', 'komentar_id');
    }

    // Scope: hanya komentar yang sudah disetujui admin (untuk tampil di halaman publik)
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
