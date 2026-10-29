import { Button, Field, inputClass, inputStyle, Panel, SavedMark } from '@/Components/PendigiUI';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Panel title="GANTI PASSWORD" description="Pakai password yang panjang dan sulit ditebak supaya akunmu aman.">
            <form onSubmit={updatePassword} className="flex flex-col gap-5">
                <Field label="Password Saat Ini" htmlFor="current_password" error={errors.current_password}>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        className={inputClass}
                        style={inputStyle}
                    />
                </Field>

                <Field label="Password Baru" htmlFor="password" error={errors.password}>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        className={inputClass}
                        style={inputStyle}
                    />
                </Field>

                <Field label="Konfirmasi Password Baru" htmlFor="password_confirmation" error={errors.password_confirmation}>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        className={inputClass}
                        style={inputStyle}
                    />
                </Field>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        SIMPAN
                    </Button>
                    <SavedMark show={recentlySuccessful} />
                </div>
            </form>
        </Panel>
    );
}
