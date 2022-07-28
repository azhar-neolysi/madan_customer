import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home/home.service';
import { LoaderService } from '../services/loader/loader.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  rates = [];

  constructor(
    private apiService: HomeService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getRates();
  }

  getRates() {
    this.loader.createLoader();
    this.apiService.getRates().subscribe((resp: any) => {
      this.loader.dismissLoader();
      console.log(resp);
      this.rates = resp || [];
    }, err => {
      this.loader.dismissLoader();
    });
  }


}
