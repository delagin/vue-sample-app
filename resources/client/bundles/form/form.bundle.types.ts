export class FormBundleTypes {
    static TYPES = {
        FormState: Symbol.for('FormState'),
        FormStateModule: Symbol.for('FormStateModule'),
        FormStateModuleNamespace: Symbol.for('FormStateModuleNamespace'),
        FormStateModuleMutations: Symbol.for('FormStateModuleMutations'),
        FormStateModuleGetters: Symbol.for('FormStateModuleGetter'),
        FormStateDaoRegistry: Symbol.for('FormStateDaoRegistry'),
        FormRequestHandler: Symbol.for('FormRequestHandler'),
    };
}
