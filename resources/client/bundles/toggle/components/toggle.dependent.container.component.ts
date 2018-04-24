import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { ToggleContainerRenderMixin } from './mixins/toggle.container.render.mixin';
import { ToggleMultipleNameMixin } from './mixins/toggle.multiple.name.mixin';

export interface ToggleDependentContainerComponent
extends ToggleContainerRenderMixin, ToggleMultipleNameMixin {}

@Component({ mixins: [ToggleContainerRenderMixin, ToggleMultipleNameMixin] })
export class ToggleDependentContainerComponent extends Vue {

    protected get isVisible(): boolean {
        return !this.toggleDao.isRegistered(...this.names) ||
            this.isInverted !== this.isVisibleModel;
    }

    protected mounted(): void {
        if (this.toggleDao.isRegistered(...this.names)) return;
        throw new Error(`Toggle container [ns="${this.ns}"] depends on unregistered models.`);
    }

}
