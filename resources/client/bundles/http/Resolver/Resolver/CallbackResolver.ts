import { ResolverInterface } from '@app/bundles/http/Resolver/ResolverInterface';

export type ResolverCallback = ((res: any, ...args: any[]) => any);

export class CallbackResolver implements ResolverInterface {

    constructor(
        protected callback: ResolverCallback,
    ) {}

    public resolve(response: any, ...args: any[]): any {
        return this.callback(response, ...args);
    }

}
