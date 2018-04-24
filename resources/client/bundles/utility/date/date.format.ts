import moment from 'moment';

export const applicationDateFormats = {
    apiDate: 'YYYY-MM-DD',
    apiDateTime: 'YYYY-MM-DD HH:mm',
};

export function dateFormat(value: Date, format: string): string {
    const momentDate = moment(value);
    momentDate.locale('ru');
    return momentDate.format(format);
}

export function stringAsDate(str: string, format?: string): Date {
    const momentDate = format ? moment(str, format) : moment(str);

    return momentDate.toDate();
}
