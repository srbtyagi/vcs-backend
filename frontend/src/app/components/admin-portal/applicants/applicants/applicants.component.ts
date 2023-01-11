import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { IDayCalendarConfig } from 'ng2-date-picker';
import { StoreDataService } from 'src/app/store-data.service';


@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent implements OnInit {
  @ViewChild('closeEdit', { static: false }) private closeEdit: ElementRef;
  @ViewChild('closeUserStatus', { static: false }) private closeUserStatus: ElementRef;
  @ViewChild('closeApplyStatus', { static: false }) private closeApplyStatus: ElementRef;
  @ViewChild('changePasswordModal', { static: false }) private changePasswordModal: ElementRef;
  @ViewChild('changePasscodeModal', { static: false }) private changePasscodeModal: ElementRef;
  @ViewChild('uploadDocModal', { static: false }) private uploadDocModal: ElementRef;
  /*paginate */
  public count: any = 20;
  public page: any = 1;
  /**paginate  */
  moduleArray: any[];
  applicantList: any = [];
  details: any;
  first_name: any;
  last_name: any;
  email: any;
  phone_no: any;
  middle_name: any;
  profession: any = [];
  speciality: any = [];
  ssn_4digit: any;
  dob: any = '';
  profession_id: any;
  speciality_id: any;
  editApplicant: FormGroup;
  recruitee_id: any;
  user_status: any;
  apply_status: any;
  user_id: any;
  docType: any;
  doc_name: any = '';
  showSecInput: boolean = false;

  fileToUpload: any | null = null;
  file_name: any = '';
  doc_id: any = "";
  viewShow: any = "";
  showPercentage: number = 0;
  showProgressBar: boolean = false;
  uploaded_data: any;
  viewfinalErr: boolean = false;
  docs: any;
  remark: any;


  recruitment_status: any = "all";
  position_type: any = "ALL";
  profession_type: any = "ALL";
  prefered_location: any = "ALL";


  datePickerConfig = <IDayCalendarConfig>{
    drops: 'up',
    format: 'MM/DD/YYYY'
  }
  from_date: any = moment(new Date()).format("MM-DD-YYYY");
  to_date: any = moment(new Date()).format("MM-DD-YYYY");
  datePickerConfig2 = <IDayCalendarConfig>{
    drops: 'down',
    format: 'MM-DD-YYYY',
    max: this.to_date
  }
  datePickerConfig3 = <IDayCalendarConfig>{
    drops: 'down',
    format: 'MM-DD-YYYY',
    min: this.from_date
  }

  doc_expiry_date: any;

  detailsData: any = [];
  filterArray: any = [];
  search_data: any;

  conf_doc_name: any;
  ConffileToUpload: any | null = null;
  conf_file_name: any = '';
  conf_doc_list: any = [];
  assignment_data: any = [];
  user_id_by: any;
  excelfileName: any;

  standard_doc_list: any = [];
  fac_specc_doc: any = [];
  others_doc: any = [];
  specific_doc_list: any = [];
  other_doc_list: any = [];
  doc_name_spec: any;
  showSecInput2: boolean = false;
  showtrdInput: boolean = false;
  doc_name_Other: any;
  req_doc_list: any = [];
  pendingReqDoc: any;

  searchData2: any;
  user_type: any;


  constructor(public http: AdminService, public route: ActivatedRoute, public router: Router, public fb: FormBuilder,
    public storeData: StoreDataService) {
    this.user_id_by = sessionStorage.getItem("user_id");
    this.excelfileName = "applicants_report(" + moment(new Date).format("MM-DD-YYYY") + ")";
    this.user_type = sessionStorage.getItem("user_type");
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    // //console.log(this.data)
    this.storeData.data2.subscribe(res => this.searchData2 = res);
    // //console.log(this.searchData2)
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);

    this.getProfession();
    this.getSpeciality();
    this.getDocType();
    this.getPreferedLocation();
    this.getPositionType();
    if (this.recruitment_status === "all" && this.searchData2.length === 0 && this.prefered_location === "ALL" && this.profession_type === "ALL" && this.position_type === "ALL") {
      this.searchAppl();
    }
    else if (this.searchData2.length !== 0) {
      this.recruitment_status = this.searchData2.recruit_status;
      this.position_type = this.searchData2.position_type;
      this.prefered_location = this.searchData2.prefered_location;
      this.profession_type = this.searchData2.profession;
      this.page = this.searchData2.page;
      this.searchAppl();
    }


    this.editApplicant = this.fb.group({
      first_name: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      middle_name: new FormControl([Validators.maxLength(100)]),
      last_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required, Validators.maxLength(60)]),
      phone_no: new FormControl(null, [Validators.max(99999999999999)]),
      dob: new FormControl(null),
      ssn_4digit: new FormControl(null, [Validators.max(9999)]),
      profession_id: new FormControl(null),
      speciality_id: new FormControl(null)
    });
  }
  /////////////////////////////
  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
    let data2 = {
      recruit_status: this.recruitment_status,
      page: this.page,
      prefered_location: this.prefered_location,
      profession: this.profession_type,
      position_type: this.position_type,


    }
    this.storeData.changeData2(data2);
  }
  /////////////////////////////////
  getAssignaccess(val) {
    if (sessionStorage.getItem("user_id")) {
      this.moduleArray = [];
      const arr = JSON.parse(sessionStorage.getItem("moduleArray"));
      const ids = arr.map(o => o.submodule_id);
      const arry = arr.filter(({ submodule_id }, index) => !ids.includes(submodule_id, index + 1));
      arry.forEach((e, index) => {
        if (e.module_id === val) {
          this.moduleArray.push(e);
          switch (e.submodule_name) {
            case "APPLICANT": {
              e.submodule_name_lower = "Applicants";
              e.routing = "/applicants";
              break;
            }
            case "JOB APPLICATION": {
              e.submodule_name_lower = "Job Application";
              e.routing = "/job-applications_admin";
              break;
            }
            case "ONBOARDING & HIRING": {
              e.submodule_name_lower = "On Boarding";
              e.routing = "/onboarding-hiring";
              break;
            }
            case "HIRED": {
              e.submodule_name_lower = "Hired";
              e.routing = "/hired-applicant";
              break;
            }
            case "ASSIGN MANAGERS": {
              e.submodule_name_lower = "Assign Manager";
              e.routing = "/assign-Manager";
              break;
            }
            case "SKILLSET": {
              e.submodule_name_lower = "Skill Set";
              e.routing = "/skill-set-admin";
              break;
            }
            default: {
              //statements; 
              break;
            }
          }

        }

      });
    }
    //console.log(this.moduleArray)
    setTimeout(() => {
      document.getElementById("clsActive201").className = "active";
    }, 200)
  }

  navigateTo(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(val.module_id)
      }
    };
    this.router.navigate([val.routing], navigationExtras);
  }

  focusFunction() {
    document.getElementById("mbody").style.height = "300px";
  }

  focusOutFunction() {
    document.getElementById("mbody").style.height = "138px";
    this.datePickerConfig2 = <IDayCalendarConfig>{
      drops: 'down',
      format: 'MM-DD-YYYY',
      max: this.to_date
    }
    this.datePickerConfig3 = <IDayCalendarConfig>{
      drops: 'down',
      format: 'MM-DD-YYYY',
      min: this.from_date
    }
  }

  getProfession() {
    this.http.getAllProfession().subscribe((res: any) => {
      this.profession = res;
      //console.log(this.profession)
    });
  }

  getSpeciality() {
    this.http.getAllSpeciality().subscribe((res: any) => {
      this.speciality = res;
      //console.log(this.speciality)
    });
  }

  prefLocation: any;
  getPreferedLocation() {
    this.http.getPreferedLocation().subscribe((res: any) => {
      // console.log(res)
      this.prefLocation = res;
    });
  }

  positiontype: any = [];
  getPositionType() {
    this.positiontype = [];
    this.http.getAllPositionType().subscribe((res: any) => {
      res.forEach(e => {
        if (e.position_type_status === "active") {
          this.positiontype.push(e);
        }
      });
      //console.log(this.positiontype)
    });
  }

  searchAppl() {
    this.applicantList = [];
    this.http.spinnerShow();
    let data = {
      recruit_status: this.recruitment_status,
      prefered_location: this.prefered_location,
      profession: this.profession_type,
      position_type: this.position_type
    }
    let data2 = {
      recruit_status: this.recruitment_status,
      prefered_location: this.prefered_location,
      profession: this.profession_type,
      position_type: this.position_type,
      page: this.page
    }
    this.storeData.changeData2(data2);
    //console.log(data)
    this.http.getApplicants(data).subscribe((res: any) => {
      //console.log(res);
      if (res.length !== 0) {
        this.applicantList = res;
        this.filterArray = res;
        this.http.spinnerHide();
      }
      else {
        this.http.spinnerHide();
        Swal.fire({
          title: 'No search result found!',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#4C96D7',
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      }
    }, err => {
      this.http.spinnerHide();
      Swal.fire({
        title: 'Something went wrong,please try again.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#4C96D7',
        confirmButtonText: 'Ok',
        allowOutsideClick: false,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      }).then((result) => {
        if (result.isConfirmed) {

        }
      })
    });
  }

  get searchData() {
    return this.search_data;
  }

  set searchData(value) {
    this.search_data = value;
    this.applicantList = this.search_data ? this.filterList(this.search_data) : this.filterArray;
  }

  filterList(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.filterArray.filter((list: any) =>
      list.user_first_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.recruitee_code.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.user_last_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );

  }

  EditApp(val) {
    //console.log(val)
    this.details = "";
    this.details = val;
    this.recruitee_id = this.details.user_id;
    this.first_name = this.details.user_first_name;
    this.last_name = this.details.user_last_name;
    this.email = this.details.email;
    this.ssn_4digit = this.details.ssn_4digit;
    this.profession_id = Number(this.details.profession);
    this.speciality_id = Number(this.details.speciality);
    this.phone_no = this.details.phone;
    //this.dob = moment(this.details.dob).format("MM/DD/YYYY");
    if (this.details.user_middle_name !== null) {
      this.middle_name = this.details.user_middle_name;
    }
    if (this.details.dob === "") {
      this.dob = '';
    }
    else if(this.details.dob === "Invalid date"){
      this.dob = '';
    }
    else {
      this.dob = moment(this.details.dob).format("MM/DD/YYYY");
    }
    //console.log(this.details)
  }

  clickOpen(val) {
    this.details = "";
    this.viewfinalErr = false;
    this.viewShow = "";
    this.details = val;
    //console.log(this.details)
    this.recruitee_id = this.details.recruitee_id;
    this.user_status = this.details.user_status;
    this.apply_status = this.details.apply_status;
    this.user_id = this.details.user_id;
  }

  clickOpenAppl(val) {
    this.details = "";
    this.details = val;
    this.recruitee_id = this.details.recruitee_id;
    this.user_id = this.details.user_id;
    this.getAllApplByUser(this.user_id);
  }

  clickOpenASSign(val) {
    this.details = "";
    this.assignment_data = [];
    this.details = val;
    this.recruitee_id = this.details.recruitee_id;
    this.user_id = this.details.user_id;
    this.assignment_data = val.assignment_data;
  }

  clickOpenDoc(val) {
    this.details = "";
    this.details = val;
    this.recruitee_id = this.details.recruitee_id;
    this.user_status = this.details.user_status;
    this.apply_status = this.details.apply_status;
    this.user_id = this.details.user_id;
    this.getAllDocs();
  }

  updateDetails() {
    this.http.spinnerShow();
    let DOB: any;
    if (this.dob) {
      DOB = moment(this.editApplicant.controls.dob.value).format("MM/DD/YYYY");
    }
    else {
      DOB = "";
    }
    let data = {
      user_id: this.recruitee_id,
      user_first_name: this.editApplicant.controls.first_name.value,
      user_middle_name: this.editApplicant.controls.middle_name.value,
      user_last_name: this.editApplicant.controls.last_name.value,
      phone: this.editApplicant.controls.phone_no.value,
      email: this.editApplicant.controls.email.value,
      dob: DOB,
      profession: this.editApplicant.controls.profession_id.value,
      speciality: this.editApplicant.controls.speciality_id.value,
      ssn_4digit: this.editApplicant.controls.ssn_4digit.value
    }
    //console.log(data)
    this.http.updateApplicant(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.http.spinnerHide();
        this.closeEdit.nativeElement.click();
        Swal.fire({
          title: 'Applicant updated successfully.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#4C96D7',
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            //window.location.reload();
            this.searchAppl();
            this.editApplicant.reset();
          }
        })
      }
      else {
        this.http.spinnerHide();
        this.closeEdit.nativeElement.click();
        Swal.fire({
          title: 'Something went wrong,please try again.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#4C96D7',
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      }

    }, err => {
      this.http.spinnerHide();
      this.closeEdit.nativeElement.click();
      Swal.fire({
        title: 'Something went wrong,please try again.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#4C96D7',
        confirmButtonText: 'Ok',
        allowOutsideClick: false,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      }).then((result) => {
        if (result.isConfirmed) {

        }
      })
    })
  }

  changeUserStatus() {
    this.http.spinnerShow();
    let data = {
      user_id: this.user_id,
      user_status: this.user_status
    }
    this.http.changeUserStatus(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.http.spinnerHide();
        this.closeUserStatus.nativeElement.click();
        this.successMsg('Status changed successfully.')
      } else {
        this.http.spinnerHide();
        this.closeUserStatus.nativeElement.click();
        this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.http.spinnerHide();
      this.closeUserStatus.nativeElement.click();
      this.errorMsg('Something went wrong,please try again.');
    });
  }

  changeApplyStatus() {
    this.http.spinnerShow();
    let data = {
      recruitee_id: this.recruitee_id,
      apply_status: this.apply_status
    }
    this.http.changeApplyStatus(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.http.spinnerHide();
        this.closeApplyStatus.nativeElement.click();
        this.successMsg('Status changed successfully.')
      } else {
        this.http.spinnerHide();
        this.closeApplyStatus.nativeElement.click();
        this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.http.spinnerHide();
      this.closeApplyStatus.nativeElement.click();
      this.errorMsg('Something went wrong,please try again.');
    });
  }

  changePassword() {
    this.http.spinnerShow();
    let data = {
      user_id: this.user_id
    }
    this.http.changePassword(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.http.spinnerHide();
        this.changePasswordModal.nativeElement.click();
        this.successMsg2('Password changed successfully.')
      } else {
        this.http.spinnerHide();
        this.changePasswordModal.nativeElement.click();
        this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.http.spinnerHide();
      this.changePasswordModal.nativeElement.click();
      this.errorMsg('Something went wrong,please try again.');
    });
  }

  changePasscode() {
    this.http.spinnerShow();
    let data = {
      user_id: this.user_id
    }
    this.http.changePasscode(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.http.spinnerHide();
        this.changePasscodeModal.nativeElement.click();
        this.successMsg2('Passcode changed successfully.')
      } else {
        this.http.spinnerHide();
        this.changePasscodeModal.nativeElement.click();
        this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.http.spinnerHide();
      this.changePasscodeModal.nativeElement.click();
      this.errorMsg('Something went wrong,please try again.');
    });
  }

  getDocType() {
    this.http.getDocumentType().subscribe((res: any) => {
      this.docType = res;
      //console.log(this.docType)
    })
  }

  onSelectedDoc(val) {
    //this.doc_name = "";
    //this.doc_id = "";
    this.docType.forEach(e => {
      if (e.doc_id === Number(val)) {
        this.doc_name = e.doc_name;
        this.doc_id = val;

        if (this.doc_name === "other") {
          this.showSecInput = true;
          this.doc_name = "";
        }
        else if (this.doc_name === "facility_spec") {
          this.showSecInput = true;
          this.doc_name = "";
        }
        else {
          this.showSecInput = false;
        }
      }

    });

    //console.log(this.doc_name, this.doc_id)

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    //console.log(this.fileToUpload)
    this.file_name = this.fileToUpload.name;
    //this.uploadFileToActivity(this.fileToUpload, this.user_id);
  }

  uploadFileToActivity() {
    //console.log(this.fileToUpload)
    this.showProgressBar = true;
    this.showPercentage = 0;
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.http.uploadDoc(formData, this.user_id, this.doc_id, this.doc_name, moment(this.doc_expiry_date).format("MM-DD-YYYY")).subscribe((res: any) => {
      //console.log(res)
      this.showPercentage = Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body.message === "success") {
          this.fileToUpload = "";
          this.file_name = "";
          this.doc_name = "";
          this.doc_id = "";
          this.showProgressBar = false;
          this.viewShow = "true";
          this.uploadDocModal.nativeElement.click();
          this.successMsg2('File uploaded successfully.');
        }
      }

      else if (res === "doc not uploaded") {
        this.viewfinalErr = true;
        this.viewShow = "false";
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.viewfinalErr = true;
      this.viewShow = "false";
      //this.errorMsg('Something went wrong,please try again.');
    });
  }

  // uploadDoc() {
  //   //this.doc_name = "a";
  //   //this.doc_id = 0;
  //   this.showProgressBar = true;
  //   this.showPercentage = 0;
  //   //console.log(this.fileToUpload)
  //   let formData = new FormData();
  //   formData.append('file', this.fileToUpload, this.fileToUpload.name);
  //   this.http.uploadDoc(formData, this.user_id, 0, "a").subscribe((res: any) => {
  //     //console.log(res)
  //     //console.log(res.body)
  //     this.showPercentage = Math.round(100 * res.loaded / res.total);
  //     if (res.body !== undefined) {
  //       if (res.body.message === "success") {
  //         this.showProgressBar = false;
  //         this.viewShow = "true";
  //         this.uploaded_data = res.body.rec_doc_details;
  //       }
  //     }
  //     else if (res === "doc not uploaded") {
  //       this.viewShow = "false";
  //     }
  //   }, err => {
  //     this.viewShow = "false";
  //   });
  // }


  gotoDetails(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(val.user_id)
      }
    };
    ////console.log(navigationExtras)
    this.router.navigate(["/applicant-details"], navigationExtras);
  }

  getAllDocs() {
    this.docs = [];
    this.http.getAllDocs(this.user_id).subscribe((res: any) => {
      //console.log(res);
      this.docs = res;
      if (this.docs.length === 0) {
        this.errorMsg("No document uploaded yet!");
      }
      else {
        this.docs.forEach(e => {
          let cDate = moment(new Date()).format("MM/DD/YYYY");
          if (new Date(cDate).getTime() > new Date(e.expiry_date).getTime() && e.expiry_date) {
            e.expirystatus = "expired";
          }
          else {
            e.expirystatus = "current";
          }
        });
      }
    })
  }

  sendRemark() {
    // let data1 = {
    //   job_id: this.job_id,
    //   application_id: this.application_id,
    //   remarks: this.remark
    // }
  }

  getAllApplByUser(user_id) {
    this.detailsData = [];
    let data = {
      user_id: user_id
    }
    this.http.getAllApplnByUser(data).subscribe((res: any) => {
      // //console.log(res)
      this.detailsData = res;
    }, err => {

    })
  }

  clickOpenConfDoc(val) {
    this.details = "";
    this.ConffileToUpload = "";
    this.conf_file_name = '';
    this.conf_doc_name = "";
    this.viewfinalErr = false;
    this.viewShow = "";
    this.details = val;
    //console.log(this.details)
    this.recruitee_id = this.details.recruitee_id;
    this.getConfDFiles(this.details.recruitee_id);
  }

  ConfFileUpload(files: FileList) {
    this.ConffileToUpload = files.item(0);
    //console.log(this.ConffileToUpload)
    this.conf_file_name = this.ConffileToUpload.name;
    this.showProgressBar = true;
    this.showPercentage = 0;
    let formData = new FormData();
    formData.append('file', this.ConffileToUpload, this.ConffileToUpload.name);
    this.http.uploadConfDoc(formData, this.conf_doc_name, sessionStorage.getItem("user_id"), this.recruitee_id).subscribe((res: any) => {
      //console.log(res)
      this.showPercentage = Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body === "success") {
          this.ConffileToUpload = "";
          this.conf_file_name = "";
          this.conf_doc_name = "";
          this.showProgressBar = false;
          this.viewShow = "true";
          this.successMsg2('Document uploaded successfully.');
          this.getConfDFiles(this.recruitee_id);
        }
      }

      else if (res === "error") {
        this.viewfinalErr = true;
        this.viewShow = "false";
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.viewfinalErr = true;
      this.viewShow = "false";
      //this.errorMsg('Something went wrong,please try again.');
    });
  }

  getConfDFiles(recruitee_id) {
    this.http.getConfDFiles(recruitee_id).subscribe((res: any) => {
      //console.log(res)
      this.conf_doc_list = res;
    }, err => {

    });
  }

  clickOpenReqDoc(val) {
    this.details = "";
    this.details = val;
    this.recruitee_id = this.details.recruitee_id;
    this.user_status = this.details.user_status;
    this.apply_status = this.details.apply_status;
    this.user_id = this.details.user_id;
    this.getPendingReqDoc();
  }

  addNewSpecDoc() {
    this.showSecInput2 = true;
  }

  addNewOtherDoc() {
    this.showtrdInput = true;
  }

  entryValue(ev) {
    var index = this.req_doc_list.findIndex(e => e.doc_id === ev.doc_id);
    //console.log(ev, index)
    if (index > -1) {
      this.req_doc_list.splice(index, 1);
    }
    else {
      let body = {
        recruitee_id: this.recruitee_id,
        req_doc_type: "standard",
        req_doc_name: ev.doc_name,
        doc_id: ev.doc_id
      }
      this.req_doc_list.push(body);
    }
    //console.log(this.req_doc_list);
  }

  entryValue22(ev) {
    //console.log("here", ev.rec_doc_name)
    var index = this.req_doc_list.findIndex(e => e.rec_doc_name === ev.rec_doc_name);;
    //console.log(index)
    if (index > -1) {
      this.req_doc_list.splice(index, 1);
    }
    else {
      let body = {
        recruitee_id: this.recruitee_id,
        req_doc_type: "facility_spec",
        req_doc_name: ev.rec_doc_name,
        doc_id: 0
      }
      this.req_doc_list.push(body);
    }
    //console.log(this.req_doc_list);
  }

  entryValue3(ev) {
    var index = this.req_doc_list.findIndex(e => e.req_doc_name === ev.rec_doc_name);
    //console.log(index)
    if (index > -1) {
      this.req_doc_list.splice(index, 1);
    }
    else {
      let body = {
        recruitee_id: this.recruitee_id,
        req_doc_type: "other",
        req_doc_name: ev.rec_doc_name,
        doc_id: 0
      }
      this.req_doc_list.push(body);
    }
    //console.log(this.req_doc_list);
  }

  entryValueSpec() {
    var index = this.req_doc_list.findIndex(e => e.req_doc_name === this.doc_name_spec);
    //console.log(index)
    if (index > -1) {
      //this.specific_doc_list.splice(index, 1);
    }
    else {

      let val = {
        rec_doc_name: this.doc_name_spec,
        availability: "Unavailable",
        value: true,
        rec_doc_status: "not_current"
      }
      let body = {
        recruitee_id: this.recruitee_id,
        req_doc_type: "facility_spec",
        req_doc_name: this.doc_name_spec,
        doc_id: 0
      }
      this.req_doc_list.push(body);
      this.fac_specc_doc.push(val);
    }
    this.showSecInput2 = false;
    //console.log(this.req_doc_list);
  }

  entryValueOther() {
    var index = this.req_doc_list.findIndex(e => e.req_doc_name === this.doc_name_Other);
    //console.log(index)
    if (index > -1) {
      //this.other_doc_list.splice(index, 1);
    }
    else {

      let val = {
        rec_doc_name: this.doc_name_Other,
        availability: "Unavailable",
        value: true
      }
      let body = {
        recruitee_id: this.recruitee_id,
        req_doc_type: "other",
        req_doc_name: this.doc_name_Other,
        doc_id: 0
      }
      this.req_doc_list.push(body);
      this.others_doc.push(val);
    }
    this.showtrdInput = false;
    //console.log(this.req_doc_list);
  }

  sendRequest() {
    let body = {
      data: this.req_doc_list
    }
    this.http.insertRequestDoc(body).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg2("Request sent successfully.");
      }
      else {
        this.errorMsg("Something went wrong,please try again!");
      }
    }, err => {
      this.errorMsg("Something went wrong,please try again!");
    })
  }

  getPendingReqDoc() {
    //console.log(this.user_id)
    this.pendingReqDoc = [];
    this.http.getCurrentReqDocs(this.user_id).subscribe((res: any) => {
      //console.log(res)
      this.pendingReqDoc = res;
    }, err => {

    })
  }

  applicant_id_list: any = [];
  selectApplicantToDelete(value) {
    let index = this.applicant_id_list.indexOf(value);
    if (index > -1) {
      this.applicant_id_list.splice(index, 1);
    }
    else {
      this.applicant_id_list.push(value);
    }
    //console.log(this.applicant_id_list)
  }

  deleteSelectedApplicants() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C96D7',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          user_ids: this.applicant_id_list
        }
        this.http.deleteMultipleApplicant(data).subscribe((res: any) => {
          //console.log(res)
          if (res === 'success') {
            this.successMsg("Applicants deteted successfully.");
            this.applicant_id_list = [];
          }
          else {
            this.errorMsg("Something went wrong,please try again!");
          }
        }, err => {
          //console.log(err)
          this.errorMsg("Something went wrong,please try again!");
        })
      }
    });
  }



  ////////////////////////////

  errorMsg(msg) {
    Swal.fire({
      title: msg,
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#4C96D7',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {

      }
    });
  }

  successMsg(msg) {
    Swal.fire({
      title: msg,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#4C96D7',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        //window.location.reload();
        this.searchAppl();
      }
    })
  }

  successMsg2(msg) {
    Swal.fire({
      title: msg,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#4C96D7',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        //window.location.reload();
      }
    })
  }


}
