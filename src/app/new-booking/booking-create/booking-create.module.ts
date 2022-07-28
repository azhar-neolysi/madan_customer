import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';


import { BookingCreatePageRoutingModule } from './booking-create-routing.module';

import { BookingCreatePage } from './booking-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    BookingCreatePageRoutingModule
  ],
  declarations: [BookingCreatePage]
})
export class BookingCreatePageModule {}
