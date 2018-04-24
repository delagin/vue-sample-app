import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { CollectionFilter } from '@app/bundles/collection/filter/filter.interface';

export class DefaultPayload {

    constructor(
        public readonly name: string,
    ) {}

}

export class ItemIdPayload extends DefaultPayload {

    constructor(
        name: string,
        public readonly id: string,
    ) {
        super(name);
    }

}

export class ItemPayload extends DefaultPayload {

    constructor(
        name: string,
        public readonly model: AbstractItemTo,
    ) {
        super(name);
    }

}

export class ItemBatchPayload extends DefaultPayload {

    public readonly models: AbstractItemTo[];

    constructor(
        name: string,
        models: AbstractItemTo[],
    ) {
        super(name);
        this.models = Array.isArray(models) ? models : [models];
    }

}

export class FilterPayload<To extends AbstractItemTo = AbstractItemTo>
extends DefaultPayload {

    constructor(
        name: string,
        public readonly filter: CollectionFilter<To>,
    ) {
        super(name);
    }

}
