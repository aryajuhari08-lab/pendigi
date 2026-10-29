import { Button, Field, inputClass, inputStyle, Panel } from '@/Components/PendigiUI';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const closeModal = () => {
        setConfirming(false);
        clearErrors();
        reset();
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <Panel
            title="HAPUS AKUN"
            description="Setelah akun dihapus, semua data dan tulisan milikmu ikut terhapus permanen dan tidak bisa dikembalikan."
        >
            <Button variant="danger" onClick={() => setConfirming(true)}>
                HAPUS AKUN SAYA
            </Button>

            <Modal show={confirming} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="font-mono text-sm font-bold tracking-wider" style={{ color: '#a8265c' }}>
                        // YAKIN HAPUS AKUN?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Semua data akunmu akan dihapus permanen. Masukkan password untuk mengonfirmasi.
                    </p>

                    <div className="mt-5">
                        <Field label="Password" htmlFor="hapus_password" error={errors.password}>
                            <input
                                id="hapus_password"
                                ref={passwordInput}
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoFocus
                                className={inputClass}
                                style={inputStyle}
                            />
                        </Field>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={closeModal}>
                            BATAL
                        </Button>
                        <Button type="submit" variant="danger" disabled={processing}>
                            HAPUS AKUN
                        </Button>
                    </div>
                </form>
            </Modal>
        </Panel>
    );
}
