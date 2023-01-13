import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-payroll-processing',
  templateUrl: './payroll-processing.component.html',
  styleUrls: ['./payroll-processing.component.css']
})
export class PayrollProcessingComponent implements OnInit {
  @ViewChild('process1Close', { static: false }) private process1Close: ElementRef;
  @ViewChild('processSecondClose', { static: false }) private processSecondClose: ElementRef;
  @ViewChild('calculatePayroleClose', { static: false }) private calculatePayroleClose: ElementRef;


  moduleArray: any = [];
  clientList: any = [];
  yearList: any = [];
  monthList: any = [];
  weekList: any = [];
  client_id: any;
  year: any;
  month: any;
  week: any;

  client_id1: any = "ALL";
  year1: any = "ALL";
  month1: any = "ALL";
  week1: any = "ALL";
  yearList2: any = [];
  clientList1: any;
  monthList2: any = [];
  weekList2: any = [];


  payrollDataList: any = [];
  showModalBox: boolean = false;
  details: any;
  data: any;

  ///////////////
  weekly_per_diem: any;
  regular_hr: any;
  ot_hr: any;
  holiday_hr: any;
  bonus_amount: any;
  total_hr_worked: any;
  taxable_income: any;
  non_taxable_income: any;
  total_gross_income: any;
  comment: any;
  invoice_amount: any;
  deduction_rate: any = "4.5";
  invoice_after_deduction: any;
  profit: any;
  payrollDataListMain: any = [];
  acc_file_id: any;
  excelfileName: any;
  user_id: any;
  misc_exp_amt: any;
  workHour: any = [];
  submitErr: any = "";
  rec_work_hr_id: any;

  clientListFilter: any = [];
  clientListShow: boolean = false;
  clientName: any = "ALL";

  /*paginate */
  public count: any = 20;
  public page: any;
  /**paginate  */
  constructor(public route: ActivatedRoute, public router: Router, public http: AdminService) {
    this.user_id = sessionStorage.getItem("user_id");
    this.excelfileName = "payroll_process(" + moment(new Date).format("MM-DD-YYYY") + ")";
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    this.getClients();
    this.getYear();
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
  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
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
      document.getElementById("clsActive301").className = "active";
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
      this.clientList = res;
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
    this.monthList2 = [];
    this.weekList2 = [];
    if (val !== "ALL") {
      this.month1 = "";
      this.week1 = "";
      this.http.getMonthFromClientIDandYr(this.client_id1, val).subscribe((res: any) => {
        //console.log(res)
        this.monthList2 = res;
      });
    }
  }

  onMonthSelected2(val) {
    //console.log(val)
    this.weekList2 = [];
    if (val !== "ALL") {
      this.week1 = "";
      this.http.getWeekByMonth(this.year1, val).subscribe((res: any) => {
        //console.log(res)
        this.weekList2 = res;
      });
    }
  }

  getYear() {
    this.http.getYearByClient().subscribe((res: any) => {
      //console.log(res)
      this.yearList = res;
    });

  }

  onYearSelected(val) {
    //console.log(val)
    this.monthList = [];
    this.weekList = [];
    if (val !== "ALL") {
      this.month = "";
      this.week = "";
      this.http.getMonthByYear(val).subscribe((res: any) => {
        //console.log(res)
        this.monthList = res;
      });
    }
  }

  onMonthSelected(val) {
    //console.log(val)
    this.weekList = [];
    if (val !== "ALL") {
      this.week = "";
      this.http.getWeekByMonth(this.year, val).subscribe((res: any) => {
        //console.log(res)
        this.weekList = res;
      });
    }
  }

  processPayroll() {
    this.client_id = "";
    this.year = "";
    this.month = "";
    this.week = "";
  }

  searchList() {
    this.http.spinnerShow();
    this.payrollDataListMain = [];
    let body = {
      client_id: this.client_id1,
      year: this.year1,
      month: this.month1,
      week_id: this.week1
    }
    this.http.getPayrollAllData(body).subscribe((res: any) => {
      //console.log(res)
      this.payrollDataListMain = res;
      this.http.spinnerHide();
    })
  }

  editSubmit(val) {
    this.showModalBox = true;
    this.payrollDataList = [];
    this.acc_file_id = val.acc_file_id;
    let body = {
      client_id: val.client_id,
      year: val.year,
      month: val.month,
      week_id: val.week_id,
      acc_file_id: val.acc_file_id
    }
    this.http.getDataByFileID(body).subscribe((res: any) => {
      //console.log(res)
      this.payrollDataList = res;
      this.payrollDataList.forEach(el => {
        if (el.payroll_status !== "submitted") {
          this.submitErr = "true";
        }
        else if (el.payroll_status === "submitted") {
          this.submitErr = "";
        }
      });
    })
  }

  next() {
    //console.log(this.month)
    this.showModalBox = true;
    this.payrollDataList = [];
    let body = {
      client_id: this.client_id,
      year: this.year,
      month: this.month,
      week_id: this.week
    }
    this.http.getPayrollDataOfSecondModal(body).subscribe((res: any) => {
      //console.log(res);

      if (res === "already exists") {
        this.processSecondClose.nativeElement.click();
        this.errorMsg("File already created!");
      }
      else if (res.message === "hiring data is greater than wk_end_date.") {
        this.processSecondClose.nativeElement.click();
        this.errorMsg("Hiring date is greater from week end date!");
        this.deleteIncentiveFile(res.acc_file_id)
      }
      else {
        this.payrollDataList = res;
        this.acc_file_id = res[0].account_file_id;
        //this.errorMsg("No search result found!");
      }
    }, err => {
      this.processSecondClose.nativeElement.click();
      this.errorMsg("Something went wrong,please try again!");
    });
  }

  deleteIncentiveFile(accFile_id) {
    let data = {
      acc_file_id: accFile_id
    }
    this.http.deleteFileIncentive(data).subscribe((res: any) => {
      //console.log(res)
    });
  }

  refreshSecondModal() {
    this.showModalBox = true;
    this.payrollDataList = [];
    let body = {
      client_id: this.details.client_id,
      year: this.details.year,
      month: this.details.month,
      week_id: this.details.week_id,
      acc_file_id: this.details.account_file_id
    }
    this.http.getDataByFileID(body).subscribe((res: any) => {
      //console.log(res)
      this.payrollDataList = res;
      this.acc_file_id = res[0].account_file_id;
      this.payrollDataList.forEach(el => {
        if (el.payroll_status !== "submitted") {
          this.submitErr = "true";
        }
        else if (el.payroll_status === "submitted") {
          this.submitErr = "";
        }
      });
    })
  }

  openCalculation(val) {
    this.details = "";
    this.data = "";
    this.details = val;
    //console.log(this.details)
    let body1 = {
      assignment_id: this.details.assignment_id,
      week_id: this.details.week_id,
      recruitee_id: this.details.recruitee_id
    }
    this.getWorkHour(body1);
    let body = {
      assignment_id: this.details.assignment_id,
      week_id: this.details.week_id,
      rec_payroll_id: this.details.rec_payroll_id
    }
    this.http.getPayrollDataByAssignID(body).subscribe((res: any) => {
      //console.log(res);
      this.data = res[0];
      this.weekly_per_diem = res[0].per_dieum_wk;
      if (this.workHour.length !== 0 && (res[0].reg_hr === null || res[0].ot_hr === null || res[0].holiday_hr === null || res[0].bonus_amount === null)) {
        this.regular_hr = this.workHour[0].rec_reg_hr;
        this.ot_hr = this.workHour[0].rec_ot_hr;
        this.holiday_hr = this.workHour[0].rec_holiday_hr;
        this.bonus_amount = 0;
        this.deduction_rate = 4.5;
        this.misc_exp_amt = 0;
        this.rec_work_hr_id = this.workHour[0].rec_work_hr_id;
      }
      else if (this.workHour.length === 0 && (res[0].reg_hr === null || res[0].ot_hr === null || res[0].holiday_hr === null || res[0].bonus_amount === null)) {
        this.regular_hr = 0;
        this.ot_hr = 0;
        this.holiday_hr = 0;
        this.bonus_amount = 0;
        this.deduction_rate = "4.5";
        this.misc_exp_amt = 0;
        this.rec_work_hr_id = 0;
      }
      else {
        this.regular_hr = res[0].reg_hr;
        this.ot_hr = res[0].ot_hr;
        this.holiday_hr = res[0].holiday_hr;
        this.bonus_amount = res[0].bonus_amount;
        this.deduction_rate = res[0].deducted_perc;
        this.misc_exp_amt = res[0].misc_exp_amt;
        this.rec_work_hr_id = this.workHour[0].rec_work_hr_id;
      }

      this.total_hr_worked = Number(this.regular_hr) + Number(this.ot_hr) + Number(this.holiday_hr);
      this.taxable_income = res[0].taxable_amt;
      this.non_taxable_income = res[0].nontaxable_amt;
      this.total_gross_income = res[0].gross_amt;
      this.comment = res[0].comments;
      this.invoice_amount = res[0].invoice_amt;
      this.invoice_after_deduction = res[0].deducted_invoice_amt;

      this.profit = res[0].profit_amt;
    }, err => {

    })
  }

  getWorkHour(data) {
    this.http.getWorkHour(data).subscribe((res) => {
      this.workHour = res;
      //console.log(this.workHour)
    }, err => {

    })
  }

  changetotalHr(e) {

    this.total_hr_worked = Number(this.regular_hr) + Number(this.ot_hr) + Number(this.holiday_hr);

    this.taxable_income = (((Number(this.regular_hr) * Number(this.data.onb_regular_pay_rate)) +
      (Number(this.ot_hr) * Number(this.data.onb_ot_pay_rate)) +
      (Number(this.holiday_hr) * Number(this.data.onb_holiday_pay_rate)) + Number(this.bonus_amount))
      - Number(this.weekly_per_diem)).toFixed(2);

    this.non_taxable_income = Number(this.weekly_per_diem);

    this.total_gross_income = (Number(this.taxable_income) + Number(this.non_taxable_income)).toFixed(2);

    this.invoice_amount = (((Number(this.regular_hr) * Number(this.data.onb_regular_bill_rate)) +
      (Number(this.ot_hr) * Number(this.data.onb_ot_bill_rate)) +
      (Number(this.holiday_hr) * Number(this.data.onb_holiday_bill_rate)))).toFixed(2);

    this.invoice_after_deduction = (Number(this.invoice_amount) - ((Number(this.invoice_amount) * Number(this.deduction_rate)) / 100)).toFixed(2);

    this.profit = ((Number(this.invoice_after_deduction) - Number(this.total_gross_income) - (Number(this.taxable_income) * 0.12)) - (Number(this.misc_exp_amt))).toFixed(2);

    // var t = e.target.value;
    // e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;

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


  changeDeduction(e) {

    this.invoice_after_deduction = (Number(this.invoice_amount) - ((Number(this.invoice_amount) * Number(this.deduction_rate)) / 100)).toFixed(2);

    this.profit = (Number(this.invoice_after_deduction) - Number(this.total_gross_income) - (Number(this.taxable_income) * 0.12)).toFixed(2);

    // var t = e.target.value;
    // e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;

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

  submitPayroll() {
    //console.log(this.data)
    //console.log(this.details)
    let insertJson = {
      "rec_payroll_id": this.data.rec_payroll_id,
      "assignment_id": this.details.assignment_id,
      "week_id": this.details.week_id,
      "month": this.details.month,
      "year": this.details.year,
      "acc_file_id": this.details.account_file_id,
      "reg_hr": this.regular_hr.toFixed(2),
      "ot_hr": this.ot_hr.toFixed(2),
      "holiday_hr": this.holiday_hr.toFixed(2),
      "per_dieum_amt": this.weekly_per_diem.toFixed(2),
      "bonus_amount": this.bonus_amount.toFixed(2),
      "taxable_amt": this.taxable_income,
      "nontaxable_amt": this.non_taxable_income.toFixed(2),
      "gross_amt": this.total_gross_income,
      "invoice_amt": this.invoice_amount,
      "deducted_invoice_amt": this.invoice_after_deduction,
      "profit_amt": this.profit,
      "deducted_perc": this.deduction_rate,
      "comments": this.comment,
      "payroll_status": "submitted",
      "misc_exp_amt": this.misc_exp_amt.toFixed(2),
      "rec_work_hr_id": this.rec_work_hr_id
    }
    //console.log(insertJson)

    this.http.insertPayrollData(insertJson).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Payroll calculated successfully.")
      }
      else {

        this.errorMsg("Something went wrong. Please Try Again.");
      }

    }, err => {

      this.errorMsg("Something went wrong. Please Try Again.");
    });
  }

  submitFile() {
    //console.log(this.acc_file_id)
    let data = {
      acc_file_id: this.acc_file_id,
      account_status: "submitted"
    }
    this.http.submitFile(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.successMsg2("Payroll file submitted successfully.");
        this.processSecondClose.nativeElement.click();
        this.searchList();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    });
  }

  saveFile() {
    //console.log(this.acc_file_id)
    let data = {
      acc_file_id: this.acc_file_id,
      account_status: "inprocess"
    }
    this.http.submitFile(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.successMsg2("Payroll file saved successfully.");
        //this.processSecondClose.nativeElement.click();
        //this.searchList();
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
        this.calculatePayroleClose.nativeElement.click();
        this.refreshSecondModal();
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
