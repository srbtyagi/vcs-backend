import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { IDayCalendarConfig } from 'ng2-date-picker';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-onboarding-and-hiring',
  templateUrl: './onboarding-and-hiring.component.html',
  styleUrls: ['./onboarding-and-hiring.component.css']
})
export class OnboardingAndHiringComponent implements OnInit {
  @ViewChild('hireClose', { static: false }) private hireClose: ElementRef;
  @ViewChild('closeFinish', { static: false }) private closeFinish: ElementRef;
  @ViewChild('onBoardModalClose', { static: false }) private onBoardModalClose: ElementRef;
  @ViewChild('ViewonBoardFormModalClose', { static: false }) private ViewonBoardFormModalClose: ElementRef;
  @ViewChild('cancelOnboardClose', { static: false }) private cancelOnboardClose: ElementRef;

  moduleArray: any[];
  clientList: any;
  countryList: any;
  stateList: any;
  cityList: any;

  client_id: any = "ALL";
  country: any = "ALL";
  state: any = "ALL";
  city: any = "ALL";
  status: any = "ALL";
  applicationList: any = [];
  details: any;

  /// On Boarding Fields ////
  onBoardForm: FormGroup;
  pstart_date: any;
  pend_date: any;
  Rbill_rate: any;
  OTbill_rate: any;
  Hbill_rate: any;
  Rpay_rate: any;
  OTpay_rate: any;
  Hpay_rate: any;
  per_diem: any;
  after_hour: any;
  pay_package: any;
  shift_hour: any;
  shift_details: any;
  rto: any;
  contract_duration: any;
  due_date: any;
  comment: any;
  user_id: any;
  docs: any;
  docType: any;
  standard_doc_list: any = [];
  fac_specc_doc: any = [];
  others_doc: any = [];
  specific_doc_list: any = [];
  other_doc_list: any = [];
  doc_name_spec: any;
  showSecInput: boolean = false;
  showtrdInput: boolean = false;
  doc_name_Other: any;

  assign_start_date: any;
  datePickerConfig = <IDayCalendarConfig>{
    drops: 'up',
    format: 'MM/DD/YYYY'
  }
  doc_exp_dt_id: any = [];
  doc_exp_dt_list: any = [];
  user_id_by: any;
  excelfileName: any;
  reqd_facility_doc_list: any;
  reqd_other_doc_list: any;
  reqd_std_doc_id_list: any;
  assign_end_date: any;
  clientListFilter: any = [];
  clientListShow: boolean = false;
  clientName: any = "ALL";
  stateListShow: boolean = false;
  stateListFilter: any = [];
  cityListFilter: any = [];
  cityListShow: boolean = false;
  /*paginate */
  public count: any = 20;
  public page: any;
  /**paginate  */
  constructor(public http: AdminService, public route: ActivatedRoute, public router: Router, public fb: FormBuilder) {
    this.user_id_by = sessionStorage.getItem("user_id");
    this.excelfileName = "onboarding_report(" + moment(new Date).format("MM-DD-YYYY") + ")";
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    this.getClients();
    this.getCountry();
    this.getStates();
    if (this.state === "ALL") {
      this.getCity(this.state);
    }

    this.getDocType();
    if (this.client_id === "ALL" && this.country === "ALL" && this.city === "ALL" && this.state === "ALL" && this.status === "ALL") {
      this.searchJob();
    }
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);

    this.onBoardForm = this.fb.group({
      due_date: new FormControl(null, [Validators.required]),
      comment: new FormControl(null,),
    });
  }
  /////////////////////////////
  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }
  ///////////////////////
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
      document.getElementById("clsActive203").className = "active";
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

  ///////////////////////

  getClients() {
    this.http.getClientOnBoard().subscribe((res: any) => {
      //console.log(res)
      this.clientList = res;
      this.clientListFilter = res;
    });
  }

  focusClientList() {
    this.clientListShow = true;
  }

  selectclientName(val) {
    this.client_id = val.client_id;
    this.clientName = val.client_name;
    this.clientListShow = false;
  }

  searchClient(ev) {
    //console.log(this.clientName)
    let search_data = this.clientName;
    this.clientList = search_data ? this.filterListClient(search_data) : this.clientListFilter;
  }

  filterListClient(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.clientListFilter.filter((list: any) =>
      list.client_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }


  getCountry() {
    this.http.getCountry().subscribe((res: any) => {
      //console.log(res)
      this.countryList = res;
    });
  }

  getStates() {
    this.http.getState().subscribe((res: any) => {
      //console.log(res)
      this.stateList = res;
      this.stateListFilter = res;
    });
  }

  focusStateList() {
    this.stateListShow = true;
  }

  searchState(ev) {
    //console.log(this.state)
    let search_data = this.state;
    this.stateList = search_data ? this.filterListState(search_data) : this.stateListFilter;
  }

  filterListState(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.stateListFilter.filter((list: any) =>
      list.state.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }

  getCity(val) {
    this.state = val;
    this.city = "ALL";
    this.stateListShow = false;
    let body = {
      state: val
    }
    this.http.getCity(body).subscribe((res: any) => {
      //console.log(res)
      this.cityList = res;
      this.cityListFilter = res;
    });
  }

  focusCityList() {
    this.cityListShow = true;
  }

  selectCity(val) {
    this.city = val;
    this.cityListShow = false;
  }

  searchCity(ev) {
    //console.log(this.city)
    let search_data = this.city;
    this.cityList = search_data ? this.filterListCity(search_data) : this.cityListFilter;
  }

  filterListCity(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.cityListFilter.filter((list: any) =>
      list.city.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }

  searchJob() {
    this.cityListShow = false;
    this.stateListShow = false;
    this.clientListShow = false;
    this.http.spinnerShow();
    this.applicationList = [];
    //console.log(this.client_id, this.country, this.state, this.city, this.status)
    if (this.clientName.toLowerCase() === "all") {
      this.client_id = "ALL";
    }
    if (this.state.toLowerCase() === "all") {
      this.state = "ALL";
    }
    if (this.city.toLowerCase() === "all") {
      this.city = "ALL";
    }
    let data = {
      client_id: this.client_id,
      country: this.country,
      city: this.city,
      state: this.state,
      status: this.status,
      user_id: sessionStorage.getItem("user_id")
    }
    this.http.searchonboardAppl(data).subscribe((res: any) => {
      //console.log(res);
      if (res.length !== 0) {
        this.applicationList = res;
        this.http.spinnerHide();
      }
      else {
        this.http.spinnerHide();
        this.errorMsg('No search result found!');
      }
    }, err => {
      this.http.spinnerHide();
      this.errorMsg('Something went wrong,please try again.');
    });
  }

  onBoard(val) {
    //console.log(val)
    this.details = "";
    this.doc_exp_dt_list = [];
    this.doc_exp_dt_id = [];
    this.fac_specc_doc = [];
    this.others_doc = [];
    this.specific_doc_list = [];
    this.other_doc_list = [];
    this.standard_doc_list = [];
    this.details = val;
    this.user_id = val.user_id;
    if (val.reqd_facility_doc_list === "" || val.reqd_facility_doc_list === null) {
      this.reqd_facility_doc_list = [];
    }
    else {
      this.reqd_facility_doc_list = val.reqd_facility_doc_list.split(',');
    }

    if (val.reqd_other_doc_list === "" || val.reqd_other_doc_list === null) {
      this.reqd_other_doc_list = [];
    }
    else {
      this.reqd_other_doc_list = val.reqd_other_doc_list.split(',');
    }

    if (val.reqd_std_doc_id_list === "" || val.reqd_std_doc_id_list === null) {
      this.reqd_std_doc_id_list = [];
    }
    else {
      this.reqd_std_doc_id_list = val.reqd_std_doc_id_list.split(',');
    }

    this.getAllDocs(this.user_id);
    this.pstart_date = moment(val.proposed_start_date).format("MM/DD/YYYY");
    this.pend_date = moment(val.proposed_end_date).format("MM/DD/YYYY");
    this.Rbill_rate = val.onb_regular_bill_rate;
    this.OTbill_rate = val.onb_ot_bill_rate;
    this.Hbill_rate = val.onb_holiday_bill_rate;
    this.Rpay_rate = val.onb_regular_pay_rate;
    this.OTpay_rate = val.onb_ot_pay_rate;
    this.Hpay_rate = val.onb_holiday_pay_rate;
    this.per_diem = val.per_dieum_wk;
    this.after_hour = val.ot_starts_after_wk;
    this.pay_package = val.pay_package_remarks;
    this.shift_hour = val.total_shift_hr;
    this.shift_details = val.shift_details;
    this.rto = val.rto;
    this.contract_duration = val.contract_duration_wk;
    this.comment = val.comments;
    if (val.due_date) {
      this.due_date = moment(val.due_date).format("MM/DD/YYYY");
    }
  }

  openFinish(val) {
    //console.log(val)
    this.details = "";
    this.details = val;
    this.user_id = val.user_id;
  }

  getAllDocs(user_id) {
    this.fac_specc_doc = [];
    this.others_doc = [];
    this.specific_doc_list = [];
    this.other_doc_list = [];
    this.standard_doc_list = [];
    //console.log(this.reqd_std_doc_id_list, this.reqd_facility_doc_list, this.reqd_other_doc_list)
    this.http.getAllDocsCurrent(user_id).subscribe((res: any) => {
      //console.log(res);
      this.docs = res;
      this.docType.forEach(e => {
        e.availability = "Unavailable";
        e.value = false;
        for (let b of this.reqd_std_doc_id_list) {
          if (Number(b) === e.doc_id) {
            e.value = true;
            this.standard_doc_list.push(e.doc_id);
            this.standard_doc_list = [...new Set(this.standard_doc_list)];
          }
        }
        for (let b of this.reqd_facility_doc_list) {
          let data = {
            rec_doc_name: b,
            value: true,
            availability: "Unavailable"
          }
          this.fac_specc_doc.push(data);
          const ids = this.fac_specc_doc.map(o => o.rec_doc_name);
          this.fac_specc_doc = this.fac_specc_doc.filter(({ rec_doc_name }, index) => !ids.includes(rec_doc_name, index + 1));
          this.specific_doc_list.push(b);
          this.specific_doc_list = [...new Set(this.specific_doc_list)];
        }
        for (let b of this.reqd_other_doc_list) {
          let data = {
            rec_doc_name: b,
            value: true,
            availability: "Unavailable"
          }
          this.others_doc.push(data);
          const ids = this.others_doc.map(o => o.rec_doc_name);
          this.others_doc = this.others_doc.filter(({ rec_doc_name }, index) => !ids.includes(rec_doc_name, index + 1));
          this.other_doc_list.push(b);
          this.other_doc_list = [...new Set(this.other_doc_list)];
        }

        for (let a of this.docs) {
          a.value = false;
          if (e.doc_id === a.doc_id && a.rec_doc_type === "standard") {
            e.value = true;
            e.availability = "Available";
            e.rec_doc_id = a.rec_doc_id;
            e.rec_doc_type = "standard";
            e.expiry_date = a.expiry_date;
            e.rec_doc_status = a.rec_doc_status;
            this.standard_doc_list.push(a.doc_id);
            this.standard_doc_list = [...new Set(this.standard_doc_list)];
          }
          else if (a.rec_doc_type === "facility_spec") {
            a.value = true;
            a.availability = "Available";
            this.fac_specc_doc.push(a);
            const ids = this.fac_specc_doc.map(o => o.rec_doc_name);
            this.fac_specc_doc = this.fac_specc_doc.filter(({ rec_doc_name }, index) => !ids.includes(rec_doc_name, index + 1));

            this.specific_doc_list.push(a.rec_doc_name);
            this.specific_doc_list = [...new Set(this.specific_doc_list)];
          }
          else if (a.rec_doc_type === "other") {
            a.value = true;
            a.availability = "Available";
            this.others_doc.push(a);
            const ids = this.others_doc.map(o => o.rec_doc_name);
            this.others_doc = this.others_doc.filter(({ rec_doc_name }, index) => !ids.includes(rec_doc_name, index + 1));

            this.other_doc_list.push(a.rec_doc_name);
            this.other_doc_list = [...new Set(this.other_doc_list)];
          }
        }
      });

      //console.log(this.docType, this.fac_specc_doc, this.others_doc)
      //console.log(this.specific_doc_list, this.other_doc_list)
    })
  }

  getDocType() {
    this.http.getDocumentType().subscribe((res: any) => {
      this.docType = res;
      //console.log(this.docType)
    })
  }

  changepayRate(e) {

    var t = e.target.value;
    e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;

    ///// Restrict negative by typing

    var key = !isNaN(e.charCode) ? e.charCode : e.keyCode;

    function keyAllowed() {
      var keys = [8, 9, 13, 16, 17, 18, 19, 20, 27, 46, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 91, 92, 93];
      if (key && keys.indexOf(key) === -1)
        return false;
      else
        return true;
    }

    if (!keyAllowed())
      e.preventDefault();
  }

  addNewSpecDoc() {
    this.showSecInput = true;
  }

  addNewOtherDoc() {
    this.showtrdInput = true;
  }

  entryValue(ev) {
    var index = this.standard_doc_list.indexOf(ev.doc_id);
    //console.log(index)
    if (index > -1) {
      this.standard_doc_list.splice(index, 1);
    }
    else {
      this.standard_doc_list.push(ev.doc_id);
    }
    //console.log(this.standard_doc_list);
  }

  entryValue22(ev) {
    //console.log("here", ev.rec_doc_name)
    var index = this.specific_doc_list.indexOf(ev.rec_doc_name);
    //console.log(index)
    if (index > -1) {
      this.specific_doc_list.splice(index, 1);
    }
    else {
      this.specific_doc_list.push(ev.rec_doc_name);
    }
    //console.log(this.specific_doc_list);
  }

  entryValue3(ev) {
    var index = this.other_doc_list.indexOf(ev.rec_doc_name);
    //console.log(index)
    if (index > -1) {
      this.other_doc_list.splice(index, 1);
    }
    else {
      this.other_doc_list.push(ev.rec_doc_name);
    }
    //console.log(this.other_doc_list);
  }

  entryValueSpec() {
    var index = this.specific_doc_list.indexOf(this.doc_name_spec);
    //console.log(index)
    if (index > -1) {
      //this.specific_doc_list.splice(index, 1);
    }
    else {
      this.specific_doc_list.push(this.doc_name_spec);
      let val = {
        rec_doc_name: this.doc_name_spec,
        availability: "Unavailable",
        value: true,
        rec_doc_status: "not_current"
      }
      this.fac_specc_doc.push(val);
    }
    this.showSecInput = false;
    //console.log(this.specific_doc_list);
  }

  entryValueOther() {
    var index = this.other_doc_list.indexOf(this.doc_name_Other);
    //console.log(index)
    if (index > -1) {
      //this.other_doc_list.splice(index, 1);
    }
    else {
      this.other_doc_list.push(this.doc_name_Other);
      let val = {
        rec_doc_name: this.doc_name_Other,
        availability: "Unavailable",
        value: true
      }
      this.others_doc.push(val);
    }
    this.showtrdInput = false;
    //console.log(this.other_doc_list);
  }

  updateDetails() {
    let data = {
      "application_id": this.details.application_id,
      "recruitee_id": this.details.recruitee_id,
      "onboarding_id": this.details.onboarding_id,
      "reqd_std_doc_id_list": this.standard_doc_list.join(','),
      "reqd_facility_doc_list": this.specific_doc_list.join(','),
      "reqd_other_doc_list": this.other_doc_list.join(','),
      "due_date": moment(this.onBoardForm.controls.due_date.value).format("MM/DD/YYYY"),
      "comments": this.onBoardForm.controls.comment.value
    }
    //console.log(data)
    this.http.updateOnboarding(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Document requested successfully.");
        this.onBoardModalClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  finishOnboarding() {
    let data = {
      onboarding_id: this.details.onboarding_id
    }
    this.http.finishOnboarding(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("On boarding process completed.");
        this.closeFinish.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    });
  }

  hiring() {
    let date = moment(new Date()).format("YYYY-MM-DD");
    // let cDate = date.toLocaleString("en-US", {
    //   timeZone: "America/Los_Angeles"
    // });

    let sDate = moment(this.assign_start_date).format("YYYY-MM-DD");
    // let assign_srt_dt = sDate.toLocaleString("en-US", {
    //   timeZone: "America/Los_Angeles"
    // });
    //let sDate = new Date(this.assign_start_date);
    //let assign_srt_dt = moment(sDate).format("M/DD/YYYY");
    ////console.log(cDate, sDate)
    ////console.log(assign_srt_dt)
    //console.log(new Date(date).getTime(), new Date(sDate).getTime())
    //console.log(this.details)
    if (new Date(date).getTime() === new Date(sDate).getTime() || new Date(date).getTime() > new Date(sDate).getTime()) {
      var data = {
        client_id: this.details.client_id,
        recruitee_id: this.details.recruitee_id,
        onboarding_id: this.details.onboarding_id,
        application_id: this.details.application_id,
        hiring_date: moment(sDate).format("MM/DD/YYYY"),
        job_id: this.details.job_id,
        assignment_status: "working",
        closing_date: moment(this.assign_end_date).format("MM/DD/YYYY")
      }
    }
    else if (new Date(date).getTime() < new Date(sDate).getTime()) {
      var data = {
        client_id: this.details.client_id,
        recruitee_id: this.details.recruitee_id,
        onboarding_id: this.details.onboarding_id,
        application_id: this.details.application_id,
        hiring_date: moment(sDate).format("MM/DD/YYYY"),
        job_id: this.details.job_id,
        assignment_status: "not_started",
        closing_date: moment(this.assign_end_date).format("MM/DD/YYYY")
      }
    }

    this.http.hiring(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Hiring process completed.");
        this.hireClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  onboard_cancel_date: any;
  cancelOnboarding() {
    let data = {
      onboarding_id: this.details.onboarding_id,
      onboard_cancel_date: moment(this.onboard_cancel_date).format("MM/DD/YYYY")
    }
    //console.log(data)
    this.http.cancelOnboarding(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("On boarding cancelled successfully.");
        this.cancelOnboardClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    });
  }

  selectExpiryDate(val, ev) {
    //console.log(val, ev)
    ////console.log(ev)
    var index = this.doc_exp_dt_id.indexOf(val.rec_doc_id);
    if (index > -1 && ev.date != this.doc_exp_dt_list[index].expiry_date) {

      this.doc_exp_dt_list[index].expiry_date = moment(ev.date).format("MM/DD/YYYY");

      //this.doc_exp_dt_id.splice(index, 1);
      //this.doc_exp_dt_list.splice(index, 1);
    }
    else {
      let data = {
        rec_doc_id: val.rec_doc_id,
        expiry_date: moment(ev.date).format("MM/DD/YYYY")
      };
      this.doc_exp_dt_list.push(data);
      this.doc_exp_dt_id.push(val.rec_doc_id);
    }
    //console.log(this.doc_exp_dt_list, this.doc_exp_dt_id);
  }

  updateExpityDate() {
    let dataObj = {
      exp_date: this.doc_exp_dt_list
    }
    this.http.updateDocExpDate(dataObj).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg2("Expiry dates updated successfully.");
        this.getAllDocs(this.user_id);
        //this.ViewonBoardFormModalClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }

    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
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
        window.location.reload();
        //this.searchJob();

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

      }
    })
  }

}
