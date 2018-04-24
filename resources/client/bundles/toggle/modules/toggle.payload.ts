import { ToggleTo } from './dto/toggle.to';

export class BasePayload {

    constructor(
        public readonly name: string,
    ) {}

}

export class ModelPayload extends BasePayload {

    constructor(
        name: string,
        public readonly model: ToggleTo,
    ) {
        super(name);
    }

}

export const togglePayloadFactory = {

    base(name: string): BasePayload {
        return new BasePayload(name);
    },

    model(name: string, visible: boolean): ModelPayload {
        return new ModelPayload(name, new ToggleTo(name, visible));
    },

};
