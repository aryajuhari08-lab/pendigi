<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadGambarController extends Controller
{
    /**
     * Upload gambar dari dalam editor (CKEditor) untuk disisipkan ke isi artikel atau bab.
     * Mengembalikan URL relatif ("/storage/...") supaya tetap jalan walau APP_URL berbeda dengan alamat yang dibuka.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'upload' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:2048'],
        ], [
            'upload.required' => 'Pilih gambar dulu.',
            'upload.image' => 'File harus berupa gambar.',
            'upload.mimes' => 'Format gambar harus JPG, PNG, WEBP, atau GIF.',
            'upload.max' => 'Ukuran gambar maksimal 2 MB.',
            'upload.uploaded' => 'Gambar gagal diunggah. Ukurannya mungkin melebihi batas server.',
        ]);

        $path = $request->file('upload')->store('konten', 'public');

        return response()->json(['url' => '/storage/'.$path]);
    }
}
