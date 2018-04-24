import { injectable } from 'inversify';

import { CollectionState } from '@app/bundles/collection/state/collection.state';
import {
    DefaultPayload,
    FilterPayload,
    ItemBatchPayload,
    ItemIdPayload,
} from '@app/bundles/collection/state/payload/payloads';
import { DefaultMutation } from '@app/bundles/utility/state/default.helper';

type CollectionMutation<Payload extends DefaultPayload> =
    (state: CollectionState, payload: Payload) => void;

@injectable()
export class CollectionStateMutations extends DefaultMutation<CollectionState> {

    public register: CollectionMutation<DefaultPayload> = (state, { name }) => {
        state.set(name);
    }

    public add: CollectionMutation<ItemBatchPayload> = (state, { name, models }) => {
        state.use(name).add(...models);
    }

    public replace: CollectionMutation<ItemBatchPayload> = (state, { name, models }) => {
        state.use(name).reset().add(...models);
    }

    public update: CollectionMutation<ItemBatchPayload> = (state, { name, models }) => {
        state.use(name).update(...models);
    }

    public remove: CollectionMutation<ItemIdPayload> = (state, { name, id }) => {
        state.use(name).remove(id);
    }

    public clear: CollectionMutation<DefaultPayload> = (state, { name }) => {
        state.use(name).reset();
    }

    public withFilter: CollectionMutation<FilterPayload> = (state, { name, filter }) => {
        state.use(name).updateFilter(filter);
    }

    public removeFilter: CollectionMutation<DefaultPayload> = (state, { name }) => {
        state.use(name).resetFilter();
    }

}
