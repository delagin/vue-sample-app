import { FormRootPayload } from '@app/bundles/form/state/payload/form.root.payload';
import { formLifecycleState } from '@app/bundles/form/type/form.lifecycle.states';

export class FormRootStatePayload extends FormRootPayload {
    public readonly state: formLifecycleState;

    constructor(form: string, state: formLifecycleState) {
        super(form);
        this.state = state;
    }
}
