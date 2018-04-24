import { Component, Prop, Vue } from 'vue-property-decorator';

import { FormStateDao } from '@app/bundles/form/state/form.state.dao';
import { HttpMethods } from '@app/bundles/http/Enum/HttpMethods';

@Component
export class BaseButtonComponent extends Vue {

    @Prop({
        type: String,
        validator: value => value == null || Object.values(HttpMethods).includes(value),
    })
    public method?: HttpMethods;

    @Prop()
    public action?: string;

    @Prop()
    public label?: string;

    protected get dao(): FormStateDao {
        throw Error('Property or getter [dao] must be implemented.');
    }

    get isPending(): boolean {
        return this.dao.form.isRegistered() && this.dao.form.isPending();
    }

    protected submit(): void {
        if (this.action != null) {
            this.dao.form.action = this.action;
        }

        if (this.method != null) {
            this.dao.form.method = this.method;
        }

        if (this.dao.form.isRegistered()) {
            this.dao.form.submit();
        }
    }
}
