import { EntityBaseMapper } from '@app/entity/models/entity.base.mapper';
import { ResourceMeta } from '@app/bundles/app/http/Resource/ResourceMeta';
import { interfaces } from 'inversify';
import { Resource } from '@app/bundles/app/http/Resource/Resource';
import { ResourceCollection } from '@app/bundles/app/http/Resource/ResourceCollection';
import { asArray } from '@app/entity/helpers/entity.value.mutator.helper';

class ResourceMetaMapper extends EntityBaseMapper<ResourceMeta> {

    public DataModel: interfaces.Newable<ResourceMeta> = ResourceMeta;

    protected mapToModel(data: any, index: number): Partial<ResourceMeta> {
        return {
            message: data.message,
            redirect: data.redirect,
            crudMode: data.crudMode,
        };
    }

    protected mapFromModel(model: ResourceMeta, index: number): any {
        return null;
    }
}

class ResourceMapper<Model extends object = object> {
    protected _metaMapper: ResourceMetaMapper = new ResourceMetaMapper();
    protected _mapper: EntityBaseMapper<Model>;

    constructor(mapper: EntityBaseMapper<Model>) {
        this._mapper = mapper;
    }

    public mapFrom(data: any): Resource<Model> {
        return Object.assign(
            new Resource(),
            {
                meta: data.meta ? this._metaMapper.mapFrom(data.meta) : new ResourceMeta(),
                model: this._mapper.mapFrom(data.data),
            },
        );
    }
}

class ResourceCollectionMapper<Model extends object = object> {
    protected _metaMapper: ResourceMetaMapper = new ResourceMetaMapper();
    protected _mapper: ResourceMapper<Model>;

    constructor(mapper: ResourceMapper<Model>) {
        this._mapper = mapper;
    }

    public mapFrom(data: any): ResourceCollection<Model> {
        const result: ResourceCollection<Model> = new ResourceCollection();
        result.meta = this._metaMapper.mapFrom(data.meta);
        result.resources = asArray(data.data).map(res => this._mapper.mapFrom(res));
        return result;
    }
}

export type ResourceResponseModel<Model extends object> = Resource<Model> | ResourceCollection<Model>;

export class ResourceResponseMapper<Model extends object = object> {
    protected _collectionMapper: ResourceCollectionMapper<Model>;
    protected _resourceMapper: ResourceMapper<Model>;

    constructor(mapper: EntityBaseMapper<Model>) {
        this._resourceMapper = new ResourceMapper<Model>(mapper);
        this._collectionMapper = new ResourceCollectionMapper<Model>(this._resourceMapper);
    }

    public mapFrom(data: any): ResourceResponseModel<Model> {
        if (!('data' in data)) {
            throw new Error('[data] property expected within response');
        }

        if (('meta' in data) && ('total' in data.meta)) {
            return this._collectionMapper.mapFrom(data);
        }

        return this._resourceMapper.mapFrom(data);
    }
}
