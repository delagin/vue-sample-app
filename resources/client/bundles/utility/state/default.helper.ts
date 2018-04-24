import { injectable } from 'inversify';
import { Getter, GetterTree, Mutation, MutationTree } from 'vuex';

@injectable()
export class DefaultGetter<State = any, RootState = any>
implements GetterTree<State, RootState> {

    [prop: string]: Getter<State, RootState>;

}

@injectable()
export class DefaultMutation<State = any>
implements MutationTree<State> {

    [prop: string]: Mutation<State>;

}
