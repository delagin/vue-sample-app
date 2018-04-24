import Vue, { CreateElement, VNode, VNodeChildren, VNodeChildrenArrayContents } from 'vue';
import { Component, Inject, Prop } from 'vue-property-decorator';

import { collectionBundleType } from '@app/bundles/collection/collection.bundle.types';
import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { CollectionDao } from '@app/bundles/collection/state/collection.dao';

export interface ItemData {
    to: AbstractItemTo;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    isSingle: boolean;
}

@Component
export class CollectionComponent extends Vue {

    @Prop({ required: true })
    public ns: string;

    @Prop({ default: 'div' })
    public tag: string;

    @Prop({ required: false, type: Number })
    public limit?: number;

    @Prop({
        default: () => [],
        validator: value => Array.isArray(value) &&
            value.every(item => typeof item.id === 'string'),
    })
    public collection: AbstractItemTo[];

    @Inject(collectionBundleType.Dao)
    protected dao: CollectionDao;

    protected get items(): AbstractItemTo[] {
        const list = this.dao.items(this.ns);

        return this.limit && this.limit > 0 ? list.slice(0, this.limit) : list;
    }

    protected created(): void {
        if (!this.dao.isRegistered(this.ns)) this.dao.register(this.ns, this.collection);
    }

    protected render(h: CreateElement): VNode {
        return h(this.tag, this.nodeChildren());
    }

    private nodeChildren(): VNodeChildren {
        return [
            this.getNodeChildren('first'),
            ...this.nodeChildrenKeyed(),
            this.getNodeChildren('last'),
        ];
    }

    private nodeChildrenKeyed(): (VNodeChildrenArrayContents | VNode | string)[] {
        if (this.items.length === 0) return this.$slots.empty;
        return this.items.map((to, index) => {
            const children = this.getNodeChildren('default', this.itemData(to, index));
            if (!Array.isArray(children)) {
                return (typeof children === 'object')
                    ? Object.assign(children, { key: `${this.ns}-${to.id}` })
                    : children;
            }
            return children.map((node: VNode, nodeIndex: number) => {
                return Object.assign(node, { key: `${this.ns}-${to.id}-${nodeIndex}` });
            });
        });
    }

    private getNodeChildren(
        key: string,
        config?: Record<string, any>,
    ): VNodeChildrenArrayContents | string {
        return (config != null && typeof this.$scopedSlots[key] === 'function')
            ? this.$scopedSlots[key](config)
            : this.$slots[key];
    }

    private itemData(to: AbstractItemTo, index: number): ItemData {
        return {
            to,
            index,
            isFirst: index === 0,
            isLast: index === this.items.length - 1,
            isSingle: this.items.length === 1,
        };
    }

}
