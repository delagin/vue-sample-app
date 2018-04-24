import { Store } from 'vuex';
import { FormStateDao } from '@app/bundles/form/state/form.state.dao';
import { inject, injectable } from 'inversify';
import { FormBundleTypes } from '@app/bundles/form/form.bundle.types';
import { FormTo } from '@app/bundles/form/dto/form.to';

@injectable()
export class FormStateDaoRegistry {
    protected ns: string;
    protected store: Store<any>;
    protected dao: Map<string, FormStateDao> = new Map<string, FormStateDao>();

    constructor(@inject(Store) store: Store<any>,
                @inject(FormBundleTypes.TYPES.FormStateModuleNamespace) ns: string) {
        this.store = store;
        this.ns = ns;
    }

    public get(form: string, model?: FormTo): FormStateDao {
        if (this.dao.has(form)) {
            return this.dao.get(form)!;
        }

        const dao = new FormStateDao(this.store, this.ns, form);

        if (model !== undefined) {
            dao.form.register(model);
        }

        this.dao.set(form, dao);

        return dao;
    }
}
