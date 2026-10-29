<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatBaca extends Model
{
    protected $table = 'riwayat_baca';
    protected $primaryKey = 'riwayat_id';

    protected $fillable = ['user_id', 'artikel_id', 'cerita_id', 'bab_id'];

    public function artikel()
    {
        return $this->belongsTo(Artikel::class, 'artikel_id', 'artikel_id');
    }

    public function cerita()
    {
        return $this->belongsTo(Cerita::class, 'cerita_id', 'cerita_id');
    }

    public function bab()
    {
        return $this->belongsTo(Bab::class, 'bab_id', 'bab_id');
    }
}
