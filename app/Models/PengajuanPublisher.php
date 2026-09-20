<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanPublisher extends Model
{
    protected $table = 'pengajuan_publisher';
    protected $primaryKey = 'pengajuan_id';

    protected $fillable = [
        'user_id',
        'portofolio_teks',
        'portofolio_file',
        'status',
        'catatan_admin',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}