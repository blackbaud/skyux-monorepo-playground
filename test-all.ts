// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true }},
);

// These projects are failing: ag-grid

const context = require.context(`./libs`, true, /(a11y|action-bars|ag-grid|angular-tree-component|animations|assets|autonumeric|avatar|colorpicker|config|core|data-manager|datetime|errors|flyout|forms|grids|http|i18n|indicators|inline-form|layout|list-builder|list-builder-common|list-builder-view-checklist|list-builder-view-grids|lists|lookup|modals|navbar|omnibar-interop|pages|phone-field|popovers|progress-indicator|router|select-field|split-view|tabs|text-editor|theme|tiles|toast|validation)\/src\/lib\/.+\.spec\.ts$/);

// And load the modules.
context.keys().map(context);
