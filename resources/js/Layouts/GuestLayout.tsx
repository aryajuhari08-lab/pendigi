import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

const clipPanel = { clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' };

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div
            className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0"
            style={{
                backgroundColor: '#f5f2f3',
                backgroundImage:
                    'linear-gradient(#ecdfe4 1px, transparent 1px), linear-gradient(90deg, #ecdfe4 1px, transparent 1px)',
                backgroundSize: '24px 24px',
            }}
        >
            <div>
                <Link href="/" className="font-mono text-2xl font-bold tracking-widest" style={{ color: '#a8265c' }}>
                    PENDIGI
                </Link>
            </div>

            <div
                className="mt-6 w-full overflow-hidden bg-white px-6 py-5 shadow-md sm:max-w-md"
                style={{ ...clipPanel, border: '1px solid #e3c7d2' }}
            >
                {children}
            </div>
        </div>
    );
}