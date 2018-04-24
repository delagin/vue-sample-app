import { ResolverInterface } from '@app/bundles/http/Resolver/ResolverInterface';
import { ValidationResponseModelMapper } from '@app/bundles/app/http/Mapper/ValidationResponseModelMapper';

export class ValidationMappingResolver implements ResolverInterface {
    protected _mapper: ValidationResponseModelMapper;

    constructor() {
        this._mapper = new ValidationResponseModelMapper();
    }

    async resolve(response: any): Promise<any> {
        if (!(response instanceof Response)) {
            throw response;
        }

        if (response.status !== 422) {
            throw response;
        }

        throw this._mapper.mapFrom(await response.json());
    }
}
