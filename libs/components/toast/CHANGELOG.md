**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.1 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#77](https://github.com/blackbaud/skyux-toast/pull/77)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#70](https://github.com/blackbaud/skyux-toast/pull/70)

# 5.0.0-beta.2 (2021-09-10)

- Enabled Ivy's "partial" compilation mode. [#73](https://github.com/blackbaud/skyux-toast/pull/73)

# 5.0.0-beta.1 (2021-08-30)

- Migrated to Angular CLI. [#70](https://github.com/blackbaud/skyux-toast/pull/70)

# 5.0.0-beta.0 (2021-06-29)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#68](https://github.com/blackbaud/skyux-toast/pull/68)
- Fixed `SkyToastService` to work within lazy-loaded feature modules. [#68](https://github.com/blackbaud/skyux-toast/pull/68)

# 5.0.0-alpha.0 (2021-05-21)

- Removed `BrowserAnimationsModule` from the `imports` section of `SkyToastModule` to support lazy-loading. Consumers of `SkyToastModule` must now import `BrowserAnimationsModule` into their application's root module. [#67](https://github.com/blackbaud/skyux-toast/pull/67)

# 4.1.2 (2020-11-23)

- Updated the tooltip for the button to close toasts. [#64](https://github.com/blackbaud/skyux-toast/pull/64)

# 4.1.1 (2020-10-07)

- Fixed a bug where two close icons would display on the toast component. [#60](https://github.com/blackbaud/skyux-toast/pull/60)

# 4.1.0 (2020-09-14)

- Added modern theme styles to the toast component. [#57](https://github.com/blackbaud/skyux-toast/pull/57)

# 4.0.1 (2020-08-07)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#50](https://github.com/blackbaud/skyux-toast/pull/50)

# 4.0.0 (2020-05-13)

### New features

- Added a test fixture for the toast component to use in consumer unit tests. [#42](https://github.com/blackbaud/skyux-toast/pull/42)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#38](https://github.com/blackbaud/skyux-toast/pull/38)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#38](https://github.com/blackbaud/skyux-toast/pull/38)

# 4.0.0-rc.1 (2020-05-05)

### New features

- Added a test fixture for the toast component to be used in consumer unit tests. [#42](https://github.com/blackbaud/skyux-toast/pull/42)

# 4.0.0-rc.0 (2020-04-17)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#38](https://github.com/blackbaud/skyux-toast/pull/38)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#38](https://github.com/blackbaud/skyux-toast/pull/38)

# 3.2.1 (2020-04-03)

- Fixed the toast component to allow clicks to propagate to the document. [#36](https://github.com/blackbaud/skyux-toast/pull/36)

# 3.2.0 (2019-11-08)

- Added a display direction configuration option to the toast container. [#31](https://github.com/blackbaud/skyux-toast/pull/31)
- Fixed a bug where too many custom components were created when new toasts were displayed and content was injected into the wrong toasts. [#31](https://github.com/blackbaud/skyux-toast/pull/31)
- Added support for `@skyux-sdk/builder` for development. [#32](https://github.com/blackbaud/skyux-toast/pull/32)

# 3.1.0 (2019-10-23)

- Updated the visual style of elements with the `sky-btn-link` or `sky-btn-link-inline` CSS class inside toasts to match anchor elements. [#26](https://github.com/blackbaud/skyux-toast/pull/26)
- Added an auto-close option to toasts. [#27](https://github.com/blackbaud/skyux-toast/pull/27)

# 3.0.4 (2019-05-28)

- Fixed the toast service to not error when attempting to close all toasts while no toasts are open. [#21](https://github.com/blackbaud/skyux-toast/pull/21) (Thanks @Blackbaud-ChristiSchneider)

# 3.0.3 (2019-04-26)

- Fixed the toast component to handle click events that originate within its contents. [#18](https://github.com/blackbaud/skyux-toast/pull/18)

# 3.0.2 (2019-04-23)

- Fixed the toast component to prevent clicks from propagating. [#16](https://github.com/blackbaud/skyux-toast/pull/16)

# 3.0.1 (2019-02-22)

- Fixed `SkyToastModule` to properly include `BrowserAnimationsModule`. [#12](https://github.com/blackbaud/skyux-toast/pull/12)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.4 (2018-12-20)

- Fixed the toast service to remove the toaster component if all toast component instances have been closed. [#9](https://github.com/blackbaud/skyux-toast/pull/9)
- Updated the toast service to utilize `SkyDynamicComponentService`. [#6](https://github.com/blackbaud/skyux-toast/pull/6)

# 3.0.0-rc.3 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#5](https://github.com/blackbaud/skyux-toast/pull/5)

# 3.0.0-rc.2 (2018-10-18)

- Removed `NoopAnimationsModule` from toast module imports (oops!). [#4](https://github.com/blackbaud/skyux-toast/pull/4)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#2](https://github.com/blackbaud/skyux-toast/pull/2)

# 3.0.0-rc.0 (2018-10-12)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-12)

- Initial alpha release.
