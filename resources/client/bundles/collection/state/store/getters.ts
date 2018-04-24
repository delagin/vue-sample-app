import { injectable } from 'inversify';

import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { CollectionState } from '@app/bundles/collection/state/collection.state';
import { DefaultGetter } from '@app/bundles/utility/state/default.helper';

type CollectionGetter = (state: CollectionState) => (name: string) => any;

@injectable()
export class CollectionStateGetters extends DefaultGetter<CollectionState> {

    public has: CollectionGetter = state => (name): boolean => state.has(name);

    public items: CollectionGetter = state => (name): AbstractItemTo[] => {
        return state.get(name).list;
    }

    public itemsRaw: CollectionGetter = state => (name): AbstractItemTo[] => {
        return state.get(name).listRaw;
    }

}
