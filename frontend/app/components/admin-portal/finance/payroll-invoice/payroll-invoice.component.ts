import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-payroll-invoice',
  templateUrl: './payroll-invoice.component.html',
  styleUrls: ['./payroll-invoice.component.css']
})
export class PayrollInvoiceComponent implements OnInit {

  moduleArray: any = [];

  client_id1: any = "ALL";
  year1: any = "ALL";
  month1: any = "ALL";
  week1: any = "ALL";
  yearList2: any;
  clientList1: any;
  monthList2: any;
  weekList2: any;
  clientList: any = [];
  yearList: any;
  monthList: any;
  weekList: any;
  client_id: any;
  year: any;
  month: any;
  week: any;
  payrollDataListMain: any = [];


  payrollDataList: any = [];
  acc_file_id: any;
  showModalBox: boolean = false;
  user_id: any;

  showNameList: boolean = false;
  showCodeList: boolean = false;
  recruitee_name: any;
  nameList: any = [];
  recruitee_code: any;
  codeList: any = [];
  recruitee_id: any;
  searchPayrollList: any = [];
  showPayslipModalBox: boolean = false;
  details: any;
  showDivPdf: boolean = false;
  total_work_hr: any;
  excelfileName: any;
 /*paginate */
 public count:any = 20;
 public page: any;
 /**paginate  */
  constructor(public route: ActivatedRoute, public router: Router, public http: AdminService) {
    this.user_id = sessionStorage.getItem("user_id");
    this.excelfileName = "payroll_invoice(" + moment(new Date).format("MM-DD-YYYY") + ")";
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
      document.getElementById("clsActive303").className = "active";
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

  getYear() {
    this.http.getYearByClient().subscribe((res: any) => {
      //console.log(res)
      this.yearList = res;
    });

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
    //console.log(val)
    if (val !== "ALL") {
      this.http.getWeekByMonth(this.year, val).subscribe((res: any) => {
        //console.log(res)
        this.weekList = res;
      });
    }
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
    this.http.getPayrollInvoiceData(body).subscribe((res: any) => {
      //console.log(res)
      this.payrollDataListMain = res;
      this.http.spinnerHide();
    })
  }

  clickDownload(val) {
    this.showModalBox = true;
    this.payrollDataList = [];
    this.acc_file_id = val.acc_file_id;
    let body = {
      acc_file_id: val.acc_file_id
    }
    this.http.getInvoiceDataByFileID(body).subscribe((res: any) => {
      //console.log(res)
      this.payrollDataList = res;
    })
  }

  findrecuiteeCode(ev) {
    //console.log(this.recruitee_name)
    let data = {
      name: this.recruitee_name
    }
    this.http.getRecruiteeCodebyName(data).subscribe((res: any) => {
      //console.log(res)
      this.nameList = res;
      if (this.nameList.length !== 0) {
        this.showNameList = true;
      }
      else {
        this.showNameList = false;
      }
    })
  }

  findrecuiteeName(ev) {
    //console.log(this.recruitee_code)
    let data = {
      code: this.recruitee_code
    }
    this.http.getRecruiteeNameByCode(data).subscribe((res: any) => {
      //console.log(res)
      this.codeList = res;
      if (this.codeList.length !== 0) {
        this.showCodeList = true;
      }
      else {
        this.showCodeList = false;
      }
    })
  }

  selectName(val) {
    this.recruitee_code = val.recruitee_code;
    this.recruitee_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    this.recruitee_id = val.recruitee_id;
    this.showNameList = false;
    this.showCodeList = false;
    //console.log(this.recruitee_code, this.recruitee_id)
  }

  selectCode(val) {
    this.recruitee_code = val.recruitee_code;
    this.recruitee_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    this.recruitee_id = val.recruitee_id;
    this.showNameList = false;
    this.showCodeList = false;
    //console.log(this.recruitee_name, this.recruitee_id)
  }

  search() {
    let data = {
      client_id: this.client_id,
      recruitee_id: this.recruitee_id,
      week_id: this.week,
      year: this.year,
      month: this.month
    }
    this.http.seachRecruiteePayroll(data).subscribe((res: any) => {
      //console.log(res)
      this.searchPayrollList = res;
      this.showPayslipModalBox = true;
      if (this.searchPayrollList.length === 0) {
        this.errorMsg("No search result found!");
      }
      else {

      }
    }, err => {
      this.errorMsg("Something went wrong,please try again!");
    })
  }

  viewslip(val) {
    this.details = "";
    this.total_work_hr = "";
    this.details = val;
    this.total_work_hr = Number(this.details.reg_hr) + Number(this.details.holiday_hr) + Number(this.details.ot_hr);
  }

  downloadPayslip() {
    this.showDivPdf = true;
    setTimeout(() => {
      let data = document.getElementById("payslipDiv");
      //console.log(data)
      html2canvas(data).then(canvas => {
        var imgWidth = 22;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        const contentDataURL = canvas.toDataURL('image/png')
        //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
        let pdf = new jspdf('p', 'cm', 'a4'); //Generates PDF in portrait mode
        var position = 0;
        pdf.setFont("helvetica");
        pdf.setFontSize(20);
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('payslip.pdf');
      });
    }, 100);

    setTimeout(() => {
      this.showDivPdf = false;
    }, 100)
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

      }
    })
  }



}
