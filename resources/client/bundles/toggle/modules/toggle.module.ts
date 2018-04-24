import { inject, injectable } from 'inversify';
import { GetterTree, Module, MutationTree } from 'vuex';

import { toggleBundleType } from '@app/bundles/toggle/toggle.bundle.type';
import { ToggleState } from './toggle.state';

@injectable()
export class ToggleModule implements Module<ToggleState, any> {

    public namespaced: boolean = true;

    constructor(
        @inject(toggleBundleType.State)
        public state: ToggleState,
        @inject(toggleBundleType.Getter)
        public getters: GetterTree<ToggleState, any>,
        @inject(toggleBundleType.Mutation)
        public mutations: MutationTree<ToggleState>,
    ) {}

}
