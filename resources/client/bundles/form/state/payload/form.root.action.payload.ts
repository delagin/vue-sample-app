import { FormRootPayload } from '@app/bundles/form/state/payload/form.root.payload';

export class FormRootActionPayload extends FormRootPayload {
    public readonly action?: string;

    constructor(form: string, action?: string) {
        super(form);
        this.action = action;
    }
}
