import { FormElementTo } from '@app/bundles/form/dto/form.element.to';
import { FormTo } from '@app/bundles/form/dto/form.to';
import { StateGetters } from '@app/bundles/form/state/form.state.module/state.getters';
import { StateMutations } from '@app/bundles/form/state/form.state.module/state.mutators';
import { FormElementMessagePayload } from '@app/bundles/form/state/payload/form.element.message.payload';
import { FormElementModelPayload } from '@app/bundles/form/state/payload/form.element.model.payload';
import { FormElementPayload } from '@app/bundles/form/state/payload/form.element.payload';
import { FormElementValuePayload } from '@app/bundles/form/state/payload/form.element.value.payload';
import { FormRootActionPayload } from '@app/bundles/form/state/payload/form.root.action.payload';
import { FormRootMethodPayload } from '@app/bundles/form/state/payload/form.root.method.payload';
import { FormRootModelPayload } from '@app/bundles/form/state/payload/form.root.model.payload';
import { FormRootPayload } from '@app/bundles/form/state/payload/form.root.payload';
import { FormRootStatePayload } from '@app/bundles/form/state/payload/form.root.state.payload';
import { formLifecycleState } from '@app/bundles/form/type/form.lifecycle.states';
import { ValueType } from '@app/bundles/form/type/value.type';
import { HttpMethods } from '@app/bundles/http/Enum/HttpMethods';
import { ObjectDotTransformer } from '@app/bundles/utility/object/object.dot.transformer';
import { TSMap } from 'typescript-map';
import { Store } from 'vuex';

export interface FormRootHandler {
    name: string;
    action: string | undefined;
    method: HttpMethods;
    register(model: FormTo): void;
    isRegistered(): boolean;
    submit(): void;
    lock(): void;
    pristine(): void;
    success(): void;
    fail(): void;
    isPending(): boolean;
    isReady(): boolean;
    isSuccess(): boolean;
    isFailed(): boolean;
}

export class FormStateDao {
    protected store: Store<any>;
    protected ns: string;
    protected formName: string;
    protected formHandler?: FormRootHandler;
    protected collectorFilter: (data: Record<string, any>) => Record<string, any> = (data => data);

    constructor(store: Store<any>, ns: string, form: string) {
        this.store = store;
        this.ns = ns;
        this.formName = form;
    }

    get form(): FormRootHandler {
        if (this.formHandler !== undefined) {
            return this.formHandler;
        }

        const formHandler = class {
            private _dao: FormStateDao;

            constructor(dao: FormStateDao) {
                this._dao = dao;
            }

            public get name(): string {
                return this._dao.formName;
            }

            public register(model: FormTo): void {
                this._dao.commit('root', new FormRootModelPayload(this._dao.formName, model));

            }

            public isRegistered(): boolean {
                return this._dao.getter('hasForm', this._dao.formName);
            }

            public submit(): void {
                if (this.testState(formLifecycleState.pending)) {
                    throw new Error('submit state cannot be applied on pending form');
                }

                this.changeState(formLifecycleState.waitingForSubmit);
            }

            public lock(): void {
                this.changeState(formLifecycleState.pending);
            }

            public pristine(): void {
                this.changeState(formLifecycleState.created);
            }

            public success(): void {
                this.changeState(formLifecycleState.success);
            }

            public fail(): void {
                this.changeState(formLifecycleState.failed);
            }

            get action(): string | undefined {
                return (this._dao.getter('getForm') as FormTo).action;
            }

            set action(value: string | undefined) {
                this._dao.commit(
                    'rootAction',
                    new FormRootActionPayload(this._dao.formName, value),
                );
            }

            get method(): HttpMethods {
                return (this._dao.getter('getForm') as FormTo).method;
            }

            set method(value: HttpMethods) {
                this._dao.commit(
                    'rootMethod',
                    new FormRootMethodPayload(this._dao.formName, value),
                );
            }

            public isPending(): boolean {
                return this.testState(formLifecycleState.pending);
            }

            public isReady(): boolean {
                return this.testState(formLifecycleState.waitingForSubmit);
            }

            public isSuccess(): boolean {
                return this.testState(formLifecycleState.success);
            }

            public isFailed(): boolean {
                return this.testState(formLifecycleState.failed);
            }

            private testState(state: formLifecycleState): boolean {
                const root = this._dao.getter('getForm') as FormTo;

                return state === root.state;
            }

            private changeState(state: formLifecycleState): void {
                this._dao.commit('rootState', new FormRootStatePayload(this._dao.formName, state));
            }
        };

        this.formHandler = new formHandler(this);
        return this.formHandler;
    }

    public hasForm(form: string): boolean {
        return this.getter('hasForm', form);
    }

    public hasElement(path: string): boolean {
        return this.getter('hasElement', path);
    }

    public attach(path: string, model: FormElementTo): void {
        this.commit('attach', new FormElementModelPayload(this.formName, path, model));
    }

    public clearMessage(path: string): void {
        this.commit('clearMessage', new FormElementPayload(this.formName, path));
    }

    public value(path: string, value?: ValueType): ValueType | undefined {
        if (value !== undefined) {
            this.commit('setValue', new FormElementValuePayload(this.formName, path, value));
            return;
        }

        return this.getter('getValue', path);
    }

    public message(path: string): string;
    public message(path: string, message: string): void;
    public message(path: string, message?: string): string | void {
        if (message !== undefined) {
            this.commit('setMessage', new FormElementMessagePayload(this.formName, path, message));

            return;
        }

        return this.getter('getMessage', path);
    }

    public hasMessage(path: string): boolean {
        return this.getter('hasMessage', path);
    }

    public collectInputValues(): Record<string, any> {
        const inputsMap = this.getter('getInputsMap') as TSMap<string, FormElementTo>;
        const valuableMap: Map<string, ValueType> = new Map<string, ValueType>();

        inputsMap.filter((el) => el.valuable).forEach((el, key) => {
            if (key) {
                valuableMap.set(key, el.value);
            }
        });

        return this.collectorFilter(ObjectDotTransformer.expand(valuableMap));
    }

    public setCollectorFilter(filter: (data: Record<string, any>) => Record<string, any>): void {
        this.collectorFilter = filter;
    }

    public clearMessages(): void {
        const inputsMap = this.getter('getInputsMap') as TSMap<string, FormElementTo>;

        inputsMap.forEach((el, key) => this.clearMessage(key!));
    }

    protected wrap(name: string): string {
        return [this.ns, '/', name].join('');
    }

    protected commit(
        name: keyof StateMutations,
        payload: FormElementPayload | FormRootPayload,
    ): void {
        this.store.commit(this.wrap(name), payload);
    }

    protected getter(name: keyof StateGetters, ...args: any[]): any {
        return this.store.getters[this.wrap(name)](this.formName, ...args);
    }
}
