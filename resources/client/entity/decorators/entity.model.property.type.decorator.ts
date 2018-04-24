import { interfaces } from 'inversify';

import { entityMetadataCustomKeysValue } from '@app/entity/entity.values.hub';

const { arrayTypeKey, objectTypeKey } = entityMetadataCustomKeysValue;

export function pt(proto: Function | Object, prop: string): void;
export function pt(detailedType: interfaces.Newable<object>): Function;
export function pt(
    detailedType: interfaces.Newable<object> | Function | Object,
    prop?: string,
): Function | void {
    if (prop != null) return;
    return (target: Function | Object, key: string) => {
        const targetType = Reflect.getMetadata('design:type', target, key);
        if (targetType === Array) {
            Reflect.defineMetadata(arrayTypeKey, detailedType, target, key);
        }
        if (targetType === Object) {
            Reflect.defineMetadata(objectTypeKey, detailedType, target, key);
        }
    };
}
