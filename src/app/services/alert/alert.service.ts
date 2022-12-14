import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController
  ) { }

  public async alertPromt(header1, message1): Promise<boolean> {
    let confirmation = false;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      animated: true,
      // backdrop-dismiss:true,
      header: header1,
      message: message1,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',

        }, {
          text: 'Ok',
          handler: (alertData) => {
            confirmation = true;
            return confirmation;

          }
        }
      ]
    });

    await alert.present();

    await alert.onDidDismiss().then((data) => {
      // confirmation = data
      console.log('data->', data);

    });
    return confirmation;

  }
  public async noEditAlert(header1, message1) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      animated: true,
      // backdrop-dismiss:true,
      header: header1,
      message: message1,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',

        }
      ]
    });

    await alert.present();

  }
}
