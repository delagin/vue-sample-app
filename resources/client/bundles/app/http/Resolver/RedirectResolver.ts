import { ResolverInterface } from '@app/bundles/http/Resolver/ResolverInterface';
import { AbstractResource } from '@app/bundles/app/http/Resource/AbstractResource';

export class RedirectResolver implements ResolverInterface {

    resolve(response: any): any {
        if ((<AbstractResource>response).meta === undefined) {
            return response;
        }

        if (!response.meta.hasRedirect()) {
            return response;
        }

        window.location.href = `${response.meta.redirect}`

        return response;
    }
}
