
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
// import { IonicSelectableComponent } from '@ionic-selectable/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ApiService } from 'src/app/services/api/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { PolPodService } from 'src/app/services/pol-pod/pol-pod.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-pol-pod-create',
  templateUrl: './pol-pod-create.page.html',
  styleUrls: ['./pol-pod-create.page.scss'],
})
export class PolPodCreatePage implements OnInit {

  polPodForm: FormGroup;
  cities: any = [];
  states = [];
  countries = [];
  polPods = [];
  customerId = null;
  userId = null;
  polPodId = null;
  entryType: string;
  newBookingForm: any;

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private polPodApi: PolPodService,
    private toast: ToastService,
    private ls: LocalstorageService,
    private router: Router,
    private toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private nativeGeocoder: NativeGeocoder,
    private loader: LoaderService
  ) {this.getRequiredDetails(); }

  ngOnInit() {
    this.customerId = this.ls.getCustomerId();
    this.userId = this.ls.getUserId();
    this.createPolPodForm();

  }

  ionViewWillEnter() {
    this.loader.createLoader();
    setTimeout(() => {

      this.activatedRoute.params.subscribe(res => {
        console.log('res = ', res);
        this.polPodId = res.id;
        this.entryType = res.type;
        console.log('this.entryType = ', this.entryType);
        if (this.entryType != null)
        {this.newBookingForm = window.history.state.formVal;}
        console.log('this.newBookingForm', this.newBookingForm, window.history.state);

        this.getPolPodById();
      });
      this.loader.dismissLoader();
    }, 5000);
  }

  getRequiredDetails() {
    this.getCities();
    this.getStates();
    this.getCountries();
    this.getPolPods();

  }

  createPolPodForm() {
    this.polPodForm = this.fb.group({
      regOrgId: [3],
      // polPodId: [this.polPodId, []],
      // refCustId: [this.customerId],
      // refCreatedBy: [this.userId],
      polPodId: ['', []],
      refCustId: [this.customerId],
      refCreatedBy: [this.userId],
      refReferenceListCityId: ['', [Validators.required]],
      refReferenceListStateId: ['', [Validators.required]],
      refReferenceListCountryId: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      address3: ['', [Validators.required]],
      address4: [''],
      location: ['', [Validators.required]],
      refReferenceListPolpodtypeId: ['', [Validators.required]]
    });
  }

  getCountries() {
    this.apiService.getCountries().subscribe((res: any) => {
      console.log(res);
      this.countries = res || [];
    }, err => {

    });
  }

  getStates() {
    this.apiService.getStates().subscribe((res: any) => {
      console.log(res);
      this.states = res || [];
    }, err => {

    });
  }
  portChange(event,type: string) {
    console.log('port:', event.value);
    if (type === 'state')
      {this.loadCity(event.value.referenceListIdName);}
  }

  getCities() {

    this.apiService.getCities().subscribe((res: any) => {
      console.log(res);
      this.cities = res || [];

    }, err => {

    });
  }

  async submit() {

    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    console.log('submit');
    if (!this.polPodForm.valid) {
      this.toast.danger('Please fill all the fields');
      this.polPodForm.markAllAsTouched();
      return;
    }
    this.loader.createLoader();
    // console.log(this.polPodForm.getRawValue());
    const req: any = JSON.parse(JSON.stringify(this.polPodForm.value));

    // eslint-disable-next-line max-len
    const address = this.polPodForm.get('address1').value + ' ' + this.polPodForm.get('address2').value + ' ' + this.polPodForm.get('address3').value;
    console.log(address);
    let lat;
    let long;
    //Get the geolocation of location enterd by user
    this.nativeGeocoder.forwardGeocode(address, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log(result);
        this.loader.dismissLoader();
        lat = result[0].latitude; long = result[0].longitude;
      })
      .catch((error: any) =>{
        console.log(error);
        this.loader.dismissLoader();
      } );

    setTimeout(() => {

      req.address4 = lat + ',' + long;
      req.refCustId = parseInt(req.refCustId, 10);
      req.refCreatedBy = parseInt(req.refCreatedBy, 10);
      req.refReferenceListCityId = this.polPodForm.get('refReferenceListCityId').value.referenceListId;
      req.refReferenceListStateId = this.polPodForm.get('refReferenceListStateId').value.referenceListId;
      console.log(req);

      if (!this.polPodForm.value.polPodId) {
        delete req.polPodId;
        this.savePolPod(req);
        return;
      }
      console.log(this.polPodForm.get('refReferenceListCityId').value.referenceListId);
      this.updatePolPod(req);
    }, 3000);
  }

  savePolPod(req) {
    // const id = 1;
    this.loader.createLoader();
    this.polPodApi.savePolPod(req).subscribe((success: any) => {
      this.loader.dismissLoader();
      if(this.entryType!=null)
      {this.newBookingForm[this.entryType] = success;}

      console.log(success, '-->', this.entryType);
      // if (this.entryType != null) {
      // this.location.back();
      this.toast.success('Pol/Pod have successfully saved');
      this.polPodForm.reset();
      if(this.entryType!=null)
      {this.router.navigate(['new-booking'], { state: { formVal: this.newBookingForm } });
    }
      // return;
      // }
      this.router.navigate(['manage-pol-pod']);
    }, err => {
      this.loader.dismissLoader();
      this.toast.danger('something went worng');
      console.log(err);

    });
  }

  updatePolPod(req) {
    this.loader.createLoader();
    this.polPodApi.updatePolPod(this.polPodId, req).subscribe((resp) => {
      this.loader.dismissLoader();
      this.toast.success('Pol/Pod have successfully updated');
      this.polPodForm.reset();
      this.router.navigate(['manage-pol-pod']);
    }, err => {
      console.log(err);
      this.loader.dismissLoader();
      this.toast.danger('something went worng');
      if (err.status === 200) {
        this.router.navigate(['manage-pol-pod']);
      }

    });
  }

  getPolPods() {
    this.polPodApi.getRefPolPods().subscribe((resp: any) => {
      console.log(resp);
      this.polPods = resp || [];

      if (!!this.entryType) {
        this.polPods.forEach(element => {
          // eslint-disable-next-line max-len
          console.log(element.referenceListIdName.trim() === this.entryType.trim().toUpperCase(), element.referenceListIdName.trim(), this.entryType.trim().toUpperCase());
          if (element.referenceListIdName.trim() === this.entryType.trim().toUpperCase()) {
            console.log('inside');
            this.polPodForm.get('refReferenceListPolpodtypeId').setValue(element.referenceListId);
            this.polPodForm.get('refReferenceListPolpodtypeId').updateValueAndValidity();
          }
        });
      }
    }, err => {

    });
  }
  compareWithFn = (o1, o2) => {
    console.log(o1, o2);

    return o1 === o2;
  };
  // eslint-disable-next-line @typescript-eslint/member-ordering
  compareWith = this.compareWithFn;
  getPolPodById() {
    // this.getRequiredDetails();
    if (!!this.polPodId)
      {this.polPodApi.getPolPodById(this.polPodId).subscribe((response: any[]) => {
        console.log(response);


        if (!(response && response[0])) {
          return;
        }
        const res = response[0];
        this.polPodForm.get('polPodId').setValue(res.polpodid);
        this.polPodForm.get('refReferenceListCountryId').setValue(res.refReferenceListCountryId);
        for (const state of this.states) {
          if (state.referenceListId === res.refReferenceListStateId) {
            this.polPodForm.get('refReferenceListStateId').setValue(state);
            this.polPodForm.get('refReferenceListStateId').updateValueAndValidity();
          }
        }
        for (const city of this.cities) {
          if (city.referenceListId === res.refReferenceListCityId) {
            this.polPodForm.get('refReferenceListCityId').setValue(city);
            this.polPodForm.get('refReferenceListCityId').updateValueAndValidity();
          }
        }
        // this.polPodForm.get('refReferenceListCityId').setValue(res.refReferenceListCityId);
        // this.polPodForm.get('refReferenceListStateId').setValue(res.refReferenceListStateId);

        this.polPodForm.get('address1').setValue(res.address1);
        this.polPodForm.get('address2').setValue(res.address2);
        this.polPodForm.get('address3').setValue(res.address3);
        this.polPodForm.get('address4').setValue(res.address4);
        this.polPodForm.get('location').setValue(res.location);

        for (const pp of this.polPods) {
          if (res.loadingType.trim() === pp.referenceListIdName.trim()) {
            console.log(pp.referenceListId);

            this.polPodForm.get('refReferenceListPolpodtypeId').setValue(pp.referenceListId);
            this.polPodForm.get('refReferenceListPolpodtypeId').updateValueAndValidity();
            break;
          }

        }

        this.polPodForm.updateValueAndValidity();

      }, err => {
        console.log(err);

      });
    }
  }
  loadCity(stateName) {
    // console.log('data', data);
    // // this.loader.createLoader();
    // this.polPodApi.getState(data.detail.value).subscribe(success => {
    //   // this.loader.dismissLoader();
    //   console.log(success);
    this.polPodForm.get('refReferenceListCityId').setValue('');
    this.polPodApi.getCityBySate(stateName).subscribe(success => {
      console.log('success', success);
      this.cities = success;
    }, failure => {
      console.log('failur', failure);
    });

    // }, failure => { })
    return;
  }

}
