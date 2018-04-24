import { EntityBaseMapper } from '@app/entity/models/entity.base.mapper';
import { DefaultResourceModel } from '@app/bundles/app/http/Model/DefaultResourceModel';
import { interfaces } from 'inversify';

export class DefaultResourceMapper extends EntityBaseMapper<DefaultResourceModel> {

    public DataModel: interfaces.Newable<DefaultResourceMapper> = DefaultResourceMapper;

    protected mapToModel(data: any, index: number): Partial<DefaultResourceModel> {
        return {};
    }

    protected mapFromModel(model: DefaultResourceModel, index: number): any {
        return null;
    }
}
