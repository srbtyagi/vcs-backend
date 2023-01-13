import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDayCalendarConfig } from 'ng2-date-picker';

@Component({
  selector: 'app-app-summary',
  templateUrl: './app-summary.component.html',
  styleUrls: ['./app-summary.component.css']
})
export class AppSummaryComponent implements OnInit {
  @ViewChild('closeStatusModal', { static: false }) private closeStatusModal: ElementRef;
  @ViewChild('onBoardModalClose', { static: false }) private onBoardModalClose: ElementRef;

  appSummryList: any = [];
  details: any;
  docs: any = [];
  showDivPdf: boolean = false;
  job_offer_status: any;
  data: any;

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
  application_stage: any;
  datePickerConfig = <IDayCalendarConfig>{
    drops: 'down',
    format: 'MM/DD/YYYY'
  }

  constructor(public http: AdminService, public route: ActivatedRoute, public router: Router, public fb: FormBuilder) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      this.data = JSON.parse(r.special);
      //console.log(this.data)
      this.getAllSummery();
    });
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

  back() {
    window.history.back();
  }

  getAllSummery() {
    let data = {
      job_id: this.data
    }
    this.http.getjobSummery(data).subscribe((res: any) => {
      //console.log(res)
      this.appSummryList = res;
    }, err => {

    });
  }

  reviewAppl(val) {
    this.details = "";
    this.details = val;
    //console.log(this.details)
    this.getAllDocs(this.details.user_id);
    let data = {
      application_id: val.application_id,
      review_status: "Yes"
    }
    this.http.changeReviewStatus(data).subscribe((res: any) => {
      //console.log(res)
    });
  }

  getAllDocs(data) {
    this.docs = [];
    this.http.getAllDocs(data).subscribe((res: any) => {
      //console.log(res);
      res.forEach(e => {
        if (e.rec_doc_status === "current") {
          this.docs.push(e);
        }
      });

    })
  }

  downloadApplForm() {
    this.showDivPdf = true;
    setTimeout(() => {
      let data = document.getElementById("applFormFDiv");
      //console.log(data)

      html2canvas(data).then(canvas => {
        var imgWidth = 22;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        const contentDataURL = canvas.toDataURL('image/png')

        //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
        var pdf: any = new jspdf('p', 'cm', 'a4'); //Generates PDF in portrait mode
        const addFooters = pdf => {
          const pageCount = pdf.internal.getNumberOfPages()
          pdf.setFont('helvetica', 'italic')
          pdf.setFontSize(8)
          for (var i = 1; i <= pageCount; i++) {
            pdf.setPage(i)
            pdf.text('Page ' + String(i) + ' of ' + String(pageCount), pdf.internal.pageSize.width / 2, 287, {
              align: 'center'
            })
          }
        }
        var position = 0;
        pdf.setFont("helvetica");
        pdf.setFontSize(20);
        addFooters(pdf);
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('ApplicationForm.pdf');
      });
    }, 100);

    setTimeout(() => {
      this.showDivPdf = false;
    }, 100)
  }

  onChangeStatus(data) {
    this.details = data;

  }

  changeStatus() {
    // //console.log(this.job_offer_status)
    let data = {
      job_id: this.details["job_id"],
      application_id: this.details["application_id"],
      application_stage: this.job_offer_status,
      recruitee_id: this.details["recruitee_id"],
      offer_accepted_by: "Recruiter"
    }
    this.http.changeJobApplicantStatus(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.closeStatusModal.nativeElement.click();
        Swal.fire({
          title: 'Offer accepted successfully.',
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
            this.getAllSummery();

          }
        })
      }
      else {
        this.closeStatusModal.nativeElement.click();
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
      this.closeStatusModal.nativeElement.click();
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

  onBoard(val) {
    //console.log(val)
    this.details = "";
    this.user_id = val.user_id;
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
    this.due_date = moment(val.due_date).format("MM/DD/YYYY");
    this.comment = val.comments;
    this.application_stage = val.application_stage;
    this.details = val;
  }

  updateDetails() {
    let data = {
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
      "contract_duration_wk": this.onBoardForm.controls.contract_duration.value,
      "pay_rate_id": this.details.pay_rate_id,
      "application_id": this.details.application_id,
      "recruitee_id": this.details.recruitee_id,
      "changed_by": sessionStorage.getItem("user_id")
    }
    //console.log(data)
    this.http.InsertOnboarding(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Rate fixed successfull.");
        this.onBoardModalClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })


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
        this.getAllSummery();

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
