import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolPodListPage } from './pol-pod-list.page';

const routes: Routes = [
  {
    path: '',
    component: PolPodListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolPodListPageRoutingModule {}
