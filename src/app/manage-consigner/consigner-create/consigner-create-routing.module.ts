import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsignerCreatePage } from './consigner-create.page';

const routes: Routes = [
  {
    path: '',
    component: ConsignerCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsignerCreatePageRoutingModule {}
