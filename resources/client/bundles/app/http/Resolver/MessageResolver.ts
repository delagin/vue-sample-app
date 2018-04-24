import Vue from 'vue';

import { ResolverInterface } from '@app/bundles/http/Resolver/ResolverInterface';
import { AbstractResource } from '@app/bundles/app/http/Resource/AbstractResource';

export class MessageResolver implements ResolverInterface {

    private bus: Vue = new Vue();

    resolve(response: any): any {
        if ((<AbstractResource>response).meta === undefined) {
            return response;
        }

        if (!response.meta.hasMessage()) {
            return response;
        }

        if (response.meta.hasRedirect()) {
            localStorage.setItem('REDIRECT_MESSAGE', `${response.meta.message}`);

            return response;
        }

        this.bus.$notify(Object.assign({}, {
            group: 'notification-default',
            duration: 3000,
            type: 'success',
            text: response.meta.message,
        }));

        return response;
    }
}
