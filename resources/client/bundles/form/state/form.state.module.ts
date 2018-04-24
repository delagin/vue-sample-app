import { FormState } from './form.state.module/state';
import { GetterTree, Module, MutationTree } from 'vuex';
import { inject, injectable } from 'inversify';
import { FormBundleTypes } from '@app/bundles/form/form.bundle.types';

@injectable()
export class FormStateModule implements Module<FormState, any> {
    public namespaced: boolean = true;
    public state: FormState;
    public getters: GetterTree<FormState, any>;
    public mutations: MutationTree<FormState>;

    constructor(@inject(FormBundleTypes.TYPES.FormState) state: FormState,
                @inject(FormBundleTypes.TYPES.FormStateModuleGetters) getters: GetterTree<FormState, any>,
                @inject(FormBundleTypes.TYPES.FormStateModuleMutations) mutations: MutationTree<FormState>) {
        this.state = state;
        this.getters = getters;
        this.mutations = mutations;
    }
}
