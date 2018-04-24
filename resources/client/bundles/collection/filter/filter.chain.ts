import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { CollectionFilter } from '@app/bundles/collection/filter/filter.interface';

export function collectionFilterChain<Model extends AbstractItemTo>(
    ...filters: CollectionFilter<Model>[],
): CollectionFilter<Model> {
    return collection => filters.reduce(
        (filtered, filter) => filter(filtered),
        collection,
    );
}
