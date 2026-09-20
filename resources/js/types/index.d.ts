export interface User {
    user_id: number;
    nama_lengkap: string;
    email: string;
    role: 'admin' | 'publisher' | 'reader';
    email_verified_at?: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};