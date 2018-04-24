import { IBundle, IComponentsProviderBundle, IServicesProviderBundle, } from '@app/bundles/app/bundle.manager';
import { Container, interfaces } from 'inversify';
import { FormState } from '@app/bundles/form/state/form.state.module/state';
import { FormBundleTypes } from '@app/bundles/form/form.bundle.types';
import { Module } from 'vuex';
import { FormStateModule } from '@app/bundles/form/state/form.state.module';
import { FormStateDaoRegistry } from '@app/bundles/form/state/form.state.dao.registry';
import { FormRequestHandler } from '@app/bundles/form/service/form.request.handler';
import { StateMutations } from '@app/bundles/form/state/form.state.module/state.mutators';
import { StateGetters } from '@app/bundles/form/state/form.state.module/state.getters';
import { ModuleIdTo } from '@app/bundles/app/module.id.to';
import * as FormComponents from './form.components.hub';
import { Component } from 'vue';

export class FormBundle implements IBundle, IServicesProviderBundle, IComponentsProviderBundle {
    public static get components(): Record<string, Component> {
        return {
            'form-main': FormComponents.FormComponent,
            'input-main': FormComponents.InputComponent,
            'hidden-input': FormComponents.HiddenInputComponent,
            'checkbox-main': FormComponents.CheckboxComponent,
            'textarea-main': FormComponents.TextareaComponent,
            'form-button': FormComponents.ButtonComponent,
            'form-remote-button': FormComponents.RemoteButtonComponent,
            'datepicker-main': FormComponents.DatepickerComponent,
            'datepicker-range': FormComponents.DatepickerRangeComponent,
        };
    }

    public bind(container: Container): void {
        const formModuleNamespace = 'formModule';

        container.bind<FormState>(FormBundleTypes.TYPES.FormState)
                 .to(FormState);
        container.bind<Module<any, any>>(FormBundleTypes.TYPES.FormStateModule)
                 .to(FormStateModule);
        container.bind<string>(FormBundleTypes.TYPES.FormStateModuleNamespace)
                 .toConstantValue(formModuleNamespace);
        container.bind<StateMutations>(FormBundleTypes.TYPES.FormStateModuleMutations)
                 .to(StateMutations);
        container.bind<StateGetters>(FormBundleTypes.TYPES.FormStateModuleGetters)
                 .to(StateGetters);
        container.bind<FormStateDaoRegistry>(FormBundleTypes.TYPES.FormStateDaoRegistry)
                 .to(FormStateDaoRegistry);
        container.bind<FormRequestHandler>(FormBundleTypes.TYPES.FormRequestHandler)
                 .to(FormRequestHandler);

        container.bind(ModuleIdTo)
                 .toConstantValue(
                     new ModuleIdTo(formModuleNamespace, FormBundleTypes.TYPES.FormStateModule));
    }

    services(): interfaces.ServiceIdentifier<any>[] {
        return [
            FormBundleTypes.TYPES.FormStateDaoRegistry,
            FormBundleTypes.TYPES.FormRequestHandler,
        ];
    }

    components(): Record<string, Component> {
        return FormBundle.components;
    }
}
