import { FormElementPayload } from '../payload/form.element.payload';
import { FormState } from './state';
import { Mutation, MutationTree } from 'vuex';
import { injectable } from 'inversify';
import { FormElementValuePayload } from '@app/bundles/form/state/payload/form.element.value.payload';
import { FormElementMessagePayload } from '@app/bundles/form/state/payload/form.element.message.payload';
import { FormElementModelPayload } from '@app/bundles/form/state/payload/form.element.model.payload';
import { FormRootStatePayload } from '@app/bundles/form/state/payload/form.root.state.payload';
import { FormRootActionPayload } from '@app/bundles/form/state/payload/form.root.action.payload';
import { FormRootModelPayload } from '@app/bundles/form/state/payload/form.root.model.payload';
import { FormTo } from '@app/bundles/form/dto/form.to';
import { FormElementMap } from '@app/bundles/form/dto/form.element.map';
import { FormRootMethodPayload } from '@app/bundles/form/state/payload/form.root.method.payload';

@injectable()
export class StateMutations implements MutationTree<FormState> {
    [key: string]: Mutation<FormState>;

    public root: Mutation<FormState> = function (state: FormState, payload: FormRootModelPayload): void {
        state.form(payload.form, payload.model);
        state.elements(payload.form, new FormElementMap());
    };

    public rootState: Mutation<FormState> = function (state: FormState, payload: FormRootStatePayload): void {
        state.form(payload.form).state = payload.state;
    };

    public rootAction: Mutation<FormState> = function (state: FormState, payload: FormRootActionPayload): void {
        if (!state.hasForm(payload.form)) {
            state.form(payload.form, new FormTo(payload.action));
            return;
        }

        state.form(payload.form).action = payload.action;
    };

    public rootMethod: Mutation<FormState> = function (state: FormState, payload: FormRootMethodPayload): void {
        if (!state.hasForm(payload.form)) {
            state.form(payload.form, new FormTo());
            return;
        }

        state.form(payload.form).method = payload.method;
    };

    public setValue: Mutation<FormState> = function (state: FormState, payload: FormElementValuePayload): void {
        state.elements(payload.form).setValue(payload.path, payload.value);
    };

    public setMessage: Mutation<FormState> = function (state: FormState, payload: FormElementMessagePayload): void {
        state.elements(payload.form).setMessage(payload.path, payload.message);
    };

    public clearMessage: Mutation<FormState> = function (state: FormState, payload: FormElementPayload): void {
        state.elements(payload.form).clearMessage(payload.path);
    };

    public attach: Mutation<FormState> = function (state: FormState, payload: FormElementModelPayload): void {
        state.elements(payload.form).set(payload.path, payload.model);
    }
}
