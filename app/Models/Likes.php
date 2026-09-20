<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Likes extends Model
{
    protected $table = 'likes';
    protected $primaryKey = 'sukai_id';

    protected $fillable = [
        'artikel_id',
        'user_id',
        'anon_identifier',
    ];

    // Relasi: like ini untuk satu artikel
    public function artikel()
    {
        return $this->belongsTo(Artikel::class, 'artikel_id', 'artikel_id');
    }

    // Relasi: like ini dari satu user (opsional, bisa null kalau belum login)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
