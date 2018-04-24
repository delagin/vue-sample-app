import { inject, injectable } from 'inversify';
import { Store } from 'vuex';

import { toggleBundleType } from '@app/bundles/toggle/toggle.bundle.type';
import { ToggleModuleGetter } from './toggle.getter';
import { ToggleModuleMutation } from './toggle.mutation';
import { BasePayload, togglePayloadFactory } from './toggle.payload';

@injectable()
export class ToggleDao {

    constructor(
        @inject(toggleBundleType.ModuleNamespace)
        protected ns: string,
        @inject(Store)
        protected store: Store<any>,
    ) {}

    public attach(name: string, visible: boolean): void {
        this.commit('attach', togglePayloadFactory.model(name, visible));
    }

    public show(...names: string[]): void {
        names.forEach(name => this.commit('show', togglePayloadFactory.base(name)));
    }

    public hide(...names: string[]): void {
        names.forEach(name => this.commit('hide', togglePayloadFactory.base(name)));
    }

    public toggle(...names: string[]): void {
        names.forEach(name => this.commit('toggle', togglePayloadFactory.base(name)));
    }

    public isSomeVisible(...names: string[]): boolean {
        return this.isRegistered(...names) && names.some(name => !!this.getter('isVisible', name));
    }

    public isEveryVisible(...names: string[]): boolean {
        return this.isRegistered(...names) && names.every(name => !!this.getter('isVisible', name));
    }

    public isRegistered(...names: string[]): boolean {
        return names.every(name => !!this.getter('isRegistered', name));
    }

    protected getter(key: keyof ToggleModuleGetter, name: string): any {
        return this.store.getters[this.wrap(key)](name);
    }

    protected commit<Payload extends BasePayload>(
        key: keyof ToggleModuleMutation,
        payload: Payload,
    ): void {
        this.store.commit(this.wrap(key), payload);
    }

    protected wrap(key: string): string {
        return `${this.ns}/${key}`;
    }

}
