<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LikeCerita extends Model
{
    protected $table = 'like_cerita';
    protected $primaryKey = 'like_cerita_id';

    protected $fillable = ['cerita_id', 'user_id'];
}
