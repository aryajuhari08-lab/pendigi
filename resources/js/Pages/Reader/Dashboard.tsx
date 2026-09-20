import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow sm:rounded-lg">
                        <p className="text-gray-600">
                            Selamat datang, Jelajahi artikel terbaru dari Pendigi!
                        </p>
                        <Link
                            href={route('home')}
                            className="mt-4 inline-block rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                            Lihat artikel
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
