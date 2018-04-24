import { ResolverInterface } from '@app/bundles/http/Resolver/ResolverInterface';
import { EntityBaseMapper } from '@app/entity/models/entity.base.mapper';
import { ResourceResponseMapper } from '@app/bundles/app/http/Resource/Mapper/ResourceResponseMapper';

export class ResourceMappingResolver<Model extends object> implements ResolverInterface {
    protected _mapper: EntityBaseMapper<Model>;

    constructor(mapper: EntityBaseMapper<Model>) {
        this._mapper = mapper;
    }

    resolve(response: any): any {
        const resourceResponseMapper = new ResourceResponseMapper<Model>(this._mapper);
        return resourceResponseMapper.mapFrom(response);
    }
}
