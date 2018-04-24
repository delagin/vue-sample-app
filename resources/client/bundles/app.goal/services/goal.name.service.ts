import { injectable } from 'inversify';

import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';

@injectable()
export class GoalNameService {

    private prefix: string = 'goal';

    public listForm(): string {
        return `${this.prefix}-form-list`;
    }

    public goalForm(to: AbstractItemTo): string {
        return `${this.prefix}-form-goal-${to.id}`;
    }

    public goalDeleteForm(to: AbstractItemTo): string {
        return `${this.prefix}-form-delete-goal-${to.id}`;
    }

    public goalFormUrl(template: string, list: AbstractItemTo, item?: AbstractItemTo): string {
        return template.replace(/%(.*?)%/g, (match, submatch) => {
            return (submatch === 'id' && item != null) ? item.id : list.id;
        });
    }

    public partlyEditableList(): string {
        return `${this.prefix}-list-mode`;
    }

    public transferList(): string {
        return `${this.prefix}-list-transfer`;
    }

    public suggestion(): string {
        return `${this.prefix}-suggestion`;
    }

    public goals(): string {
        return `${this.prefix}-list`;
    }

    public goalsUnsaved(): string {
        return `${this.prefix}-list-usaved`;
    }

    public goalsUncomplete(): string {
        return `${this.prefix}-list-uncomplete`;
    }

    public goalEdit(to: AbstractItemTo): string {
        return `${this.prefix}-goal-edit-${to.id}`;
    }

    public createGoal(): string {
        return `${this.prefix}-create`;
    }

    public dueDate(): string {
        return 'due_date';
    }

    public reminder(): string {
        return 'reminder';
    }

    public goalsArray(): string {
        return 'goals';
    }

    public goalCompleted(index?: number): string {
        return (index != null) ? `goals.${index}.completed` : 'completed';
    }

    public goalLabel(to?: AbstractItemTo): string {
        return (to != null) ? `goals.${to.id}.title` : 'title';
    }

    public goalLabelNew(to?: AbstractItemTo): string {
        return (to != null) ? `goals.${to.id}.isNew` : 'isNew';
    }

    public closeList(): string {
        return `${this.prefix}-close-list`;
    }

    public listUpdateForm(): string {
        return `${this.prefix}-update-list`;
    }

    public startGoals(): string {
        return `${this.prefix}-start-goals`;
    }

}
