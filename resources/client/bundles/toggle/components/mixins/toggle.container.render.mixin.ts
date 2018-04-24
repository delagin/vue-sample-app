import { CreateElement, VNode, VNodeChildrenArrayContents, VNodeData } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import {
    toggleBehavior,
    toggleTransitionMode,
} from '@app/bundles/toggle/enums/toggle.options.enum';
import { enumValidatorFactory } from '@app/bundles/utility/component/component.util';
import { ToggleBaseMixin } from './toggle.base.mixin';

@Component
export class ToggleContainerRenderMixin extends ToggleBaseMixin {

    @Prop({
        type: String,
        default: toggleTransitionMode.outIn,
        validator: enumValidatorFactory(toggleTransitionMode),
    })
    public mode!: toggleTransitionMode;

    @Prop({
        type: String,
        default: toggleBehavior.regular,
        validator: enumValidatorFactory(toggleBehavior),
    })
    public behavior!: toggleBehavior;

    protected get isInverted(): boolean {
        return this.behavior === toggleBehavior.inverse;
    }

    protected nodeOptions(): VNodeData {
        const props = { ...this.$attrs };
        if (this.mode !== toggleTransitionMode.default) props.mode = this.mode;
        return { props };
    }

    protected nodeChildrenKeyed(
        h: CreateElement,
    ): VNode[] | VNodeChildrenArrayContents | undefined {
        const children = this.nodeChildren(h);
        if (children == null || !this.isRenderable) return;
        if (!Array.isArray(children)) return children;
        return children.map((vnode: VNode, index) => Object.assign(vnode, {
            key: `${this.ns}-${this.slotName}-${index}`,
        }));
    }

    protected render(h: CreateElement): VNode {
        return h('transition', this.nodeOptions(), this.nodeChildrenKeyed(h));
    }

}
