import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { IDayCalendarConfig } from 'ng2-date-picker';

@Component({
  selector: 'app-invoice-reconcile',
  templateUrl: './invoice-reconcile.component.html',
  styleUrls: ['./invoice-reconcile.component.css']
})
export class InvoiceReconcileComponent implements OnInit {
  @ViewChild('processSecondClose', { static: false }) private processSecondClose: ElementRef;
  @ViewChild('processThirdClose', { static: false }) private processThirdClose: ElementRef;

  moduleArray: any = [];
  excelfileName: any;
  user_id: any;
  client_id1: any = "ALL";
  year1: any = "ALL";
  month1: any = "ALL";
  week1: any = "ALL";
  yearList2: any;
  clientList1: any;
  monthList2: any;
  weekList2: any;
  payrollDataList: any = [];

  /// Recon Cal Variables /////
  reg_hr_clt: number = 0;
  ot_hr_clt: number = 0;
  holiday_hr_clt: number = 0;
  invoice_clt: number = 0;
  reconcileDataList: any = [];
  client_name: any;
  wk_start_date: any;
  wk_end_date: any;
  month: any;
  year: any;
  showTable: boolean = false;
  finalSubmitArray: any = [];
  diffErr: any = "";

  datePickerConfig = <IDayCalendarConfig>{
    drops: 'up',
    format: 'MM-DD-YYYY'
  }
  client_id: any = "";
  from_date: any = "";
  to_date: any = "";
  acc_file_no: any;
   /*paginate */
   public count:any = 20;
   public page: any;
   /**paginate  */
  constructor(public route: ActivatedRoute, public router: Router, public http: AdminService) {
    this.user_id = sessionStorage.getItem("user_id");
    this.excelfileName = "Recon_Report(" + moment(new Date).format("MM-DD-YYYY") + ")";
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    this.getClients();
    if (this.client_id1 === "ALL" && this.year1 === "ALL" && this.month1 === "ALL" && this.week1 === "ALL") {
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
      document.getElementById("clsActive304").className = "active";
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

  onMonthSelected2(val) {
    //console.log(val)
    if (val !== "ALL") {
      this.http.getWeekByMonth(this.year1, val).subscribe((res: any) => {
        //console.log(res)
        this.weekList2 = res;
      });
    }
  }

  searchList() {
    this.http.spinnerShow();
    this.payrollDataList = [];
    let body = {
      client_id: this.client_id1,
      year: this.year1,
      month: this.month1,
      week_id: this.week1
    }
    this.http.getPayrollReconData(body).subscribe((res: any) => {
      //console.log(res)
      this.payrollDataList = res;
      this.http.spinnerHide();

    })
  }

  ReconcileModal(val) {
    //console.log(val)
    this.reconcileDataList = [];
    this.finalSubmitArray = [];
    this.reconcileDataList = val.payroll_and_reconcile_data;
    this.reconcileDataList.forEach(e => {
      //console.log(e)
      if (e.reg_hr_clt === null && e.ot_hr_clt === null && e.holiday_hr_clt === null && e.inv_recon_id === null) {
        e.reg_hr_clt = e.reg_hr;
        e.ot_hr_clt = e.ot_hr;
        e.holiday_hr_clt = e.holiday_hr;
        e.invoice_amt_clt = e.invoice_amt;
        let total_hr: number = Number(e.reg_hr) + Number(e.ot_hr) + Number(e.holiday_hr);
        let total_hr_clt: number = Number(e.reg_hr_clt) + Number(e.ot_hr_clt) + Number(e.holiday_hr_clt);
        e.total_hr = total_hr;
        e.total_hr_clt = total_hr_clt;
        this.calcDiff(total_hr, total_hr_clt, e.rec_payroll_id);
        let data = {
          "rec_payroll_id": e.rec_payroll_id,
          "inv_recon_id": e.inv_recon_id,
          "recruitee_id": e.recruitee_id,
          "week_id": e.week_id,
          "assignment_id": e.assignment_id,
          "month": val.month,
          "year": val.year,
          "acc_file_id": e.acc_file_id,
          "reg_hr_clt": e.reg_hr_clt,
          "ot_hr_clt": e.ot_hr_clt,
          "holiday_hr_clt": e.holiday_hr_clt,
          "invoice_amt_clt": e.invoice_amt_clt,
          "total_hr": total_hr
        }
        this.finalSubmitArray.push(data);
      }
      else {
        let total_hr: number = Number(e.reg_hr) + Number(e.ot_hr) + Number(e.holiday_hr);
        let total_hr_clt: number = Number(e.reg_hr_clt) + Number(e.ot_hr_clt) + Number(e.holiday_hr_clt);
        e.total_hr = total_hr;
        e.total_hr_clt = total_hr_clt;
        this.calcDiff(total_hr, total_hr_clt, e.rec_payroll_id);
        let data = {
          "rec_payroll_id": e.rec_payroll_id,
          "inv_recon_id": e.inv_recon_id,
          "recruitee_id": e.recruitee_id,
          "week_id": e.week_id,
          "assignment_id": e.assignment_id,
          "month": val.month,
          "year": val.year,
          "acc_file_id": e.acc_file_id,
          "reg_hr_clt": e.reg_hr_clt,
          "ot_hr_clt": e.ot_hr_clt,
          "holiday_hr_clt": e.holiday_hr_clt,
          "invoice_amt_clt": e.invoice_amt_clt,
          "total_hr": total_hr
        }
        this.finalSubmitArray.push(data);
      }
    });
    this.showTable = true;
    this.acc_file_no = val.file_no;
    this.client_name = val.client_name;
    this.wk_start_date = val.wk_start_date;
    this.wk_end_date = val.wk_end_date;
    this.month = val.month;
    this.year = val.year;

  }

  changepayRateRegHr(e, rec_payroll_id) {
    //console.log(e.target.value, rec_payroll_id)
    if (e.target.value !== "") {
      this.finalSubmitArray.forEach((a, index) => {
        if (Number(a.rec_payroll_id) === Number(rec_payroll_id)) {
          //console.log("here", e.target.value)
          a.reg_hr_clt = e.target.value;
          let total_hr_clt: number = Number(a.reg_hr_clt) + Number(a.ot_hr_clt) + Number(a.holiday_hr_clt);
          this.calcDiff(a.total_hr, total_hr_clt, rec_payroll_id);
        }
      });
      this.reconcileDataList.forEach((b, index) => {
        if (Number(b.rec_payroll_id) === Number(rec_payroll_id)) {
          b.reg_hr_clt = e.target.value;
          let total_hr_clt: number = Number(b.reg_hr_clt) + Number(b.ot_hr_clt) + Number(b.holiday_hr_clt);
          this.calcDiff(b.total_hr, total_hr_clt, rec_payroll_id);
        }
      });
      this.diffErr = "";
    }
    else {
      this.diffErr = "true";
    }

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
      e.preventDefault()
  }

  changepayRateOTHr(e, rec_payroll_id) {
    //console.log(e.target.value, rec_payroll_id)
    if (e.target.value !== "") {
      this.finalSubmitArray.forEach((a, index) => {
        if (Number(a.rec_payroll_id) === Number(rec_payroll_id)) {
          //console.log("here")
          a.ot_hr_clt = e.target.value;
          let total_hr_clt: number = Number(a.reg_hr_clt) + Number(a.ot_hr_clt) + Number(a.holiday_hr_clt);
          this.calcDiff(a.total_hr, total_hr_clt, rec_payroll_id);
        }
      });
      this.reconcileDataList.forEach((b, index) => {
        if (Number(b.rec_payroll_id) === Number(rec_payroll_id)) {
          b.ot_hr_clt = e.target.value;
          let total_hr_clt: number = Number(b.reg_hr_clt) + Number(b.ot_hr_clt) + Number(b.holiday_hr_clt);
          this.calcDiff(b.total_hr, total_hr_clt, rec_payroll_id);
        }
      });
      this.diffErr = "";
    }
    else {
      this.diffErr = "true";
    }

    //console.log(this.finalSubmitArray)

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
      e.preventDefault()
  }

  changepayRateHolidayHr(e, rec_payroll_id) {
    //console.log(e.target.value, rec_payroll_id)
    if (e.target.value !== "") {
      this.finalSubmitArray.forEach((a, index) => {
        if (Number(a.rec_payroll_id) === Number(rec_payroll_id)) {
          //console.log("here")
          a.holiday_hr_clt = e.target.value;
          let total_hr_clt: number = Number(a.reg_hr_clt) + Number(a.ot_hr_clt) + Number(a.holiday_hr_clt);
          this.calcDiff(a.total_hr, total_hr_clt, rec_payroll_id);
        }
      });
      this.reconcileDataList.forEach((b, index) => {
        if (Number(b.rec_payroll_id) === Number(rec_payroll_id)) {
          b.holiday_hr_clt = e.target.value;
          let total_hr_clt: number = Number(b.reg_hr_clt) + Number(b.ot_hr_clt) + Number(b.holiday_hr_clt);
          this.calcDiff(b.total_hr, total_hr_clt, rec_payroll_id);
        }
      });
      this.diffErr = "";
    }

    else {
      this.diffErr = "true";
    }

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
      e.preventDefault()
  }

  changepayRateInvoice(e, rec_payroll_id) {
    //console.log(e.target.value, rec_payroll_id)
    if (e.target.value !== "") {
      this.finalSubmitArray.forEach((a, index) => {
        if (Number(a.rec_payroll_id) === Number(rec_payroll_id)) {
          //console.log("here")
          a.invoice_amt_clt = e.target.value;
        }
      });
      this.reconcileDataList.forEach((b, index) => {
        if (Number(b.rec_payroll_id) === Number(rec_payroll_id)) {
          b.invoice_amt_clt = e.target.value;
        }
      });
      this.diffErr = "";
    }
    else {
      this.diffErr = "true";
    }

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
      e.preventDefault()
  }

  calcDiff(total_hr, total_hr_clt, rec_payroll_id) {
    this.reconcileDataList.forEach(e => {
      if (e.rec_payroll_id === rec_payroll_id) {
        e.difference_amt = Number(total_hr) - Number(total_hr_clt);
      }
    });

    //console.log(this.reconcileDataList)
  }

 

  submitFile() {
    //console.log(this.finalSubmitArray)
    let arrObj = {
      data: this.finalSubmitArray
    }
    this.http.InsertUpdatePayrollReconData(arrObj).subscribe((res) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Reconcilation process completed.");
        this.processSecondClose.nativeElement.click();
        this.processThirdClose.nativeElement.click();
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
        //window.location.reload();
        this.searchList();

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
