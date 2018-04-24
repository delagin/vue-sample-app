import { Component, Inject } from 'vue-property-decorator';

import { BaseButtonComponent } from '@app/bundles/form/components/button/base.button.component';
import { FormStateDao } from '@app/bundles/form/state/form.state.dao';

import componentTemplate from './component.template';

@Component({ template: componentTemplate() })
export class ButtonComponent extends BaseButtonComponent {

    @Inject('dao')
    protected dao!: FormStateDao;

    get isPending(): boolean {
        return this.dao.form.isRegistered() && this.dao.form.isPending();
    }

}
