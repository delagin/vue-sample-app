import { formLifecycleState } from '@app/bundles/form/type/form.lifecycle.states';
import { HttpMethods } from '@app/bundles/http/Enum/HttpMethods';

export class FormTo {
    private _state: formLifecycleState = formLifecycleState.created;
    private _action?: string;
    private _method: HttpMethods = HttpMethods.post;

    constructor(action?: string) {
        if (action !== undefined) {
            this._action = action;
        }
    }

    get state(): formLifecycleState {
        return this._state;
    }

    set state(value: formLifecycleState) {
        this._state = value;
    }

    get action(): string | undefined {
        return this._action;
    }

    set action(value: string | undefined) {
        this._action = value;
    }

    get method(): HttpMethods {
        return this._method;
    }

    set method(value: HttpMethods) {
        this._method = value;
    }
}
