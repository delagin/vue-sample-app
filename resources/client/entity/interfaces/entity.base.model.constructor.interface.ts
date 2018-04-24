import { EntityBaseModel } from '@app/entity/entity.models.hub';

export interface IEntityBaseModelConstructor<Instance extends EntityBaseModel = EntityBaseModel> {
    new (...args: any[]): Instance;
    is<Model extends EntityBaseModel>(
        this: IEntityBaseModelConstructor<Model>,
        value: any,
    ): boolean;
    are(...values: any[]): boolean;
    init<Model extends EntityBaseModel, Config extends Model>(
        this: IEntityBaseModelConstructor<Model>,
        config?: Partial<Config>,
    ): Model;
    initGroup<Model extends EntityBaseModel, Config extends Model>(
        this: IEntityBaseModelConstructor<Model>,
        ...configs: Partial<Config>[],
    ): Model[];
}
