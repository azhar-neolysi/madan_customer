import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsignerListPage } from './consigner-list.page';

const routes: Routes = [
  {
    path: '',
    component: ConsignerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsignerListPageRoutingModule {}
