import { ACCENT, BORDER, Button, clipPanelSm, Field, inputClass, inputStyle, Panel } from '@/Components/PendigiUI';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, ReactNode } from 'react';

export interface PengajuanTerakhir {
    pengajuan_id: number;
    status: 'pending' | 'approved' | 'rejected';
    catatan_admin: string | null;
    created_at: string;
}

function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function KotakInfo({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#faf7f8] p-4 text-sm text-gray-600" style={{ ...clipPanelSm, border: `1px dashed ${BORDER}` }}>
            {children}
        </div>
    );
}

export default function PengajuanPublisherForm({ pengajuan }: { pengajuan: PengajuanTerakhir | null }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, errors, reset } = useForm({
        portofolio_teks: '',
        portofolio_file: null as File | null,
    });

    // Admin tidak perlu mengajukan
    if (user.role === 'admin') return null;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.pengajuan'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    let isi: ReactNode;

    if (user.role === 'publisher') {
        isi = (
            <KotakInfo>
                Kamu sudah menjadi <strong>Publisher</strong>. Kamu bisa menulis artikel dan cerita dari Dashboard.
            </KotakInfo>
        );
    } else if (pengajuan?.status === 'pending') {
        isi = (
            <KotakInfo>
                Pengajuanmu dikirim pada {formatTanggal(pengajuan.created_at)} dan{' '}
                <strong>sedang menunggu ditinjau admin</strong>. Kamu akan menjadi Publisher begitu disetujui.
            </KotakInfo>
        );
    } else {
        isi = (
            <form onSubmit={submit} className="flex flex-col gap-5">
                {pengajuan?.status === 'rejected' && (
                    <div className="bg-white p-4 text-sm" style={{ ...clipPanelSm, border: `1px solid ${ACCENT}`, color: ACCENT }}>
                        <p className="font-semibold">Pengajuan sebelumnya ditolak.</p>
                        {pengajuan.catatan_admin && <p className="mt-1 text-gray-600">Catatan admin: {pengajuan.catatan_admin}</p>}
                        <p className="mt-1 text-gray-600">Kamu boleh mengajukan lagi dengan data yang diperbarui.</p>
                    </div>
                )}

                <Field label="Bio dan Pengalaman Menulis" htmlFor="portofolio_teks" error={errors.portofolio_teks}>
                    <textarea
                        id="portofolio_teks"
                        value={data.portofolio_teks}
                        onChange={(e) => setData('portofolio_teks', e.target.value)}
                        rows={5}
                        maxLength={2000}
                        placeholder="Ceritakan dirimu dan pengalaman menulismu: pernah menulis di mading, blog, lomba, dan sebagainya. Kamu juga bisa menempel link karyamu di sini."
                        className={inputClass}
                        style={inputStyle}
                    />
                    <p className="mt-1 font-mono text-[10px] tracking-wider text-gray-400">
                        {data.portofolio_teks.length} / 2000 KARAKTER
                    </p>
                </Field>

                <Field
                    label="File Portofolio"
                    htmlFor="portofolio_file"
                    hint="(opsional, PDF/DOC/DOCX, maks 2 MB)"
                    error={errors.portofolio_file}
                >
                    <input
                        id="portofolio_file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setData('portofolio_file', e.target.files?.[0] ?? null)}
                        className="w-full font-mono text-xs text-gray-500 file:mr-3 file:border-0 file:bg-[#a8265c] file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:tracking-wider file:text-white"
                    />
                </Field>

                <div>
                    <Button type="submit" disabled={processing}>
                        KIRIM PENGAJUAN
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <Panel
            title="DAFTAR JADI PUBLISHER"
            description="Publisher bisa menulis artikel dan cerita di Pendigi. Pengajuanmu ditinjau admin terlebih dahulu."
        >
            {isi}
        </Panel>
    );
}
