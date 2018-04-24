import { interfaces } from 'inversify';
import { Module } from 'vuex';

export class ModuleIdTo {

    constructor(
        public readonly ns: string,
        public readonly moduleId: interfaces.ServiceIdentifier<Module<any, any>>,
    ) {}

}
