import { interfaces } from 'inversify';

import {
    EntityValueArrayMutator,
    EntityValueMutator,
    IEntityModelPropertyMutator,
} from '@app/entity/entity.interfaces.hub';
import { EntityBaseMapper } from '@app/entity/entity.models.hub';
import { entityMetadataCustomKeysValue } from '@app/entity/entity.values.hub';
import * as entityValueMutatorHelper from './entity.value.mutator.helper';

const { asArray, asBoolean, asDate, asNumber, asString } = entityValueMutatorHelper;
const { arrayTypeKey, objectTypeKey } = entityMetadataCustomKeysValue;

export class EntityModelPropertyMutatorHelper implements IEntityModelPropertyMutator {

    private mutators: Map<interfaces.Newable<object>, EntityValueMutator> = new Map();
    private arrayMutators: Map<interfaces.Newable<object>, EntityValueArrayMutator> = new Map();

    constructor(
        mutations: Map<interfaces.Newable<object>, EntityValueMutator> | EntityBaseMapper[] = [],
    ) {
        this.initDefaultMutators();
        if (Array.isArray(mutations)) {
            mutations.forEach(mapper => this.addMutator(mapper.DataModel, mapper));
        } else {
            mutations.forEach((mutator, targetType) => this.addMutator(targetType, mutator));
        }
    }

    public mutate<Model extends object>(
        DataModel: interfaces.Newable<Model>,
        key: keyof Model,
        value: any,
    ): any {
        const result = this.mutateValue(DataModel.prototype, key, value);
        return this.mutateValuesArray(DataModel.prototype, key, result);
    }

    public addMutator(
        targetType: interfaces.Newable<object>,
        mutator: EntityValueMutator | EntityBaseMapper,
    ): void {
        if (mutator instanceof EntityBaseMapper) {
            this.setMapperMutator(targetType, mutator);
        } else if (typeof mutator === 'function') {
            this.setFnMutator(targetType, mutator);
        }
    }

    public removeMutator(targetType: interfaces.Newable<object>): void {
        this.mutators.delete(targetType);
        this.arrayMutators.delete(targetType);
    }

    private initDefaultMutators(): void {
        this.addMutator(Array, asArray);
        this.addMutator(Boolean, asBoolean);
        this.addMutator(Date, asDate);
        this.addMutator(Number, asNumber);
        this.addMutator(String, asString);
    }

    private mutateValue(proto: Object, key: string, value: any): any {
        let targetType = Reflect.getMetadata('design:type', proto, key);
        if (targetType === Object) targetType = Reflect.getMetadata(objectTypeKey, proto, key);
        if (!this.mutators.has(targetType)) return value;
        return this.mutators.get(targetType)!(value);
    }

    private mutateValuesArray(proto: Object, key: string, values: any): any[] {
        const targetType = Reflect.getMetadata(arrayTypeKey, proto, key);
        if (!this.arrayMutators.has(targetType) || !Array.isArray(values)) return values;
        return this.arrayMutators.get(targetType)!(values);
    }

    private setFnMutator(
        targetType: interfaces.Newable<object>,
        mutator: EntityValueMutator,
    ): void {
        this.mutators.set(targetType, mutator);
        this.arrayMutators.set(targetType, (values: any[]) => values.map(mutator));
    }

    private setMapperMutator(
        targetType: interfaces.Newable<object>,
        mutator: EntityBaseMapper,
    ): void {
        this.mutators.set(targetType, (value: any) => mutator.mapFrom(value));
        this.arrayMutators.set(targetType, (values: any[]) => mutator.mapIterableFrom(values));
    }

}
