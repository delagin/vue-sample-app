import { AbstractResource } from '@app/bundles/app/http/Resource/AbstractResource';
import { pt } from '@app/entity/decorators/entity.model.property.type.decorator';

export class Resource<Model extends object = object> extends AbstractResource {
    @pt public model!: Model;
}
