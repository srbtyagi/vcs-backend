import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import { IDayCalendarConfig } from 'ng2-date-picker';
import * as moment from 'moment';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as $ from "jquery";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-edit-skill-set',
  templateUrl: './edit-skill-set.component.html',
  styleUrls: ['./edit-skill-set.component.css']
})
export class EditSkillSetComponent implements OnInit {

  checkUserType:boolean=false;

  constructor(public router: Router, public service: RecruiteeService, public route: ActivatedRoute,public fb: FormBuilder) { }

  jobDomain:any=[];
  candidateForm: FormGroup;
  codePattern="[+]?[0-9]*";
  phonePattern="[0-9]*";
  checkEmail:boolean=false;
  editStatus:boolean=false;
  details:any={};
  category_name:any;
  area_name:any;
  show:boolean=true;
  badge:Number;
  showDivPdf: boolean = false;

  datePickerConfig = <IDayCalendarConfig>{
    drops: 'down',
    format: 'MM/DD/YYYY'
  }

  



  ngOnInit() {

    if(sessionStorage.getItem("user_type")==='recruitee')
    {
      this.checkUserType=true;
    }
    
    this.getJObSkillDomain();
    this.getUser();
    this.candidateForm = this.fb.group({
      name: new FormControl(null, [Validators.required,Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required,Validators.maxLength(60),Validators.email,Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      edit_date: new FormControl(null, [Validators.required]),
      // phone_no: new FormControl(null, [Validators.required,,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.phonePattern)]),
    });
    this.getBadge();

  }

  getBadge() {
    this.service.getCurrentReqDocs(sessionStorage.getItem('user_id')).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length) {
        this.badge=result.length;
      }
     
    });
  }

  skillCheck(){
    if(!this.show)
    {
      this.error1("Skill Set not added yet.");
      
    }
  }

  skillRateChange(k,i,data)
  {

    if(data!==undefined){
    this.jobDomain[k]["skillset"][i]["date_of_completion"]=moment(new Date(data)).format("MM/DD/YYYY");
  }


  }

  dateChange(data)
  {
    //console.log("DATA",data);
    if(data!==undefined){
    // //console.log(k,i,this.dateComplete,moment(this.dateComplete).format("MM/DD/YYYY"))
    this.candidateForm.patchValue({
      edit_date:moment(new Date(data.date)).format("MM/DD/YYYY")
    });
    }
    //console.log(this.candidateForm.value)

  }
  

  edit(data:boolean)
  {
    this.editStatus=data;
  }

  getUser(){
    let user="0"
      if(sessionStorage.getItem("user_id"))
      {
        user=sessionStorage.getItem('user_id');
      }
    this.service.getCandidateByUserId({user_id:user}).subscribe((res) => {
      // //console.log(res,"RESULT");
      let result: any = res;
      if(result.length>0){

        
        let edit_date=moment(new Date()).format("MM/DD/YYYY");
        if(result[0].edit_date!==undefined || result[0].edit_date!==null || result[0].edit_date!==""){
          edit_date=result[0].edit_date
        }

        this.candidateForm.patchValue({
          name:result[0].candidate_name,
          email:result[0].candidate_email,
          edit_date:edit_date
          
        });

        this.details=this.candidateForm.value;
      }
      else {
        let edit_date=moment(new Date()).format("MM/DD/YYYY");
        this.candidateForm.patchValue({
          
          edit_date:edit_date
          
          
        });
      }
      // else {
      //   this.error("Something went wrong. Please Try Again.");
      // }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    });
  }

  getJObSkillDomain(){
    
      let user="0";
      if(sessionStorage.getItem("user_id"))
      {
        user=sessionStorage.getItem('user_id');
      }
      this.service.geAllSkillCategoryByuserId({user_id:user}).subscribe((res) => {
        //console.log(res,"RESULT");
        let result: any = res;
        if(result.length>0){
          this.show=true;
          this.skillCheck();
          this.category_name=result[0].skill_category_name;
          this.area_name=result[0]["area"][0].skill_area_name;
          //console.log(this.area_name)
          this.jobDomain = result[0]["area"][0]["domain"];
            
        }
        else{
          this.show=false;
          this.skillCheck();
        }
        
      });
   
  }

 


  addCandidate(){
    this.service.spinnerShow();
    let obj={
      domainData:this.jobDomain,
      candidateData:this.candidateForm.value,
    }
    //console.log(obj);
    this.service.insertCandidate(obj).subscribe((res) => {
      //console.log(res,"RESULT");
      let result: any = res;
      if(result==="success"){
        this.service.spinnerHide();
        this.details=this.candidateForm.value;
        this.success("Updated successfully.");
      }
      else{
        this.service.spinnerHide();
        this.error('Something went wrong,please try again.');
      }
     
    }, err => {
      this.service.spinnerHide();
      this.error("Something went wrong. Please Try Again.");
    });
  }



  downloadPDF() {
    this.showDivPdf = true;

    setTimeout(() => {
      var HTML_Width = $(".canvas_div_pdf").width();
      var HTML_Height = $(".canvas_div_pdf").height();
      var top_left_margin = 15;
      var PDF_Width = HTML_Width + (top_left_margin * 2);
      var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      var canvas_image_width = HTML_Width;
      var canvas_image_height = HTML_Height;

      var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;


      html2canvas($(".canvas_div_pdf")[0], { allowTaint: true }).then(function (canvas) {
        canvas.getContext('2d');

        //console.log(canvas.height + "  " + canvas.width);


        var imgData = canvas.toDataURL("image/png", 1.0);
        var pdf: any = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.page = 1; // use this as a counter.

        // function footer() {
        //   pdf.text(150, 285, 'page ' + pdf.page); //print number bottom right
        //   pdf.page++;
        // };
        pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);


        for (var i = 1; i <= totalPDFPages; i++) {
          pdf.addPage();
          //footer();
          pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }

        pdf.save("Skill_Checklist.pdf");
      });
    }, 100);


    setTimeout(() => {
      this.showDivPdf = false;
    }, 100)
  }

  success(msg) {
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
        // window.location.reload();
        this.editStatus=false;
        this.getJObSkillDomain();
      }
    })
  }
  error(msg) {
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
    })
  }
  error1(msg) {
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
        this.router.navigate(['/skill-checklist'])
      }
    })
  }

}
