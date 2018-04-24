import { inject, injectable } from 'inversify';

import { HttpClient, RequestParams } from '@app/bundles/http/Transport/HttpClient';
import { HttpBundleTypes } from '@app/bundles/http/HttpBundleTypes';
import { HttpMethods } from '@app/bundles/http/Enum/HttpMethods';
import { QueryString } from '@app/bundles/utility/string/query.string';
import { DecoratorInterface } from '@app/bundles/http/Decorator/DecoratorInterface';

interface UrlObject {
    uri: string;
    params: RequestParams;
}

export type UrlType = string | UrlObject;

@injectable()
export class HttpTransport {
    private _client: HttpClient;
    private _decorators: DecoratorInterface[];

    constructor(@inject(HttpBundleTypes.HttpClient) client: HttpClient) {
        this._client = client;
        this._decorators = [];
    }

    public request(method: HttpMethods, url: UrlType, params?: RequestParams): Promise<any> {
        return this.doRequest(method, url, params);
    }

    public get(url: UrlType, params?: RequestParams): Promise<any> {
        return this.doRequest(HttpMethods.get, url, params);
    }

    public post(url: UrlType, data: RequestParams): Promise<any> {
        return this.doRequest(HttpMethods.post, url, data);
    }

    public put(url: UrlType, data: RequestParams): Promise<any> {
        return this.doRequest(HttpMethods.put, url, data);
    }

    public patch(url: UrlType, data: RequestParams): Promise<any> {
        return this.doRequest(HttpMethods.patch, url, data);
    }

    public delete(url: UrlType, data?: RequestParams): Promise<any> {
        return this.doRequest(HttpMethods.delete, url, data);
    }

    protected doRequest(method: HttpMethods, url: UrlType, params?: RequestParams): Promise<any> {
        return this.client.request(method, this.normalizeUrl(url), params);
    }

    public decorate(decorator: DecoratorInterface): HttpTransport {
        this._decorators.push(decorator);

        return this;
    }

    protected get client(): HttpClient {
        this._decorators
            .forEach((decorator) => {
                decorator.decorate(this._client);
            });

        return this._client;
    }

    protected normalizeUrl(url: UrlType): string {
        if (typeof url === 'string') {
            return url;
        }

        return QueryString.append(url.uri, url.params);
    }
}
