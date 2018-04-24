import Vue from 'vue';
import { createDecorator } from 'vue-class-component';
import { VueDecorator } from 'vue-class-component/lib/util';

import { entityValueMutatorHelper } from '@app/entity/entity.helpers.hub';

const { asInteger } = entityValueMutatorHelper;
export function debounce(delay: string | number = 0): VueDecorator {
    return createDecorator((options, key) => {
        if (options.methods == null || typeof options.methods[key] !== 'function') {
            throw new Error(`There is no [${key}] method in component options.`);
        }
        const method = options.methods && options.methods[key];
        let timer: number | undefined;
        let timerDelay: number;
        options.methods[key] = function(this: Vue, ...args: any[]): void {
            if (timerDelay == null) {
                timerDelay = (typeof delay === 'string')
                    ? asInteger(this[delay as keyof typeof this] || delay)
                    : delay;
            }
            if (timer != null) clearTimeout(timer);
            timer = setTimeout(
                () => {
                    method.apply(this, args);
                    timer = undefined;
                },
                timerDelay,
            );
        };
    });
}
