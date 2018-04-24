import { inject, injectable } from 'inversify';

import { GoalListMapper } from '@app/bundles/app.goal/dto/goal.list.mapper';
import { GoalListTo } from '@app/bundles/app.goal/dto/goal.list.to';
import { GoalMapper } from '@app/bundles/app.goal/dto/goal.mapper';
import { GoalTo } from '@app/bundles/app.goal/dto/goal.to';
import { goalBundleType } from '@app/bundles/app.goal/goal.bundle.type';
import { GoalNameService } from '@app/bundles/app.goal/services/goal.name.service';
import { GoalController } from '@app/bundles/app.goal/types/goal.state.controller.type';
import { MessageResolver } from '@app/bundles/app/http/Resolver/MessageResolver';
import { ResourceMappingResolver } from '@app/bundles/app/http/Resolver/ResourceMappingResolver';
import {
    ValidationMappingResolver,
} from '@app/bundles/app/http/Resolver/ValidationMappingResolver';
import { Resource } from '@app/bundles/app/http/Resource/Resource';
import { collectionBundleType } from '@app/bundles/collection/collection.bundle.types';
import { AbstractItemTo } from '@app/bundles/collection/dto/abstract.item.to';
import { CollectionDao } from '@app/bundles/collection/state/collection.dao';
import { FormBundleTypes } from '@app/bundles/form/form.bundle.types';
import { FormStateDaoRegistry } from '@app/bundles/form/state/form.state.dao.registry';
import { HttpBundleTypes } from '@app/bundles/http/HttpBundleTypes';
import { ResolversRegistry } from '@app/bundles/http/Resolver/ResolversRegistry';
import { HttpTransport } from '@app/bundles/http/Transport/HttpTransport';
import { ToggleDao } from '@app/bundles/toggle/modules/toggle.dao';
import { toggleBundleType } from '@app/bundles/toggle/toggle.bundle.type';

@injectable()
export class GoalCreateService {

    private stateController?: GoalController;
    private removedItems: string[] = [];
    private itemsCounter: number = -1;
    private prefix: string = 'new-goal';
    private hasResolvers: boolean = false;

    constructor(
        @inject(goalBundleType.nameService)
        protected name: GoalNameService,
        @inject(HttpBundleTypes.Transport)
        protected http: HttpTransport,
        @inject(goalBundleType.mapper)
        protected goalMapper: GoalMapper,
        @inject(goalBundleType.listMapper)
        protected goalListMapper: GoalListMapper,
        @inject(toggleBundleType.Dao)
        protected toggleDao: ToggleDao,
        @inject(collectionBundleType.Dao)
        protected collectionDao: CollectionDao,
        @inject(FormBundleTypes.TYPES.FormStateDaoRegistry)
        protected formDaoRegistry: FormStateDaoRegistry,
        @inject(HttpBundleTypes.Resolvers)
        protected resolversRegistry: ResolversRegistry,
    ) {}

    public initList(controller: GoalController, items: GoalTo[] | number = 3): void {
        this.stateController = controller;
        const list = (typeof items !== 'number')
            ? items
            : (new Array(items)).fill(0).map(() => {
                const to = { id: `${this.prefix}-${(this.itemsCounter += 1)}` };
                return this.goalMapper.mapFrom(to, undefined, true);
            });
        this.collectionDao.replace(this.name.goalsUnsaved(), list);
        if (!this.hasResolvers) this.handleGoalsCreate();
        this.toggleDao.hide(this.name.transferList());
        this.toggleDao.show(this.name.partlyEditableList());
    }

    public initGoal(): void {
        const to = { id: `${this.prefix}-${(this.itemsCounter += 1)}` };
        const goal = this.goalMapper.mapFrom(to, undefined, true);
        this.collectionDao.add(this.name.goalsUnsaved(), [goal]);
    }

    public clearGoal(to: AbstractItemTo): void {
        this.removedItems.push(to.id);
        this.collectionDao.remove(this.name.goalsUnsaved(), to.id);
    }

    public saveList(controller: GoalController): void {
        this.stateController = controller;
        if (this.uncompletedItems.length === 0) {
            this.stateController.pristine();
        } else {
            this.collectionDao.replace(this.name.goalsUncomplete(), this.uncompletedItems);
            this.toggleDao.show(this.name.transferList());
            this.toggleDao.show(this.name.partlyEditableList());
        }
    }

    public get uncompletedItems(): GoalTo[] {
        return this.collectionDao.items<GoalTo>(this.name.goals()).filter(to => !to.isCompleted);
    }

    private handleGoalsCreate(): void {
        const ns = this.name.listForm();
        this.formDaoRegistry
            .get(ns)
            .setCollectorFilter(data => ({
                ...data,
                goals: Object.entries(data.goals).filter(([id, value]: [string, any]) => {
                    return !!value && !!value.title && !this.removedItems.includes(id);
                }).map(([id, value]: [string, any]) => {
                    const goal: Record<string, string> = { title: value.title };
                    return value.isNew ? goal : { ...goal, id };
                }),
            }));
        const resolver = this.resolversRegistry.has(ns)
            ? this.resolversRegistry.get(ns)
            : this.resolversRegistry.register(ns);
        resolver
            .fail(new ValidationMappingResolver())
            .success(new ResourceMappingResolver(this.goalListMapper))
            .success(new MessageResolver())
            .success((resource: Resource<GoalListTo>) => {
                if (this.stateController == null) return resource;
                this.stateController.list(resource.model);
                this.stateController.created();
                return resource;
            });
        this.hasResolvers = true;
    }

}
