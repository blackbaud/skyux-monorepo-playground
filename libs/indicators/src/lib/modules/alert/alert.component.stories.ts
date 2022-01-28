import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { SkyAlertModule } from './alert.module';

@Component({
  selector: 'sky-alert-story',
  template: `
    <div class="screenshot">
      <sky-alert
        *ngFor="let alertType of ['danger', 'info', 'success', 'warning']"
        [alertType]="alertType"
      >
        This is an alert message of type "{{ alertType }}".
      </sky-alert>
    </div>
  `,
})
class AlertStoryComponent {}

export default {
  title: 'Alert',
  component: AlertStoryComponent,
  decorators: [
    moduleMetadata({
      imports: [SkyAlertModule, CommonModule],
      declarations: [AlertStoryComponent],
    }),
  ],
} as Meta<AlertStoryComponent>;

const Template: Story<AlertStoryComponent> = (args: AlertStoryComponent) => ({
  component: AlertStoryComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
