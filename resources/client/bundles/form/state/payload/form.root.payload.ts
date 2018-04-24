export abstract class FormRootPayload {
    public readonly form: string;

    constructor(form: string) {
        this.form = form;
    }
}
