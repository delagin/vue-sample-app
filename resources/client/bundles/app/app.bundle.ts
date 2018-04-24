import { Container } from 'inversify';
import Vue from 'vue';
import Notifications from 'vue-notification';

import {
    IBundle,
    IPluginsProviderBundle,
    IRunHandlerBundle,
    PluginGetter,
} from '@app/bundles/app/bundle.manager';
import {
    LaravelCsrfTokenDecorator,
} from '@app/bundles/app/http/Decorator/LaravelCsrfTokenDecorator';
import { DefaultResourceMapper } from '@app/bundles/app/http/Mapper/DefaultResourceMapper';
import { MessageResolver } from '@app/bundles/app/http/Resolver/MessageResolver';
import { RedirectResolver } from '@app/bundles/app/http/Resolver/RedirectResolver';
import { ResourceMappingResolver } from '@app/bundles/app/http/Resolver/ResourceMappingResolver';
import {
    ValidationMappingResolver,
} from '@app/bundles/app/http/Resolver/ValidationMappingResolver';
import { CredentialsDecorator } from '@app/bundles/http/Decorator/CredentialsDecorator';
import { XhrRequestDecorator } from '@app/bundles/http/Decorator/XhrRequestDecorator';
import { HttpBundleTypes } from '@app/bundles/http/HttpBundleTypes';
import { ResolversRegistry } from '@app/bundles/http/Resolver/ResolversRegistry';
import { ResponseResolver } from '@app/bundles/http/Resolver/ResponseResolver';
import { HttpTransport } from '@app/bundles/http/Transport/HttpTransport';
import { dateFormat } from '@app/bundles/utility/date/date.format';

export class AppBundle
implements IBundle, IPluginsProviderBundle, IRunHandlerBundle {

    public plugins(): PluginGetter[] {
        return [
            () => [Notifications],
        ];
    }

    public onRun(app: Vue): void {
        Vue.filter('dateFormat', dateFormat);
    }

    public bind(container: Container): void {
        container
            .rebind<HttpTransport>(HttpBundleTypes.Transport)
            .to(HttpTransport)
            .onActivation((context, transport) => {
                return transport
                    .decorate(new XhrRequestDecorator())
                    .decorate(new CredentialsDecorator())
                    .decorate(new LaravelCsrfTokenDecorator());
            });
        container
            .rebind<ResolversRegistry>(HttpBundleTypes.Resolvers)
            .to(ResolversRegistry)
            .onActivation((context, resolvers) => {
                resolvers.default = ResponseResolver
                    .init()
                    .fail(new ValidationMappingResolver())
                    .success(new ResourceMappingResolver(new DefaultResourceMapper()))
                    .success(new MessageResolver())
                    .success(new RedirectResolver());
                return resolvers;
            });
    }

}
