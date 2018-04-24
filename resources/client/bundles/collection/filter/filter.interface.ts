import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';

export type CollectionFilter<To extends AbstractItemTo> = (collection: To[]) => To[];
