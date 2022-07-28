import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ConsignerCreatePageRoutingModule } from './consigner-create-routing.module';

import { ConsignerCreatePage } from './consigner-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    ConsignerCreatePageRoutingModule
  ],
  declarations: [ConsignerCreatePage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsignerCreatePageModule {}
