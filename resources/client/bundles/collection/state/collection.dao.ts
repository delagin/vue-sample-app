import { inject, injectable } from 'inversify';
import { Store } from 'vuex';

import { collectionBundleType } from '@app/bundles/collection/collection.bundle.types';
import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { CollectionFilter } from '@app/bundles/collection/filter/filter.interface';
import {
    DefaultPayload,
    FilterPayload,
    ItemBatchPayload,
    ItemIdPayload,
} from '@app/bundles/collection/state/payload/payloads';
import { CollectionStateGetters } from '@app/bundles/collection/state/store/getters';
import { CollectionStateMutations } from '@app/bundles/collection/state/store/mutations';

@injectable()
export class CollectionDao<Model extends AbstractItemTo = AbstractItemTo> {

    constructor(
        @inject(Store)
        protected store: Store<any>,
        @inject(collectionBundleType.ModuleNamespace)
        protected ns: string,
    ) {}

    public register(name: string, items?: Model[]): void {
        this.commit('register', new DefaultPayload(name));
        if (items != null && items.length > 0) this.add(name, items);
    }

    public isRegistered(name: string): boolean {
        return this.getter('has', name);
    }

    public hasFilter(name: string): boolean {
        return this.getter('hasFilter', name);
    }

    public getFilter(name: string): CollectionFilter<Model> {
        return this.getter('getFilter', name);
    }

    public withFilter<To extends Model = Model>(name: string, filter: CollectionFilter<To>): void {
        this.commit('withFilter', new FilterPayload(name, filter));
    }

    public removeFilter(name: string): void {
        this.commit('removeFilter', new DefaultPayload(name));
    }

    public items<Item extends AbstractItemTo = Model>(name: string): Item[] {
        return this.getter('items', name);
    }

    public add(name: string, items: Model[]): void {
        this.commit('add', new ItemBatchPayload(name, items));
    }

    public update(name: string, items: Model[]): void {
        this.commit('update', new ItemBatchPayload(name, items));
    }

    public replace(name: string, items: Model[]): void {
        this.commit('replace', new ItemBatchPayload(name, items));
    }

    public remove(name: string, id: string): void {
        this.commit('remove', new ItemIdPayload(name, id));
    }

    public clear(name: string): void {
        this.commit('clear', new DefaultPayload(name));
    }

    protected wrap(name: string): string {
        return [this.ns, '/', name].join('');
    }

    protected commit(name: keyof CollectionStateMutations, payload: DefaultPayload): void {
        this.store.commit(this.wrap(name), payload);
    }

    protected getter(name: keyof CollectionStateGetters, ...args: any[]): any {
        return this.store.getters[this.wrap(name)](...args);
    }

}
