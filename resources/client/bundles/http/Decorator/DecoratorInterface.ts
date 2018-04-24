import { HttpClient } from '@app/bundles/http/Transport/HttpClient';

export interface DecoratorInterface {
    decorate(client: HttpClient): void;
}
