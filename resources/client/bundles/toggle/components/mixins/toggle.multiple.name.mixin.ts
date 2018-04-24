import { Component, Prop } from 'vue-property-decorator';

import { toggleQuantifier } from '@app/bundles/toggle/enums/toggle.options.enum';
import {
    enumValidatorFactory,
    splitStringProp,
} from '@app/bundles/utility/component/component.util';
import { ToggleBaseMixin } from './toggle.base.mixin';

@Component
export class ToggleMultipleNameMixin extends ToggleBaseMixin {

    @Prop({
        type: String,
        default: toggleQuantifier.some,
        validator: enumValidatorFactory(toggleQuantifier),
    })
    public quantifier!: toggleQuantifier;

    protected get names(): string[] {
        return splitStringProp(this.ns);
    }

    protected get isVisibleModel(): boolean {
        return (this.quantifier === toggleQuantifier.some)
            ? this.toggleDao.isSomeVisible(...this.names)
            : this.toggleDao.isEveryVisible(...this.names);
    }

}
