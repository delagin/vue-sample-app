import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { ToggleContainerRenderMixin } from './mixins/toggle.container.render.mixin';

export interface ToggleContainerComponent
extends ToggleContainerRenderMixin {}

@Component({ mixins: [ToggleContainerRenderMixin] })
export class ToggleContainerComponent extends Vue {

    @Prop({ default: true })
    public visible!: boolean;

    protected get isVisible(): boolean {
        return this.isInverted !== this.toggleDao.isSomeVisible(this.ns);
    }

    protected created(): void {
        if (!this.toggleDao.isRegistered(this.ns)) this.toggleDao.attach(this.ns, this.visible);
    }

}
