<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RatingCerita extends Model
{
    protected $table = 'rating_cerita';
    protected $primaryKey = 'rating_cerita_id';

    protected $fillable = [
        'cerita_id',
        'user_id',
        'skor',
    ];

    public function cerita()
    {
        return $this->belongsTo(Cerita::class, 'cerita_id', 'cerita_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}