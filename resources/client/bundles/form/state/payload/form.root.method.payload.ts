import { FormRootPayload } from '@app/bundles/form/state/payload/form.root.payload';
import { HttpMethods } from '@app/bundles/http/Enum/HttpMethods';

export class FormRootMethodPayload extends FormRootPayload {

    constructor(
        form: string,
        public readonly method: HttpMethods,
    ) {
        super(form);
    }
}
