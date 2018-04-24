export function parseDate(date: string): Date {
    const [year, month, day] = date.split(' ')[0].split('-');
    return new Date(+year, +month - 1, +day);
}

export function stringToDate(str: string): Date {
    const [date, time] = str.split(' ');
    const [year, month, day] = date.split('-');
    const [hour = 0, minute = 0] = (time || '').split(':');
    return new Date(+year, +month - 1, +day, +hour, +minute);
}

export function dateToString(date: Date, hasTime: boolean = false): string {
    const pad = (value: any) => value.toString().padStart(2, '0');
    const result = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return hasTime
        ? `${result} ${pad(date.getHours())}:${pad(date.getMinutes())}`
        : result;
}
