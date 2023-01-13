import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { IDayCalendarConfig } from 'ng2-date-picker';
import * as moment from 'moment';

@Component({
  selector: 'app-hired-applicant',
  templateUrl: './hired-applicant.component.html',
  styleUrls: ['./hired-applicant.component.css']
})
export class HiredApplicantComponent implements OnInit {
  @ViewChild('changeStatusclose', { static: false }) private changeStatusclose: ElementRef;
   /*paginate */
   public count:any = 20;
   public page: any;
   /**paginate  */
  moduleArray: any = [];
  applicationList: any = [];

  client_id: any = "ALL";
  job_id: any = "ALL";
  status: any = "ALL";

  clientList: any = [];
  details: any;
  user_id: any;
  fac_specc_doc: any = [];
  others_doc: any = [];
  standard_doc: any = [];
  jobList: any = [];

  showDivPdf: boolean = false;
  assignment_status: any = "";
  effective_date: any;
  effective_end_date: any;
  datePickerConfig = <IDayCalendarConfig>{
    drops: 'up',
    format: 'MM/DD/YYYY'
  }
  user_id_by: any;
  excelfileName: any;
  clientListFilter: any = [];
  clientListShow: boolean = false;
  clientName: any = "ALL";
  jobListFilter: any = "";

  constructor(public http: AdminService, public route: ActivatedRoute, public router: Router) {
    this.user_id_by = sessionStorage.getItem("user_id");
    this.excelfileName = "hired_applicant_report(" + moment(new Date).format("MM-DD-YYYY") + ")";
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    this.getClients();
    if (this.client_id === "ALL" && this.job_id === "ALL" && this.status === "ALL") {
      this.searchJob();
    }
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);
  }
  /////////////////////////////
  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }
  ///////////////////////
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
            case "APPLICANT": {
              e.submodule_name_lower = "Applicants";
              e.routing = "/applicants";
              break;
            }
            case "ASSIGN MANAGERS": {
              e.submodule_name_lower = "Assign Manager";
              e.routing = "/assign-Manager";
              break;
            }
            case "JOB APPLICATION": {
              e.submodule_name_lower = "Job Application";
              e.routing = "/job-applications_admin";
              break;
            }
            case "ONBOARDING & HIRING": {
              e.submodule_name_lower = "On Boarding";
              e.routing = "/onboarding-hiring";
              break;
            }
            case "HIRED": {
              e.submodule_name_lower = "Hired";
              e.routing = "/hired-applicant";
              break;
            }
            case "SKILLSET": {
              e.submodule_name_lower = "Skill Set";
              e.routing = "/skill-set-admin";
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
      document.getElementById("clsActive204").className = "active";
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
  ///////////////////////

  getClients() {
    this.http.getClientHired().subscribe((res: any) => {
      //console.log(res)
      this.clientList = res;
      this.clientListFilter = res;
    });
  }

  selectclientName(val) {
    //console.log(val)
    this.client_id = val.client_id;
    this.clientName = val.client_name;
    this.clientListShow = false;
    if (val !== "ALL") {
      let data = {
        client_id: val.client_id
      }
      this.http.getJobByClient(data).subscribe((res: any) => {
        //console.log(res)
        this.jobList = res;
        this.jobListFilter = res;
      });
    }

  }

  focusClientList() {
    this.clientListShow = true;
  }

  searchClient(ev) {
    //console.log(this.clientName)
    let search_data = this.clientName;
    this.clientList = search_data ? this.filterListClient(search_data) : this.clientListFilter;
  }

  filterListClient(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.clientListFilter.filter((list: any) =>
      list.client_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }


  searchJob() {
    this.http.spinnerShow();
    this.clientListShow = false;
    this.applicationList = [];
    //console.log(this.client_id, this.job_id, this.status)
    if (this.clientName.toLowerCase() === "all") {
      this.client_id = "ALL";
    }
    let data = {
      client_id: this.client_id,
      job_id: this.job_id,
      status: this.status
    }
    this.http.searchHiredAppl(data).subscribe((res: any) => {
      //console.log(res);
      if (res.length !== 0) {
        this.applicationList = res;
        this.http.spinnerHide();
      }
      else {
        this.http.spinnerHide();
        this.errorMsg('No search result found!');
      }
    }, err => {
      this.http.spinnerHide();
      this.errorMsg('Something went wrong,please try again.');
    });
  }

  openFinish(val) {
    //console.log(val)
    this.details = "";
    this.details = val;
    this.user_id = val.user_id;
    this.assignment_status = val.assignment_status;
    this.effective_date = moment(val.proposed_start_date).format("MM/DD/YYYY");
    this.effective_end_date = moment(val.proposed_end_date).format("MM/DD/YYYY");
  }

  openAssignment(val) {
    //console.log(val)
    this.details = "";
    this.details = val;
    this.user_id = val.user_id;
    this.getAllDocs(this.user_id);
  }

  getAllDocs(user_id) {
    this.fac_specc_doc = [];
    this.others_doc = [];
    this.standard_doc = [];
    this.http.getAllDocs(user_id).subscribe((res: any) => {
      //console.log(res);
      for (let a of res) {
        if (a.rec_doc_status === "current") {
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

      }
    });
    //console.log(this.standard_doc, this.fac_specc_doc, this.others_doc)
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

  changeStatus() {
    let data = {
      assignment_id: this.details.assignment_id,
      assignment_status: this.assignment_status,
      effective_date: moment(this.effective_date).format("MM/DD/YYYY"),
      closing_date: moment(this.effective_end_date).format("MM/DD/YYYY"),
    }
    this.http.changeAssignmentStatus(data).subscribe((res: any) => {
      //console.log(res);
      if (res === "success") {
        this.successMsg("Status changed successfully.");
        this.changeStatusclose.nativeElement.click();
      }
      else {
        this.errorMsg('Something went wrong,please try again.');
      }
    }, err => {
      this.errorMsg('Something went wrong,please try again.');
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
        this.searchJob();

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
