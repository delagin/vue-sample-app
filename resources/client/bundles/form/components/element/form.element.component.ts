import { Component, Emit, Inject, Prop, Vue } from 'vue-property-decorator';

import { FormElementTo } from '@app/bundles/form/dto/form.element.to';
import { FormStateDao } from '@app/bundles/form/state/form.state.dao';
import { ValueType } from '@app/bundles/form/type/value.type';
import slugify from '@app/bundles/utility/string/slugify';

@Component
export class FormElementComponent extends Vue {
    @Prop({ required: true, type: String })
    public path!: string;

    @Prop({ type: [String, Number, Boolean], default: '' })
    public value!: ValueType;

    @Prop({ default: true, type: Boolean })
    public valuable!: boolean;

    @Inject()
    protected dao!: FormStateDao;

    protected previousValue?: ValueType;

    get name(): string {
        return slugify(this.path);
    }

    get elementId(): string {
        return slugify(`${this.dao.form.name}-${this.name}`);
    }

    get elementValue(): ValueType | undefined {
        return this.dao.value(this.path);
    }

    set elementValue(value: ValueType | undefined) {
        this.dao.value(this.path, this.mapValue(value));
    }

    get elementMessage(): string {
        return this.dao.message(this.path);
    }

    set elementMessage(message: string) {
        this.dao.message(this.path, message);
    }

    get hasMessage(): boolean {
        return !!this.dao.message(this.path);
    }

    get isPending(): boolean {
        return this.dao.form.isRegistered() && this.dao.form.isPending();
    }

    protected rememberPrevious(): void {
        this.previousValue = this.dao.value(this.path);
    }

    protected reset(): void {
        this.dao.value(this.path, this.previousValue);
    }

    protected created(): void {
        this.init(new FormElementTo(this.value, this.valuable));
    }

    @Emit('init')
    protected init(model: FormElementTo): void {
        if (!this.dao.hasElement(this.path)) {
            this.dao.attach(this.path, model);
        } else {
            this.dao.value(this.path, model.value);
        }
    }

    protected mapValue(value: ValueType | undefined): ValueType | undefined {
        return value;
    }
}
