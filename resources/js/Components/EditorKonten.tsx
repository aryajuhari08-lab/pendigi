import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';

interface FileLoader {
    file: Promise<File | null>;
}

// Adapter upload gambar untuk CKEditor: kirim file ke endpoint Laravel dan pakai URL yang dikembalikan.
// Pesan error yang ditolak (reject) berupa teks, karena CKEditor menampilkannya apa adanya ke penulis.
class UploadAdapter {
    private controller = new AbortController();

    constructor(
        private loader: FileLoader,
        private url: string,
    ) {}

    async upload() {
        const file = await this.loader.file;
        if (!file) throw 'File tidak ditemukan.';

        const form = new FormData();
        form.append('upload', file);

        try {
            const res = await axios.post<{ url: string }>(this.url, form, { signal: this.controller.signal });
            return { default: res.data.url };
        } catch (e) {
            if (axios.isCancel(e)) throw 'aborted';
            const data = (e as { response?: { data?: { errors?: { upload?: string[] }; message?: string } } }).response?.data;
            throw data?.errors?.upload?.[0] ?? data?.message ?? 'Gagal mengunggah gambar. Coba lagi.';
        }
    }

    abort() {
        this.controller.abort();
    }
}

function PluginUploadGambar(editor: { plugins: { get: (nama: string) => { createUploadAdapter: unknown } } }) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) =>
        new UploadAdapter(loader, route('publisher.upload.gambar'));
}

export default function EditorKonten({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}) {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(_event, editor) => onChange(editor.getData())}
            config={
                {
                    placeholder,
                    extraPlugins: [PluginUploadGambar],
                    // Hanya YouTube yang dipakai; penyedia lain dimatikan supaya penulis tidak menempel link yang akan ditolak server
                    mediaEmbed: {
                        removeProviders: ['dailymotion', 'spotify', 'vimeo', 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook'],
                    },
                } as never
            }
        />
    );
}
