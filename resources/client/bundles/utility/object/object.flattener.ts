type Subject = Record<string, any>;

export class ObjectFlattener {

    public static toStringMap(object: Subject, glue: string = '<br>'): Map<string, string> {
        const map = new Map<string, string>();

        Object.entries(object)
              .map(([key, value]) => map.set(key, this.valueToString(value, glue)));

        return map;
    }

    protected static valueToString(value: Subject | String[] | String, glue: string): string {
        if (typeof value === 'string') {
            return value;
        }

        if (Array.isArray(value)) {
            return value.join(glue)
        }

        return Object.entries(value)
                     .map(([key, value]) => this.valueToString(value, glue))
                     .join(glue);

    }
}
