import template from './checkbox.template';
import { Component, Prop } from 'vue-property-decorator';
import { FormElementComponent } from '@app/bundles/form/components/element/form.element.component';
import { ValueType } from '@app/bundles/form/type/value.type';

@Component({ template: template() })
export class CheckboxComponent extends FormElementComponent {

    @Prop({ default: '0', type: [String, Boolean] })
    public falseValue!: ValueType;

    @Prop({ default: '1', type: [String, Boolean] })
    public trueValue!: ValueType;

}
