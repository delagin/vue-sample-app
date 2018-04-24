import { interfaces } from 'inversify';

import { ValidationResponseModel } from '@app/bundles/app/http/Model/ValidationResponseModel';
import { EntityBaseMapper } from '@app/entity/models/entity.base.mapper';

export class ValidationResponseModelMapper extends EntityBaseMapper<ValidationResponseModel> {
    public DataModel: interfaces.Newable<ValidationResponseModel> = ValidationResponseModel;

    protected mapToModel(data: any, index: number): Partial<ValidationResponseModel> {
        return {
            message: data.message,
            errors: data.errors,
        };
    }

    protected mapFromModel(model: ValidationResponseModel, index: number): any {
        return null;
    }
}
