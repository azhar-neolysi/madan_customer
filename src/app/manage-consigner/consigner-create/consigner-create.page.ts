import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { IonicSelectableComponent } from '@ionic-selectable/angular';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ApiService } from 'src/app/services/api/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ConsignerService } from 'src/app/services/consigner/consigner.service';

@Component({
  selector: 'app-consigner-create',
  templateUrl: './consigner-create.page.html',
  styleUrls: ['./consigner-create.page.scss'],
})
export class ConsignerCreatePage implements OnInit {
  consignerForm: FormGroup;
  cities: any = [];
  states = [];
  countries = [];
  customerId = null;
  userId = null;
  consignerId = null;
  selectedStateId: number;
  // consignerId =

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private ls: LocalstorageService,
    private consignerApiService: ConsignerService,
    private toastService: ToastService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private loader: LoaderService,
    private nativeGeocoder: NativeGeocoder
  ) {}

  ngOnInit() {
    this.customerId = this.ls.getCustomerId();
    this.userId = this.ls.getUserId();
    this.createConsignerForm();
  }

  ionViewWillEnter() {
    this.getRequiredDetails();
    this.activeRouter.params.subscribe((res) => {
      console.log(res);
      if (res && res.id) {
        this.consignerId = res.id;
        console.log('pop');
        this.getConsigner();
        // this.getRequiredDetails();
      }
    });
  }

  getRequiredDetails() {
    this.getCities();
    this.getStates();
    this.getCountries();
  }

  createConsignerForm() {
    this.consignerForm = this.fb.group({
      regORGId: [3],
      consignerId: [null],
      refCustId: [this.customerId],
      refCreatedBy: [this.userId],
      name: ['', [Validators.required]],
      gstno: ['', [Validators.required, Validators.minLength(15)]],
      pannumber: ['', [Validators.required, Validators.minLength(10)]],
      phoneNo: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(8),
        ],
      ],
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      website: ['', [Validators.required]],
      description: ['', [Validators.required]],
      refReferenceListCityId: ['', [Validators.required]],
      refReferenceListStateId: ['', [Validators.required]],
      refReferenceListCountryId: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      address3: [''],
      address4: [''],
    });
  }

  getCountries() {
    this.apiService.getCountries().subscribe(
      (res: any) => {
        console.log(res);
        this.countries = res || [];
      },
      (err) => {}
    );
  }

  getStates() {
    this.apiService.getStates().subscribe(
      (res: any) => {
        console.log(res);
        this.states = res || [];
      },
      (err) => {}
    );
  }

  getCities() {
    this.apiService.getCities().subscribe(
      (res: any) => {
        console.log(res);
        this.cities = res || [];
      },
      (err) => {}
    );
  }

  submit() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };

    console.log('submit', this.consignerForm);
    // this.consignerForm.get('refReferenceListStateId').setValue(this.selectedStateId);

    if (!this.consignerForm.valid) {
      this.toastService.danger('Please fille all fields');
      this.consignerForm.markAllAsTouched();
      console.log(this.consignerForm.dirty);
      return;
    }

    const req = JSON.parse(JSON.stringify(this.consignerForm.value));

    const address =
      this.consignerForm.get('address1').value +
      ' ' +
      this.consignerForm.get('address2').value +
      ' ' +
      this.consignerForm.get('address3').value;
    console.log(address);
    let lat;
    let long;
    //Get the geolocation of location enterd by user
    this.nativeGeocoder
      .forwardGeocode(address, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log(
          'The coordinates are latitude=' +
            result[0].latitude +
            ' and longitude=' +
            result[0].longitude
        );
        lat = result[0].latitude;
        long = result[0].longitude;
      })
      .catch((error: any) => console.log(error));

    // return;
    req.address4 = lat + ' ' + long;
    req.phoneNo = req.phoneNo.toString();
    req.mobileNo = req.mobileNo.toString();
    req.refCustId = parseInt(req.refCustId, 10);
    req.refCreatedBy = parseInt(req.refCreatedBy, 10);
    req.refReferenceListStateId = this.consignerForm.get(
      'refReferenceListStateId'
    ).value.referenceListId;
    req.refReferenceListCityId = this.consignerForm.get(
      'refReferenceListCityId'
    ).value.referenceListId;
    console.log('-->', req);

    if (req.consignerId) {
      //this.consignerForm.get('refReferenceListStateId').setValue(this.consignerForm.get('refReferenceListStateId').value.referenceListId);
      // this.consignerForm.get('refReferenceListCityId').setValue(this.consignerForm.get('refReferenceListCityId').value.referenceListId);
      // req = JSON.parse(JSON.stringify(this.consignerForm.value));
      this.update(req);
      return;
    }
    this.save(req);
  }

  save(req) {
    delete req.consignerId;
    this.loader.createLoader();
    this.consignerApiService.saveConsigner(req).subscribe(
      (resp) => {
        this.loader.dismissLoader();
        console.log(resp);
        this.router.navigate(['manage-consigner']);
      },
      (err) => {
        this.loader.dismissLoader();
        this.toastService.danger('something went worng');
        console.log(err);
      }
    );
  }

  update(req) {
    this.loader.createLoader();
    this.consignerApiService.updateConsigner(req, req.consignerId).subscribe(
      (resp) => {
        this.loader.dismissLoader();
        console.log(resp);
        this.toastService.success(
          'The consigner has been updated successfully'
        );
        this.router.navigate(['manage-consigner']);
      },
      (err) => {
        console.log(err);
        this.loader.dismissLoader();
        this.toastService.danger(
          'The consigner has not been updated successfully'
        );
      }
    );
  }

  getConsigner() {
    this.getRequiredDetails();
    this.loader.createLoader();
    setTimeout(() => {
      this.consignerApiService
        .getConsigner(this.consignerId, this.customerId)
        .subscribe(
          (res) => {
            this.loader.dismissLoader();
            console.log(res);
            if (res && res[0]) {
              this.consignerForm
                .get('consignerId')
                .setValue(res[0].consignerId);
              this.consignerForm.get('name').setValue(res[0].name);
              this.consignerForm.get('gstno').setValue(res[0].gstno);
              this.consignerForm.get('pannumber').setValue(res[0].pannumber);
              this.consignerForm.get('phoneNo').setValue(res[0].phoneNo);
              this.consignerForm.get('mobileNo').setValue(res[0].mobileNo);
              this.consignerForm.get('email').setValue(res[0].email);
              this.consignerForm.get('website').setValue(res[0].website);
              this.consignerForm
                .get('description')
                .setValue(res[0].description);
              this.consignerForm
                .get('refReferenceListCountryId')
                .setValue(res[0].refReferenceListCountryId);
              this.consignerForm
                .get('refReferenceListStateId')
                .setValue(res[0].refReferenceListStateId);
              this.consignerForm
                .get('refReferenceListCityId')
                .setValue(res[0].refReferenceListCityId);
              for (const state of this.states) {
                if (state.referenceListId === res[0].refReferenceListStateId) {
                  this.consignerForm
                    .get('refReferenceListStateId')
                    .setValue(state);
                  this.consignerForm
                    .get('refReferenceListStateId')
                    .updateValueAndValidity();
                }
              }
              for (const city of this.cities) {
                if (city.referenceListId === res[0].refReferenceListCityId) {
                  this.consignerForm
                    .get('refReferenceListCityId')
                    .setValue(city);
                  this.consignerForm
                    .get('refReferenceListCityId')
                    .updateValueAndValidity();
                }
              }
              this.consignerForm.get('address1').setValue(res[0].address1);
              this.consignerForm.get('address2').setValue(res[0].address2);
              this.consignerForm.get('address3').setValue(res[0].address3);
              this.consignerForm.get('address4').setValue(res[0].address4);
            }
          },
          (err) => {
            this.loader.dismissLoader();
            console.log(err);
          }
        );
    }, 800);
  }
  loadCity(data) {
    console.log('data', data);
    this.loader.createLoader();
    this.consignerForm.get('refReferenceListCityId').setValue('');
    // this.consignerApiService.getState(data.detail.value).subscribe(success => {
    //   this.loader.dismissLoader();
    //   console.log(success);
    this.consignerApiService.getCityBySate(data).subscribe(
      (success) => {
        this.loader.dismissLoader();
        console.log('success', success);
        this.cities = success;
      },
      (failure) => {
        console.log('failur', failure);
      }
    );

    // }, failure => { })
    return;
  }

  portChange(
    event,
    type: string
  ) {
    console.log('port:', event.value);
    if (type === 'state') {
      this.loadCity(event.value.referenceListIdName);
    }
  }
}
