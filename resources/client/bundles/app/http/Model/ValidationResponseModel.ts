import { pt } from '@app/entity/decorators/entity.model.property.type.decorator';

export class ValidationResponseModel {
    @pt public message: string = '';
    @pt public errors: Record<string, string[]> = {};
}
