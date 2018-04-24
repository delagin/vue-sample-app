import { GoalListTo } from '@app/bundles/app.goal/dto/goal.list.to';
import { goalListState } from '@app/bundles/app.goal/enums/goal.list.state.enum';

export type GoalStateController = {
    [prop in keyof typeof goalListState]: () => void;
};

export interface GoalController extends GoalStateController {
    list: (list: GoalListTo) => void;
}
