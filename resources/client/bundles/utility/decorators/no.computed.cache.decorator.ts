import { createDecorator } from 'vue-class-component';

export default createDecorator((options, key) => {
    if (options.computed != null && options.computed[key] != null) {
        const computed = options.computed[key];
        if (typeof computed !== 'function') computed.cache = false;
    }
});
