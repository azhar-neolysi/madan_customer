import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'manage-consigner',
    loadChildren: () => import('./manage-consigner/manage-consigner.module').then( m => m.ManageConsignerPageModule)
  },
  {
    path: 'manage-pol-pod',
    loadChildren: () => import('./manage-pol-pod/manage-pol-pod.module').then( m => m.ManagePolPodPageModule)
  },
  {
    path: 'my-booking',
    loadChildren: () => import('./my-booking/my-booking.module').then( m => m.MyBookingPageModule)
  },
  {
    path: 'new-booking',
    loadChildren: () => import('./new-booking/new-booking.module').then( m => m.NewBookingPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
