import { DecoratorInterface } from '@app/bundles/http/Decorator/DecoratorInterface';
import { HttpClient } from '@app/bundles/http/Transport/HttpClient';

export class CredentialsDecorator implements DecoratorInterface {
    protected _credentials: RequestCredentials;

    constructor(credentials: RequestCredentials = 'same-origin') {
        this._credentials = credentials;
    }

    decorate(client: HttpClient): void {
        client.options.credentials = this._credentials;
    }
}
