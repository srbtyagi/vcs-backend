import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RecruiteeService } from 'src/app/recruitee.service';
import * as moment from 'moment';
import { FormBuilder,Validators,FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-current-assignment',
  templateUrl: './current-assignment.component.html',
  styleUrls: ['./current-assignment.component.css']
})
export class CurrentAssignmentComponent implements OnInit {

  @ViewChild('workModalClose',{static: false}) private workModalClose: ElementRef;
  @ViewChild('workNextModalClose',{static: false}) private workNextModalClose: ElementRef;

  checkUserType:boolean=false;
  client_id: any = "ALL";
  year: any = "ALL";
  month: any = "ALL";
  clientList:any=[];
  yearList:any=[];
  monthList:any=[];
  jobIdList:any=[];
  weekList:any=[];
  jobSelect:any;
  weekSelect:any;
  details:any;
  assignmentList:any=[];
  user_id:any=sessionStorage.getItem('user_id');
  showDivPdf: boolean = false;
  showDivPdf2: boolean = false;

  constructor(public router: Router, public service: RecruiteeService,public fb: FormBuilder) { }

  assignmentForm:FormGroup;
  standard_doc: any = [];
  fac_specc_doc: any = [];
  others_doc: any = [];

  ngOnInit() {

    this.assignmentForm = this.fb.group({
      job_id: new FormControl(null, [Validators.required]),
      client: new FormControl(null, []),
      week_id: new FormControl(null, [Validators.required]),
      reg_ot_hr: new FormControl(null, [Validators.required]),
      holiday_wk_hr: new FormControl(null, [Validators.required]),
      }
    );
    if(sessionStorage.getItem("user_type")==='recruitee')
    {
      this.checkUserType=true;
    }
    
    this.getClientData();
    this.getYearData();
    this.getCurrentDate();
    this.getJobList();

  }

  getCurrentDate(){
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles"
    });
    let currentYear=moment(new Date(strTime)).format("YYYY"); 
    let currentMonth=moment(new Date(strTime)).format("MMM"); 
    //console.log(currentYear,currentMonth);

    this.year=currentYear;
    this.month=currentMonth.toLowerCase();
    //console.log(currentYear,this.month);
    this.getMonthData(this.year);
    

  }

  getClientData(){
    this.service.getClientDetails().subscribe((res) => {
      // //console.log("result",res);
      let result: any = res;
      if (result.length > 0) {
        this.clientList = result;
      }
      else {
        this.error("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
      
    });
  }

  getYearData(){
    this.service.getYearDetails().subscribe((res) => {
      // //console.log("result",res);
      let result: any = res;
      if (result.length > 0) {
        this.yearList = result;
      }
    });
  }

  getMonthData(data){
    //console.log(data)
    this.service.getMonthDetails(data).subscribe((res) => {
      //console.log("result",res);
      let result: any = res;
      if (result.length > 0) {
        this.monthList= result;
        let index=this.monthList.map(function(e) { return e.month; }).indexOf(this.month);
        //console.log("abc",this.monthList,index)
        if(index===-1)
        {
          this.month="ALL"; 
        }
        this.searchAssignments();
      }
    });
  }

  getJobList(){
    this.service.getJobIdDetails({user_id:sessionStorage.getItem('user_id')}).subscribe((res) => {
      // //console.log("result",res);
      let result: any = res;
      if (result.length > 0) {
        this.jobIdList= result;
      }
      else {
        this.error("No Data.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    });
  }

  getWeekList(){
    let obj={
      assignment_id:this.jobSelect.assignment_id,
      user_id:sessionStorage.getItem("user_id"),
    }
    this.service.getWorkDetails(obj).subscribe((res) => {
      // //console.log("result",res);
      let result: any = res;
      if (result.length > 0) {
        this.weekList= result;
      }
      
    });
  }

  searchAssignments(){
    let obj={
      client_id:this.client_id,
      year:this.year,
      month:this.month,
      user_id:sessionStorage.getItem('user_id')
    }
    //console.log(obj)
    this.service.getAssignmentDetails(obj).subscribe((res) => {
      let result: any = res;
      if (result.length > 0) {
        this.assignmentList = result;
        //console.log(this.assignmentList)
      }
      else {
        this.error("No Data.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
      
    });
  }

  getClientDataOnChange(val){

    // //console.log(val,"val");
    let index=this.jobIdList.map(function(e) { return e.job_id; }).indexOf(parseInt(val));
    // //console.log(index,"index")
    if(index>=0)
    {
      this.jobSelect=this.jobIdList[index];
      this.getWeekList();
      this.assignmentForm.patchValue({
        client:this.jobSelect.client_name
      });
    }
    else{
    this.assignmentForm.patchValue({
      client:""
    });
  }
    
  }

  getWeekDataOnChange(val){

    let index=this.weekList.map(function(e) { return e.week_id; }).indexOf(parseInt(val));
    this.weekSelect=this.weekList[index];
  }

  onClose(){
    this.assignmentForm.reset();
  }

  insertDetails(){
    let obj={
      assignment_id:this.jobSelect.assignment_id,
      ot_reg_hr:this.assignmentForm.value.reg_ot_hr,
      rec_holiday_hr:this.assignmentForm.value.holiday_wk_hr,
      user_id:sessionStorage.getItem('user_id'),
      week_id:this.weekSelect.week_id
    }
    //console.log(obj,"OBJ");
    this.service.insertWorkHour(obj).subscribe((res) => {
      //console.log("result",res);
      let result: any = res;
      if (result==="success") {
        // this.weekList= result;
        this.workNextModalClose.nativeElement.click(); 
        this.workModalClose.nativeElement.click(); 
        this.success("Work hour submitted successfully!!!")

      }
      else{
        this.error("Something went wrong. Please Try Again.")
      }
      
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    });
  }

  onSubmit(){
    // this.workModalClose.nativeElement.click();
    this.details=this.assignmentForm.value;
    this.details["week"]=this.weekSelect.wk_start_date+"-"+this.weekSelect.wk_end_date;
    this.details["job"]=this.jobSelect.job_no;
    //console.log(this.details);
  }

  onClickPaySlip(a){
    this.details=a;
    if(a.user_middle_name)
    {
      this.details["name"]=a.user_first_name+" "+a.user_middle_name+" "+a.user_last_name;
    }
    else{
      this.details["name"]=a.user_first_name+" "+a.user_last_name;
    }

    this.details["total_wk_hr"]=(parseFloat(a.reg_hr)+parseFloat(a.ot_hr)+parseFloat(a.holiday_hr)).toFixed(2);
  }


  onClickAssignment(a){
    this.details=a;
    if(a.user_middle_name)
    {
      this.details["name"]=a.user_first_name+" "+a.user_middle_name+" "+a.user_last_name;
    }
    else{
      this.details["name"]=a.user_first_name+" "+a.user_last_name;
    }

    this.details["total_wk_hr"]=(parseFloat(a.reg_hr)+parseFloat(a.ot_hr)+parseFloat(a.holiday_hr)).toFixed(2);

    this.getAllDocs(sessionStorage.getItem('user_id'));
  }

  getAllDocs(user_id) {
    this.fac_specc_doc = [];
    this.others_doc = [];
    this.standard_doc = [];
    this.service.getAllDocs(user_id).subscribe((res: any) => {
      //console.log(res);
      for (let a of res) {
        if (a.rec_doc_type === "standard") {

          this.standard_doc.push(a);
        }
        else if (a.rec_doc_type === "facility_spec") {
          this.fac_specc_doc.push(a);
        }
        else if (a.rec_doc_type === "other") {
          this.others_doc.push(a);
        }
      }
    });
    //console.log(this.standard_doc, this.fac_specc_doc, this.others_doc)
  }

  workHourData(a){

    this.details=a;
    this.details["rec_ot_wk_hr"]=(parseFloat(a.rec_reg_hr)+parseFloat(a.rec_ot_hr)).toFixed(2);
    this.details["rec_holiday_hr"]=(parseFloat(a.rec_holiday_hr)).toFixed(2)
    

  }

  error(msg){
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
        this.assignmentForm.reset();
      }
    })
  }
  success(msg){
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
        this.assignmentForm.reset();
      }
    })
  }

  downloadApplForm() {
    this.showDivPdf = true;
    setTimeout(() => {
      let data = document.getElementById("assignFormFDiv");
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
        pdf.save('AssignmentDetails.pdf');
      });
    }, 100);

    setTimeout(() => {
      this.showDivPdf = false;
    }, 100)
  }

  downloadPayslip() {
    this.showDivPdf2 = true;
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
      this.showDivPdf2 = false;
    }, 100)
  }
}
