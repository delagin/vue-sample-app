import { Container } from 'inversify';

import { IBundle, IServicesProviderBundle, ServiceId } from '@app/bundles/app/bundle.manager';
import { HttpBundleTypes } from '@app/bundles/http/HttpBundleTypes';
import { ResolversRegistry } from '@app/bundles/http/Resolver/ResolversRegistry';
import { HttpClient } from '@app/bundles/http/Transport/HttpClient';
import { HttpTransport } from '@app/bundles/http/Transport/HttpTransport';

export class HttpBundle implements IBundle, IServicesProviderBundle {

    public bind(container: Container): void {
        container
            .bind(HttpBundleTypes.HttpClient)
            .to(HttpClient);
        container
            .bind(HttpBundleTypes.Transport)
            .to(HttpTransport);
        container
            .bind<ResolversRegistry>(HttpBundleTypes.Resolvers)
            .to(ResolversRegistry);
    }

    public services(): ServiceId[] {
        return [
            HttpBundleTypes.Transport,
            HttpBundleTypes.Resolvers,
        ];
    }
}
