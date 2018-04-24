import { GetterTree, Module, MutationTree } from 'vuex';
import { CollectionState } from '@app/bundles/collection/state/collection.state';
import { inject, injectable } from 'inversify';
import { collectionBundleType } from '@app/bundles/collection/collection.bundle.types';

const injectTypes = collectionBundleType;

@injectable()
export class CollectionModule implements Module<CollectionState, any> {
    public namespaced = true;
    public state: CollectionState;
    public getters: GetterTree<CollectionState, any>;
    public mutations: MutationTree<CollectionState>;

    constructor(@inject(injectTypes.State) state: CollectionState,
                @inject(injectTypes.Getter) getters: GetterTree<CollectionState, any>,
                @inject(injectTypes.Mutation) mutations: MutationTree<CollectionState>) {
        this.state = state;
        this.getters = getters;
        this.mutations = mutations;
    }
}
