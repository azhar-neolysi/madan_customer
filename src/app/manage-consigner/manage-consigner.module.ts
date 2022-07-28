import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageConsignerPageRoutingModule } from './manage-consigner-routing.module';

import { ManageConsignerPage } from './manage-consigner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageConsignerPageRoutingModule
  ],
  declarations: [ManageConsignerPage]
})
export class ManageConsignerPageModule {}
