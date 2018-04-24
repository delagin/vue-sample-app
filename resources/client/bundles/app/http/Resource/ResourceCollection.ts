import { AbstractResource } from '@app/bundles/app/http/Resource/AbstractResource';
import { Resource } from '@app/bundles/app/http/Resource/Resource';
import { pt } from '@app/entity/decorators/entity.model.property.type.decorator';

export class ResourceCollection<Model extends object> extends AbstractResource {

    @pt public resources: Resource<Model>[] = [];

    public get models(): Model[] {
        return this.resources.map(res => res.model);
    }

}
