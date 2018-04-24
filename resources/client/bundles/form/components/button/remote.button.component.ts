import { Component, Inject, Prop } from 'vue-property-decorator';

import { FormStateDao } from '@app/bundles/form/state/form.state.dao';

import { BaseButtonComponent } from '@app/bundles/form/components/button/base.button.component';
import { FormBundleTypes } from '@app/bundles/form/form.bundle.types';
import { FormStateDaoRegistry } from '@app/bundles/form/state/form.state.dao.registry';
import componentTemplate from './component.template';

@Component({ template: componentTemplate() })
export class RemoteButtonComponent extends BaseButtonComponent {

    @Prop({ required: true })
    public name!: string;

    @Inject(FormBundleTypes.TYPES.FormStateDaoRegistry)
    protected daoRegistry!: FormStateDaoRegistry;

    public get dao(): FormStateDao {
        return this.daoRegistry.get(this.name);
    }
}
