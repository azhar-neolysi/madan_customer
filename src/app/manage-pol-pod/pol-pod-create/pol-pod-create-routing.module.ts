import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolPodCreatePage } from './pol-pod-create.page';

const routes: Routes = [
  {
    path: '',
    component: PolPodCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolPodCreatePageRoutingModule {}
