import { FormElementPayload } from '@app/bundles/form/state/payload/form.element.payload';
import { FormElementTo } from '@app/bundles/form/dto/form.element.to';

export class FormElementModelPayload extends FormElementPayload {
    public readonly model: FormElementTo;

    constructor(form: string, path: string, model: FormElementTo) {
        super(form, path);
        this.model = model;
    }
}
