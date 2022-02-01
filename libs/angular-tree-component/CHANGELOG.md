**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.3 (2022-01-24)

- Fixed the angular tree component to not select the virtual root when clicking the select all button. [#56](https://github.com/blackbaud/skyux-angular-tree-component/pull/56)

# 5.0.2 (2021-11-19)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#54](https://github.com/blackbaud/skyux-angular-tree-component/pull/54)

# 5.0.1 (2021-10-26)

- Fixed single select mode to only emit once when a user makes a selection. [#52](https://github.com/blackbaud/skyux-angular-tree-component/pull/52)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#45](https://github.com/blackbaud/skyux-angular-tree-component/pull/45)

### Breaking changes

- Added support for `@circlon/angular-tree-component` and dropped support for the deprecated library `angular-tree-component`. [#45](https://github.com/blackbaud/skyux-angular-tree-component/pull/45)

# 5.0.0-beta.1 (2021-09-28)

- Updated peer dependencies. [#49](https://github.com/blackbaud/skyux-angular-tree-component/pull/49)

# 5.0.0-beta.0 (2021-09-08)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#45](https://github.com/blackbaud/skyux-angular-tree-component/pull/45)
- Migrated to Angular CLI. [#45](https://github.com/blackbaud/skyux-angular-tree-component/pull/45)
- Added support for `@circlon/angular-tree-component` and dropped support for the deprecated library `angular-tree-component`. [#45](https://github.com/blackbaud/skyux-angular-tree-component/pull/45)

# 4.0.3 (2021-07-29)

- Fixed the Angular tree component to fire the `stateChange` event once on click. [#42](https://github.com/blackbaud/skyux-angular-tree-component/pull/42)

# 4.0.2 (2021-02-23)

- Fixed the Angular tree component to properly indent child nodes without children. [#37](https://github.com/blackbaud/skyux-angular-tree-component/pull/37)

# 4.0.1 (2020-08-05)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#24](https://github.com/blackbaud/skyux-angular-tree-component/pull/24)

# 4.0.0 (2020-05-22)

### New features

- Added support for `@angular/core@^9`. [#15](https://github.com/blackbaud/skyux-angular-tree-component/pull/15)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#15](https://github.com/blackbaud/skyux-angular-tree-component/pull/15)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#15](https://github.com/blackbaud/skyux-angular-tree-component/pull/15)

# 4.0.0-rc.0 (2020-04-21)

### New features

- Added support for `@angular/core@^9`. [#15](https://github.com/blackbaud/skyux-angular-tree-component/pull/15)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#15](https://github.com/blackbaud/skyux-angular-tree-component/pull/15)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#15](https://github.com/blackbaud/skyux-angular-tree-component/pull/15)

# 3.0.0 (2020-04-20)

- Major version release.
- Updated the angular tree component to be compatible with the affix and overlay services. [#13](https://github.com/blackbaud/skyux-angular-tree-component/pull/13)

# 3.0.0-rc.0 (2019-11-04)

- Initial release candidate.

# 3.0.0-alpha.1 (2019-10-24)

- Updated the color of the Angular tree wrapper component's expand/collapse icon to follow SKY UX design patterns. [#5](https://github.com/blackbaud/skyux-angular-tree-component/pull/5)
- Fixed the Angular tree wrapper component to prevent nodes from moving when users drag on selected text. [#7](https://github.com/blackbaud/skyux-angular-tree-component/pull/7)

# 3.0.0-alpha.0 (2019-10-08)

- Initial alpha release.
