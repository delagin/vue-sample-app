import { Container, interfaces } from 'inversify';
import Vue, { ComponentOptions } from 'vue';
import Vuex, { Module, Store, StoreOptions } from 'vuex';

import { BundleCtor, BundleManager, PluginGetter } from '@app/bundles/app/bundle.manager';
import { ModuleIdTo } from '@app/bundles/app/module.id.to';

export class VueKernel {

    protected container: Container;
    protected bundleManager: BundleManager;

    private containerConfig: interfaces.ContainerOptions = {
        defaultScope: 'Singleton',
    };

    constructor(...bundleCtors: BundleCtor[]) {
        this.container = new Container(this.containerConfig);
        this.bundleManager = new BundleManager(this.container, ...bundleCtors);
        this.use(() => [Vuex], ...this.bundleManager.use());
        this.container
            .bind<Store<any>>(Store)
            .toConstantValue(new Store<any>(this.storeOptions));
    }

    public static boot(...bundleCtors: BundleCtor[]): VueKernel {
        return new this(...bundleCtors);
    }

    public run(el: ComponentOptions<Vue>['el'], options: ComponentOptions<Vue> = {}): Vue {
        const app = this.mount(el, options);
        this.bundleManager.onRun(app);
        return app;
    }

    private get storeOptions(): StoreOptions<any> {
        return {
            strict: true,
            modules: this.container
                .getAll(ModuleIdTo)
                .reduce(
                    (modules, { ns, moduleId }) => ({
                        ...modules,
                        [ns]: this.container.get(moduleId),
                    }),
                    {} as Record<string, Module<any, any>>,
                ),
        };
    }

    private use(...pluginGetters: PluginGetter[]): void {
        pluginGetters.forEach(pluginGetter => {
            const [plugin, ...options] = pluginGetter();
            Vue.use(plugin, ...options);
        });
    }

    private mount(el: ComponentOptions<Vue>['el'], options: ComponentOptions<Vue> = {}): Vue {
        return new Vue({
            ...options,
            el,
            store: this.container.get(Store),
            provide: { ...options.provide, ...this.bundleManager.provide() },
            components: { ...options.components, ...this.bundleManager.components() },
            directives: { ...options.directives, ...this.bundleManager.directives() },
        });
    }

}
