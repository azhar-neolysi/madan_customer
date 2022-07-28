import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { ConsignerListPageRoutingModule } from './consigner-list-routing.module';

import { ConsignerListPage } from './consigner-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ConsignerListPageRoutingModule
  ],
  declarations: [ConsignerListPage]
})
export class ConsignerListPageModule {}
