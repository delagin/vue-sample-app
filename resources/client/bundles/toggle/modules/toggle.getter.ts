import { injectable } from 'inversify';

import { DefaultGetter } from '@app/bundles/utility/state/default.helper';
import { ToggleState } from './toggle.state';

type ToggleGetter = (state: ToggleState) => (name: string) => boolean;

@injectable()
export class ToggleModuleGetter extends DefaultGetter<ToggleState> {

    public isRegistered: ToggleGetter = state => name => state.has(name);
    public isVisible: ToggleGetter = state => name => state.get(name).visible;

}
