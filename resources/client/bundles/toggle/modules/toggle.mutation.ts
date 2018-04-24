import { injectable } from 'inversify';

import { DefaultMutation } from '@app/bundles/utility/state/default.helper';
import { BasePayload, ModelPayload } from './toggle.payload';
import { ToggleState } from './toggle.state';

type ToggleMutation<Payload extends BasePayload> = (state: ToggleState, payload: Payload) => void;

@injectable()
export class ToggleModuleMutation extends DefaultMutation<ToggleState> {

    public attach: ToggleMutation<ModelPayload> = (state, { name, model }) => {
        state.register(name, model);
    }

    public show: ToggleMutation<BasePayload> = (state, { name }) => {
        if (!state.has(name)) state.register(name);
        state.get(name).visible = true;
    }

    public hide: ToggleMutation<BasePayload> = (state, { name }) => {
        if (!state.has(name)) state.register(name);
        state.get(name).visible = false;
    }

    public toggle: ToggleMutation<BasePayload> = (state, { name }) => {
        const toggle = state.get(name);
        toggle.visible = !toggle.visible;
    }

}
