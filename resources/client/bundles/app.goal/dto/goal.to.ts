import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { pt } from '@app/entity/entity.decorators.hub';

export class GoalTo extends AbstractItemTo {

    @pt public label: string = '';
    @pt public isCompleted: boolean = false;
    @pt public isNew: boolean = false;

}
