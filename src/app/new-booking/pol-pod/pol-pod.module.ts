import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PolPodPageRoutingModule } from './pol-pod-routing.module';

import { PolPodPage } from './pol-pod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolPodPageRoutingModule
  ],
  declarations: [PolPodPage]
})
export class PolPodPageModule {}
