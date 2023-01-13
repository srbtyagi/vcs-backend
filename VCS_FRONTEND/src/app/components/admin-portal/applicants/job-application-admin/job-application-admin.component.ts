import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDayCalendarConfig } from 'ng2-date-picker';
import { StoreDataService } from 'src/app/store-data.service';

@Component({
  selector: 'app-job-application-admin',
  templateUrl: './job-application-admin.component.html',
  styleUrls: ['./job-application-admin.component.css']
})
export class JobApplicationAdminComponent implements OnInit {
  @ViewChild('sortListModalClose', { static: false }) private sortListModalClose: ElementRef;
  @ViewChild('offerModalClose', { static: false }) private offerModalClose: ElementRef;
  @ViewChild('offerRejectModalClose', { static: false }) private offerRejectModalClose: ElementRef;
  @ViewChild('onBoardModalClose', { static: false }) private onBoardModalClose: ElementRef;

  moduleArray: any[];
  clientList: any[];
  client_id: any = "ALL";
  job_no: any = "ALL";
  job_status: any = "open";
  jobIdList: any[];
  joblists: any = [];
  shortListedAppl: any = [];
  appl_id: any = [];
  job_id: any;
  viewfinalErr: boolean = false;
  application_stage: any;
  modal_header: string;
  application_id: any;
  remark: any = "";
  detailsData: any = [];
  dateCond: string;
  recruitee_id: any;
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
  details: any;
  datePickerConfig = <IDayCalendarConfig>{
    drops: 'down',
    format: 'MM/DD/YYYY'
  }
  user_id_by: any;
  excelfileName: any;
  client_name: any;
  showNameList: boolean = false;
  clientListShow: boolean = false;
  clientListFilter: any = [];
  clientName: any = "ALL";
  /*paginate */
  public count: any = 20;
  public page: any = 1;
  /**paginate  */

  searchData: any;
  user_type: any;

  constructor(public http: AdminService, public route: ActivatedRoute, public router: Router, public fb: FormBuilder,
    public storeData: StoreDataService) {
    this.user_id_by = sessionStorage.getItem("user_id");
    this.excelfileName = "job_application_report(" + moment(new Date).format("MM-DD-YYYY") + ")";
    this.user_type = sessionStorage.getItem("user_type");
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    this.storeData.data.subscribe(res => this.searchData = res);
    //console.log(this.searchData)

    // //console.log(this.data)
    this.getAllClients();
    //this.getAllJobId();
    this.getEmployee();
    if (this.client_id === "ALL" && this.job_no === "ALL" && this.job_status === "open" && this.vcs_person === "ALL" && this.searchData.length === 0) {
      this.searchJob();
    }
    else if (this.searchData.length !== 0) {
      this.client_id = this.searchData.client_id;
      this.job_no = this.searchData.job_no;
      this.job_status = this.searchData.job_status;
      this.page = this.searchData.page;
      this.vcs_person = this.searchData.vcs_person;
      this.vcs_person_name = this.searchData.vcs_person_name;
      this.searchJob();
    }

    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);

    this.onBoardForm = this.fb.group({
      pstart_date: new FormControl(null, [Validators.required]),
      pend_date: new FormControl(null, [Validators.required]),
      Rbill_rate: new FormControl(null, [Validators.required]),
      OTbill_rate: new FormControl(null, [Validators.required]),
      Hbill_rate: new FormControl(null, [Validators.required]),
      Rpay_rate: new FormControl(null, [Validators.required]),
      OTpay_rate: new FormControl(null, [Validators.required]),
      Hpay_rate: new FormControl(null, [Validators.required]),
      per_diem: new FormControl(null,),
      after_hour: new FormControl(null, [Validators.required]),
      pay_package: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      shift_hour: new FormControl(null, [Validators.required]),
      shift_details: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      rto: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      contract_duration: new FormControl(null, [Validators.required])
    });

  }
  /////////////////////////////
  public onPageChanged(event) {
    //console.log(event)
    this.page = event;
    window.scrollTo(0, 0);
    let data2 = {
      job_no: this.job_no,
      job_status: this.job_status,
      client_id: this.client_id,
      posted_by: this.vcs_person,
      vcs_person_name: this.vcs_person_name,
      page: this.page
    }
    this.storeData.changeData(data2);
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
            case "ASSIGN MANAGERS": {
              e.submodule_name_lower = "Assign Manager";
              e.routing = "/assign-Manager";
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
      document.getElementById("clsActive202").className = "active";
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

  getAllClients() {
    this.clientList = [];
    this.http.getClientsExceptStatus().subscribe((res: any) => {
      this.clientList = res;
      this.clientListFilter = res;
      //console.log(this.clientList)
      if (this.clientList.length === 0) {
        //this.errorMsg("No search result found!")
      }
      else {

      }
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

  getAllJobId() {
    this.jobIdList = [];
    this.http.getJobId().subscribe((res: any) => {
      this.jobIdList = res;
      //console.log(this.jobIdList)
    });
  }

  findJobId(ev) {
    //console.log(this.job_no)
    this.jobIdList = [];
    if (this.job_no.toLowerCase() === "all") {
      this.job_no = "ALL";
    }
    else {
      let data = {
        job_no: this.job_no
      }
      this.http.getJobIdSearch(data).subscribe((res: any) => {
        this.jobIdList = res;
        //console.log(this.jobIdList)
        if (this.jobIdList.length !== 0) {
          this.showNameList = true;
        }
        else {
          this.showNameList = false;
        }
      });
    }

  }

  selectName(val) {
    //console.log(val)
    this.job_no = val;
    this.showNameList = false;
  }

  searchJob() {
    this.clientListShow = false;
    this.empListShow = false;
    this.showNameList = false;
    this.http.spinnerShow();
    //console.log(this.job_no, this.job_status, this.client_id)

    // if (this.clientName.toLowerCase() === "all") {
    //   this.client_id = "ALL";
    // }
    if (this.vcs_person_name.toLowerCase() === "all") {
      this.vcs_person = "ALL";
    }
    let data = {
      job_no: this.job_no,
      job_status: this.job_status,
      client_id: this.client_id,
      posted_by: this.vcs_person
    }
    let data2 = {
      job_no: this.job_no,
      job_status: this.job_status,
      client_id: this.client_id,
      posted_by: this.vcs_person,
      vcs_person_name: this.vcs_person_name,
      page: this.page
    }
    this.storeData.changeData(data2);
    // //console.log(data)
    this.http.getAllJobApplication(data).subscribe((res: any) => {
      // //console.log(res);
      this.joblists = res;
      this.http.spinnerHide();
      if (this.joblists.length === 0) {
        this.errorMsg("No application found.");
      }

    }, err => {
      this.http.spinnerHide();
    });
  }

  navigateToSummery(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(val)
      }
    };
    this.router.navigate(["/app-summary"], navigationExtras);
  }

  shortList(val) {
    this.job_id = val.job_id;
    this.shortListedAppl = [];
    let data = {
      job_id: val.job_id
    }
    this.http.getShortlistedCandidate(data).subscribe((res: any) => {
      //console.log(res);
      this.shortListedAppl = res;
      if (this.shortListedAppl.length === 0) {
        this.errorMsg("There are no applicants to shortlist!");
      }
      else {
        this.shortListedAppl.forEach(e => {
          e.value = false;
          if (e.application_stage === "sort_listed") {
            e.value = true;
          }
        });
      }

    });
  }

  offerClick(val) {
    this.job_id = val.job_id;
    this.client_name = val.client_name;
    this.shortListedAppl = [];
    let data = {
      job_id: val.job_id
    }
    this.http.getOfferedShortListCandi(data).subscribe((res: any) => {
      //console.log(res);
      this.shortListedAppl = res;
      if (this.shortListedAppl.length === 0) {
        this.errorMsg("There are no shortlisted applicants to offer!");
      }
      else {

      }

    });
  }

  entryValue(ev) {
    var index = this.appl_id.indexOf(ev.application_id);
    //console.log(index)
    if (index > -1) {
      this.appl_id.splice(index, 1);
    }
    else {
      this.appl_id.push(ev.application_id);
    }
    //console.log(this.appl_id);
  }

  sortListCandidate() {
    let data = {
      job_id: this.job_id,
      application_id: this.appl_id,
      application_stage: "sort_listed"
    }
    this.http.shortlistingCandidate(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.job_id = "";
        this.appl_id = [];
        this.sortListModalClose.nativeElement.click();
        this.successMsg("Candidates submitted successfully.");
      }
      else {
        this.viewfinalErr = true;
      }
    }, err => {
      this.viewfinalErr = true;
    });
  }

  openOffer(val) {
    this.modal_header = "";
    this.application_stage = val.application_stage;
    this.application_id = val.application_id;
    this.recruitee_id = val.recruitee_id;
    this.details = val;
    if (val.application_status === "underreview") {
      this.modal_header = "Offer/Reject";
    }
    else if (val.application_status === "rejected") {
      this.modal_header = "Change Decision";
    }
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

  offerToApplicant() {
    let data = {
      "job_id": this.job_id,
      "application_id": this.application_id,
      "application_stage": this.application_stage,
      "recruitee_id": this.recruitee_id,
      "proposed_start_date": moment(this.onBoardForm.controls.pstart_date.value).format("MM/DD/YYYY"),
      "proposed_end_date": moment(this.onBoardForm.controls.pend_date.value).format("MM/DD/YYYY"),
      "onb_regular_bill_rate": this.onBoardForm.controls.Rbill_rate.value,
      "onb_ot_bill_rate": this.onBoardForm.controls.OTbill_rate.value,
      "onb_holiday_bill_rate": this.onBoardForm.controls.Hbill_rate.value,
      "onb_regular_pay_rate": this.onBoardForm.controls.Rpay_rate.value,
      "onb_ot_pay_rate": this.onBoardForm.controls.OTpay_rate.value,
      "onb_holiday_pay_rate": this.onBoardForm.controls.Hpay_rate.value,
      "per_dieum_wk": this.onBoardForm.controls.per_diem.value,
      "ot_starts_after_wk": this.onBoardForm.controls.after_hour.value,
      "pay_package_remarks": this.onBoardForm.controls.pay_package.value,
      "total_shift_hr": this.onBoardForm.controls.shift_hour.value,
      "shift_details": this.onBoardForm.controls.shift_details.value,
      "rto": this.onBoardForm.controls.rto.value,
      "contract_duration_wk": this.onBoardForm.controls.contract_duration.value
    }

    //console.log(data)

    let data1 = {
      job_id: this.job_id,
      application_id: this.application_id,
      remarks: this.remark
    }

    this.http.offerreject(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        if (this.remark !== "") {
          this.http.InsertRemark(data1).subscribe((res: any) => {
            //console.log(res);
            if (res === "success") {
              this.offerModalClose.nativeElement.click();
              this.onBoardModalClose.nativeElement.click();
              //this.offerRejectModalClose.nativeElement.click();
              this.successMsg2("Request successful.")

            }
            else {
              this.viewfinalErr = true;
              this.errorMsg("Something went wrong,please try again!");
            }
          }, err => {
            this.viewfinalErr = true;
            this.errorMsg("Something went wrong,please try again!");
          });
        }
        else {
          this.offerModalClose.nativeElement.click();
          this.onBoardModalClose.nativeElement.click();
          //this.offerRejectModalClose.nativeElement.click();
          this.successMsg2("Request successful.")
        }

      }
      else {
        this.viewfinalErr = true;
        this.errorMsg("Something went wrong,please try again!");
      }
    }, err => {
      this.viewfinalErr = true;
      this.errorMsg("Something went wrong,please try again!");
    });
  }

  addApplicant(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(val))))
      }
    };
    this.router.navigate(["/add-applicant-admin"], navigationExtras);
  }

  openDetailsModal(val, dis) {
    //console.log(val, dis)
    this.modal_header = "";
    this.dateCond = "";
    this.detailsData = [];
    if (dis === "new_appl") {
      this.detailsData = val.applied_no_details;
      this.modal_header = "New Application";
      this.dateCond = "new_appl";
    }
    else if (dis === "applied") {
      this.detailsData = val.applied_yes_details;
      this.modal_header = "Applied";
      this.dateCond = "applied";
    }
    else if (dis === "shortlisted") {
      this.detailsData = val.sortlisted_details;
      this.modal_header = "Submitted";
      this.dateCond = "shortlisted";
    }
    else if (dis === "offered") {
      this.detailsData = val.offered_details;
      this.modal_header = "Offered";
      this.dateCond = "offered";
    }
    else if (dis === "accepted") {
      this.detailsData = val.apl_acc_details;
      this.modal_header = "Accepted";
      this.dateCond = "accepted";
    }



  }

  offerRejectNext() {
    //console.log(this.details)
    if (this.application_stage === "offered") {
      this.user_id = this.details.user_id;
      //this.pstart_date = moment(this.details.proposed_start_date).format("MM/DD/YYYY");
      //this.pend_date = moment(this.details.proposed_end_date).format("MM/DD/YYYY");
      this.Rbill_rate = this.details.bill_rate;
      this.OTbill_rate = this.details.at_holiday_rate;
      this.Hbill_rate = this.details.at_holiday_rate;
      this.Rpay_rate = this.details.blended_pay_rate;
      this.OTpay_rate = this.details.ot_holiday_pay_rate_traveller;
      this.Hpay_rate = this.details.ot_holiday_pay_rate_traveller;
      this.per_diem = "";
      this.after_hour = "40";
      this.pay_package = "";
      this.shift_hour = this.details.confirm_hr;
      this.shift_details = this.details.shift;
      this.rto = "";
      this.contract_duration = this.details.duration;
      this.due_date = moment(this.details.due_date).format("MM/DD/YYYY");
      this.comment = "";
    }
    else if (this.application_stage === "rejected") {
      Swal.fire({
        title: "Do you want to reject this job application ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C96D7',
        confirmButtonText: 'Yes',
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
            "job_id": this.job_id,
            "application_id": this.application_id,
            "application_stage": this.application_stage
          }

          let data1 = {
            job_id: this.job_id,
            application_id: this.application_id,
            remarks: this.remark
          }

          this.http.offerreject(data).subscribe((res: any) => {
            //console.log(res);
            if (res === "success") {
              if (this.remark !== "") {
                this.http.InsertRemark(data1).subscribe((res: any) => {
                  //console.log(res);
                  if (res === "success") {
                    this.offerModalClose.nativeElement.click();
                    //this.offerRejectModalClose.nativeElement.click();
                    this.successMsg2("Request successful.")

                  }
                  else {
                    this.viewfinalErr = true;
                    this.errorMsg("Something went wrong,please try again!");
                  }
                }, err => {
                  this.viewfinalErr = true;
                  this.errorMsg("Something went wrong,please try again!");
                });
              }
              else {
                this.offerModalClose.nativeElement.click();
                //this.offerRejectModalClose.nativeElement.click();
                this.successMsg2("Request successful.")
              }

            }
            else {
              this.viewfinalErr = true;
              this.errorMsg("Something went wrong,please try again!");
            }
          }, err => {
            this.viewfinalErr = true;
            this.errorMsg("Something went wrong,please try again!");
          });
        }
      });
    }
  }

  employeeList: any = [];
  empListFilter: any = [];
  empListShow: boolean = false;
  vcs_person: any = "ALL";
  vcs_person_name: any = "ALL";
  getEmployee() {
    this.http.getAllEmployee().subscribe((res: any) => {
      //console.log(res)
      this.employeeList = res;
      this.empListFilter = res;
    });
  }

  focusEmpList() {
    this.empListShow = true;
  }

  selectEmpName(val) {
    this.vcs_person = val.user_id;
    if (val.user_middle_name) {
      this.vcs_person_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    } else {
      this.vcs_person_name = val.user_first_name + ' ' + val.user_last_name;
    }
    this.empListShow = false;
  }

  searchEmployee(ev) {
    //console.log(this.vcs_person_name)
    let search_data = this.vcs_person_name;
    this.employeeList = search_data ? this.filterListEmp(search_data) : this.empListFilter;
  }

  filterListEmp(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.empListFilter.filter((list: any) =>
      list.user_first_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.user_last_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );
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
        this.searchJob();
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
        this.searchJob();
        this.shortListedAppl = [];
        let data = {
          job_id: this.job_id
        }
        this.http.getOfferedShortListCandi(data).subscribe((res: any) => {
          //console.log(res);
          this.shortListedAppl = res;
          if (this.shortListedAppl.length === 0) {
            this.errorMsg("There are no more shortlisted applicants to offer!");
          }
          else {

          }

        });
      }
    })
  }

}
