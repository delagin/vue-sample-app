import { inject, injectable } from 'inversify';

import { GoalListMapper } from '@app/bundles/app.goal/dto/goal.list.mapper';
import { GoalListTo } from '@app/bundles/app.goal/dto/goal.list.to';
import { GoalMapper } from '@app/bundles/app.goal/dto/goal.mapper';
import { GoalTo } from '@app/bundles/app.goal/dto/goal.to';
import { goalBundleType } from '@app/bundles/app.goal/goal.bundle.type';
import { GoalNameService } from '@app/bundles/app.goal/services/goal.name.service';
import { GoalController } from '@app/bundles/app.goal/types/goal.state.controller.type';
import { DefaultResourceMapper } from '@app/bundles/app/http/Mapper/DefaultResourceMapper';
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
import { ResponseResolver } from '@app/bundles/http/Resolver/ResponseResolver';
import { HttpTransport } from '@app/bundles/http/Transport/HttpTransport';
import { ToggleDao } from '@app/bundles/toggle/modules/toggle.dao';
import { toggleBundleType } from '@app/bundles/toggle/toggle.bundle.type';
import { EntityBaseMapper } from '@app/entity/entity.models.hub';

@injectable()
export class GoalUpdateService {

    private stateController?: GoalController;
    private registeredResolvers: string[] = [];

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

    public initList(controller: GoalController, url: string): void {
        this.stateController = controller;
        this.loadGoalList(url);
        this.handleGoalListUpdate();
        this.handleGoalListComplete();
    }

    public loadGoalList(url: string): void {
        this.resolversRegistry
            .makeResolver()
            .success(response => {
                if (response.data != null && response.data.length !== 0) {
                    const list = this.goalListMapper.mapFrom(response.data);
                    this.handleGoalList(list);
                    if (this.stateController != null) this.stateController.list(list);
                    this.toggleDao.hide(this.name.partlyEditableList());
                    this.toggleDao.show(this.name.startGoals());
                } else {
                    if (this.stateController != null) this.stateController.pristine();
                }
                return response;
            })
            .resolve(this.http.get(url));
    }

    public handleGoalListUpdate(): void {
        if (this.registeredResolvers.includes(this.name.listUpdateForm())) return;
        this.handleItemDefault(this.name.listUpdateForm(), this.goalListMapper)
            .success((resource: Resource<GoalListTo>) => {
                this.handleGoalList(resource.model);
                if (this.stateController != null) this.stateController.list(resource.model);
                this.toggleDao.show(this.name.listUpdateForm());
                this.toggleDao.hide(this.name.partlyEditableList());
                return resource;
            });
    }

    public handleGoalListComplete(): void {
        if (this.registeredResolvers.includes(this.name.closeList())) return;
        this.handleItemDefault(this.name.closeList(), new DefaultResourceMapper())
            .success((resource: any) => {
                if (this.stateController == null) return resource;
                this.stateController.renew();
                return resource;
            });
    }

    public handleGoalList(list: GoalListTo): void {
        this.collectionDao.replace(this.name.goals(), list.goals);
        this.collectionDao.items(this.name.goals())
            .forEach(to => this.handleItem(to));
        this.handleGoalCreate();
    }

    protected handleGoalCreate(): void {
        this.handleItemCreate(
            this.name.createGoal(),
            this.name.goals(),
            this.name.createGoal(),
            this.goalMapper,
        );
    }

    protected handleGoalUpdate(to: AbstractItemTo): void {
        this.handleItemUpdate(
            this.name.goalForm(to),
            this.name.goals(),
            this.name.goalEdit(to),
            this.goalMapper,
        );
    }

    protected handleGoalDelete(to: AbstractItemTo): void {
        this.handleItemDelete(this.name.goalDeleteForm(to), this.name.goals(), to.id);
    }

    protected handleItem(to: AbstractItemTo): void {
        this.handleGoalUpdate(to);
        this.handleGoalDelete(to);
    }

    protected getDefaultResolver(ns: string): ResponseResolver {
        if (!this.registeredResolvers.includes(ns)) this.registeredResolvers.push(ns);
        if (this.resolversRegistry.has(ns)) return this.resolversRegistry.get(ns);
        return this.resolversRegistry.register(ns);
    }

    protected handleItemDefault(
        resolverNs: string,
        mapper: EntityBaseMapper,
    ): ResponseResolver {
        if (this.registeredResolvers.includes(resolverNs)) {
            return this.getDefaultResolver(resolverNs);
        }
        return this.getDefaultResolver(resolverNs)
            .fail(new ValidationMappingResolver())
            .success(new ResourceMappingResolver(mapper))
            .success(new MessageResolver());
    }

    protected handleItemCreate(
        resolverNs: string,
        collectionNs: string,
        toggleNs: string,
        mapper: EntityBaseMapper,
    ): ResponseResolver {
        if (this.registeredResolvers.includes(resolverNs)) {
            return this.handleItemDefault(resolverNs, mapper);
        }
        return this
            .handleItemDefault(resolverNs, mapper)
            .success((resource: Resource<GoalTo>) => {
                this.toggleDao.show(toggleNs);
                this.collectionDao.add(collectionNs, [resource.model]);
                this.collectionDao.items(collectionNs)
                    .filter(to => to.id === resource.model.id)
                    .forEach(to => this.handleItem(to));
                return resource;
            });
    }

    protected handleItemUpdate(
        resolverNs: string,
        collectionNs: string,
        toggleNs: string,
        mapper: EntityBaseMapper,
    ): ResponseResolver {
        if (this.registeredResolvers.includes(resolverNs)) {
            return this.handleItemDefault(resolverNs, mapper);
        }
        return this
            .handleItemDefault(resolverNs, mapper)
            .success((resource: Resource<GoalTo>) => {
                this.toggleDao.show(toggleNs);
                this.collectionDao.update(collectionNs, [resource.model]);
                return resource;
            });
    }

    protected handleItemDelete(
        resolverNs: string,
        collectionNs: string,
        id: string,
    ): ResponseResolver {
        if (this.registeredResolvers.includes(resolverNs)) {
            return this.getDefaultResolver(resolverNs);
        }
        return this.getDefaultResolver(resolverNs)
            .success(new ResourceMappingResolver(new DefaultResourceMapper()))
            .success(new MessageResolver())
            .success((resource: any) => {
                this.collectionDao.remove(collectionNs, id);
                return resource;
            });
    }

}
