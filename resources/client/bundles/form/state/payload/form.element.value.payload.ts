import { FormElementPayload } from '@app/bundles/form/state/payload/form.element.payload';
import { ValueType } from '@app/bundles/form/type/value.type';

export class FormElementValuePayload extends FormElementPayload {
    public readonly value: ValueType;

    constructor(form: string, path: string, value: ValueType) {
        super(form, path);

        this.value = value;
    }
}
