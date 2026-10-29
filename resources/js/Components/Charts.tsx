const ACCENT = '#a8265c';
const ACCENT_SOFT = '#e3c7d2';

export interface ChartItem {
    label: string;
    value: number;
}

const NAMA_BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// "2026-08" -> "Agu 26"
export function labelBulan(bulan: string) {
    const [tahun, bln] = bulan.split('-');
    return `${NAMA_BULAN[parseInt(bln, 10) - 1]} ${tahun.slice(2)}`;
}

// Batang vertikal. Tinggi batang memakai ruang flex yang pasti (bukan persen dari induk
// yang tingginya auto), jadi batang selalu terlihat. Nilai 0 ditandai garis tipis.
export function BarChartVertical({ data }: { data: ChartItem[] }) {
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="flex h-48 items-stretch gap-3">
            {data.map((d) => (
                <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center">
                    <span className="text-xs font-semibold text-gray-700">{d.value}</span>
                    <div className="relative mt-1 w-full max-w-[56px] flex-1">
                        <div
                            className="absolute bottom-0 left-0 right-0"
                            style={{
                                height: d.value === 0 ? '2px' : `${(d.value / max) * 100}%`,
                                backgroundColor: d.value === 0 ? ACCENT_SOFT : ACCENT,
                            }}
                        />
                    </div>
                    <span className="mt-2 font-mono text-[10px] text-gray-400">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

// Batang horizontal (label di kiri, angka di kanan)
export function BarChartHorizontal({ data, labelClass = 'w-28' }: { data: ChartItem[]; labelClass?: string }) {
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="flex flex-col gap-3">
            {data.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                    <span className={`${labelClass} shrink-0 truncate font-mono text-[11px] text-gray-500`} title={d.label}>
                        {d.label}
                    </span>
                    <div className="h-4 flex-1 bg-[#f3e8ec]">
                        <div className="h-4" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: ACCENT }} />
                    </div>
                    <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700">{d.value}</span>
                </div>
            ))}
        </div>
    );
}
