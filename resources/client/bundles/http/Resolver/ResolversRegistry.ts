import { injectable } from 'inversify';

import { ResolverCallback } from '@app/bundles/http/Resolver/Resolver/CallbackResolver';
import { ResolverInterface } from '@app/bundles/http/Resolver/ResolverInterface';
import { ResponseResolver } from '@app/bundles/http/Resolver/ResponseResolver';

type Resolver = ResolverInterface | ResolverCallback;

export interface ResolverConfig {
    success: Resolver[];
    error: Resolver[];
}

@injectable()
export class ResolversRegistry {

    protected resolver: Record<string, ResponseResolver> = {};
    private defaultResolver?: ResponseResolver;

    public set default(value: ResponseResolver) {
        this.defaultResolver = value;
    }

    public register(
        id: string,
        config: ResolverConfig = { success: [], error: [] },
        merge: boolean = true,
    ): ResponseResolver {
        const given = this.makeResolver(config);

        if (merge && this.has(id)) {
            this.resolver[id].merge(given);
        }

        return (this.resolver[id] = given);
    }

    public has(id: string): boolean {
        return id in this.resolver;
    }

    public get(id: string): ResponseResolver {
        if (this.has(id)) return this.resolver[id];
        if (this.defaultResolver != null) return this.defaultResolver;
        throw new Error(`Response resolver for id [${id}] does not exist.`);
    }

    public makeResolver(config: ResolverConfig = { success: [], error: [] }): ResponseResolver {
        return ResponseResolver
            .init()
            .success(...config.success)
            .fail(...config.error);
    }

}
