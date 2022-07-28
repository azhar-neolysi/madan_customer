import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolPodPage } from './pol-pod.page';

const routes: Routes = [
  {
    path: '',
    component: PolPodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolPodPageRoutingModule {}
