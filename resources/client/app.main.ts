/// <reference path='./app.main.d.ts' />

import '@style/app';
import 'bootstrap';
import 'core-js/shim';
import 'intersection-observer';
import 'jquery';
import 'popper.js';
import 'reflect-metadata';
import 'whatwg-fetch';

import { GoalBundle } from './bundles/app.goal/goal.bundle';
import { AppBundle } from './bundles/app/app.bundle';
import { VueKernel } from './bundles/app/vue.kernel';
import { CollectionBundle } from './bundles/collection/collection.bundle';
import { FormBundle } from './bundles/form/form.bundle';
import { HttpBundle } from './bundles/http/HttpBundle';
import { ToggleBundle } from './bundles/toggle/toggle.bundle';

export default VueKernel
    .boot(
        // Common bundles
        AppBundle,
        HttpBundle,
        CollectionBundle,
        FormBundle,
        ToggleBundle,
        // App bundles
        GoalBundle,
    )
    .run('#app');
