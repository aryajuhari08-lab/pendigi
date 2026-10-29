<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    protected $table = 'bookmark';
    protected $primaryKey = 'bookmark_id';

    protected $fillable = ['user_id', 'artikel_id', 'cerita_id'];

    public function artikel()
    {
        return $this->belongsTo(Artikel::class, 'artikel_id', 'artikel_id');
    }

    public function cerita()
    {
        return $this->belongsTo(Cerita::class, 'cerita_id', 'cerita_id');
    }
}
