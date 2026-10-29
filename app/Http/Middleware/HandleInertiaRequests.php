<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'reset_password' => fn () => $request->session()->get('reset_password'),
            ],
            // Data ikon lonceng (user yang login saja). Dibungkus try/catch supaya situs tetap jalan
            // walau tabel notifications belum dibuat (mis. kode sudah diunggah tapi migration belum dijalankan).
            'notifikasi' => fn () => $this->dataNotifikasi($request),
        ];
    }

    private function dataNotifikasi(Request $request): ?array
    {
        $user = $request->user();

        if (! $user) {
            return null;
        }

        try {
            return [
                'belumDibaca' => $user->unreadNotifications()->count(),
                'terbaru' => $user->notifications()->latest()->limit(8)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'dibaca' => $n->read_at !== null,
                    'waktu' => $n->created_at,
                    'jenis' => $n->data['jenis'] ?? '',
                    'disetujui' => (bool) ($n->data['disetujui'] ?? false),
                    'judul' => $n->data['judul'] ?? '',
                    'catatan' => $n->data['catatan'] ?? null,
                ])->values(),
            ];
        } catch (\Throwable) {
            return null;
        }
    }
}