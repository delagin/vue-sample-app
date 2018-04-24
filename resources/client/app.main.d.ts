/// <reference path='./vendor/vendor.module.d.ts' />

declare module '*.template' {
    export default function(...args: any[]): string;
}

declare module '*.style' {
    const stylesMap: { [prop: string]: string };
    export = stylesMap;
}

declare module '@img/*' {
    const imgUrl: string;
    export = imgUrl;
}
