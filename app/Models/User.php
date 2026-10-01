<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'nama_lengkap',
        'email',
        'nis',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    // Relasi: satu user (publisher) bisa punya banyak artikel
    public function artikel()
    {
        return $this->hasMany(Artikel::class, 'user_id', 'user_id');
    }

    // Relasi: satu user bisa memberi banyak komentar
    public function komentar()
    {
        return $this->hasMany(Komentar::class, 'user_id', 'user_id');
    }

    // Relasi: satu user bisa memberi banyak like
    public function likes()
    {
        return $this->hasMany(Likes::class, 'user_id', 'user_id');
    }

    // Relasi: satu user bisa memberi banyak rating
    public function rating()
    {
        return $this->hasMany(Rating::class, 'user_id', 'user_id');
    }

    // Relasi: satu user (publisher) bisa punya banyak cerita
    public function cerita()
    {
        return $this->hasMany(Cerita::class, 'user_id', 'user_id');
    }

    // Relasi: satu user bisa memberi banyak rating cerita
    public function ratingCerita()
    {
        return $this->hasMany(RatingCerita::class, 'user_id', 'user_id');
    }

    // Helper cek role
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPublisher(): bool
    {
        return $this->role === 'publisher';
    }

    public function isReader(): bool
    {
        return $this->role === 'reader';
    }
}