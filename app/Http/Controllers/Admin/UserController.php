<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::select('user_id', 'nama_lengkap', 'email', 'role', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => ['required', Rule::in(['admin', 'publisher', 'reader'])],
        ]);

        if ($user->user_id === $request->user()->user_id) {
            return back()->with('error', 'Kamu tidak bisa mengubah role akun sendiri.');
        }

        $user->update(['role' => $request->role]);

        return back()->with('success', 'Role user berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->user_id === $request->user()->user_id) {
            return back()->with('error', 'Kamu tidak bisa menghapus akun sendiri.');
        }

        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}