import Modal from '@/Components/Modal';
import { ReactNode } from 'react';

const clipPanelSm = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };
const ACCENT = '#a8265c';
const BORDER = '#c9829d';
const HIJAU = '#1f7a3f';

// Cuplikan teks polos dari HTML (isi artikel/bab dari CKEditor berupa HTML)
export const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export function Info({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-wider text-gray-400">// {label}</p>
            <div className="mt-0.5 break-words text-sm text-gray-700">{children}</div>
        </div>
    );
}

export function CatatanSebelumnya({ catatan }: { catatan?: string | null }) {
    if (!catatan) return null;
    return (
        <div className="p-3 text-sm" style={{ ...clipPanelSm, border: `1px solid ${ACCENT}`, color: ACCENT }}>
            <p className="font-mono text-[10px] tracking-wider">CATATAN PENOLAKAN SEBELUMNYA</p>
            <p className="mt-1 text-gray-600">{catatan}</p>
        </div>
    );
}

export function formatTanggal(waktu?: string | null) {
    if (!waktu) return '-';
    return new Date(waktu).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function DetailModerasi({
    show,
    onClose,
    jenis,
    judul,
    onApprove,
    onReject,
    children,
}: {
    show: boolean;
    onClose: () => void;
    jenis: string;
    judul: string;
    onApprove: () => void;
    onReject: () => void;
    children: ReactNode;
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="flex max-h-[88vh] flex-col">
                <div className="flex items-start justify-between gap-4 border-b p-5" style={{ borderColor: '#f0dee5' }}>
                    <div className="min-w-0">
                        <p className="font-mono text-[11px] font-bold tracking-wider" style={{ color: ACCENT }}>
                            // DETAIL {jenis.toUpperCase()}
                        </p>
                        <h3 className="mt-1 break-words text-lg font-semibold text-gray-800">{judul}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="shrink-0 font-mono text-lg leading-none text-gray-400 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">{children}</div>

                <div className="flex flex-wrap justify-end gap-2 border-t p-4" style={{ borderColor: '#f0dee5' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 font-mono text-[11px] tracking-wider text-gray-500 transition hover:bg-gray-50"
                        style={{ ...clipPanelSm, border: `1px solid ${BORDER}` }}
                    >
                        TUTUP
                    </button>
                    <button
                        type="button"
                        onClick={onReject}
                        className="px-4 py-1.5 font-mono text-[11px] tracking-wider transition hover:bg-[#fbeaef]"
                        style={{ ...clipPanelSm, border: `1px solid ${ACCENT}`, color: ACCENT }}
                    >
                        REJECT
                    </button>
                    <button
                        type="button"
                        onClick={onApprove}
                        className="px-4 py-1.5 font-mono text-[11px] tracking-wider transition hover:bg-[#eaf6ee]"
                        style={{ ...clipPanelSm, border: `1px solid ${HIJAU}`, color: HIJAU }}
                    >
                        APPROVE
                    </button>
                </div>
            </div>
        </Modal>
    );
}
