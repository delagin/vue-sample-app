import { inject, injectable, interfaces } from 'inversify';

import { GoalMapper } from '@app/bundles/app.goal/dto/goal.mapper';
import { goalBundleType } from '@app/bundles/app.goal/goal.bundle.type';
import { stringToDate } from '@app/bundles/utility/date/parse.date';
import { EntityBaseMapper } from '@app/entity/entity.models.hub';
import { GoalListTo } from './goal.list.to';

@injectable()
export class GoalListMapper extends EntityBaseMapper<GoalListTo> {

    public DataModel: interfaces.Newable<GoalListTo> = GoalListTo;

    constructor(
        @inject(goalBundleType.mapper)
        goalMapper: GoalMapper,
    ) {
        super([goalMapper]);
    }

    public mapToModel(data: any): Partial<GoalListTo> {
        const dateString = (str: string) => str.split('T').join(' ').split('+')[0];
        const dueDate = data.dueDate && dateString(data.dueDate);
        const remindDate = data.reminder && dateString(data.reminder);
        return {
            id: data.id,
            dueDate,
            dueDateText: dueDate && stringToDate(dueDate).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            remindDate,
            remindDateText: remindDate && stringToDate(remindDate).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            hasRemindDate: data.reminder,
            goals: Object.values(data.goals).map((value: any) => value.data),
        };
    }

    public mapFromModel(to: GoalListTo): any {
        return;
    }

}
