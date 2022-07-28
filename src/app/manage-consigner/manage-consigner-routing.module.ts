import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageConsignerPage } from './manage-consigner.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ManageConsignerPage
  // },
  {
    path: '',
    loadChildren: () => import('./consigner-list/consigner-list.module').then( m => m.ConsignerListPageModule)
  },
  {
    path: 'new',
    loadChildren: () => import('./consigner-create/consigner-create.module').then( m => m.ConsignerCreatePageModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./consigner-create/consigner-create.module').then( m => m.ConsignerCreatePageModule)
  },
  {
    path: 'consigner-list',
    loadChildren: () => import('./consigner-list/consigner-list.module').then( m => m.ConsignerListPageModule)
  },
  {
    path: 'consigner-create',
    loadChildren: () => import('./consigner-create/consigner-create.module').then( m => m.ConsignerCreatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageConsignerPageRoutingModule {}
