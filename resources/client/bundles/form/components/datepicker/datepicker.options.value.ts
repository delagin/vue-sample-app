import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru';

export const dateOptions: flatpickr.Options.Options = {
    dateFormat: 'F j, Y',
    time_24hr: true,
    locale: Russian,
};

export const dateTimeOptions: flatpickr.Options.Options = {
    ...dateOptions,
    enableTime: true,
    dateFormat: 'H:i M j, Y',
};

export const dateRangeOptions: flatpickr.Options.Options = {
    ...dateOptions,
    mode: 'range',
};
