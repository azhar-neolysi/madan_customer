import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePolPodPageRoutingModule } from './manage-pol-pod-routing.module';

import { ManagePolPodPage } from './manage-pol-pod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePolPodPageRoutingModule
  ],
  declarations: [ManagePolPodPage]
})
export class ManagePolPodPageModule {}
