import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { IDayCalendarConfig } from 'ng2-date-picker';

@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.component.html',
  styleUrls: ['./incentives.component.css']
})
export class IncentivesComponent implements OnInit {
  @ViewChild('processIncentiveClose', { static: false }) private processIncentiveClose: ElementRef;
  @ViewChild('backlogIncentiveClose', { static: false }) private backlogIncentiveClose: ElementRef;
  /*paginate */
  public count:any = 20;
  public page: any;
  /**paginate  */
  moduleArray: any = [];
  user_id: any;
  clientList: any = [];
  client_id1: any = "ALL";
  year1: any = "ALL";
  month1: any = "ALL";
  yearList2: any;
  clientList1: any;
  monthList2: any;
  yearList: any;
  monthList: any;
  weekList: any = [];
  client_id: any;
  year: any;
  month: any;
  incentiveDataListMain: any = [];
  approveErr: boolean = false;
  approveSuccess: boolean = false;
  weeklist_id: any = [];
  acclist_id: any = [];
  alreadyExistErr: boolean = false;
  excelfileName: any;
  backlogData: any;
  backlog_recruitee: any = [];
  backlog_recruitee_id: any = [];

  datePickerConfig = <IDayCalendarConfig>{
    drops: 'up',
    format: 'YYYY/MM'
  }
  employeeList: any = [];
  vcs_employee: any = "ALL";
  from_month: any;
  to_month: any;
  empListFilter: any = [];
  empListShow: boolean = false;
  vcs_person_name: any = "";


  constructor(public route: ActivatedRoute, public router: Router, public http: AdminService) {
    this.user_id = sessionStorage.getItem("user_id");
    this.excelfileName = "incentive(" + moment(new Date).format("MM-DD-YYYY") + ")";
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    this.getClients();
    this.getYear();
    this.getBacklogFiles();
    this.getEmployee();
    if (this.client_id1 === "ALL" && this.year1 === "ALL" && this.month1 === "ALL") {
      this.searchList();
    }
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 400);


  }
  /////////////////////////////
  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }
  /////////////////////////

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
            case "PAYROLL PROCESSING": {
              e.submodule_name_lower = "Payroll Process";
              e.routing = "/payroll-processing";
              break;
            }
            case "PAYROLL APPROVAL": {
              e.submodule_name_lower = "Payroll Approval";
              e.routing = "/payroll-approval";
              break;
            }
            case "PAYROLL & INVOICE": {
              e.submodule_name_lower = "Payroll & Invoice";
              e.routing = "/payroll-invoice";
              break;
            }
            // case "INCENTIVE PROCESSING": {
            //   e.submodule_name_lower = "Incentive Processing";
            //   e.routing = "/";
            //   break;
            // }
            // case "INCENTIVE APPROVAL": {
            //   e.submodule_name_lower = "Incentive Approval";
            //   e.routing = "/";
            //   break;
            // }
            case "INCENTIVES": {
              e.submodule_name_lower = "Incentives";
              e.routing = "/incentives";
              break;
            }
            case "INVOICE RECON": {
              e.submodule_name_lower = "Invoice Reconcile";
              e.routing = "/invoice-reconcile";
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
      document.getElementById("clsActive306").className = "active";
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

  ////////////////////////////

  getClients() {
    this.http.getClientHired().subscribe((res: any) => {
      //console.log(res)
      this.clientList1 = res;
      this.clientList = res;
    });
  }

  getYear() {
    this.http.getYearByClient().subscribe((res: any) => {
      //console.log(res)
      this.yearList = res;
    });

  }

  onOptionsSelected(val) {
    //console.log(val)
    if (val !== "ALL") {
      this.http.getYearFromClientID(val).subscribe((res: any) => {
        //console.log(res)
        this.yearList2 = res;
      });
    }
  }

  onYearSelected2(val) {
    //console.log(val)
    if (val !== "ALL") {
      this.http.getMonthFromClientIDandYr(this.client_id1, val).subscribe((res: any) => {
        //console.log(res)
        this.monthList2 = res;
      });
    }
  }

  onYearSelected(val) {
    //console.log(val)
    if (val !== "ALL") {
      this.http.getMonthByYear(val).subscribe((res: any) => {
        //console.log(res)
        this.monthList = res;
      });
    }
  }

  onMonthSelected(val) {
    this.weekList = [];
    this.weeklist_id = [];
    this.acclist_id = [];
    let data = {
      month: val,
      year: this.year,
      client_id: this.client_id
    }
    this.http.getApprovedWeek(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "No Approved acc file.") {
        this.approveErr = true;
      }
      else if (res === "Already generated for this week.") {
        this.alreadyExistErr = true;
      }
      else if (res === "no data") {
        this.errorMsg("No data found for this month!");
        this.processIncentiveClose.nativeElement.click();
      }
      else {
        this.weekList = res;
        this.approveSuccess = true;
        this.weekList.forEach((e, index) => {
          e.seriel_no = Number(index) + 1;
          this.weeklist_id.push(e.week_id);
          this.acclist_id.push(e.acc_file_id);
        });
      }
    }, err => {
      this.errorMsg("Something went wrong,please try again!");
    })
  }

  searchList() {
    this.http.spinnerShow();
    this.incentiveDataListMain = [];
    let body = {
      client_id: this.client_id1,
      year: this.year1,
      month: this.month1
    }
    this.http.getIncentiveData(body).subscribe((res: any) => {
      //console.log(res)
      this.incentiveDataListMain = res;
      this.http.spinnerHide();
    }, err => {
      this.errorMsg("Something went wrong,please try again!");
    });
  }

  generateIncentives() {
    let data = {
      client_id: this.client_id,
      month: this.month,
      year: this.year,
      week_id_list: this.weeklist_id.join(','),
      create_by: sessionStorage.getItem("user_id"),
      account_file: this.acclist_id.join(',')
    }
    this.http.generateIncentivesforPayroll(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Incentive processed successfully.");
        this.processIncentiveClose.nativeElement.click();
        this.searchList();
      }
      else if (res === "No data to be inserted.") {
        this.errorMsg("No data to be inserted!");
      }
      else {
        this.errorMsg("Something went wrong,please try again!");
      }
    }, err => {
      this.errorMsg("Something went wrong,please try again!");
    });
  }

  getBacklogFiles() {
    this.http.getBacklog().subscribe((res: any) => {
      //console.log(res)
      this.backlogData = res;

    });
  }

  openBacklog() {
    if (this.backlogData.length === 0) {

      this.errorMsg2("No backlog file found.");
    }
  }

  entryValue(ev) {
    var index = this.backlog_recruitee_id.indexOf(ev.recruitee_id);
    //console.log(index)
    if (index > -1) {
      this.backlog_recruitee_id.splice(index, 1);
      this.backlog_recruitee.splice(index, 1);
    }
    else {
      let data = {
        client_id: ev.client_id,
        recruitee_id: ev.recruitee_id
      }
      this.backlog_recruitee_id.push(ev.recruitee_id);
      this.backlog_recruitee.push(data);
    }
    //console.log(this.backlog_recruitee);
  }

  generateBacklog() {
    let obj = {
      data: this.backlog_recruitee,
      create_by: sessionStorage.getItem("user_id")
    }
    this.http.generateBacklog(obj).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Backlog incentive generated.");
        this.backlogIncentiveClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    });
  }

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
    this.vcs_employee = val.user_id;
    //console.log(this.vcs_person_name, this.vcs_employee)
    if (val.user_middle_name) {
      this.vcs_person_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    } else {
      this.vcs_person_name = val.user_first_name + ' ' + val.user_last_name;
    }
    this.empListShow = false;
  }

  searchEmployee(ev) {

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

  fDateChanged(ev) {
    //console.log(ev + "/01")
    this.from_month = moment(ev + "/01").format("YYYY-MM-DD");
    //console.log(this.from_month)
  }

  lDateChanged(ev) {
    //console.log(ev)
    this.to_month = moment(ev + "/01").format("YYYY-MM-DD");
    //console.log(this.to_month)
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

  errorMsg2(msg) {
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
        this.backlogIncentiveClose.nativeElement.click();
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

      }
    })
  }

}
