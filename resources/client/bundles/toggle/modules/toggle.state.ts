import { injectable } from 'inversify';
import Vue from 'vue';

import { ToggleTo } from './dto/toggle.to';

@injectable()
export class ToggleState {

    protected toggles: Record<string, ToggleTo> = {};

    public has(name: string): boolean {
        return name in this.toggles;
    }

    public get(name: string): ToggleTo {
        if (this.has(name)) return this.toggles[name];
        throw new Error(`Toggle [${name}] does not exist yet.`);
    }

    public register(name: string, to: ToggleTo = new ToggleTo(name, true)): void {
        Vue.set(this.toggles, name, to);
    }

}
