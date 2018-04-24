import { DecoratorInterface } from '@app/bundles/http/Decorator/DecoratorInterface';
import { HttpClient } from '@app/bundles/http/Transport/HttpClient';

export class XhrRequestDecorator implements DecoratorInterface {
    decorate(client: HttpClient): void {
        client.headers.set('Content-Type', 'application/json');
        client.headers.set('X-Requested-With', 'XMLHttpRequest');
    }
}
