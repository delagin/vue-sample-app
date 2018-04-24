import { pt } from '@app/entity/decorators/entity.model.property.type.decorator';
import { CrudModes } from '@app/bundles/app/http/Enum/CrudModes';

export class ResourceMeta {
    @pt public crudMode: CrudModes = CrudModes.none;
    @pt public message: string | null = null;
    @pt public redirect: string | null = null;

    public isCrudResource(): boolean {
        return this.crudMode !== CrudModes.none;
    }

    public hasMessage(): boolean {
        return !!this.message;
    }

    public hasRedirect(): boolean {
        return !!this.redirect;
    }
}
