<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $table = 'rating';
    protected $primaryKey = 'rating_id';

    protected $fillable = [
        'artikel_id',
        'user_id',
        'skor',
    ];

    // Relasi: rating ini untuk satu artikel
    public function artikel()
    {
        return $this->belongsTo(Artikel::class, 'artikel_id', 'artikel_id');
    }

    // Relasi: rating ini dari satu user (opsional, bisa null kalau belum login)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
