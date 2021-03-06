**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.1 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#75](https://github.com/blackbaud/skyux-split-view/pull/75)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#58](https://github.com/blackbaud/skyux-split-view/pull/58)

# 5.0.0-beta.3 (2021-09-15)

- Added bug fixes and features from the `master` branch and migrated to Angular CLI. [#71](https://github.com/blackbaud/skyux-split-view/pull/71)

# 4.3.3 (2021-08-10)

- Fixed `sky-split-view-workspace-content` to address keyboard access to the component. [#69](https://github.com/blackbaud/skyux-split-view/pull/69)

# 5.0.0-beta.2 (2021-08-09)

- Added bug fixes and features from the `master` branch. [#68](https://github.com/blackbaud/skyux-split-view/pull/68)

# 4.3.2 (2021-08-06)

- Fixed the accessibility of scrollable regions in the split view component. [#66](https://github.com/blackbaud/skyux-split-view/pull/66)

# 5.0.0-beta.1 (2021-08-03)

- Added bug fixes and features from the `master` branch. [#65](https://github.com/blackbaud/skyux-split-view/pull/65)

# 4.3.1 (2021-08-02)

- Fixed the split view component to properly render tile components in the workspace. [#62](https://github.com/blackbaud/skyux-split-view/pull/62)

# 5.0.0-beta.0 (2021-07-15)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#60](https://github.com/blackbaud/skyux-split-view/pull/60)

# 5.0.0-alpha.0 (2021-05-24)

- Added support for `@angular/core@^12`. [#58](https://github.com/blackbaud/skyux-split-view/pull/58)
- Removed `BrowserAnimationsModule` from the `imports` section of `SkySplitViewModule` to support lazy-loading. Consumers of `SkySplitViewModule` must now import `BrowserAnimationsModule` into their application's root module. [#58](https://github.com/blackbaud/skyux-split-view/pull/58)

# 4.3.0 (2021-05-21)

- Updated the split view component to use the modern theme. [#55](https://github.com/blackbaud/skyux-split-view/pull/55)

# 4.2.0 (2020-11-16)

- Added a split view test fixture. [#48](https://github.com/blackbaud/skyux-split-view/pull/48)

# 4.1.0 (2020-09-11)

- Added the `bindHeightToWindow` input property to the split view component to bind split views on the main application page to the window's height. [#37](https://github.com/blackbaud/skyux-split-view/pull/37)
- Fixed the split view component to set responsive styles after the split view fully renders. [#43](https://github.com/blackbaud/skyux-split-view/pull/43)

# 4.0.1 (2020-08-10)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#32](https://github.com/blackbaud/skyux-split-view/pull/32)

# 4.0.0 (2020-05-21)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#21](https://github.com/blackbaud/skyux-split-view/pull/21)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#21](https://github.com/blackbaud/skyux-split-view/pull/21)

# 4.0.0-rc.0 (2020-04-18)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#21](https://github.com/blackbaud/skyux-split-view/pull/21)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#21](https://github.com/blackbaud/skyux-split-view/pull/21)

# 3.0.0 (2020-03-12)

- Major version release.

# 3.0.0-rc.0 (2019-08-13)

- Initial release candidate.

# 3.0.0-alpha.1 (2019-08-09)

- Added the split view workspace content and footer components. [#10](https://github.com/blackbaud/skyux-split-view/pull/10)

# 3.0.0-alpha.0 (2019-07-11)

- Initial alpha release.
