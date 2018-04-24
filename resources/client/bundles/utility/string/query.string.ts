export class QueryString {
    public static append(url: string, params: object = {}): string {
        const paramMap = Object.entries(params)
                               .map(([key, value]) => `${key}=${value}`)
                               .join('&');

        return paramMap === '' ? url : `${url}?${paramMap}`;
    }
}
