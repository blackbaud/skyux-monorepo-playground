import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyDescriptionListModule } from '@skyux/layout';

import { DescriptionListDemoComponent } from './description-list-demo.component';

@NgModule({
  imports: [CommonModule, SkyDescriptionListModule],
  declarations: [DescriptionListDemoComponent],
  exports: [DescriptionListDemoComponent],
})
export class DescriptionListDemoModule {}
