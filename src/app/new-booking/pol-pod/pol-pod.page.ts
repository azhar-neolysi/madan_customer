
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { NewBookingService } from 'src/app/services/new-booking/new-booking.service';

@Component({
  selector: 'app-pol-pod',
  templateUrl: './pol-pod.page.html',
  styleUrls: ['./pol-pod.page.scss'],
})
export class PolPodPage implements OnInit {
  @Input() type: string;
  @Input() form: any;
  polPods = [];
  // pods = [];
  slideOpts = {
    slidesPerView: 2,
    freeMode: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  };
  constructor(private api: NewBookingService,
    private route: Router,
    private modalCtrl: ModalController,
    private loader: LoaderService) { }

  ngOnInit() { }
  ionViewWillEnter() {
    console.log('this.type', this.type);
    if (this.type === 'pol') {
      this.getPol();
    }
    else
      {this.getPod();}
    // this.getPolPods();
  }

  getPol() {
    this.loader.createLoader();
    this.api.getPols().subscribe((resp: any) => {
      this.loader.dismissLoader();
      console.log(resp);
      this.polPods = resp || [];
    }, err => {
    });
  }

  getPod() {
    this.loader.createLoader();
    this.api.getPods().subscribe((resp: any) => {
      this.loader.dismissLoader();
      console.log(resp);
      this.polPods = resp || [];
    }, err => {
    });
  }

  dismiss(data) {

    this.modalCtrl.dismiss({ data });
  }

  openNewPol(type) {
    console.log('this.form', this.form, type);

    // const type = 'pol/pod';
    this.route.navigate(['manage-pol-pod', 'new', type], { state: { formVal: this.form } });
    this.modalCtrl.dismiss();
  }
}
