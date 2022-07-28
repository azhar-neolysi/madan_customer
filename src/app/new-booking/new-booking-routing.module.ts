import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewBookingPage } from './new-booking.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: NewBookingPage
  // },
  {
    path: '',
    loadChildren: () => import('./booking-create/booking-create.module').then( m => m.BookingCreatePageModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./booking-create/booking-create.module').then( m => m.BookingCreatePageModule)
  },
  {
    path: 'booking-create',
    loadChildren: () => import('./booking-create/booking-create.module').then( m => m.BookingCreatePageModule)
  },
  {
    path: 'pol-pod',
    loadChildren: () => import('./pol-pod/pol-pod.module').then( m => m.PolPodPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewBookingPageRoutingModule {}
