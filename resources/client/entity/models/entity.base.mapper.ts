import { injectable, interfaces, unmanaged } from 'inversify';

import {
    EntityModelPropertyMutatorHelper,
} from '@app/entity/entity.helpers.hub';
import {
    EntityValueMutator,
    IEntityBaseModelConstructor,
    IEntityModelPropertyMutator,
} from '@app/entity/entity.interfaces.hub';

type MutationConfig
    = IEntityModelPropertyMutator
    | Map<interfaces.Newable<object>, EntityValueMutator>
    | EntityBaseMapper[];

@injectable()
export abstract class EntityBaseMapper<Model extends object = object, Input = any, Output = Input> {

    public abstract DataModel: IEntityBaseModelConstructor<Model> | interfaces.Newable<Model>;

    private valueMutator: IEntityModelPropertyMutator;

    constructor(
        @unmanaged()
        mutationConfig: MutationConfig = new EntityModelPropertyMutatorHelper(),
        @unmanaged()
        private valueFilter: ((value: any) => boolean) = (value => value != null),
    ) {
        this.valueMutator = (mutationConfig instanceof Map || Array.isArray(mutationConfig))
            ? new EntityModelPropertyMutatorHelper(mutationConfig)
            : mutationConfig;
    }

    public mapFrom(data: Input, index: number = 0, ...args: any[]): Model {
        return this.hydrateModel(this.mapToModel(data, index, ...args));
    }

    public mapIterableFrom(data: Input[], ...args: any[]): Model[] {
        return Array.from(data).map((item, index) => this.mapFrom(item, index, ...args));
    }

    public mapTo(model: Model, index: number = 0): Output {
        return this.mapFromModel(model, index);
    }

    public mapIterableTo(model: Model[]): Output[] {
        return Array.from(model).map((item, index) => this.mapTo(item, index));
    }

    protected abstract mapToModel(data: Input, index: number, ...args: any[]): Partial<Model>;

    protected abstract mapFromModel(model: Model, index: number): Output;

    private hydrateModel(mappedData: Partial<Model>): Model {
        return Object.entries(mappedData)
            .filter(([key, value]) => this.valueFilter(value))
            .reduce(
                (model: Model, [key, value]) => {
                    const name = key as keyof Model;
                    model[name] = this.valueMutator.mutate(this.DataModel, name, value);
                    return model;
                },
                new this.DataModel(),
            );
    }

}
