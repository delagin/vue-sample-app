import Vue, { CreateElement, VNode, VNodeData } from 'vue';
import { Component, Inject, Prop, Provide } from 'vue-property-decorator';

import { FormTo } from '@app/bundles/form/dto/form.to';
import { FormBundleTypes } from '@app/bundles/form/form.bundle.types';
import { FormRequestHandler } from '@app/bundles/form/service/form.request.handler';
import { FormStateDao } from '@app/bundles/form/state/form.state.dao';
import { FormStateDaoRegistry } from '@app/bundles/form/state/form.state.dao.registry';
import { HttpMethods } from '@app/bundles/http/Enum/HttpMethods';

@Component
export class FormComponent extends Vue {

    @Prop({ required: true })
    public name!: string;

    @Prop({
        type: String,
        default: HttpMethods.post,
        validator: value => Object.values(HttpMethods).includes(value),
    })
    public method!: HttpMethods;

    @Prop()
    public action?: string;

    @Prop()
    public occupation?: string;

    @Inject(FormBundleTypes.TYPES.FormStateDaoRegistry)
    protected daoRegistry!: FormStateDaoRegistry;

    @Inject(FormBundleTypes.TYPES.FormRequestHandler)
    protected formHandler!: FormRequestHandler;

    @Provide()
    protected dao: FormStateDao = this.daoRegistry.get(this.name);

    get isReady(): boolean {
        return this.dao.form.isRegistered() && this.dao.form.isReady();
    }

    protected created(): void {
        this.dao.form.register(this.initialModel());
        this.$watch(() => this.isReady, () => this.request());
    }

    protected submit(event?: Event): void {
        if (event != null) event.preventDefault();
        if (this.dao.form.isRegistered()) {
            this.dao.form.submit();
        }
    }

    protected request(): void {
        if (this.isReady) {
            this.formHandler.submit(this.name, this.occupation);
        }
    }

    protected initialModel(): FormTo {
        const model = new FormTo(this.action);
        model.method = this.method;

        return model;
    }

    protected render(h: CreateElement): VNode {
        return h('form', this.nodeOptions, this.nodeChildren(h));
    }

    private get nodeOptions(): VNodeData {
        return {
            attrs: {
                action: this.action,
                method: this.method,
            },
            on: {
                submit: (event: Event) => this.submit(event),
            },
        };
    }

    private nodeChildren(h: CreateElement): VNode[] {
        // @ts-ignore: Property '_t' does not exist.
        return [this._t('default')];
    }

}
