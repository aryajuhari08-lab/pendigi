<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaftarNis extends Model
{
    protected $table = 'daftar_nis';
    protected $primaryKey = 'nis_id';

    protected $fillable = [
        'nis',
        'nama_siswa',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}