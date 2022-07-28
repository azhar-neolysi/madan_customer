
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PolPodService } from 'src/app/services/pol-pod/pol-pod.service';


@Component({
  selector: 'app-pol-pod-list',
  templateUrl: './pol-pod-list.page.html',
  styleUrls: ['./pol-pod-list.page.scss'],
})
export class PolPodListPage implements OnInit {

  polPods = [];
  constructor(private api: PolPodService,
    private router: Router,
    private loader: LoaderService,
    private alert: AlertService) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getPolPods();
  }

  getPolPods() {
    this.loader.createLoader();
    this.api.getPolPods().subscribe((resp: any) => {
      this.loader.dismissLoader();
      console.log(resp);
      this.polPods = resp || [];

    }, err => {

    });
  }

  createPolPod() {
    this.router.navigate(['manage-pol-pod', 'new']);
  }

  editPolPod(item) {
    console.log('edit = ', item);
    this.router.navigate(['manage-pol-pod', item.polpodid, 'edit']);

  }

  deletePolPod(item) {
    this.alert.alertPromt('Confirmation ', `Are you sure you want to delete? `).then(data => {
      if (Boolean(data)) {
        console.log('delete = ', item);
        // this.loader.createLoader();
        this.api.deletePolPodById(item.polpodid).subscribe(res => {
          // this.loader.dismissLoader();
          console.log(res);
          this.getPolPods();
        }, err => {
          console.log(err);
          this.getPolPods();
        });
      }
    });
    this.loader.dismissLoader();
  }
}
