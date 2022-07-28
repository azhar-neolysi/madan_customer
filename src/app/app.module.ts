/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

// import { IonicSelectableModule } from '@ionic-selectable/angular';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
// import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx'; //@awesome-cordova-plugins/file-chooser/
import { DatePipe } from '@angular/common';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@awesome-cordova-plugins/native-geocoder/ngx';

import { AlertService } from './services/alert/alert.service';
import { ApiService } from './services/api/api.service';
import { ConsignerService } from './services/consigner/consigner.service';
import { HomeService } from './services/home/home.service';
import { LanguageService } from './services/language/language.service';
import { LoaderService } from './services/loader/loader.service';
import { LocalstorageService } from './services/localstorage/localstorage.service';
import { MyBookingService } from './services/my-booking/my-booking.service';
import { NewBookingService } from './services/new-booking/new-booking.service';
import { PolPodService } from './services/pol-pod/pol-pod.service';
import { ProfileService } from './services/profile/profile.service';
import { SignupService } from './services/signup/signup.service';
import { ToastService } from './services/toast/toast.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    SplashScreen,
    StatusBar,
    FileTransfer,
    File,
    // FileChooser,
    Chooser,
    DatePipe,
    NativeGeocoder,
    ConsignerService,
    AlertService,
    ApiService,
    HomeService,
    LanguageService,
    LoaderService,
    LocalstorageService,
    MyBookingService,
    NewBookingService,
    PolPodService,
    ProfileService,
    SignupService,
    ToastService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  // createTranslateLoader(http: HttpClient) {
  //   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  // }
}
