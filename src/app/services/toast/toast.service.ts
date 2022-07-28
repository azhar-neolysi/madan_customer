import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastServictoastCtrl: ToastController) { }

  success(msg) {
    this.presentToast(msg, 'success');
  }

  warning(msg) {
    this.presentToast(msg, 'warning');
  }

  danger(msg) {
    this.presentToast(msg, 'danger');
  }


  private async presentToast(msg, color1) {
    const toast = await this.toastServictoastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: color1
    });

    toast.present();
  }

}
