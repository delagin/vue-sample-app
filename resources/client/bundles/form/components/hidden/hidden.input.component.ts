import { FormElementComponent } from '@app/bundles/form/components/element/form.element.component';
import { Component } from 'vue-property-decorator';
import { CreateElement, VNode } from 'vue';

@Component
export class HiddenInputComponent extends FormElementComponent {

    protected render(h: CreateElement): VNode | undefined {
        return undefined;
    }

    public rememberPrevious(): void {
        this.previousValue = this.dao.value(this.path);
    }

    public reset(): void {
        this.dao.value(this.path, this.previousValue);
    }
}
