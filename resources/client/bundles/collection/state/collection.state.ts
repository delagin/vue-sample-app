import { injectable } from 'inversify';
import Vue from 'vue';

import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { ItemCollectionTo } from '@app/bundles/collection/dto/item.collection.to';

@injectable()
export class CollectionState<Model extends AbstractItemTo = AbstractItemTo> {

    public map: Record<string, ItemCollectionTo<Model>> = {};

    public has(name: string): boolean {
        return name in this.map;
    }

    public get(name: string): ItemCollectionTo<Model> {
        if (this.has(name)) return this.map[name];
        throw new Error(`collection ${name} does not exist yet`);
    }

    public set(
        name: string,
        collection: ItemCollectionTo<Model> = new ItemCollectionTo(),
    ): ItemCollectionTo<Model> {
        Vue.set(this.map, name, collection);
        return this.get(name);
    }

    public use(name: string): ItemCollectionTo<Model> {
        return this.has(name) ? this.get(name) : this.set(name);
    }

}
