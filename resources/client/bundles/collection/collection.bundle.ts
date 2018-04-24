import { IBundle, IComponentsProviderBundle, IServicesProviderBundle } from '@app/bundles/app/bundle.manager';
import { Container, interfaces } from 'inversify';
import { Component } from 'vue';
import { CollectionState } from '@app/bundles/collection/state/collection.state';
import { collectionBundleType } from '@app/bundles/collection/collection.bundle.types';
import { CollectionModule } from '@app/bundles/collection/state/collection.module';
import { CollectionStateGetters } from '@app/bundles/collection/state/store/getters';
import { CollectionStateMutations } from '@app/bundles/collection/state/store/mutations';
import { CollectionDao } from '@app/bundles/collection/state/collection.dao';
import { ModuleIdTo } from '@app/bundles/app/module.id.to';
import { CollectionComponent } from '@app/bundles/collection/components/collection.component';

export class CollectionBundle
implements IBundle, IComponentsProviderBundle, IServicesProviderBundle {

    public static get components(): Record<string, Component> {
        return {
            'collection-main': CollectionComponent,
        };
    }

    components(): Record<string, Component> {
        return CollectionBundle.components;
    }

    services(): interfaces.ServiceIdentifier<any>[] {
        return [
            collectionBundleType.Dao,
        ];
    }

    bind(container: Container): void {
        const cModuleNs = 'collectionModule';

        container.bind<CollectionState>(collectionBundleType.State)
                 .to(CollectionState);
        container.bind<CollectionModule>(collectionBundleType.Module)
                 .to(CollectionModule);
        container.bind<CollectionStateGetters>(collectionBundleType.Getter)
                 .to(CollectionStateGetters);
        container.bind<CollectionStateMutations>(collectionBundleType.Mutation)
                 .to(CollectionStateMutations);
        container.bind<CollectionDao>(collectionBundleType.Dao)
                 .to(CollectionDao);

        container.bind(collectionBundleType.ModuleNamespace)
                 .toConstantValue(cModuleNs);
        container.bind(ModuleIdTo)
                 .toConstantValue(
                     new ModuleIdTo(cModuleNs, collectionBundleType.Module),
                 );
    }
}
