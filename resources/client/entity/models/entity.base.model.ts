import { IEntityBaseModelConstructor } from '@app/entity/entity.interfaces.hub';

export class EntityBaseModel {

    public static is<Model extends EntityBaseModel>(
        this: IEntityBaseModelConstructor<Model>,
        value: any,
    ): value is Model {
        if (typeof value !== 'object') return false;
        if (value instanceof this) return true;
        return (model => Object.keys(value).every(key => key in model))(new this());
    }

    public static are(...values: any[]): boolean {
        return Array.isArray(values) && values.every(value => this.is(value));
    }

    public static init<Model extends EntityBaseModel, Config extends Model>(
        this: IEntityBaseModelConstructor<Model>,
        config?: Partial<Config>,
    ): Model {
        const model = new this();
        const cleanConfig = Object.entries(config || {})
            .filter(([key, value]) => key in model && value !== undefined)
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        return Object.assign(model, cleanConfig);
    }

    public static initGroup<Model extends EntityBaseModel, Config extends Model>(
        this: IEntityBaseModelConstructor<Model>,
        ...configs: Partial<Config>[],
    ): Model[] {
        return configs.map(config => this.init(config));
    }

}
