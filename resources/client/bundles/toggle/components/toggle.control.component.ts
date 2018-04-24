import Vue, { CreateElement, VNode, VNodeData } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { toggleActions } from '@app/bundles/toggle/enums/toggle.options.enum';
import { enumValidatorFactory } from '@app/bundles/utility/component/component.util';
import { ToggleMultipleNameMixin } from './mixins/toggle.multiple.name.mixin';

export interface ToggleControlComponent
extends ToggleMultipleNameMixin {}

@Component({ mixins: [ToggleMultipleNameMixin] })
export class ToggleControlComponent extends Vue {

    @Prop({ default: 'button' })
    public tag!: string;

    @Prop({
        type: String,
        default: toggleActions.toggle,
        validator: enumValidatorFactory(toggleActions),
    })
    public action!: toggleActions;

    protected get isVisible(): boolean {
        return this.isVisibleModel;
    }

    protected nodeOptions(): VNodeData {
        return { on: { click: this.handle } };
    }

    protected handle(event?: Event): void {
        if (event != null) event.preventDefault();
        this.toggleDao[this.action](...this.names);
    }

    protected render(h: CreateElement): VNode {
        return h(this.tag, this.nodeOptions(), this.nodeChildren(h));
    }

}
