import { inject, injectable } from 'inversify';

import { FormBundleTypes } from '@app/bundles/form/form.bundle.types';
import { FormStateDaoRegistry } from '@app/bundles/form/state/form.state.dao.registry';
import { HttpBundleTypes } from '@app/bundles/http/HttpBundleTypes';
import { ResolversRegistry } from '@app/bundles/http/Resolver/ResolversRegistry';
import { ResponseResolver } from '@app/bundles/http/Resolver/ResponseResolver';
import { RequestParams } from '@app/bundles/http/Transport/HttpClient';
import { HttpTransport } from '@app/bundles/http/Transport/HttpTransport';
import { ObjectFlattener } from '@app/bundles/utility/object/object.flattener';

@injectable()
export class FormRequestHandler {

    private updatedResolvers: Record<string, ResponseResolver> = {};

    constructor(
        @inject(FormBundleTypes.TYPES.FormStateDaoRegistry)
        protected daoRegistry: FormStateDaoRegistry,
        @inject(HttpBundleTypes.Transport)
        protected transport: HttpTransport,
        @inject(HttpBundleTypes.Resolvers)
        protected resolvers: ResolversRegistry,
    ) {}

    public submit(
        formName: string,
        formOccupation: string = formName,
        data?: RequestParams,
    ): void {
        const dao = this.daoRegistry.get(formName);

        dao.form.lock();
        dao.clearMessages();

        const values = data || dao.collectInputValues();
        const resolverKey = `${formName}-${formOccupation}`;
        let resolver: ResponseResolver;

        if (this.updatedResolvers[resolverKey] == null) {
            resolver = this.resolvers.get(formOccupation);
            this.updatedResolvers[resolverKey] = resolver;

            resolver.success(json => dao.form.success());

            resolver.fail(res => {
                if (!('errors' in res)) {
                    throw res;
                }

                ObjectFlattener
                    .toStringMap(res.errors)
                    .forEach((value, key, map) => dao.message(key, value));

                dao.form.fail();
            });
        } else {
            resolver = this.updatedResolvers[resolverKey];
        }

        if (dao.form.action == null) {
            throw new Error(`Form [${formName}] is not provided with action.`);
        }

        const request = this.transport.request(dao.form.method, dao.form.action, values);
        resolver.resolve(request, formName);
    }

}
