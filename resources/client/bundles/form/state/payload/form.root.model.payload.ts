import { FormRootPayload } from '@app/bundles/form/state/payload/form.root.payload';
import { FormTo } from '@app/bundles/form/dto/form.to';

export class FormRootModelPayload extends FormRootPayload {
    public readonly model: FormTo;

    constructor(form: string, model: FormTo) {
        super(form);
        this.model = model;
    }
}
