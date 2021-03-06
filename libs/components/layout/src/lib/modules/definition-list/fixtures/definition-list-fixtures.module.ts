import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyDefinitionListModule } from '../definition-list.module';

import { SkyDefinitionListTestComponent } from './definition-list.component.fixture';

@NgModule({
  declarations: [SkyDefinitionListTestComponent],
  imports: [CommonModule, SkyDefinitionListModule],
  exports: [SkyDefinitionListTestComponent],
})
export class SkyDefinitionListFixturesModule {}
