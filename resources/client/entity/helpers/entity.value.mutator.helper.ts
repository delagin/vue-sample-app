import { EntityValueMutator } from '@app/entity/entity.interfaces.hub';

export const asArray: EntityValueMutator<any[]> = function(value: any): any[] {
    checkNotEmpty(value);
    if (Array.isArray(value)) return value;
    return Array.from(value);
};

export const asBoolean: EntityValueMutator<boolean> = function(value: any): boolean {
    checkNotEmpty(value);
    if (typeof value === 'boolean') return value;
    return !!value;
};

export const asDate: EntityValueMutator<Date> = function(value: any): Date {
    checkNotEmpty(value);
    if (value instanceof Date) return value;
    const val = asString(value);
    let date;
    if (Number.isNaN(+val)) {
        date = new Date(val);
    } else {
        date = new Date(asInteger(+val));
    }
    if (!Number.isNaN(date.getDate())) return date;
    throw new TypeError('A value cannot be converted to date');
};

export const asInteger: EntityValueMutator<number> = function(value: any): number {
    checkNotEmpty(value);
    const val = (typeof value === 'number') ? value : asNumber(value);
    return Number.isInteger(val) ? val : Math.round(val);
};

export const asNumber: EntityValueMutator<number> = function(value: any): number {
    checkNotEmpty(value);
    if (typeof value === 'number') return value;
    const val = Number.parseFloat(asString(value));
    if (!Number.isNaN(val)) return val;
    throw new TypeError('Value cannot be converted to number');
};

export const asString: EntityValueMutator<string> = function(value: any): string {
    checkNotEmpty(value);
    if (typeof value === 'string') return value;
    return value.toString();
};

function checkNotEmpty(value: any): void {
    if (value != null) return;
    throw new TypeError('Value to convert should not be null or undefined');
}
