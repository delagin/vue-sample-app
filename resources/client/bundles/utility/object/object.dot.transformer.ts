type Subject = Record<string, any>;

export class ObjectDotTransformer {
    public static collapse(input: Subject): Map<string, any> {
        return new Map<string, any>();
    }

    public static expand(input: Map<string, any>): Subject {
        let result = {};

        input.forEach((value, key, map) => {result = Object.assign(result, this.doExpand(key, input.get(key), result))});

        return result;
    }

    protected static doExpand(key: string, value: any, result: Subject): Subject {
        const keyParts = key.split('.');

        if (keyParts.length > 1) {
            const firstKey: string = keyParts.shift()!;
            let container = firstKey in result ? result[firstKey] : {};

            result[firstKey] = this.doExpand(keyParts.join('.'), value, container);
        } else {
            result[key] = value;
        }

        return result;
    }
}
