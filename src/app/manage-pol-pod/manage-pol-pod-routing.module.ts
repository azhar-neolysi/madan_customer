import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePolPodPage } from './manage-pol-pod.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ManagePolPodPage
  // },
  {
    path: '',
    loadChildren: () => import('./pol-pod-list/pol-pod-list.module').then( m => m.PolPodListPageModule)
  },
  {
    path: 'new',
    loadChildren: () => import('./pol-pod-create/pol-pod-create.module').then( m => m.PolPodCreatePageModule)
  },
  {
    path: 'new/:type',
    loadChildren: () => import('./pol-pod-create/pol-pod-create.module').then( m => m.PolPodCreatePageModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./pol-pod-create/pol-pod-create.module').then( m => m.PolPodCreatePageModule)
  },
  {
    path: 'pol-pod-list',
    loadChildren: () => import('./pol-pod-list/pol-pod-list.module').then( m => m.PolPodListPageModule)
  },
  {
    path: 'pol-pod-create',
    loadChildren: () => import('./pol-pod-create/pol-pod-create.module').then( m => m.PolPodCreatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePolPodPageRoutingModule {}
