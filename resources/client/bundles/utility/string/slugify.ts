export default function (value: string, replacement: string = '-'): string {
    return value
        .toString()
        .toLowerCase()
        .replace(/[\W\.\_]+/, replacement);
}
