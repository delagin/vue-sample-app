import { DecoratorInterface } from '@app/bundles/http/Decorator/DecoratorInterface';
import { HttpClient } from '@app/bundles/http/Transport/HttpClient';

export class LaravelCsrfTokenDecorator implements DecoratorInterface {
    protected tokenSelector: string;

    constructor(tokenSelector: string = 'meta[name="csrf-token"]') {
        this.tokenSelector = tokenSelector;
    }

    decorate(client: HttpClient): void {
        client.headers.set('X-CSRF-TOKEN', this.getToken());
    }

    private getToken(): string {
        const meta: HTMLMetaElement | null = document.head.querySelector(this.tokenSelector);
        const token = meta && meta.content;
        if (token == null) throw new Error('Failed to find CSRF-TOKEN');
        return token;
    }
}
