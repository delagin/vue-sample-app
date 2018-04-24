import { injectable, interfaces } from 'inversify';

import { EntityBaseMapper } from '@app/entity/entity.models.hub';
import { GoalTo } from './goal.to';

@injectable()
export class GoalMapper extends EntityBaseMapper<GoalTo> {

    public DataModel: interfaces.Newable<GoalTo> = GoalTo;

    public mapToModel(data: any, index: number = 0, isNew: boolean = false): Partial<GoalTo> {
        return {
            id: data.id,
            label: data.title,
            isCompleted: data.completed,
            isNew,
        };
    }

    public mapFromModel(to: GoalTo): any {
        return;
    }

}
