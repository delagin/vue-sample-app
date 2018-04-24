import {
    CallbackResolver,
    ResolverCallback,
} from '@app/bundles/http/Resolver/Resolver/CallbackResolver';
import { ResolverInterface } from '@app/bundles/http/Resolver/ResolverInterface';

enum responseHandlerType {
    success,
    fail,
}

interface ResponseHandler {
    type: responseHandlerType;
    resolver: ResolverInterface;
}

export type Resolver = ResolverInterface | ResolverCallback;

export class ResponseResolver {

    protected handlers: ResponseHandler[] = [];

    public static init(): ResponseResolver {
        return new this();
    }

    public reset(): ResponseResolver {
        this.handlers.splice(0, Infinity);
        return this;
    }

    public success(...handlers: Resolver[]): ResponseResolver {
        this.pushHandlers(responseHandlerType.success, ...handlers);
        return this;
    }

    public fail(...handlers: Resolver[]): ResponseResolver {
        this.pushHandlers(responseHandlerType.fail, ...handlers);
        return this;
    }

    public merge(resolver: ResponseResolver): ResponseResolver {
        this.handlers.push(...resolver.handlers);
        return this;
    }

    public resolve(response: Promise<Response>, ...args: any[]): void {
        this.handlers.reduce(
            (promise, { type, resolver }) => {
                const cb = (value: any) => resolver.resolve(value, ...args);
                return (type === responseHandlerType.success)
                    ? promise.then(cb)
                    : promise.catch(cb);
            },
            response,
        );
    }

    protected pushHandlers(type: responseHandlerType, ...handlers: Resolver[]): void {
        handlers.forEach(handler => {
            const resolver = this.makeResolver(handler);
            this.handlers.push({ type, resolver });
        });
    }

    protected makeResolver(resolver: Resolver): ResolverInterface {
        return (typeof resolver === 'function')
            ? new CallbackResolver(resolver)
            : resolver;
    }

}
