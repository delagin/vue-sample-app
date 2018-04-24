import { ValueType } from '../type/value.type';

export class FormElementTo {
    public value: ValueType;
    public valuable: boolean = true;
    public message: string | undefined = '';

    constructor(value: ValueType, valuable?: boolean, message?: string) {
        this.value = value;

        if (typeof valuable === 'boolean') {
            this.valuable = valuable;
        }

        if (typeof message === 'string') {
            this.message = message;
        }
    }
}
