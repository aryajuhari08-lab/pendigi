import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

// Token tema Pendigi (panel bersudut terpotong ala terminal) dipakai bersama oleh halaman-halaman baru.
export const ACCENT = '#a8265c';
export const BORDER = '#c9829d';
export const BORDER_SOFT = '#e3c7d2';

export const clipPanel: CSSProperties = {
    clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
};
export const clipPanelSm: CSSProperties = {
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
};

export const inputClass = 'w-full bg-[#faf7f8] px-3 py-2 text-sm text-gray-700 focus:outline-none';
export const inputStyle: CSSProperties = { ...clipPanelSm, border: `1px solid ${BORDER}` };

export function Panel({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="bg-white p-6 shadow-sm" style={{ ...clipPanel, border: `1px solid ${BORDER_SOFT}` }}>
            <header className="border-b pb-3" style={{ borderColor: '#f0dee5' }}>
                <h2 className="font-mono text-xs font-bold tracking-wider" style={{ color: ACCENT }}>
                    // {title}
                </h2>
                {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </header>
            <div className="mt-5">{children}</div>
        </section>
    );
}

export function Field({
    label,
    htmlFor,
    hint,
    error,
    children,
}: {
    label: string;
    htmlFor?: string;
    hint?: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1 block font-mono text-[11px] tracking-wider text-gray-500">
                // {label}
                {hint && <span className="ml-2 normal-case text-gray-400">{hint}</span>}
            </label>
            {children}
            {error && (
                <p className="mt-1 font-mono text-[11px]" style={{ color: ACCENT }}>
                    {error}
                </p>
            )}
        </div>
    );
}

type Variant = 'primary' | 'ghost' | 'danger';

export function Button({
    variant = 'primary',
    className = '',
    style,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
    const look: Record<Variant, CSSProperties> = {
        primary: { backgroundColor: ACCENT, color: '#fff' },
        ghost: { border: `1px solid ${BORDER}`, color: ACCENT, backgroundColor: '#fff' },
        danger: { backgroundColor: '#7a1f3d', color: '#fff' },
    };
    return (
        <button
            {...props}
            className={`px-5 py-2 font-mono text-xs tracking-wider transition hover:opacity-90 disabled:opacity-40 ${className}`}
            style={{ ...clipPanelSm, ...look[variant], ...style }}
        />
    );
}

export function Notice({ tone, children }: { tone: 'success' | 'error'; children: ReactNode }) {
    return (
        <div
            className="p-3 font-mono text-xs"
            style={{
                ...clipPanelSm,
                backgroundColor: tone === 'success' ? '#eaf6ee' : '#fbeaef',
                color: tone === 'success' ? '#1f7a3f' : ACCENT,
            }}
        >
            {children}
        </div>
    );
}

export function SavedMark({ show }: { show: boolean }) {
    return (
        <span
            className={`font-mono text-[11px] tracking-wider transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
            style={{ color: '#1f7a3f' }}
            aria-live="polite"
        >
            TERSIMPAN
        </span>
    );
}
