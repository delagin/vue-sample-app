import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { pt } from '@app/entity/entity.decorators.hub';
import { GoalTo } from './goal.to';

export class GoalListTo extends AbstractItemTo {

    @pt public dueDate: string = '';
    @pt public dueDateText: string = '';
    @pt public remindDate: string = '';
    @pt public remindDateText: string = '';
    @pt public hasRemindDate: boolean = false;
    @pt(GoalTo) public goals: GoalTo[] = [];

    public get hasReminder(): boolean {
        return !!this.remindDate;
    }

}
