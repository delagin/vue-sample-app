import Vue from 'vue';
import { Component, Inject, Prop } from 'vue-property-decorator';

import { GoalListTo } from '@app/bundles/app.goal/dto/goal.list.to';
import { goalListState } from '@app/bundles/app.goal/enums/goal.list.state.enum';
import { goalBundleType } from '@app/bundles/app.goal/goal.bundle.type';
import { GoalCreateService } from '@app/bundles/app.goal/services/goal.create.service';
import { GoalNameService } from '@app/bundles/app.goal/services/goal.name.service';
import { GoalUpdateService } from '@app/bundles/app.goal/services/goal.update.service';
import { GoalController } from '@app/bundles/app.goal/types/goal.state.controller.type';
import { CollectionBundle } from '@app/bundles/collection/collection.bundle';
import { collectionBundleType } from '@app/bundles/collection/collection.bundle.types';
import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { CollectionDao } from '@app/bundles/collection/state/collection.dao';
import { FormBundle } from '@app/bundles/form/form.bundle';
import { FormBundleTypes } from '@app/bundles/form/form.bundle.types';
import { FormStateDaoRegistry } from '@app/bundles/form/state/form.state.dao.registry';
import { ToggleDao } from '@app/bundles/toggle/modules/toggle.dao';
import { ToggleBundle } from '@app/bundles/toggle/toggle.bundle';
import { toggleBundleType } from '@app/bundles/toggle/toggle.bundle.type';

@Component({
    components: {
        ...FormBundle.components,
        ...CollectionBundle.components,
        ...ToggleBundle.components,
    },
})
export class GoalPeriodListComponent extends Vue {

    @Prop({ required: true })
    public listUrl: string;

    @Inject(goalBundleType.nameService)
    protected name: GoalNameService;

    @Inject(collectionBundleType.Dao)
    protected collectionDao: CollectionDao;

    @Inject(goalBundleType.createService)
    protected createService: GoalCreateService;

    @Inject(goalBundleType.updateService)
    protected updateService: GoalUpdateService;

    @Inject(FormBundleTypes.TYPES.FormStateDaoRegistry)
    protected formDaoRegistry: FormStateDaoRegistry;

    @Inject(toggleBundleType.Dao)
    protected toggleDao: ToggleDao;

    private listState: goalListState = goalListState.created;
    private list: GoalListTo | null = null;

    protected get controller(): GoalController {
        return {
            pristine: () => (this.listState = goalListState.pristine),
            created: () => (this.listState = goalListState.created),
            renew: () => (this.listState = goalListState.renew),
            list: (list: GoalListTo) => (this.list = list),
        };
    }

    protected created(): void {
        this.$watch(
            () => this.listState,
            state => {
                if (state === goalListState.pristine) {
                    this.createService.initList(this.controller);
                }
                if (state === goalListState.created) {
                    this.updateService.initList(this.controller, this.listUrl);
                }
                if (state === goalListState.renew) {
                    this.createService.saveList(this.controller);
                }
            },
            { immediate: true },
        );
    }

    protected addGoal(): void {
        this.createService.initGoal();
    }

    protected removeGoal(to: AbstractItemTo): void {
        this.createService.clearGoal(to);
    }

    protected updateGoal(to: AbstractItemTo): void {
        this.formDaoRegistry.get(this.name.goalForm(to)).form.submit();
    }

    protected saveGoal(): void {
        this.toggleDao.hide(this.name.startGoals());
        this.createService.initList(this.controller, this.createService.uncompletedItems);
    }

    protected cancelGoal(): void {
        this.toggleDao.show(this.name.startGoals());
        this.createService.initList(this.controller);
    }

}
