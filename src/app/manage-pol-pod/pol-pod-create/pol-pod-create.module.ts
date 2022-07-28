import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PolPodCreatePageRoutingModule } from './pol-pod-create-routing.module';

import { PolPodCreatePage } from './pol-pod-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    PolPodCreatePageRoutingModule
  ],
  declarations: [PolPodCreatePage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class PolPodCreatePageModule {}
