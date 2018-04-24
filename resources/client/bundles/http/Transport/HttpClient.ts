import { HttpMethods } from '@app/bundles/http/Enum/HttpMethods';
import { QueryString } from '@app/bundles/utility/string/query.string';
import { injectable } from 'inversify';

export type RequestParams = object;

@injectable()
export class HttpClient {
    private _headers: Headers = new Headers();
    private _options: RequestInit = {};

    get headers(): Headers {
        return this._headers;
    }

    get options(): RequestInit {
        return this._options;
    }

    set options(value: RequestInit) {
        this._options = value;
    }

    public async request(method: HttpMethods, action: string, data?: RequestParams): Promise<any> {
        if (!action) {
            return Promise.reject('Invalid request URL');
        }

        let config: RequestInit = { method: method.toUpperCase() };

        if (data instanceof FormData) {
            this.headers.delete('Content-Type');
            config.body = data;
        } else if (data != null && Object.keys(data).length !== 0) {
            if (this.hasBody(method)) {
                config.body = JSON.stringify(data);
            } else {
                action = QueryString.append(action, data);
            }
        }

        config = Object.assign({}, this.options, config, { headers: this.headers });

        const res = await fetch(action, config);

        if (res.status >= 400) {
            throw res;
        }

        return res.json();
    }

    protected hasBody(method: HttpMethods): boolean {
        const noBodyMethods: string[] = [
            HttpMethods.get,
            HttpMethods.head,
            HttpMethods.options,
        ];

        return !noBodyMethods.includes(method);
    }
}
