**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.1 (2021-11-19)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#66](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/66)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#61](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/61)

# 5.0.0-beta.1 (2021-09-14)

- Migrated to Angular CLI. [#61](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/61)
- Added support for "partial" Ivy compilation mode. [#61](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/61)

# 5.0.0-beta.0 (2021-07-14)

- Initial beta release.
- Added support for `@angular/core@^12`. [#59](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/59)
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#59](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/59)

# 4.0.1 (2020-08-06)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#52](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/52)

# 4.0.0 (2020-05-14)

### New features

- Added a test fixture for the list view checklist component to use in consumer unit tests. [#45](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/45)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#43](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/43)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#43](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/43)

# 4.0.0-rc.2 (2020-04-30)

### New features

- Added a test fixture for the list view checklist component to use in consumer unit tests. [#45](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/45)

# 4.0.0-rc.1 (2020-04-20)

- Added `SkyListViewChecklistComponent` to the exports API (for use by SKY UX components only).

# 4.0.0-rc.0 (2020-04-17)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#43](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/43)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#43](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/43)

# 3.2.0 (2020-02-12)

- Added support for `@skyux-sdk/builder@3.14.0`. [#39](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/39)
- Removed a few deep imports into other SKY UX packages. [#39](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/39)

# 3.1.3 (2019-05-30)

- Fixed the list view checklist component to add space between checkboxes and the right-hand side of the checklist. [#32](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/32)

# 3.1.2 (2019-04-12)

- Fixed toolbar to hide multiselect controls in single select mode. [#30](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/30)
- Fixed visual styles for checkbox labels. [#21](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/21)

# 3.1.1 (2019-03-22)

- Fixed toolbar to follow UX guidelines. [#25](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/25)

# 3.1.0 (2019-03-19)

- Added support for `microedge-rxstate@>=2.0.2`. [#26](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/26)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.6 (2018-11-20)

- Added support for `@skyux/list-builder-common@3.0.0-rc.1`. [#14](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/14)

# 3.0.0-rc.5 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#12](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/12)

# 3.0.0-rc.4 (2018-11-13)

- Fixed checklist component to list all items when pagination is not enabled. [#9](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/9)

# 3.0.0-rc.3 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#6](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/6)

# 3.0.0-rc.2 (2018-11-01)

- Fixed "Show only selected" checkbox to return to first page in paging component. [#5](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/5)

# 3.0.0-rc.1 (2018-10-29)

- Updated resource strings to use `skyLibResources` pipe. [#3](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/3)

# 3.0.0-rc.0 (2018-10-26)

- Initial release candidate.

# 3.0.0-alpha.1 (2018-10-11)

- Removed all references to moment.js. [#2](https://github.com/blackbaud/skyux-list-builder-view-checklist/pull/2)

# 3.0.0-alpha.0 (2018-10-10)

- Initial alpha release.
