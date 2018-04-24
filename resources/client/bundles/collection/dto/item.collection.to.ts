import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { CollectionFilter } from '@app/bundles/collection/filter/filter.interface';

export class ItemCollectionTo<Model extends AbstractItemTo = AbstractItemTo> {

    protected collection: Model[] = [];

    public get listRaw(): Model[] {
        return Array.from(this.collection);
    }

    public get list(): Model[] {
        return this.filter(this.listRaw);
    }

    public has(id: string): boolean {
        return this.collection.some(item => item.id === id);
    }

    public get(id: string): Model {
        if (this.has(id)) return this.collection.find(item => item.id === id)!;
        throw new Error(`Model with id [${id}] does not exist.`);
    }

    public add(...models: Model[]): void {
        this.collection.push(...models);
    }

    public remove(id: string): void {
        if (!this.has(id)) return;
        const index = this.collection.findIndex(item => item.id === id);
        this.collection.splice(index, 1);
    }

    public update(...models: Model[]): void {
        models.forEach(model => {
            this.has(model.id)
                ? Object.assign(this.get(model.id), model)
                : this.add(model);
        });
    }

    public reset(): ItemCollectionTo<Model> {
        this.collection = [];
        return this;
    }

    public updateFilter(filter: CollectionFilter<Model>): void {
        this.filter = filter;
    }

    public resetFilter(): void {
        this.filter = models => models;
    }

    protected filter: CollectionFilter<Model> = models => models;

}
