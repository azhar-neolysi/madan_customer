import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PolPodListPageRoutingModule } from './pol-pod-list-routing.module';

import { PolPodListPage } from './pol-pod-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PolPodListPageRoutingModule
  ],
  declarations: [PolPodListPage]
})
export class PolPodListPageModule {}
