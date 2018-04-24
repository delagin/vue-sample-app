import { FormElementPayload } from '@app/bundles/form/state/payload/form.element.payload';

export class FormElementMessagePayload extends FormElementPayload {
    public readonly message: string;

    constructor(form: string, path: string, message: string) {
        super(form, path);
        this.message = message;
    }
}
