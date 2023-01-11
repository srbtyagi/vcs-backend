import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import { AdminService } from 'src/app/admin.service';
import * as moment from 'moment';
import { IDayCalendarConfig } from 'ng2-date-picker';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.css']
})
export class JobApplicationComponent implements OnInit {

  @ViewChild('uploadDocModal', { static: false }) private uploadDocModal: ElementRef;
  @ViewChild('closeStatusModal', { static: false }) private closeStatusModal: ElementRef;

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService,
    public route: ActivatedRoute, public http: AdminService) { }

  applicationData = [];
  details: any = {};
  docs = [];
  user_id = sessionStorage.getItem("user_id");
  recruitee_id;
  user_status;
  apply_status;
  fileToUpload: any | null = null;
  file_name: any = '';
  doc_id: any = "";
  viewShow: any = "no";
  showPercentage: number = 0;
  showProgressBar: boolean = false;
  uploaded_data: any;
  viewfinalErr: boolean = false;
  docType: any;
  doc_name: any = '';
  showSecInput: boolean = false;
  job_offer_status: any;
  moduleArray: any[];
  expiry_date:any;
  expiry_date_status:boolean=false;
  filterArray: any = [];
  search_data: any;

  datePickerConfig = <IDayCalendarConfig>{
    drops: 'up',
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
    this.getAllApplication();
    this.getDocType();
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
      document.getElementById("clsActive502").className = "active";
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

  getAllApplication() {
    this.service.getApplicationById({ user_id: sessionStorage.getItem("user_id") }).subscribe((res) => {
      // //console.log("result",res);
      let result: any = res;
      if (result.length > 0) {
        this.applicationData = result;
        this.filterArray = result;
        for (let i = 0; i < this.applicationData.length; i++) {
          let latestremarks = "";
          let allRem = [];
          let allRemDate = [];
          let remarksObj = [];
          this.job_offer_status = this.applicationData[i].application_stage;
          if (this.applicationData[i].remarks && this.applicationData[i].remarks_date) {
            allRem = this.applicationData[i].remarks.split('&$&');
            allRemDate = this.applicationData[i].remarks_date.split('&$&');
            latestremarks = allRem[allRem.length - 1];

            for (let j = 0; j < allRem.length && j < allRemDate.length; j++) {
              remarksObj.push({ remarks: allRem[j], remarks_date: allRemDate[j] });
            }

            this.applicationData[i]["latest_remarks"] = latestremarks.substring(0, 5) + "...";
            this.applicationData[i]["allRemarks"] = remarksObj;
          }
          if (this.applicationData[i].application_stage === "sort_listed") {
            this.applicationData[i].application_stage = "submitted";
          }
          else if (this.applicationData[i].application_stage === "offer_accepted") {
            this.applicationData[i].application_stage = "offer accepted";
          }
          else if (this.applicationData[i].application_stage === "offer_declined") {
            this.applicationData[i].application_stage = "offer declined";
          }
          else if (this.applicationData[i].application_stage === "onboarding") {
            this.applicationData[i].application_stage = "on boarding";
          }
          else if (this.applicationData[i].application_stage === "rejected") {
            this.applicationData[i].application_stage = "not offered";
          }

        }
      }
      else {
        this.error("No Data.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    });

  }

  viewApplication(data) {
    this.getAllDocs();
    this.details = data;
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

    this.details["loc"] = loc;
    this.details["name"] = name;

  }

  viewRemarks(data) {
    this.details = data;
  }

  viewOffer(data) {
    this.details = data;
    let name="";
    if (this.details["user_middle_name"]) {
      name = this.details["user_first_name"] + " " + this.details["user_middle_name"] + " " + this.details["user_last_name"];
    }
    else {
      name = this.details["user_first_name"] + " " + this.details["user_last_name"];
    }

    this.details["name"] = name;
  }

  getAllDocs() {
    this.service.getAllDocs(this.user_id).subscribe((res: any) => {
      //console.log("getzdoc", res);
      this.docs = res;
    })
  }



  clickOpen(val) {
    this.details = "";
    this.details = val;
    this.recruitee_id = this.details["recruitee_id"];
    this.user_status = this.details["user_status"];
    this.apply_status = this.details["apply_status"];
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

  uploadFileToActivity() {
    //console.log(this.fileToUpload)
    
      this.viewShow ="no";
    this.showProgressBar = true;
    this.showPercentage = 0;
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    // this.service.uploadDoc(formData, this.user_id, this.doc_id, this.doc_name,moment(new Date(this.expiry_date)).format("MM-DD-YYYY")).subscribe((res: any) => {
    this.service.uploadDoc(formData, this.user_id, this.doc_id, this.doc_name,"0").subscribe((res: any) => {
      //console.log(res)
      this.viewShow = "try";
      this.showPercentage = Math.round(100 * res.loaded / res.total);
      if (res.body !== undefined) {
        if (res.body.message === "success") {
          this.fileToUpload = "";
          this.file_name = "";
          this.doc_name = "";
          this.doc_id = "";
          this.expiry_date_status=false;
          this.expiry_date="";
          this.showProgressBar = false;
          this.viewShow = "true";
          this.uploadDocModal.nativeElement.click();
          this.viewShow = 'no';
          this.successMsg2('File uploaded successfully.');
        }
      }

      else if (res === "doc not uploaded") {
        this.viewfinalErr = true;
        this.viewShow = "false";
        //this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.viewfinalErr = true;
      this.viewShow = "false";
      //this.errorMsg('Something went wrong,please try again.');
    });
  
  }

  checkExpiry()
  {
    
    if(this.expiry_date===undefined)
    {
      this.expiry_date_status=false;
    }
    else{
      this.expiry_date_status=true;
    }
    //console.log(this.expiry_date_status);
  }


  handleFileInput(files: FileList) {
    this.viewShow ="no";
    this.file_name="";
    if(files.item(0).size>25000000)
    {
      this.viewShow = "fileSizeError"
    }
    else{
    this.fileToUpload = files.item(0);
    //console.log(this.fileToUpload)
    this.file_name = this.fileToUpload.name;
    }
    
    
    

    //this.uploadFileToActivity(this.fileToUpload, this.user_id);
  }

  onSelectedDoc(val) {
    //this.doc_name = "";
    //this.doc_id = "";
    this.docType.forEach(e => {
      if (e.doc_id === Number(val)) {
        this.doc_name = e.doc_name;
        this.doc_id = val;

        if (this.doc_name === "other") {
          this.showSecInput = true;
          this.doc_name = "";
        }
        else {
          this.showSecInput = false;
        }
      }

    });

    //console.log(this.doc_name, this.doc_id)

  }

  getDocType() {
    this.service.getDocumentType().subscribe((res: any) => {
      this.docType = res;
      for(var x in this.docType)this.docType[x].doc_name == "other" ? this.docType.push( this.docType.splice(x,1)[0] ) : 0;
      //console.log(this.docType)
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
        //window.location.reload();
      }
    })
  }

  search(event) {
    const cols = document.querySelectorAll('.itemList');
    const query = event.target.value.toLowerCase();
    requestAnimationFrame(() => {
      [].forEach.call(cols, (e) => {
        const shouldShow = e.textContent.toLowerCase().indexOf(query) > -1;
        e.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }

  onChangeStatus(data) {
    this.details = data;

  }

  changeStatus() {
    // //console.log(this.job_offer_status)
    this.service.spinnerShow();
    let data = {
      job_id: this.details["job_id"],
      application_id: this.details["application_id"],
      application_stage: this.job_offer_status,
      recruitee_id: this.details["recruitee_id"],
      offer_accepted_by: "Applicant"
    }
    this.service.changeJobApplicantStatus(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.service.spinnerHide();
        this.closeStatusModal.nativeElement.click();
        Swal.fire({
          title: 'Status changed successfully.',
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
            this.getAllApplication();

          }
        })
      }
      else {
        this.service.spinnerHide();
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
      this.service.spinnerHide();
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

  get searchData() {
    return this.search_data;
  }

  set searchData(value) {
    this.search_data = value;
    this.applicationData = this.search_data ? this.filterList(this.search_data) : this.filterArray;
  }

  filterList(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.filterArray.filter((list: any) =>
      list.application_stage.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.application_no.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.job_title.toLocaleLowerCase().indexOf(filterby) !== -1
    );

  }

}
