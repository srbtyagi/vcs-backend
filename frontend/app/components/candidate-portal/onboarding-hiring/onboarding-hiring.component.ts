import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import { AdminService } from 'src/app/admin.service';
import { IDayCalendarConfig } from 'ng2-date-picker';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import * as moment from 'moment';

@Component({
  selector: 'app-onboarding-hiring',
  templateUrl: './onboarding-hiring.component.html',
  styleUrls: ['./onboarding-hiring.component.css']
})
export class OnboardingHiringComponent implements OnInit {

  @ViewChild('uploadDocModal', { static: false }) private uploadDocModal: ElementRef;

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService,
    public route: ActivatedRoute, public http: AdminService) { }

  applicationData = [];
  job_offer_status: string;
  details: any = {};
  user_id = sessionStorage.getItem("user_id");
  docs = [];
  file_name: any = '';
  viewShow: any = "";
  showPercentage: number = 0;
  showProgressBar: boolean = false;
  viewfinalErr: boolean = false;
  status = false;
  url = "";
  moduleArray: any[];
  fileToUpload: any | null = null;
  rec_doc_id_list=[];
  closeModalUpload=false;
  onboarding_id:any;
  standard_doc: any = [];
  fac_specc_doc: any = [];
  others_doc: any = [];
  showDivPdf: boolean = false;

  datePickerConfig = <IDayCalendarConfig>{
    drops: 'down',
    format: 'MM/DD/YYYY'
  }


  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    // //console.log(this.data)
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);

    this.getAllApplicationOnboard();
  }

  ////////////

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
            case "SEARCH JOB": {
              e.submodule_name_lower = "Search job";
              e.routing = "/";
              break;
            }
            case "APPLICATION": {
              e.submodule_name_lower = "Application";
              e.routing = "/job-applications";
              break;
            }
            case "ONBOARDING & HIRING": {
              e.submodule_name_lower = "On Boarding";
              e.routing = "/recruitee-onboarding-hiring";
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
      document.getElementById("clsActive503").className = "active";
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

  ////////////

  getAllApplicationOnboard() {
    this.service.getApplicationOnboard({ user_id: sessionStorage.getItem("user_id") }).subscribe((res) => {
      // //console.log("result",res);
      let result: any = res;
      if (result.length > 0) {
        this.applicationData = result;
        for (let i = 0; i < this.applicationData.length; i++) {
          this.job_offer_status = this.applicationData[i].application_stage;
          if (this.applicationData[i].application_stage === "offer_accepted") {
            this.applicationData[i].application_stage = "offer accepted";
          }

          if (this.applicationData[i].fill_up_status === "not_done") {
            this.applicationData[i].fill_up_status = "Not Done";
          }

        }
      }
      else {
        this.error("No Data.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    
      // //console.log(this.applicationData)
    });

  }

  jobDetails(data) {
    this.details = data;
  }

  assignmentDetails(data){
    this.getAllDocuments(this.user_id);
    this.details=data;
    let name="";
    // if (this.details["user_middle_name"]) {
    //   name = this.details["user_first_name"] + " " + this.details["user_middle_name"] + " " + this.details["user_last_name"];
    // }
    // else {
    //   name = this.details["user_first_name"] + " " + this.details["user_last_name"];
    // }

    // this.details["name"] = name;
    //console.log(data);

    this.service.getAssignmentDataByapplication({application_id:data.application_id}).subscribe((res: any) => {
      //console.log(res,"data");
      if(res.length)
      {
        this.details=res[0];
        if (this.details["user_middle_name"]) {
          name = this.details["user_first_name"] + " " + this.details["user_middle_name"] + " " + this.details["user_last_name"];
        }
        else {
          name = this.details["user_first_name"] + " " + this.details["user_last_name"];
        }
            
        this.details["name"] = name;
      }
      
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    });
  }

  viewApplication(data) {
    this.getAllDocs();
    this.onboarding_id=data.onboarding_id
    this.details = data;
    if(this.details.fill_up_status==="done")
    {
      this.details["fill_status"]=false;
    }
    else{
      this.details["fill_status"]=true;
    }
    let loc = "";
    let name = "";
    if (this.details["desired_location_1"] && this.details["desired_location_2"]) {
      loc = this.details["desired_location_1"] + ", " + this.details["desired_location_2"];
    }
    if (!this.details["desired_location_1"] && this.details["desired_location_2"]) {
      loc = this.details["desired_location_2"];
    }
    if (this.details["desired_location_1"] && !this.details["desired_location_2"]) {
      loc = this.details["desired_location_1"];
    }


    if (this.details["user_middle_name"]) {
      name = this.details["user_first_name"] + " " + this.details["user_middle_name"] + " " + this.details["user_last_name"];
    }
    else {
      name = this.details["user_first_name"] + " " + this.details["user_last_name"];
    }

    let standard_doc = [];
    let standard_doc_name = [];
    if (this.details["reqd_std_doc_id_list"]) {
      standard_doc = this.details["reqd_std_doc_id_list"].split(',');
      // //console.log(standard_doc);
      for (let k = 0; k < standard_doc.length; k++) {
        this.service.getStandardDocDetails({ doc_id: standard_doc[k] }).subscribe((res) => {
          // //console.log("result",res);
          let result: any = res;
          if(result.length>0){
            this.service.getStandardDocbyIdDetails({doc_id:standard_doc[k],user_id:this.user_id}).subscribe((res1) => {
            
            let result1: any = res1;
            //console.log("RES",result1)
            if(result1.length)
            {
              this.rec_doc_id_list.push(result1[0].rec_doc_id)
                standard_doc_name.push({expiry_date:result1[0].expiry_date,doc_name:result[0].doc_name,rec_doc_id:result1[0].rec_doc_id,exist:"true",doc_id:result1[0].doc_id,type:"standard",showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
            }
            else{
                standard_doc_name.push({expiry_date:"",doc_name:result[0].doc_name,exist:"false",type:"standard",doc_id:standard_doc[k],showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
            }
            
                       
                      });
                      // //console.log("std",standard_doc_name)
                    }
        });
      }
    }

    let facility_doc = [];
    let facility_doc_name = [];
    if (this.details["reqd_facility_doc_list"]) {
      facility_doc = this.details["reqd_facility_doc_list"].split(',');
      let doc_id=0;
      this.service.getdocBydoc_name({doc_name:"facility_spec"}).subscribe((res2) => {
            //console.log("res2",res2)
        let result2: any = res2;
        if(result2.length)
        {
          doc_id=result2[0].doc_id
        }
        
     
      for (let l = 0; l < facility_doc.length; l++) {
        this.service.getFacilityDocbyNameDetails({doc_name:facility_doc[l],user_id:this.user_id}).subscribe((res1) => {
            
          let result1: any = res1;
          if(result1.length)
          {
            this.rec_doc_id_list.push(result1[0].rec_doc_id)
            facility_doc_name.push({expiry_date:result1[0].expiry_date,doc_name:facility_doc[l],rec_doc_id:result1[0].rec_doc_id,exist:"true",doc_id:doc_id,type:"facility_spec",showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
          }
          else{
            facility_doc_name.push({expiry_date:"",doc_name:facility_doc[l],exist:"false",type:"facility_spec",doc_id:doc_id,showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
          }
          
                     
                    });
      }
    });
    }

    let other_doc = [];
    let other_doc_name = [];
    if (this.details["reqd_other_doc_list"]) {
      other_doc = this.details["reqd_other_doc_list"].split(',');
      let doc_id=0;
      this.service.getdocBydoc_name({doc_name:"other"}).subscribe((res2) => {
            
        let result2: any = res2;
        if(result2.length)
        {
          doc_id=result2[0].doc_id
        }
      
      // //console.log(other_doc)
      for (let m = 0; m < other_doc.length; m++) {

        this.service.getOthersDocbyNameDetails({doc_name:other_doc[m],user_id:this.user_id}).subscribe((res1) => {
            
          let result1: any = res1;
   
          if(result1.length)
          {
            this.rec_doc_id_list.push(result1[0].rec_doc_id)
            other_doc_name.push({expiry_date:result1[0].expiry_date,doc_name:other_doc[m],rec_doc_id:result1[0].rec_doc_id,exist:"true",doc_id:doc_id,type:"other",showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
          }
          else{
            other_doc_name.push({expiry_date:"",doc_name:other_doc[m],exist:"false",type:"other",doc_id:doc_id,showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
          }
          
                     
                    });
                   
      }
    });
    }

    this.details["standard_doc"] = standard_doc_name;
    this.details["facility_doc"] = facility_doc_name;
    this.details["other_doc"] = other_doc_name;





    this.details["loc"] = loc;
    this.details["name"] = name;

  }

  getAllDocuments(user_id) {
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

  getAllDocs() {
    this.service.getAllDocs(this.user_id).subscribe((res: any) => {
      //console.log("getzdoc", res);
      this.docs = res;
    })
  }


  handleFileInput(files: FileList,data) {

    this.closeModalUpload=true;
    this.fileToUpload = files.item(0);
    //console.log(this.fileToUpload,data)
    
    this.file_name = this.fileToUpload.name;
    let index;
    if(data.type==="standard")
    {
      index=this.details["standard_doc"].map(function(e) { return e.doc_id; }).indexOf(data.doc_id);
      // if(data.expiry_date==undefined)
      // {
        if(this.fileToUpload.size>25000000)
        {
          this.details["standard_doc"][index]["viewShow"]="fileSizeError"
        }
      //   else{
      //   this.details["standard_doc"][index]["viewShow"]="expire";
      //   }
      // }
      else{
        this.details["standard_doc"][index]["file_name"]=this.fileToUpload.name;
        this.uploadFileToActivity(data);
      }
    }
    if(data.type==="facility_spec")
    {
      index=this.details["facility_doc"].map(function(e) { return e.doc_name; }).indexOf(data.doc_name);
      // if(data.expiry_date==undefined)
      // {
        if(this.fileToUpload.size>25000000)
        {
          this.details["facility_doc"][index]["viewShow"]="fileSizeError";
        }
        // else{
        // this.details["facility_doc"][index]["viewShow"]="expire";
        // }
      // }
      else{
      this.details["facility_doc"][index]["file_name"]=this.fileToUpload.name;
      this.uploadFileToActivity(data);
        }
    }
    if(data.type==="other")
    {
      index=this.details["other_doc"].map(function(e) { return e.doc_name; }).indexOf(data.doc_name);
      // if(data.expiry_date==undefined)
      // {
        if(this.fileToUpload.size>25000000)
        {
          this.details["other_doc"][index]["viewShow"]="fileSizeError";
        }
      //   else{
      //   this.details["other_doc"][index]["viewShow"]="expire";
      //   }
      // }
      else{
      this.details["other_doc"][index]["file_name"]=this.fileToUpload.name;
      this.uploadFileToActivity(data);
        }
    }
    
  }

  onSubmitModalUpload(){

    this.closeModalUpload=false;
    let uniqueItems = [...new Set(this.rec_doc_id_list)]

    // //console.log(uniqueItems,this.rec_doc_id_list)
    this.service.updateFillup({onboarding_id:this.onboarding_id,req_doc_id_list :uniqueItems.join(',')}).subscribe((res1) => {
            
      let result1: any = res1;
      //console.log(result1)

      if(result1==="success")
      {

        this.uploadDocModal.nativeElement.click();
        
        this.success("Successfully Updated On-Boarding Form.");
        this.getAllApplicationOnboard();

      }
      else{
        
        this.uploadDocModal.nativeElement.click();
        
        this.error("Something went wrong. Please Try Again.")
        this.getAllApplicationOnboard();
      }
      
    }, err => {
      this.error("Something went wrong. Please Try Again.");
      this.getAllApplicationOnboard();
    
    });
      
    
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


  

  uploadFileToActivity(data) {
    // //console.log(this.fileToUpload)

    let index;
    if(data.type==="standard")
    {
      index=this.details["standard_doc"].map(function(e) { return e.doc_id; }).indexOf(data.doc_id);
    

        this.details["standard_doc"][index]["showProgressBar"]=true;
        this.details["standard_doc"][index]["showPercentage"]=0;
        this.details["standard_doc"][index]["exist"]="false";
        this.details["standard_doc"][index]["viewShow"]="try";
      
    
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    // this.service.uploadDoc(formData, this.user_id, data.doc_id, data.doc_name,moment(new Date(data.expiry_date)).format("MM-DD-YYYY")).subscribe((res: any) => {
      this.service.uploadDoc(formData, this.user_id, data.doc_id, data.doc_name,"0").subscribe((res: any) => {
      //console.log(res)
      this.details["standard_doc"][index]["showPercentage"]= Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body.message === "success") {
          this.fileToUpload = "";
          this.file_name = "";
          // this.doc_name = "";
          // this.doc_id = "";
          this.rec_doc_id_list.push(res.body.rec_doc_details.rec_doc_id);
          this.details["standard_doc"][index]["showProgressBar"]=false;
          this.details["standard_doc"][index]["viewShow"]="true";
          this.details["standard_doc"][index]["exist"]="true";
          this.details["standard_doc"][index]["rec_doc_id"]=res.body.rec_doc_details.rec_doc_id;

          //console.log(this.details,"DETAILS")
          // this.uploadDocModal.nativeElement.click();
          // this.successMsg2('File uploaded successfully.');
        }
      }

      else if (res === "doc not uploaded") {

        this.details["standard_doc"][index]["viewShow"]="error";
        this.details["standard_doc"][index]["viewfinalErr"]=true;
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.details["standard_doc"][index]["viewShow"]="error";
        this.details["standard_doc"][index]["viewfinalErr"]=true;
      //this.errorMsg('Something went wrong,please try again.');
    });
  
    }
    else if(data.type==="facility_spec")
    {
      index=this.details["facility_doc"].map(function(e) { return e.doc_name; }).indexOf(data.doc_name);
    
    this.details["facility_doc"][index]["showProgressBar"]=true;
    this.details["facility_doc"][index]["showPercentage"]=0;
    this.details["facility_doc"][index]["exist"]="false";
    this.details["facility_doc"][index]["viewShow"]="try";
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    // this.service.uploadDoc(formData, this.user_id, data.doc_id, data.doc_name,moment(new Date(data.expiry_date)).format("MM-DD-YYYY")).subscribe((res: any) => {
      this.service.uploadDoc(formData, this.user_id, data.doc_id,  data.doc_name,"0").subscribe((res: any) => {
      //console.log(res)
      this.details["facility_doc"][index]["showPercentage"]= Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body.message === "success") {
          this.fileToUpload = "";
          this.file_name = "";
          // this.doc_name = "";
          // this.doc_id = "";
          this.rec_doc_id_list.push(res.body.rec_doc_details.rec_doc_id);
          this.details["facility_doc"][index]["showProgressBar"]=false;
          this.details["facility_doc"][index]["viewShow"]="true";
          this.details["facility_doc"][index]["exist"]="true";
          this.details["facility_doc"][index]["rec_doc_id"]=res.body.rec_doc_details.rec_doc_id;

          // this.uploadDocModal.nativeElement.click();
          // this.successMsg2('File uploaded successfully.');
        }
      }

      else if (res === "doc not uploaded") {

        this.details["facility_doc"][index]["viewShow"]="error";
        this.details["facility_doc"][index]["viewfinalErr"]=true;
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.details["facility_doc"][index]["viewShow"]="error";
        this.details["facility_doc"][index]["viewfinalErr"]=true;
      //this.errorMsg('Something went wrong,please try again.');
    });
    }
    else if(data.type==="other")
    {
      index=this.details["other_doc"].map(function(e) { return e.doc_name; }).indexOf(data.doc_name);
    
    this.details["other_doc"][index]["showProgressBar"]=true;
    this.details["other_doc"][index]["showPercentage"]=0;
    this.details["other_doc"][index]["exist"]="false";
    this.details["other_doc"][index]["viewShow"]="try";
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    // this.service.uploadDoc(formData, this.user_id, data.doc_id, data.doc_name,moment(new Date(data.expiry_date)).format("MM-DD-YYYY")).subscribe((res: any) => {
      this.service.uploadDoc(formData, this.user_id, data.doc_id,  data.doc_name,"0").subscribe((res: any) => {    //console.log(res)
      this.details["other_doc"][index]["showPercentage"]= Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body.message === "success") {
          this.fileToUpload = "";
          this.file_name = "";
          // this.doc_name = "";
          // this.doc_id = "";
          this.rec_doc_id_list.push(res.body.rec_doc_details.rec_doc_id);
          this.details["other_doc"][index]["showProgressBar"]=false;
          this.details["other_doc"][index]["viewShow"]="true";
          this.details["other_doc"][index]["exist"]="true";
          this.details["other_doc"][index]["rec_doc_id"]=res.body.rec_doc_details.rec_doc_id;
          

          // this.uploadDocModal.nativeElement.click();
          // this.successMsg2('File uploaded successfully.');
        }
      }

      else if (res === "doc not uploaded") {

        this.details["other_doc"][index]["viewShow"]="error";
        this.details["other_doc"][index]["viewfinalErr"]=true;
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.details["other_doc"][index]["viewShow"]="error";
        this.details["other_doc"][index]["viewfinalErr"]=true;
      //this.errorMsg('Something went wrong,please try again.');
    });
    }
}

success(msg)
  {
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

}
