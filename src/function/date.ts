export function formatFecha(fecha = new Date()) {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const YY = fecha.getFullYear().toString().slice(2); // últimos 2 dígitos del año
    const MM = pad(fecha.getMonth() + 1); // meses desde 0
    const DD = pad(fecha.getDate());
    const hh = pad(fecha.getHours());
    const mm = pad(fecha.getMinutes());
    const ss = pad(fecha.getSeconds());

    return `${YY}:${MM}:${DD} ${hh}:${mm}:${ss}`;
}