export function splitStringProp(prop: string): string[] {
    return prop.trim().split(' ').filter(item => !!item);
}

export function enumValidatorFactory(enumBody: object): (value: any) => boolean {
    const enumValues = Object.values(enumBody);
    return value => enumValues.includes(value);
}

export function enumMultiValidatorFactory(enumBody: object): (value: any | any[]) => boolean {
    const enumValidator = enumValidatorFactory(enumBody);
    return value => Array.isArray(value)
        ? value.every(enumValidator)
        : enumValidator(value);
}
