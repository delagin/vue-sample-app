import { Container, interfaces } from 'inversify';
import { Component } from 'vue';
import { Module } from 'vuex';

import {
    IBundle,
    IComponentsProviderBundle,
    IServicesProviderBundle,
} from '@app/bundles/app/bundle.manager';
import { ModuleIdTo } from '@app/bundles/app/module.id.to';
import { ToggleContainerComponent } from './components/toggle.container.component';
import { ToggleControlComponent } from './components/toggle.control.component';
import {
    ToggleDependentContainerComponent,
} from './components/toggle.dependent.container.component';
import { ToggleDao } from './modules/toggle.dao';
import { ToggleModuleGetter } from './modules/toggle.getter';
import { ToggleModule } from './modules/toggle.module';
import { ToggleModuleMutation } from './modules/toggle.mutation';
import { ToggleState } from './modules/toggle.state';
import { toggleBundleType } from './toggle.bundle.type';

export class ToggleBundle
implements IBundle, IServicesProviderBundle, IComponentsProviderBundle {

    private readonly ns: string = 'toggle-module';

    public static get components(): Record<string, Component> {
        return {
            'toggle-container': ToggleContainerComponent,
            'toggle-dependent': ToggleDependentContainerComponent,
            'toggle-control': ToggleControlComponent,
        };
    }

    public components(): Record<string, Component> {
        return ToggleBundle.components;
    }

    public services(): interfaces.ServiceIdentifier<any>[] {
        return [
            toggleBundleType.Dao,
        ];
    }

    public bind(container: Container): void {
        container
            .bind<ToggleState>(toggleBundleType.State)
            .to(ToggleState);
        container
            .bind<Module<ToggleState, any>>(toggleBundleType.Module)
            .to(ToggleModule);
        container
            .bind(toggleBundleType.ModuleNamespace)
            .toConstantValue(this.ns);
        container
            .bind<ToggleModuleMutation>(toggleBundleType.Mutation)
            .to(ToggleModuleMutation);
        container
            .bind<ToggleModuleGetter>(toggleBundleType.Getter)
            .to(ToggleModuleGetter);
        container
            .bind<ToggleDao>(toggleBundleType.Dao)
            .to(ToggleDao);
        container
            .bind(ModuleIdTo)
            .toConstantValue(new ModuleIdTo(this.ns, toggleBundleType.Module));
    }

}
