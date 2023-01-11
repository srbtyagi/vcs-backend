import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.css']
})
export class MyDocumentsComponent implements OnInit {

  @ViewChild('uploadDoc', { static: false }) private uploadDoc: ElementRef;
  constructor(public service: RecruiteeService) { }

  checkUserType:boolean=false;
  documentData:any = [];
  user_id:String;
  badge:Number;
  details:any=[];
  standardDoc:any=[];
  facilityDoc:any=[];
  othersDoc:any=[];
  fileToUpload: any | null = null;
  file_name: any = '';
  

  ngOnInit() {
    this.service.spinnerShow();
    setTimeout(() => {
      this.service.spinnerHide();
    }, 900);

    if(sessionStorage.getItem("user_type")==='recruitee')
    {
      this.checkUserType=true;
    }
    this.user_id=sessionStorage.getItem("user_id");

    this.getAllDocuments();
    this.getBadge();
  }

  getBadge() {
    this.badge=0;
    this.service.getCurrentReqDocs(sessionStorage.getItem('user_id')).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length) {
        this.details=result;
        this.badge=result.length;
      }
     
    });
  }



  getAllDocuments() {
    this.service.getAllDocuments(sessionStorage.getItem("user_id")).subscribe((res) => {
      //console.log("result",res);
      let result: any = res;
      if (result.length > 0) {
        this.documentData = result;
        for(let i=0;i<this.documentData.length;i++)
        {
          if(this.documentData[i]["rec_doc_type"]==="facility_spec"){
            this.documentData[i]["rec_doc_type"]="Facility Specific"; 
          }
          this.documentData[i]["update_date_time"]=moment(this.documentData[i]["update_date_time"]).format("MM/DD/YYYY");
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

  getDocToUpload(){
    this.getBadge();
    this.standardDoc=[];
    this.facilityDoc=[];
    this.othersDoc=[];
    //console.log(this.details);
    for(let i=0;i<this.details.length;i++)
    {
      if(this.details[i].req_doc_type==="standard"){
        this.service.getStandardDocbyIdDetails({doc_id:this.details[i].doc_id,user_id:this.user_id}).subscribe((res) => {
            
          let result: any = res;
          //console.log("RES",result)
          if(result.length)
          {
              this.standardDoc.push({req_doc_id:this.details[i].req_doc_id,expiry_date:result[0].expiry_date,doc_name:result[0].doc_name,rec_doc_id:result[0].rec_doc_id,exist:"true",doc_id:result[0].doc_id,type:"standard",showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
          }
          else{
              this.standardDoc.push({req_doc_id:this.details[i].req_doc_id,expiry_date:"",doc_name:this.details[i].req_doc_name,exist:"false",type:"standard",doc_id:this.details[i].doc_id,showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
          }
          
                     
                    });
        
      }
      else if(this.details[i].req_doc_type==="facility_spec"){
        let doc_id=0;
      this.service.getdocBydoc_name({doc_name:"facility_spec"}).subscribe((res2) => {
            //console.log("res2",res2)
        let result2: any = res2;
        if(result2.length)
        {
          doc_id=result2[0].doc_id
        }
        this.service.getFacilityDocbyNameDetails({doc_name:this.details[i].req_doc_name,user_id:this.user_id}).subscribe((res) => {
            
          let result: any = res;
          if(result.length)
          {
            this.facilityDoc.push({req_doc_id:this.details[i].req_doc_id,expiry_date:result[0].expiry_date,doc_name:this.details[i].req_doc_name,rec_doc_id:result[0].rec_doc_id,exist:"true",doc_id:doc_id,type:"facility_spec",showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
          }
          else{
            this.facilityDoc.push({req_doc_id:this.details[i].req_doc_id,expiry_date:"",doc_name:this.details[i].req_doc_name,exist:"false",type:"facility_spec",doc_id:doc_id,showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
          }
          
                     
                    });
                  });
        

      }
      else{
        let doc_id=0;
        this.service.getdocBydoc_name({doc_name:"other"}).subscribe((res2) => {
            
          let result2: any = res2;
          if(result2.length)
          {
            doc_id=result2[0].doc_id
          }
          this.service.getOthersDocbyNameDetails({doc_name:this.details[i].req_doc_name,user_id:this.user_id}).subscribe((res1) => {
            
            let result1: any = res1;
     
            if(result1.length)
            {
              this.othersDoc.push({req_doc_id:this.details[i].req_doc_id,expiry_date:result1[0].expiry_date,doc_name:this.details[i].req_doc_name,rec_doc_id:result1[0].rec_doc_id,exist:"true",doc_id:doc_id,type:"other",showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
            }
            else{
              this.othersDoc.push({req_doc_id:this.details[i].req_doc_id,expiry_date:"",doc_name:this.details[i].req_doc_name,exist:"false",type:"other",doc_id:doc_id,showProgressBar:false,showPercentage:0,viewfinalErr:false,viewShow:"no"})
            }
            
                       
                      });
        });
        
      }
    }
    //console.log(this.standardDoc,"DOC")
  }

  updateRequestDocStatus(data) {
    this.service.updateReqDocStatus({req_doc_id:data}).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result==="success") {
        this.getBadge();
        this.getAllDocuments();
      }else{
        this.uploadDoc.nativeElement.click();
        
        this.error("Something went wrong. Please Try Again.");
      }
     
    });
  }

  handleFileInput(files: FileList,data) {

    this.fileToUpload = files.item(0);
    //console.log(this.fileToUpload,data)
    
    this.file_name = this.fileToUpload.name;
    let index;
    if(data.type==="standard")
    {
      index=this.standardDoc.map(function(e) { return e.doc_id; }).indexOf(data.doc_id);
      // if(data.expiry_date==undefined)
      // {
        if(this.fileToUpload.size>25000000)
        {
          this.standardDoc[index]["viewShow"]="fileSizeError"
        }
      //   else{
      //   this.details["standard_doc"][index]["viewShow"]="expire";
      //   }
      // }
      else{
        this.standardDoc[index]["file_name"]=this.fileToUpload.name;
        this.uploadFileToActivity(data);
      }
    }
    if(data.type==="facility_spec")
    {
      index=this.facilityDoc.map(function(e) { return e.doc_name; }).indexOf(data.doc_name);
      // if(data.expiry_date==undefined)
      // {
        if(this.fileToUpload.size>25000000)
        {
          this.facilityDoc[index]["viewShow"]="fileSizeError";
        }
        // else{
        // this.details["facility_doc"][index]["viewShow"]="expire";
        // }
      // }
      else{
        this.facilityDoc[index]["file_name"]=this.fileToUpload.name;
      this.uploadFileToActivity(data);
        }
    }
    if(data.type==="other")
    {
      index=this.othersDoc.map(function(e) { return e.doc_name; }).indexOf(data.doc_name);
      // if(data.expiry_date==undefined)
      // {
        if(this.fileToUpload.size>25000000)
        {
          this.othersDoc[index]["viewShow"]="fileSizeError";
        }
      //   else{
      //   this.details["other_doc"][index]["viewShow"]="expire";
      //   }
      // }
      else{
        this.othersDoc[index]["file_name"]=this.fileToUpload.name;
      this.uploadFileToActivity(data);
        }
    }
    
  }

  uploadFileToActivity(data) {
    // //console.log(this.fileToUpload)

    let index;
    if(data.type==="standard")
    {
      index=this.standardDoc.map(function(e) { return e.doc_id; }).indexOf(data.doc_id);
    

        this.standardDoc[index]["showProgressBar"]=true;
        this.standardDoc[index]["showPercentage"]=0;
        this.standardDoc[index]["exist"]="false";
        this.standardDoc[index]["viewShow"]="try";
      
    
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    // this.service.uploadDoc(formData, this.user_id, data.doc_id, data.doc_name,moment(new Date(data.expiry_date)).format("MM-DD-YYYY")).subscribe((res: any) => {
      this.service.uploadDoc(formData, this.user_id, data.doc_id, data.doc_name,"0").subscribe((res: any) => {
      //console.log(res)
      this.standardDoc[index]["showPercentage"]= Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body.message === "success") {
          this.fileToUpload = "";
          this.file_name = "";
          this.standardDoc[index]["showProgressBar"]=false;
          this.standardDoc[index]["viewShow"]="true";
          this.standardDoc[index]["exist"]="true";
          this.standardDoc[index]["rec_doc_id"]=res.body.rec_doc_details.rec_doc_id;
          this.updateRequestDocStatus(data.req_doc_id);

          // //console.log(this.details,"DETAILS")
          // this.uploadDocModal.nativeElement.click();
          // this.successMsg2('File uploaded successfully.');
        }
      }

      else if (res === "doc not uploaded") {

        this.standardDoc[index]["viewShow"]="error";
        this.standardDoc[index]["viewfinalErr"]=true;
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.standardDoc[index]["viewShow"]="error";
        this.standardDoc[index]["viewfinalErr"]=true;
      //this.errorMsg('Something went wrong,please try again.');
    });
  
    }
    else if(data.type==="facility_spec")
    {
      index=this.facilityDoc.map(function(e) { return e.doc_name; }).indexOf(data.doc_name);
    
    this.facilityDoc[index]["showProgressBar"]=true;
    this.facilityDoc[index]["showPercentage"]=0;
    this.facilityDoc[index]["exist"]="false";
    this.facilityDoc[index]["viewShow"]="try";
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    // this.service.uploadDoc(formData, this.user_id, data.doc_id, data.doc_name,moment(new Date(data.expiry_date)).format("MM-DD-YYYY")).subscribe((res: any) => {
      this.service.uploadDoc(formData, this.user_id, data.doc_id,  data.doc_name,"0").subscribe((res: any) => {
      //console.log(res)
      this.facilityDoc[index]["showPercentage"]= Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body.message === "success") {
          this.fileToUpload = "";
          this.file_name = "";
          
          this.facilityDoc[index]["showProgressBar"]=false;
          this.facilityDoc[index]["viewShow"]="true";
          this.facilityDoc[index]["exist"]="true";
          this.facilityDoc[index]["rec_doc_id"]=res.body.rec_doc_details.rec_doc_id;
          this.updateRequestDocStatus(data.req_doc_id);

          // this.uploadDocModal.nativeElement.click();
          // this.successMsg2('File uploaded successfully.');
        }
      }

      else if (res === "doc not uploaded") {

        this.facilityDoc[index]["viewShow"]="error";
        this.facilityDoc[index]["viewfinalErr"]=true;
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.facilityDoc[index]["viewShow"]="error";
        this.facilityDoc[index]["viewfinalErr"]=true;
      //this.errorMsg('Something went wrong,please try again.');
    });
    }
    else if(data.type==="other")
    {
      index=this.othersDoc.map(function(e) { return e.doc_name; }).indexOf(data.doc_name);
    
    this.othersDoc[index]["showProgressBar"]=true;
    this.othersDoc[index]["showPercentage"]=0;
    this.othersDoc[index]["exist"]="false";
    this.othersDoc[index]["viewShow"]="try";
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    // this.service.uploadDoc(formData, this.user_id, data.doc_id, data.doc_name,moment(new Date(data.expiry_date)).format("MM-DD-YYYY")).subscribe((res: any) => {
      this.service.uploadDoc(formData, this.user_id, data.doc_id,  data.doc_name,"0").subscribe((res: any) => {    //console.log(res)
      this.othersDoc[index]["showPercentage"]= Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body.message === "success") {
          this.fileToUpload = "";
          this.file_name = "";
          this.othersDoc[index]["showProgressBar"]=false;
          this.othersDoc[index]["viewShow"]="true";
          this.othersDoc[index]["exist"]="true";
          this.othersDoc[index]["rec_doc_id"]=res.body.rec_doc_details.rec_doc_id;
          this.updateRequestDocStatus(data.req_doc_id);
          

          // this.uploadDocModal.nativeElement.click();
          // this.successMsg2('File uploaded successfully.');
        }
      }

      else if (res === "doc not uploaded") {

        this.othersDoc[index]["viewShow"]="error";
        this.othersDoc[index]["viewfinalErr"]=true;
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.othersDoc[index]["viewShow"]="error";
        this.othersDoc[index]["viewfinalErr"]=true;
      //this.errorMsg('Something went wrong,please try again.');
    });
    }
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

}
