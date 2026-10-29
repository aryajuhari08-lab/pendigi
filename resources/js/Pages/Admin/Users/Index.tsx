import Avatar from '@/Components/Avatar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

interface UserItem {
    user_id: number;
    nama_lengkap: string;
    email: string;
    role: string;
    foto_profil: string | null;
    created_at: string;
}

// Panel bersudut terpotong ala Rhodes Island terminal - konsisten dengan Home.tsx
const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';

export default function Index({ users }: { users: UserItem[] }) {
    const roleBadge = (role: string) => {
        const styles: Record<string, { bg: string; text: string }> = {
            admin: { bg: '#f0d9ee', text: '#7a1f8a' },
            publisher: { bg: '#d9e6f5', text: '#1f4e8a' },
            reader: { bg: '#e5e7eb', text: '#4b5563' },
        };
        return styles[role] ?? styles.reader;
    };

    const handleRoleChange = (userId: number, role: string) => {
        router.put(route('admin.users.role', userId), { role });
    };

    const handleDelete = (userId: number, nama: string) => {
        if (confirm(`Hapus user "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
            router.delete(route('admin.users.destroy', userId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-mono text-lg font-bold tracking-widest" style={{ color: ACCENT }}>
                    KELOLA USER
                </h2>
            }
        >
            <Head title="Kelola User" />

            <div
                className="min-h-screen py-10"
                style={{
                    backgroundColor: '#ede3e6',
                    backgroundImage:
                        'linear-gradient(#ddc2cb 1px, transparent 1px), linear-gradient(90deg, #ddc2cb 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <div className="mx-auto max-w-5xl px-4">
                    <div className="overflow-hidden bg-white" style={{ ...clipPanel, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 20px rgba(120,30,60,0.14)' }}>
                        <table className="min-w-full divide-y text-sm" style={{ borderColor: '#f0dee5' }}>
                            <thead className="text-left font-mono text-[11px] tracking-wider text-gray-400" style={{ backgroundColor: '#faf7f8' }}>
                                <tr>
                                    <th className="px-4 py-3">NAMA</th>
                                    <th className="px-4 py-3">EMAIL</th>
                                    <th className="px-4 py-3">ROLE</th>
                                    <th className="px-4 py-3">TERDAFTAR</th>
                                    <th className="px-4 py-3">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: '#f0dee5' }}>
                                {users.map((user) => {
                                    const badge = roleBadge(user.role);
                                    return (
                                        <tr key={user.user_id}>
                                            <td className="px-4 py-3 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Avatar nama={user.nama_lengkap} foto={user.foto_profil} size={32} />
                                                    <span>{user.nama_lengkap}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                                    className="border-0 px-2 py-1 font-mono text-[11px] tracking-wider"
                                                    style={{ backgroundColor: badge.bg, color: badge.text }}
                                                >
                                                    <option value="admin">ADMIN</option>
                                                    <option value="publisher">PUBLISHER</option>
                                                    <option value="reader">READER</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-gray-400">
                                                {new Date(user.created_at).toLocaleDateString('id-ID').replace(/\//g, '.')}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                <button
                                                    onClick={() => handleDelete(user.user_id, user.nama_lengkap)}
                                                    className="hover:underline"
                                                    style={{ color: ACCENT }}
                                                >
                                                    HAPUS
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}