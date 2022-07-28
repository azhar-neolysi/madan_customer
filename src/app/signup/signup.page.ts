
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
// import { FileChooser, FileChooserOptions } from '@ionic-native/file-chooser/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@awesome-cordova-plugins/file-transfer/ngx';
import { environment } from 'src/environments/environment';
// import { IonicSelectableComponent } from '@ionic-selectable/angular';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { SignupService } from '../services/signup/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  cities: any = [];
  states = [];
  countries = [];
  gstDetails: any = [];
  gstNo = '';
  companyName = '';
  doNotProceed = false;
  lorryOwner: any = [];
  gstDocUrl = '';
  panDocUrl = '';
  gstUpload = false;
  panUpload = false;
  registrationForm: FormGroup;
  password = '';
  cnfpassword = '';
  userForm = this.fb.group({
    refOrgid: [3],
    userName: [''],
    refCreatedBy: [],
    email: [''],
    mobileNo: [''],
    password: [''],
    processing: ['0'],
    comments: [''],
    emailVerified: [true],
    refEmpId: [null],
    refCustId: [],
    refDriverId: [null],
    refConsignerId: [null]
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signUpApi: SignupService,
    private toast: ToastService,
    private datePipe: DatePipe,
    private fileChooser: Chooser,
    // private fileChooser: FileChooser,
    private fileTransfer: FileTransfer,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.formRegistration();
    this.getRoleId();
    this.getStates();
    this.getCountries();
    this.getCities();


  }
formRegistration() {
    this.registrationForm = this.fb.group({
      refOrgId: [3],
      refRoleId: [],
      refCreatedBy: [],
      name: ['', [Validators.required]],
      gstNo: ['', [Validators.required, Validators.minLength(15)]],
      gSTDOCUrl: ['C:/'],
      pANDOCUrl: ['C:/'],
      pannumber: ['', [Validators.required,Validators.minLength(10)]],
      legalName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      natureOfBusiness: ['', [Validators.required]],
      entityType: ['', [Validators.required]],
      registrationType: ['', [Validators.required]],
      deptCodeAndType: ['', [Validators.required]],
      registrationDate: ['', [Validators.required]],
      telePhone: ['', [Validators.required,Validators.minLength(11), Validators.maxLength(11)]],
      mobile: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      website: ['', [Validators.required]],
      description: ['', [Validators.required]],
      refReferenceListCityId: ['', [Validators.required]],
      refReferenceListStateId: ['2', [Validators.required]],
      refReferenceListCountryId: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      address3: ['', [Validators.required]],
      address4: ['', [Validators.required]],

    });
  }

  getRoleId() {
    this.signUpApi.getRole().subscribe((res: any) => {
      console.log('roleId = ', res);
      if (res && res.length > 0) {
        this.registrationForm.get('refRoleId').setValue(res[0].roleId);
      }
    }, err => {

    });
  }

  getCountries() {
    this.signUpApi.getCountries().subscribe((res: any) => {
      console.log(res);
      this.countries = res || [];
    }, err => {

    });
  }

  getStates() {
    this.signUpApi.getStates().subscribe((res: any) => {
      console.log('states',res);
      this.states = res || [];
    }, err => {

    });
  }

  getCities() {
    this.signUpApi.getCities().subscribe((res: any) => {
      console.log('cities',res);
      this.cities = res || [];
    }, err => {

    });
  }
  getDetailsFromGst() {
    this.gstNo = this.registrationForm.get('gstNo').value.trim();
    if (this.gstNo !== ''&&this.gstNo!=null)
    {this.loader.createLoader();}
    console.log('gst-->', this.gstNo);
    this.signUpApi.getGstDetails(this.gstNo).subscribe(success => {
      this.loader.dismissLoader();
      console.log('success', success);
      this.gstDetails = success;
      this.setDataFromGst(this.gstDetails);
    }, failure => {
      this.loader.dismissLoader();
      console.log('failure', failure);
    });

  }
  setDataFromGst(data) {
    console.log('dataaa', data);
    if (data && data.error) {
      this.toast.danger('Please enter valid GST NO');
    }
    this.companyName = data.taxpayerInfo.tradeNam.trim();
    const panNo = this.gstNo.substring(2, 12);
    let regDate: string = data.taxpayerInfo.rgdt;
    const dateString = regDate.split('/');
    regDate = dateString[2] + '-' + dateString[1] + '-' + dateString[0];
    regDate += 'T00:00:00';
    console.log(regDate);
    const address = data.taxpayerInfo.pradr.addr.bno + ' ' + data.taxpayerInfo.pradr.addr.st + ' '
      + data.taxpayerInfo.pradr.addr.loc + ' ' + data.taxpayerInfo.pradr.addr.pncd;
    this.registrationForm.get('legalName').setValue(data.taxpayerInfo.lgnm);
    this.registrationForm.get('registrationDate').setValue(regDate);
    this.registrationForm.get('name').setValue(this.companyName);
    this.registrationForm.get('entityType').setValue(data.taxpayerInfo.ctb);
    this.registrationForm.get('registrationType').setValue(data.taxpayerInfo.dty);
    this.registrationForm.get('deptCodeAndType').setValue(data.taxpayerInfo.ctj);
    this.registrationForm.get('natureOfBusiness').setValue(data.taxpayerInfo.pradr.ntr);
    this.registrationForm.get('address').setValue(address);
    this.registrationForm.get('pannumber').setValue(panNo);
    this.registrationForm.get('refRoleId').setValue(this.lorryOwner.roleId);
    this.registrationForm.updateValueAndValidity();
  }
  portChange(event: any, type: string) {
    console.log('port:', event.value);
    if (type === 'state')
      {this.loadCity(event.value.referenceListIdName);}
  }
  loadCity(stateName) {
     this.registrationForm.get('refReferenceListCityId').setValue('');
    this.signUpApi.getCityBySate(stateName).subscribe(success => {
      console.log('success', success);
      this.cities = success;
    }, failure => {
      console.log('failur', failure);
    });
    return;
  }
  submit() {
    console.log('f = ', this.registrationForm);
    console.log('dp = ', this.doNotProceed);
    console.log('gst = ', this.gstDocUrl);
    console.log('pd = ', this.panDocUrl);

    if (this.registrationForm.valid && !this.doNotProceed && this.gstDocUrl !== '' && this.panDocUrl !== '') {
      this.loader.createLoader();
      console.log('this.registrationForm.value', this.registrationForm.value);
      this.fileUpload(this.registrationForm.value);
    }
    else {
      this.toast.danger('Fill/Upload all required Details');
      this.registrationForm.markAllAsTouched();
      this.registrationForm.updateValueAndValidity();
    }
  }
  fileUpload(req) {
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    if (this.gstUpload) {
      const gstOptions: FileUploadOptions = {
        fileKey: 'file',
        params: {
          filename: `${req.gstNo}CustGST.pdf`
        }
      };
      req.gstDocUrl = `F:/CustomerGST/${req.gstNo}CustGST.pdf`;
      fileTransfer.upload(this.gstDocUrl, `${environment.serverUrl}Common/PostdriverUploads/?file`, gstOptions).then((res) => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    }
    if (this.panUpload) {
      const panOptions: FileUploadOptions = {
        fileKey: 'file',
        params: {
          filename: `${req.pannumber}CustPAN.pdf`
        }
      };
      req.panDocUrl = `F:/CustomerPAN/${req.pannumber}CustPAN.pdf`;
      fileTransfer.upload(this.panDocUrl, `${environment.serverUrl}Common/PostdriverUploads/?file`, panOptions).then((res) => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    }
    this.registerData(req);
  }
  registerData(req) {
    this.signUpApi.registerDetails(req).subscribe(
      success => {
        console.log('success registered', success);
        if (success[0].status === 1) {
          // this.toast.success(success[0].msg);
          this.saveUser(success[0].id);
        }
        else {
          this.toast.danger(success[0].msg);
          return;
        }
      },
      failure => {
        this.loader.dismissLoader();
        console.log('failure re', failure);
      });

  }

  saveUser(refCustId) {
    this.setUserData(refCustId);
    this.signUpApi.addUser(this.userForm.value).subscribe(success => {
      console.log('success', success);
      this.loader.dismissLoader();
      if (success[0].status === 1) {
        this.toast.success(success[0].msg);
        this.router.navigate(['']);
      }
      else {
        this.toast.danger(success[0].msg);
        return;
      }
    }, failure => {
      this.loader.dismissLoader();
      console.log('failure', failure);
      this.toast.danger(failure[0].msg);
      return;
    });
  }

  setUserData(refCustId) {
    this.userForm.get('refCustId').setValue(refCustId);
    this.userForm.get('userName').setValue(this.registrationForm.get('legalName').value);
    this.userForm.get('email').setValue(this.registrationForm.get('email').value);
    // this.userForm.get('processing').setValue(1);
    this.userForm.get('comments').setValue(this.lorryOwner.roleName);
    // this.userForm.get('emailVerified').setValue(false);
    this.userForm.get('password').setValue(this.password);
    this.userForm.get('mobileNo').setValue(this.registrationForm.get('mobile').value);
    this.userForm.get('refCreatedBy').setValue(refCustId);
  }
  chooseFile(docType) {
    console.log('chooseFile');
    // const options: FileChooserOptions = {
    //   mime: '"application/pdf"'
    // };
    if (docType === 'gstNo') {
      if (!this.registrationForm.get('gstNo').value) {
        this.toast.warning('Please enter gst Number before uploading document');
        return;
      }
    }
    else {
      if (!this.registrationForm.get('pannumber').value) {
        this.toast.warning('Please enter pan Number before uploading document');
        return;
      }
    }

    // this.fileChooser.open(options).then((resp) => {
    this.fileChooser.getFile().then((resp) => {
      console.log(resp);
      if (docType === 'gstNo') {
        this.gstDocUrl = resp.toString();
        this.gstUpload = true;
      }
      else {
        this.panDocUrl = resp.toString();
        this.panUpload = true;
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  checkCnfPassword() {
    this.doNotProceed = false;
    if ((this.password === '' && this.cnfpassword === '')) {
      this.toast.warning(`Enter valid password `);
      this.doNotProceed = true;
      return;
    }
    if (this.password !== this.cnfpassword) {
      this.toast.warning(`Password and confirm password doesn't match `);
      this.doNotProceed = true;
      return;
    }
  }
  loginback(){
    this.router.navigate(['/login']);
  }
}
