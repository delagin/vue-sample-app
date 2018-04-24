import { Container, interfaces } from 'inversify';
import { Component } from 'vue';

import {
    IBundle,
    IComponentsProviderBundle,
    IServicesProviderBundle,
} from '@app/bundles/app/bundle.manager';
import { GoalPeriodListComponent } from './components/goal.period.list.component';
import { GoalListMapper } from './dto/goal.list.mapper';
import { GoalMapper } from './dto/goal.mapper';
import { goalBundleType } from './goal.bundle.type';
import { GoalCreateService } from './services/goal.create.service';
import { GoalNameService } from './services/goal.name.service';
import { GoalUpdateService } from './services/goal.update.service';

export class GoalBundle
implements IBundle, IServicesProviderBundle, IComponentsProviderBundle {

    public components(): Record<string, Component> {
        return {
            'goal-period-list': GoalPeriodListComponent,
        };
    }

    public services(): interfaces.ServiceIdentifier<any>[] {
        return [
            goalBundleType.createService,
            goalBundleType.updateService,
            goalBundleType.nameService,
        ];
    }

    public bind(container: Container): void {
        container
            .bind(goalBundleType.mapper)
            .to(GoalMapper);
        container
            .bind(goalBundleType.listMapper)
            .to(GoalListMapper);
        container
            .bind(goalBundleType.createService)
            .to(GoalCreateService);
        container
            .bind(goalBundleType.updateService)
            .to(GoalUpdateService);
        container
            .bind(goalBundleType.nameService)
            .to(GoalNameService);
    }

}
