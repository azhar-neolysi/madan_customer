import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConsignerService } from 'src/app/services/consigner/consigner.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';

@Component({
  selector: 'app-consigner-list',
  templateUrl: './consigner-list.page.html',
  styleUrls: ['./consigner-list.page.scss'],
})
export class ConsignerListPage implements OnInit {

  customerId = null;
  userId = null;
  consigners = [];
  constructor(private api: ConsignerService,
    private router: Router,
    private ls: LocalstorageService,
    private loader: LoaderService,
    private alert: AlertService) { }

  ngOnInit() {
    this.customerId = this.ls.getCustomerId();
    this.userId = this.ls.getUserId();
  }

  ionViewWillEnter() {
    this.getConsigners();
  }

  getConsigners() {
    this.loader.createLoader();
    this.api.getConsigners(this.customerId).subscribe((resp: any) => {
      this.loader.dismissLoader();
      console.log(resp);
      this.consigners = resp || [];
    }, err => {

    });
  }

  createNewConsigner() {
    this.router.navigate(['manage-consigner', 'new']);
  }

  editConsigner(consigner) {
    console.log(consigner);
    this.router.navigate(['manage-consigner', consigner.consignerId, 'edit']);
  }

  deleteConsigner(consigner) {
    this.alert.alertPromt('Confirmation ', `Are you sure you want to delete? `,).then(data => {
      if (Boolean(data)) {
        this.api.deleteConsigner(consigner.consignerId).subscribe(success=>{
          console.log(success);
          this.getConsigners();
        },
          failure=>{
            console.log(failure);
          });
      }
    });
  }

}
