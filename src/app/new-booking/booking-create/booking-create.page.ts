import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
// import { IonicSelectableComponent } from '@ionic-selectable/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { ConsignerService } from 'src/app/services/consigner/consigner.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { NewBookingService } from 'src/app/services/new-booking/new-booking.service';
import { PolPodService } from 'src/app/services/pol-pod/pol-pod.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { PolPodPage } from '../pol-pod/pol-pod.page';
// import { type } from 'os';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.page.html',
  styleUrls: ['./booking-create.page.scss'],
})
export class BookingCreatePage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides;
  bookingForm: FormGroup;
  cities = [];
  states = [];
  countries = [];
  polAddress = [];
  materials = [];
  consigners = [];
  vehicleTypes: any = [];
  polPods = [];
  locations = [];
  pols = [];
  pods = [];
  rateDetails = [];
  podAddress = [];
  customerId = null;
  userId = null;
  consignerId = null;
  noOfPol = [1];
  noOfPod = [1];
  noOfTrucks = [1];
  truckss = [];
  source=[];
  destination=[];
  loc: any;
  sourceId: number;
  destinationId: number;
  editBookingId = -1;
  newpolId: number;
  showbId = false;
  vehicleTypeBookingMappingId;
  polBookingMappingId;
  podBookingMappingId;
value: any;
  myDate;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  sourceOptions = {
    header: 'Source',
    subHeader: 'Select your loading point'
  };
  destinationOptions = {
    header: 'Destination',
    subHeader: 'Select your unloading point'
  };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private ls: LocalstorageService,
    private toastService: ToastService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private bookingService: NewBookingService,
    private polPodService: PolPodService,
    private consignerApi: ConsignerService,
    public modal: ModalController,
    private loader: LoaderService
  ) {}

  portChange(event: any, type: string) {
    console.log('Event Called');
    console.log(event);
    if (type !== 'material')
      {this.changeLocations(event, type);}
  }
  ngOnInit() {
    this.customerId =
      this.ls.getCustomerId() != null
        ? parseFloat(this.ls.getCustomerId())
        : null;
    this.userId = this.ls.getUserId();
    this.createFG();
    this.getRequiredDetails();
    this.activeRouter.params.subscribe((res) => {
      console.log('res', res);
      this.editBookingId = res.id;
      if (!!this.editBookingId) {
        this.loadEditData();
      }
    });
    this.myDate = new Date();
    console.log('window.history.state', window.history.state.formVal);
    if (window.history.state.formVal) {
      setTimeout(() => {
        this.loader.createLoader();
      }, 8000);
      this.loader.dismissLoader();
      const data = window.history.state.formVal;
      console.log('dataa', data);

      this.bookingForm.get('loadingLocation').setValue(data.loadingLocation);
      this.bookingForm.get('loadingLocation').updateValueAndValidity();
      this.bookingForm
        .get('unLoadingLocation')
        .setValue(data.unLoadingLocation);
      this.bookingForm.get('unLoadingLocation').updateValueAndValidity();
      this.bookingForm
        .get('refReferenceListVehicleTypeId')
        .setValue(data.refReferenceListVehicleTypeId);
      this.bookingForm
        .get('refReferenceListVehicleTypeId')
        .updateValueAndValidity();
      this.bookingForm
        .get('refMaterialRefListId')
        .setValue(data.refMaterialRefListId);
      this.bookingForm.get('refMaterialRefListId').updateValueAndValidity();
      this.bookingForm.get('rateId').setValue(data.rateId);
      this.bookingForm.get('rateId').updateValueAndValidity();
      this.bookingForm.updateValueAndValidity();
    }
  }

  ionViewWillEnter() {
    this.slides.slideTo(0);
  }

  getRequiredDetails() {
    this.getStates();
    this.getCountries();
    this.getCities();
    this.getMaterials();
    this.getConsigners();
    this.getVehicleTypes();
    this.getLocations();
    this.getPods();
    this.getPols();
    this.getPolPods();
    this.getRateDetails();
  }

  async popover(type) {
    let pol;
    const modal = await this.modal.create({
      component: PolPodPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        // eslint-disable-next-line object-shorthand
        type: type,
        form: this.bookingForm.getRawValue(),
      },
    });
    modal.onDidDismiss().then((data: any) => {
      pol = data.data;
      console.log('pol', pol, type, type === 'pol');
      if (data !== undefined && type === 'pol') {
        this.polAddress.push(
          pol.data.state + ',' + pol.data.city + ',' + pol.data.location
        );
        console.log(this.polAddress);
        this.bookingForm
          .get('refReferenceListPOLTypeId')
          .setValue(this.polPods[0].referenceListId);
        this.bookingForm.get('polId').setValue(pol.data.polpodid);
      } else if (data !== undefined) {
        this.podAddress.push(
          pol.data.state + ',' + pol.data.city + ',' + pol.data.location
        );
        this.bookingForm
          .get('refReferenceListPODTypeId')
          .setValue(this.polPods[1].referenceListId);
        this.bookingForm.get('podId').setValue(pol.data.polpodid);
      }
    });

    return await modal.present();
  }

  createFG() {
    this.bookingForm = this.fb.group({
      refConsignerID: ['', [Validators.required]],
      value: [null, []],
      refMaterialRefListId: ['', [Validators.required]],
      totalQty: ['', [Validators.required]],
      vehicleCategory: ['', [Validators.required]],
      refReferenceListVehicleTypeId: ['', [Validators.required]],
      refReferenceListPOLTypeId: ['', [Validators.required]],
      loadingLocation: ['', [Validators.required]],
      estimatedLoadingTime: ['', [Validators.required]],
      lRefReferenceListCityId: [null],
      lRefReferenceListStateId: [null],
      lRefReferenceListCountryId: [null],
      lAddress1: [''],
      lAddress2: [''],
      lAddress3: [''],
      lAddress4: [''],
      refReferenceListPODTypeId: ['', [Validators.required]],
      unLoadingLocation: ['', [Validators.required]],
      estimatedUnloadingTime: ['', [Validators.required]],
      uRefReferenceListCityId: [null],
      uRefReferenceListStateId: [null],
      uRefReferenceListCountryId: [null],
      uAddress1: [''],
      uAddress2: [''],
      uAddress3: [''],
      uAddress4: [''],
      polId: ['', [Validators.required]],
      podId: ['', [Validators.required]],
      bookingDate: ['', [Validators.required]],
      rateId: ['', [Validators.required]],
      rlRateForId: ['', []],
      // sourceId: ['', []],
      // destinationId: ['', []]
    });
    console.log('this.newpolId', this.newpolId);

    // if (!!this.newpolId) {

    // }
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

  getMaterials() {
    this.bookingService.getMaterials().subscribe(
      (res) => {
        console.log('materials',res);
        this.materials = res as any[];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getConsigners() {
    console.log('customerId', this.customerId);
    this.consignerApi.getConsigners(this.customerId).subscribe(
      (res: any[]) => {
        console.log('consigners',res);
        this.consigners = res;
        console.log('consigners',this.consigners);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getVehicleTypes() {
    this.bookingService.getVehicleTypes().subscribe(
      (res) => {
        console.log(res);
        this.vehicleTypes = res as any[];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getPolPods() {
    this.polPodService.getRefPolPods().subscribe(
      (res) => {
        console.log(res);
        this.polPods = res as any[];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getLocations() {
    this.loader.createLoader();
    this.bookingService.getLocations().subscribe(
      (res) => {
        console.log('Locations',res);
        this.loader.dismissLoader();
        this.locations = res as any[];
        this.locations.map((val,i)=>{
          // this.source=[{source:this.locations[i].source,}];
          this.loc=this.locations[i];
          this.source=this.locations[i].source;
          this.destination=this.locations[i].destination;

          console.log(this.source);
        });
        // console.log(this.locations[0].source);
      },
      (err) => {
        this.loader.dismissLoader();
        console.log(err);
      }
    );
  }

  getPols() {
    this.bookingService.getPols().subscribe(
      (res) => {
        console.log('pols', res);
        this.pols = res as any[];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getPods() {
    this.bookingService.getPods().subscribe(
      (res) => {
        this.pods = res as any[];
        console.log(res, 'this.pods', this.pods);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getRateDetails() {
    const rlRateForId = this.bookingForm.get('rlRateForId').value;
    let sourceId = this.sourceId;
    let destinationId = this.destinationId;
    console.log(sourceId);
    console.log(
      'bform',
      this.bookingForm.get('unLoadingLocation').value.sourceID);
    if (destinationId === undefined || destinationId == null) {
      if (this.bookingForm.get('unLoadingLocation').value != null) {
        destinationId =
          this.bookingForm.get('unLoadingLocation').value.destinationID;
          console.log(this.bookingForm.get('unLoadingLocation').value.destinationID);
      }
    }
    if (sourceId === undefined || sourceId == null) {
      if (this.bookingForm.get('loadingLocation').value != null) {
        sourceId = this.bookingForm.get('loadingLocation').value.sourceID;
      }
    }
    console.log(
      'rlRateForId,',
      rlRateForId,
      'sourceId,',
      sourceId,
      'destinationId,',
      destinationId
    );
    if (!!destinationId && !!sourceId) {
      this.bookingService
        .getRateDetails(sourceId, rlRateForId, destinationId)
        .subscribe(
          (res) => {
            console.log(res);

            this.rateDetails = res as any[];
            console.log('---LLLL>>>', this.rateDetails);
            this.bookingForm.get('rateId').setValue(this.rateDetails[0].rateId);

            this.bookingForm.get('rateId').updateValueAndValidity();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  submit() {
    console.log('form', this.bookingForm, '--->', this.editBookingId);

    if (!this.bookingForm.valid) {
      this.bookingForm.markAllAsTouched();
      console.log(this.bookingForm.dirty);
      this.toastService.danger('Please fill all the fields');
      return;
    }
    this.bookingForm.removeControl('vehicleCategory');
    this.bookingForm.updateValueAndValidity();
    console.log(this.bookingForm.value);
    const req = JSON.parse(JSON.stringify(this.bookingForm.value));
    // req.refCreatedBy = parseInt(req.refCreatedBy.toString());
    // req.refCustomerId = parseInt(req.refCustomerId.toString());
    req.estimatedLoadingTime = new Date(req.estimatedLoadingTime)
      .toISOString()
      .split('.')[0];
    req.estimatedUnloadingTime = new Date(req.estimatedUnloadingTime)
      .toISOString()
      .split('.')[0];
    req.bookingDate = new Date(req.bookingDate).toISOString().split('.')[0];
    req.loadingLocation = this.bookingForm.get('loadingLocation').value.source;
    req.unLoadingLocation =
      this.bookingForm.get('unLoadingLocation').value.destination;
    req.refMaterialRefListId = this.bookingForm.get(
      'refMaterialRefListId'
    ).value.referenceListId;
    console.log(req);
    if (this.editBookingId > -1) {
      this.edit(req);
    } else {
      this.save(req);
    }
  }
  save(req) {
    req.refCreatedBy = parseInt(this.userId, 10);
    req.refOrgId = 3;
    req.refCustomerId = this.customerId;
    this.bookingService.save(req).subscribe(
      (res) => {
        console.log(res);
        this.toastService.success('Bookings created successfully');
        this.bookingForm.reset();
        this.router.navigate(['my-bookings']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  edit(req) {
    console.log('inside Editing');
    req.BookingId = parseInt(this.editBookingId.toString(), 10);
    req.RefModifiedBy = parseInt(this.userId, 10);
    req.VehicleTypeBookingMappingId = this.vehicleTypeBookingMappingId;
    req.POLBookingMappingId = this.polBookingMappingId;
    req.PODBookingMappingId = this.podBookingMappingId;
    req.LoadingLocationID =
      this.bookingForm.get('loadingLocation').value.sourceID;
    req.UnLoadingLocationID =
      this.bookingForm.get('unLoadingLocation').value.destinationID;
    req.value = req.value.toString();
    delete req.refMaterialRefListId;
    delete req.refReferenceListPODTypeId;
    delete req.refReferenceListPOLTypeId;
    delete req.rlRateForId;
    this.bookingService.editBooking(this.editBookingId, req).subscribe(
      (data) => {
        if (data[0].status === 2) {
          this.toastService.success('Bookings updated successfully');
          this.bookingForm.reset();
          this.router.navigate(['my-bookings']);
        } else {
          this.toastService.success(data[0].msg);
        }
      },
      (err) => {
        this.toastService.success(err[0].msg);
      }
    );
  }
  changeLocations(data, str) {
    if (str === 'loadingLocation') {
      this.bookingForm.get('rlRateForId').setValue(data.rlRateForId);
      this.sourceId = data.sourceID;
    } else if (str === 'unLoadingLocation') {
      this.destinationId = data.destinationID;
    }
    this.getRateDetails();
    this.bookingForm.get('bookingDate').setValue(new Date().toISOString());
    this.bookingForm.get('bookingDate').updateValueAndValidity();
  }
  increaseCount(data) {
    if (data === 'pol') {
      this.noOfPol.push(1);
    } else if (data === 'pod') {
      this.noOfPod.push(1);
    } else {
      this.noOfTrucks.push(1);
    }
  }
  trucksLoader(data) {
    console.log('this.truckType', data.detail.value);
    this.bookingService.getVehicleByType(data.detail.value).subscribe(
      (success) => {
        console.log('suc', success);
        this.vehicleTypes = success;
      },
      (failure) => {
        console.log('fail', failure);
      }
    );
  }
  getSelectedTrucks(data) {
    console.log('data', data);

    this.truckss.push(data.detail.value);
  }
  decreaseCount(data) {
    if (data === 'pol') {
      this.noOfPol.pop();
    } else if (data === 'pod') {
      this.noOfPod.pop();
    } else {
      this.noOfTrucks.pop();
    }
  }
  goToStepTwo() {
    console.log('inside');
    setTimeout(() => {
      this.slides.slideNext();
    }, 1000);
  }
  loadEditData() {
    this.bookingService.getBooking(this.editBookingId).subscribe(
      (successeditBookingId: any) => {
        console.log('succss', successeditBookingId);
        if (successeditBookingId.polbmDtls[0].rpolbmRateId != null) {
          this.bookingService
            .getRateById(successeditBookingId.polbmDtls[0].rpolbmRateId)
            .pipe()
            .subscribe(
              (successbookingService) => {
                console.log('succss', successbookingService);
                this.bookingForm
                  .get('rlRateForId')
                  .setValue(successbookingService[0].refRateForReferenceList);

                for (const loc of this.locations) {
                  if (
                    loc.sourceID ===
                    successbookingService[0].refSourceReferenceList
                  ) {
                    this.sourceId =
                      successbookingService[0].refSourceReferenceList;
                    this.bookingForm.get('loadingLocation').setValue(loc);
                    this.bookingForm
                      .get('loadingLocation')
                      .updateValueAndValidity();
                  }
                  if (
                    loc.destinationID ===
                    successbookingService[0].refDestinationReferenceList
                  ) {
                    this.destinationId =
                      successbookingService[0].refDestinationReferenceList;
                    this.bookingForm.get('unLoadingLocation').setValue(loc);
                    this.bookingForm
                      .get('unLoadingLocation')
                      .updateValueAndValidity();
                  }
                }
                console.log(
                  'sss',
                  this.sourceId,
                  this.destinationId,
                  this.bookingForm.get('rlRateForId').value
                );
                this.getRateDetails();
              },
              (failure) => {}
            );

          setTimeout(() => {
            // this.loader.createLoader();
            const category = successeditBookingId.bookingDtls[0].vehicleType;
            const cat = category.split(' ', 1);
            console.log('category', category, cat);
            if (cat === 'Open' || cat === 'OpenTrucks') {
              // success[0].refSourceReferenceList;
              console.log('insss');
              this.bookingForm.get('vehicleCategory').setValue('Open Truck');
            } else if (cat === 'Covered' || cat === 'Container') {
              this.bookingForm.get('vehicleCategory').setValue('Container');
            } else {
              this.bookingForm.get('vehicleCategory').setValue('Trailer');
            }

            this.bookingForm
              .get('refReferenceListVehicleTypeId')
              .setValue(successeditBookingId.bookingDtls[0].rlvtId);
            this.bookingForm
              .get('value')
              .setValue(successeditBookingId.bookingDtls[0].bookingId);
            this.showbId = true;
            this.bookingForm
              .get('totalQty')
              .setValue(successeditBookingId.bookingDtls[0].totalQty);

            // this.bookingForm.get('rateId').setValue(success.polbmDtls[0].rpolbmRateId);
            this.bookingForm
              .get('bookingDate')
              .setValue(successeditBookingId.bookingDtls[0].bookingDate);
            this.vehicleTypeBookingMappingId =
              successeditBookingId.bookingDtls[0].vehicleTypeBookingMappingId;
            this.bookingForm
              .get('refReferenceListPOLTypeId')
              .setValue(this.polPods[0].referenceListId);
            this.bookingForm
              .get('refReferenceListPODTypeId')
              .setValue(this.polPods[1].referenceListId);
            this.bookingForm
              .get('polId')
              .setValue(successeditBookingId.polbmDtls[0].polId);
            this.polBookingMappingId =
              successeditBookingId.polbmDtls[0].polbookingMappingId;
            this.formPolPodAddress(
              successeditBookingId.polbmDtls[0].polId,
              'pol'
            );
            this.bookingForm
              .get('estimatedLoadingTime')
              .setValue(successeditBookingId.polbmDtls[0].estimatedLoadingTime);
            this.bookingForm
              .get('podId')
              .setValue(successeditBookingId.podbmDtls[0].podId);
            this.podBookingMappingId =
              successeditBookingId.podbmDtls[0].podbookingMappingId;
            this.formPolPodAddress(
              successeditBookingId.podbmDtls[0].podId,
              'pod'
            );
            this.bookingForm
              .get('estimatedUnloadingTime')
              .setValue(
                successeditBookingId.podbmDtls[0].estimatedUnloadingTime
              );
            this.bookingForm
              .get('refConsignerID')
              .setValue(successeditBookingId.podbmDtls[0].consignerId);
            // this.bookingForm.get('refMaterialRefListId').setValue(success.bookingDtls[0].rlmaterialId);

            // Ionic selectable set value should be an object
            for (const material of this.materials) {
              if (
                material.referenceListId ===
                successeditBookingId.bookingDtls[0].rlmaterialId
              ) {
                this.bookingForm.get('refMaterialRefListId').setValue(material);
              }
            }
            // this.loader.dismissLoader();
          }, 800);
        }
        // this.bookingForm.get().setValue(success.);
      },
      (failure) => {}
    );
  }
  formPolPodAddress(id, type) {
    if (type === 'pol') {
      this.polAddress = [];
      this.pols.forEach((data) => {
        if (data.polpodid === id) {
          this.polAddress.push(
            data.state + ',' + data.city + ',' + data.location
          );
        }
      });
    } else {
      console.log('pod', id);

      this.podAddress = [];
      console.log(this.pods);

      this.pods.forEach((data) => {
        if (data.polpodid === id) {
          this.podAddress.push(
            data.state + ',' + data.city + ',' + data.location
          );
        }
      });
    }
  }
}
