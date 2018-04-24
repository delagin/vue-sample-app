import { FormElementTo } from '@app/bundles/form/dto/form.element.to';
import { ValueType } from '@app/bundles/form/type/value.type';
import { TSMap } from 'typescript-map';

export class FormElementMap extends TSMap<string, FormElementTo> {

    public get(path: string): FormElementTo {
        if (!this.has(path)) {
            throw new Error(`Model does not exist under [${path}], use [has(path)] method first`);
        }

        return super.get(path);
    }

    public setMessage(path: string, message: string): void {
        this.get(path).message = message;
    }

    public clearMessage(path: string): void {
        this.get(path).message = '';
    }

    public setValue(path: string, value: ValueType): void {
        this.get(path).value = value;
    }

    public getValue(path: string): ValueType {
        return this.get(path).value;
    }

    public hasMessage(path: string): boolean {
        return !!this.get(path).message;
    }

    public getMessage(path: string): string | undefined {
        return this.get(path).message;
    }

}
