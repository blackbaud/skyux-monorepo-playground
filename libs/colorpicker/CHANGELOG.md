**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.1.2 (2021-12-21)

- Fix Stackblitz demo. [#112](https://github.com/blackbaud/skyux-colorpicker/pull/112)

# 5.1.1 (2021-11-19)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#110](https://github.com/blackbaud/skyux-colorpicker/pull/110)

# 5.1.0 (2021-10-28)

- Updated the colorpicker component to fix the appearance of the picker button in the text editor component. [#108](https://github.com/blackbaud/skyux-colorpicker/pull/108)
- Fixed the colorpicker component to display the picker button chevron in modern theme. [#107](https://github.com/blackbaud/skyux-colorpicker/pull/107)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#96](https://github.com/blackbaud/skyux-colorpicker/pull/96)

# 5.0.0-beta.4 (2021-09-20)

- Merge master and update peer dependencies. [#103](https://github.com/blackbaud/skyux-colorpicker/pull/103)

# 5.0.0-beta.3 (2021-09-14)

- Updated peer dependencies. [#102](https://github.com/blackbaud/skyux-colorpicker/pull/102)

# 5.0.0-beta.2 (2021-09-09)

- Fixed peer dependencies to include `@skyux/forms` and `@skyux/indicators`. [#100](https://github.com/blackbaud/skyux-colorpicker/pull/100)
- Enabled the `partial` Ivy compilation mode. [#100](https://github.com/blackbaud/skyux-colorpicker/pull/100)

# 5.0.0-beta.1 (2021-08-24)

- Migrated to Angular CLI. [#96](https://github.com/blackbaud/skyux-colorpicker/pull/96)

# 4.4.0 (2021-08-20)

- Added the ability to disable the colorpicker via reactive or template-driven forms. [#94](https://github.com/blackbaud/skyux-colorpicker/pull/94)

# 5.0.0-beta.0 (2021-07-08)

- Initial beta release.
- Added support for `@angular/core@^12`. [#93](https://github.com/blackbaud/skyux-colorpicker/pull/93)
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#93](https://github.com/blackbaud/skyux-colorpicker/pull/93)

# 4.3.0 (2021-06-16)

- Added the `label` and `labelledBy` inputs to the colorpicker component. [#91](https://github.com/blackbaud/skyux-colorpicker/pull/91)
- Fixed the colorpicker component in modern theme to properly display a transparent background in the picker button. [#91](https://github.com/blackbaud/skyux-colorpicker/pull/91)

# 4.2.5 (2021-04-30)

- Fixed the colorpicker component to display the previously selected color after users select the cancel button. [#88](https://github.com/blackbaud/skyux-colorpicker/pull/88)

# 4.2.4 (2021-04-22)

- Fixed the label for the button that closes the colorpicker. [#86]https://github.com/blackbaud/skyux-colorpicker/pull/86)

# 4.2.3 (2021-03-18)

- Replaced theme conditionals in templates with the new `skyThemeIf` directive. [#82](https://github.com/blackbaud/skyux-colorpicker/pull/82)

# 4.2.2 (2020-12-07)

- Added the missing `public_api.ts` file to expose the testing module's exports API. [#81](https://github.com/blackbaud/skyux-colorpicker/pull/81)

# 4.2.1 (2020-12-02)

- Fixed the hover and focus styles for the colorpicker button. [#77](https://github.com/blackbaud/skyux-colorpicker/pull/77)
- Fixed the colorpicker component to position the picker below the trigger button. [#79](https://github.com/blackbaud/skyux-colorpicker/pull/79)

# 4.2.0 (2020-11-19)

- Added modern theme styles to the colorpicker component. [#75](https://github.com/blackbaud/skyux-colorpicker/pull/75)

# 4.1.1 (2020-08-31)

- Fixed the colorpicker component to handle non-keyboard events that pass through the `keydown` handler. [#69](https://github.com/blackbaud/skyux-colorpicker/pull/69)

# 4.1.0 (2020-08-20)

- Added the colorpicker testing fixture (import from `@skyux/colorpicker/testing`). [#67](https://github.com/blackbaud/skyux-colorpicker/pull/67)

# 4.0.4 (2020-08-05)

- Fixed the colorpicker component to position its overlay after the contents fully render. [#62](https://github.com/blackbaud/skyux-colorpicker/pull/62)

# 4.0.3 (2020-06-29)

- Fixed the selected color indicator on the colorpicker component to enhance alpha channel visibility. [#52](https://github.com/blackbaud/skyux-colorpicker/pull/52) (Thanks [@blackbaud-conorwright](https://github.com/blackbaud-conorwright)!)

# 4.0.2 (2020-06-22)

- Removed unused parameters from the colorpicker input directive `HostListener` to address build issues when consumed by another library. [#48](https://github.com/blackbaud/skyux-colorpicker/pull/48)

# 4.0.1 (2020-06-05)

- Fixed the exports API to include `SkyColorpickerChangeAxis`, `SkyColorpickerCmyk`, `SkyColorpickerChangeColor`, `SkyColorpickerHsla`, `SkyColorpickerHsva`, and `SkyColorpickerRgba`. [#47](github.com/blackbaud/skyux-colorpicker/pull/47)

# 4.0.0 (2020-05-21)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#43](https://github.com/blackbaud/skyux-colorpicker/pull/43)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#43](https://github.com/blackbaud/skyux-colorpicker/pull/43)

# 4.0.0-rc.0 (2020-04-17)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#43](https://github.com/blackbaud/skyux-colorpicker/pull/43)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#43](https://github.com/blackbaud/skyux-colorpicker/pull/43)

# 3.3.2 (2020-04-14)

- Fixed the colorpicker to hide the launch and reset buttons when the input element's `type` is `hidden`. [#40](https://github.com/blackbaud/skyux-colorpicker/pull/40)

# 3.3.1 (2020-04-13)

- Fixed the colorpicker component to properly set ARIA attributes when the colorpicker is closed. [#38](https://github.com/blackbaud/skyux-colorpicker/pull/38)

# 3.3.0 (2020-04-08)

- Updated the colorpicker component to implement the affix and overlay services. [#35](https://github.com/blackbaud/skyux-colorpicker/pull/35)

# 3.2.1 (2020-02-13)

- Fixed the colorpicker component to use the `Renderer2` service instead of the deprecated `Renderer` service. [#50](https://github.com/blackbaud/skyux-lookup/pull/50)

# 3.2.0 (2019-11-15)

- Added a close message to the colorpicker component's message stream. [#29](https://github.com/blackbaud/skyux-colorpicker/pull/29) (Thanks, [@blackbaud-conorwright](https://github.com/blackbaud-conorwright)!)

# 3.1.1 (2019-09-27)

- Fixed the colorpicker component to properly export all output types. [#24](https://github.com/blackbaud/skyux-colorpicker/pull/24)

# 3.1.0 (2019-07-19)

- Added option to disable transparency slider on the colorpicker component. [#20](https://github.com/blackbaud/skyux-colorpicker/pull/20) (Thanks [@jeffbdye](https://github.com/jeffbdye)!)

# 3.0.1 (2019-06-26)

- Fixed the colorpicker component button to properly display transparent colors. [#15](https://github.com/blackbaud/skyux-colorpicker/pull/15)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.3 (2018-11-20)

- Fixed colorpicker component to emit value changes properly. [#5](https://github.com/blackbaud/skyux-colorpicker/pull/5)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#6](https://github.com/blackbaud/skyux-colorpicker/pull/6)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#3](https://github.com/blackbaud/skyux-colorpicker/pull/3)

# 3.0.0-rc.0 (2018-10-09)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-08)

- Initial alpha release.
