import { interfaces } from 'inversify';

import { EntityBaseMapper } from '@app/entity/entity.models.hub';
import { EntityValueMutator } from './entity.value.type';

export interface IEntityModelPropertyMutator {
    mutate<Model extends object>(
        DataModel: interfaces.Newable<Model>,
        key: keyof Model,
        value: any,
    ): any;
    addMutator(
        targetType: interfaces.Newable<object>,
        mutator: EntityValueMutator | EntityBaseMapper,
    ): void;
    removeMutator(targetType: interfaces.Newable<object>): void;
}
