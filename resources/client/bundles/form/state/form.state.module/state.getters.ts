import { ValueType } from '@app/bundles/form/type/value.type';
import { FormState } from './state';
import { TSMap } from 'typescript-map';
import { FormElementTo } from '@app/bundles/form/dto/form.element.to';
import { Getter, GetterTree } from 'vuex';
import { injectable } from 'inversify';
import { FormTo } from '@app/bundles/form/dto/form.to';

@injectable()
export class StateGetters implements GetterTree<FormState, any> {
    [key: string]: Getter<FormState, any>;

    hasForm: Getter<FormState, any> = function (state: FormState, getters: any, rootState: any, rootGetters: any): any {
        return function (form: string): boolean {
            return state.hasForm(form);
        };
    };

    getForm: Getter<FormState, any> = function (state: FormState, getters: any, rootState: any, rootGetters: any): any {
        return function (form: string): FormTo {
            return state.form(form);
        };
    };

    hasElement: Getter<FormState, any> = function (state: FormState, getters: any, rootState: any, rootGetters: any): any {
        return function (form: string, path: string): boolean {
            return state.hasElements(form) && state.elements(form).has(path);
        };
    };

    getValue: Getter<FormState, any> = function (state: FormState, getters: any, rootState: any, rootGetters: any): any {
        return function (form: string, path: string): ValueType {
            return state.elements(form).getValue(path);
        };
    };

    getMessage: Getter<FormState, any> = function (state: FormState, getters: any, rootState: any, rootGetters: any): any {
        return function (form: string, path: string): string | undefined {
            return state.elements(form).getMessage(path);
        };
    };

    hasMessage: Getter<FormState, any> = function (state: FormState, getters: any, rootState: any, rootGetters: any): any {
        return function (form: string, path: string): boolean {
            return state.elements(form).hasMessage(path);
        };
    };

    getInputsMap: Getter<FormState, any> = function (state: FormState, getters: any, rootState: any, rootGetters: any): any {
        return function (form: string): TSMap<string, FormElementTo> {
            return state.elements(form).clone();
        };
    };
}
