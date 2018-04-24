import { Container, interfaces } from 'inversify';
import Vue, { ComponentOptions, PluginFunction, PluginObject } from 'vue';

type ServiceProvider = IBundle & IServicesProviderBundle;
type ComponentProvider = IBundle & IComponentsProviderBundle;
type DirectiveProvider = IBundle & IDirectivesProviderBundle;
type PluginProvider = IBundle & IPluginsProviderBundle;
type RunHandler = IBundle & IRunHandlerBundle;

type Plugin<Config> = PluginFunction<Config> | PluginObject<Config>;

export type BundleCtor = interfaces.Newable<IBundle>;
export type ServiceId = interfaces.ServiceIdentifier<any>;
export type PluginGetter = <Config = any>() => [Plugin<Config>, Config] | [Plugin<any>];

export interface IBundle {
    bind(container: Container): void;
}

export interface IServicesProviderBundle {
    services(): ServiceId[];
}

export interface IComponentsProviderBundle {
    components(): ComponentOptions<Vue>['components'];
}

export interface IDirectivesProviderBundle {
    directives(): ComponentOptions<Vue>['directives'];
}

export interface IPluginsProviderBundle {
    plugins(): PluginGetter[];
}

export interface IRunHandlerBundle {
    onRun(app: Vue): void;
}

export class BundleManager {

    protected bundles: IBundle[];

    constructor(
        protected container: Container,
        ...bundleCtors: BundleCtor[],
    ) {
        this.bundles = bundleCtors.map(BundleConstructor => new BundleConstructor());
        this.bundles.forEach(bundle => bundle.bind(this.container));
    }

    public provide(): ComponentOptions<Vue>['provide'] {
        const getKey = (id: ServiceId) => typeof id === 'symbol' ? id : id.toString();
        return this.bundles
            .filter((bundle: IBundle): bundle is ServiceProvider => 'services' in bundle)
            .reduce((ids, bundle) => ids.concat(bundle.services()), [] as ServiceId[])
            .reduce((services, id) => ({ ...services, [getKey(id)]: this.container.get(id) }), {});
    }

    public components(): ComponentOptions<Vue>['components'] {
        return this.bundles
            .filter((bundle: IBundle): bundle is ComponentProvider => 'components' in bundle)
            .reduce((components, bundle) => ({ ...components, ...bundle.components() }), {});
    }

    public directives(): ComponentOptions<Vue>['directives'] {
        return this.bundles
            .filter((bundle: IBundle): bundle is DirectiveProvider => 'directives' in bundle)
            .reduce((directives, bundle) => ({ ...directives, ...bundle.directives() }), {});
    }

    public use(): PluginGetter[] {
        return this.bundles
            .filter((bundle: IBundle): bundle is PluginProvider => 'plugins' in bundle)
            .reduce((plugins, bundle) => [...plugins, ...bundle.plugins()], [] as PluginGetter[]);
    }

    public onRun(app: Vue): void {
        this.bundles
            .filter((bundle: IBundle): bundle is RunHandler => 'onRun' in bundle)
            .forEach(bundle => bundle.onRun(app));
    }

}
