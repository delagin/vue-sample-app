import { FormElementComponent } from '@app/bundles/form/components/element/form.element.component';
import { Component, Prop } from 'vue-property-decorator';

import componentTemplate from './component.template';

@Component({ template: componentTemplate() })
export class TextareaComponent extends FormElementComponent {
    @Prop({ required: false })
    public placeholder!: string;

    @Prop()
    public cols!: string;

    @Prop()
    public rows!: string;

    get hasSlot(): boolean {
        return !!this.$slots.default;
    }
}
