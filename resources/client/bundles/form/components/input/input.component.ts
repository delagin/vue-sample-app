import { FormElementComponent } from '@app/bundles/form/components/element/form.element.component';
import { inputModesEnum } from '@app/bundles/form/enums/input.modes.enum';
import { Component, Prop } from 'vue-property-decorator';
import getInputTemplate from './input.component.template';

@Component({ template: getInputTemplate() })
export class InputComponent extends FormElementComponent {
    @Prop({
        type: String,
        default: inputModesEnum.text,
        validator: value => Object.values(inputModesEnum).includes(value),
    })
    public mode!: inputModesEnum;

    @Prop()
    public placeholder!: string;

    get hasSlot(): boolean {
        return !!this.$slots.default;
    }
}
