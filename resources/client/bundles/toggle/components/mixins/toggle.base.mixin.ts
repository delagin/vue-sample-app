import Vue, { CreateElement, VNode, VNodeChildrenArrayContents } from 'vue';
import { Component, Inject, Prop } from 'vue-property-decorator';

import { toggleSlotName } from '@app/bundles/toggle/enums/toggle.options.enum';
import { ToggleDao } from '@app/bundles/toggle/modules/toggle.dao';
import { toggleBundleType } from '@app/bundles/toggle/toggle.bundle.type';

@Component
export class ToggleBaseMixin extends Vue {

    @Prop({ required: true })
    public ns!: string;

    @Inject(toggleBundleType.Dao)
    protected toggleDao!: ToggleDao;

    protected get isVisible(): boolean {
        throw new Error('Toggle method [isVisible] is not yet implemented.');
    }

    protected get slotName(): toggleSlotName {
        if (this.hasState) return this.isVisible ? toggleSlotName.on : toggleSlotName.off;
        return toggleSlotName.default;
    }

    protected get slotContent(): { nodes: VNode[] } {
        return { nodes: this.$slots[toggleSlotName.content] };
    }

    protected get isRenderable(): boolean {
        return this.hasState || this.isVisible;
    }

    protected get hasState(): boolean {
        return this.hasSlot('on') && this.hasSlot('off');
    }

    protected nodeChildren(h: CreateElement): VNode[] | VNodeChildrenArrayContents | undefined {
        let children: VNode | VNode[] | VNodeChildrenArrayContents | undefined;
        const scopedSlot = this.$scopedSlots[this.slotName];
        if (typeof scopedSlot === 'function') children = scopedSlot(this.slotContent);
        // @ts-ignore: Property '_t' does not exist.
        if (children == null) children = this._t(this.slotName);
        if (children == null || typeof children !== 'object') return;
        return Array.isArray(children) ? children : [children];
    }

    private hasSlot(name: string): boolean {
        return Array.isArray(this.$slots[name]) || typeof this.$scopedSlots[name] === 'function';
    }

}
