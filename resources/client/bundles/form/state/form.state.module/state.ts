import { FormElementMap } from '@app/bundles/form/dto/form.element.map';
import Vue from 'vue';
import { injectable } from 'inversify';
import { FormTo } from '@app/bundles/form/dto/form.to';

@injectable()
export class FormState {
    private formElements: Record<string, FormElementMap>;
    private forms: Record<string, FormTo>;

    constructor() {
        this.formElements = {};
        this.forms = {};
    }

    public hasElements(name: string): boolean {
        return name in this.formElements;
    }

    public elements(name: string): FormElementMap;
    public elements(name: string, elements: FormElementMap): void;
    public elements(name: string, elements?: FormElementMap): void | FormElementMap {
        if (elements) {
            Vue.set(this.formElements, name, elements);
        }

        if (!this.hasElements(name)) {
            throw new Error(`elements for [${name}] does not registered yet`);
        }

        return this.formElements[name];
    }

    public hasForm(name: string): boolean {
        return name in this.forms;
    }

    public form(name: string): FormTo;
    public form(name: string, model: FormTo): void;
    public form(name: string, model?: FormTo): FormTo | void {
        if (model !== undefined) {
            Vue.set(this.forms, name, model);

            return;
        }

        if (!this.hasForm(name)) {
            throw new Error(`form [${name}] does not registered yet`);
        }

        return this.forms[name];
    }
}
