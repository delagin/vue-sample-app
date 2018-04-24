export class FormElementPayload {
    public form: string;
    public path: string;

    constructor(form: string, path: string) {
        this.form = form;
        this.path = path;
    }
}
