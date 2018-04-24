import { pt } from '@app/entity/decorators/entity.model.property.type.decorator';
import { ResourceMeta } from '@app/bundles/app/http/Resource/ResourceMeta';

export abstract class AbstractResource {
    @pt public meta: ResourceMeta = new ResourceMeta();
}
