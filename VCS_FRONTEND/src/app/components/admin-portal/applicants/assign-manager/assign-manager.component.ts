import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-assign-manager',
  templateUrl: './assign-manager.component.html',
  styleUrls: ['./assign-manager.component.css']
})
export class AssignManagerComponent implements OnInit {
  @ViewChild('assignRecClose', { static: false }) private assignRecClose: ElementRef;
  @ViewChild('assignOnClose', { static: false }) private assignOnClose: ElementRef;
  @ViewChild('assignTeamClose', { static: false }) private assignTeamClose: ElementRef;
  @ViewChild('assignManagerClose', { static: false }) private assignManagerClose: ElementRef;
  /*paginate */
  public count: any = 20;
  public page: any;
  /**paginate  */
  moduleArray: any[];
  clientList: any;
  applicantList: any;
  employeeList: any;
  client_id: any = "ALL";
  applicant: any = "ALL";
  vcs_person: any = "ALL";
  assign_recruiter: any;
  assign_onboardMgr: any;
  assign_teamlead: any;
  assign_manager: any;
  applicationList: any = [];
  details: any;
  user_id_by: any;
  excelfileName: any;
  clientListFilter: any = [];
  clientListShow: boolean = false;
  clientName: any = "ALL";
  applicantListFilter: any = [];
  applicantListShow: boolean = false;
  applicantName: any = "ALL";
  empListFilter: any = [];
  empListShow: boolean = false;
  vcs_person_name: any = "ALL";
  vcsempListShow: boolean = false;
  assign_vcs_emp_name: any = "";

  constructor(public http: AdminService, public route: ActivatedRoute, public router: Router, public fb: FormBuilder) {
    this.user_id_by = sessionStorage.getItem("user_id");
    this.excelfileName = "Assign-Manager-Report(" + moment(new Date).format("MM-DD-YYYY") + ")";
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    this.getClients();
    this.getEmployee();
    this.getAllApplicant();
    this.getUserRoleDetailsAll();
    if (this.client_id === "ALL" && this.applicant === "ALL" && this.vcs_person === "ALL") {
      this.searchJob();
    }
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);
  }
  /////////////////////////////
  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
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
            case "ASSIGN MANAGERS": {
              e.submodule_name_lower = "Assign Manager";
              e.routing = "/assign-Manager";
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
      document.getElementById("clsActive205").className = "active";
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
    this.http.getClientOnBoard().subscribe((res: any) => {
      //console.log(res)
      this.clientList = res;
      this.clientListFilter = res;
    });
  }

  focusClientList() {
    this.clientListShow = true;
  }

  // selectclientName(val) {
  //   this.client_id = val.client_id;
  //   this.clientName = val.client_name;
  //   this.clientListShow = false;
  // }

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

  getEmployee() {
    this.http.getAllEmployee().subscribe((res: any) => {
      //console.log(res)
      this.employeeList = res;
      this.empListFilter = res;
    });
  }

  getAllApplicant() {
    this.applicantList = [];
    this.http.getAllApplicant().subscribe((res: any) => {
      //console.log(res)
      this.applicantList = res;
      this.applicantListFilter = res;
    });
  }

  focusApplicantList() {
    this.applicantListShow = true;
  }

  selectApplicantName(val) {
    this.applicant = val.user_id;
    if (val.user_middle_name) {
      this.applicantName = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    } else {
      this.applicantName = val.user_first_name + ' ' + val.user_last_name;
    }
    this.applicantListShow = false;
  }

  searchApplicant(ev) {
    //console.log(this.applicantName)
    let search_data = this.applicantName;
    this.applicantList = search_data ? this.filterListApplicant(search_data) : this.applicantListFilter;
  }

  filterListApplicant(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.applicantListFilter.filter((list: any) =>
      list.user_first_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.user_last_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }

  focusEmpList() {
    this.empListShow = true;
  }

  selectEmpName(val) {
    this.vcs_person = val.user_id;
    if (val.user_middle_name) {
      this.vcs_person_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    } else {
      this.vcs_person_name = val.user_first_name + ' ' + val.user_last_name;
    }
    this.empListShow = false;
  }

  searchEmployee(ev) {
    //console.log(this.vcs_person_name)
    let search_data = this.vcs_person_name;
    this.employeeList = search_data ? this.filterListEmp(search_data) : this.empListFilter;
  }

  filterListEmp(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.empListFilter.filter((list: any) =>
      list.user_first_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.user_last_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }

  selectclientName(val) {
    this.applicantList = [];
    this.client_id = val.client_id;
    this.clientName = val.client_name;
    this.clientListShow = false;
    //console.log(val)
    if (this.clientName === "ALL") {
      this.getAllApplicant();
    }
    else {
      let data = {
        client_id: val.client_id
      }
      this.http.getApplicantByClient(data).subscribe((res: any) => {
        //console.log(res)
        this.applicantList = res;
        this.applicantListFilter = res;
      });
    }

  }

  searchJob() {
    this.empListShow = false;
    this.applicantListShow = false;
    this.clientListShow = false;
    if (this.client_id !== "" && this.applicant !== "") {
      this.http.spinnerShow();
      this.applicationList = [];
      if (this.clientName.toLowerCase() === "all") {
        this.client_id = "ALL";
      }
      if (this.vcs_person_name.toLowerCase() === "all") {
        this.vcs_person = "ALL";
      }
      if (this.applicantName.toLowerCase() === "all") {
        this.applicant = "ALL";
      }
      let data = {
        client_id: this.client_id,
        user_id: this.applicant,
        manager_id: this.vcs_person
      }
      this.http.getSearchMgrApplication(data).subscribe((res: any) => {
        //console.log(res)
        this.applicationList = res;
        this.http.spinnerHide();
        if (this.applicationList.length === 0) {
          this.http.spinnerHide();
          this.errorMsg("No search result found!")
        }
        else if (res === "clients data not found") {
          this.http.spinnerHide();
          this.errorMsg("Something went wrong. Please Try Again.");
        }
        else if (res === "err") {
          this.http.spinnerHide();
          this.errorMsg("Something went wrong. Please Try Again.");
        }
        else {
          this.http.spinnerHide();
        }

      }, err => {
        this.http.spinnerHide();
        this.errorMsg("Something went wrong. Please Try Again.");
      });
    }
    else {
      this.errorMsg("Select both client and applicant");
    }

  }

  existRoleUser: any = [];
  getRolesByAppl(val) {
    this.existRoleUser = [];
    let data = {
      application_id: val.application_id
    }
    this.http.getRolesByApplication(data).subscribe((res) => {
      // //console.log(res);
      this.existRoleUser = res;
      for (let i = 0; i < this.allUserRole.length; i++) {
        for (let j = 0; j < this.existRoleUser.length; j++) {
          if (Number(this.allUserRole[i].role_id) === Number(this.existRoleUser[j].user_role_id)) {
            // //console.log(Number(this.allUserRole[i].role_id))
            this.allUserRole[i].selected_emp = this.existRoleUser[j].user_id;
          }
        }
      }
      //console.log(this.allUserRole)
    });
  }

  openModal(val) {

    this.vcsempListShow = false;
    this.assign_vcs_emp_name = "";
    this.details = "";
    this.details = val;
    this.getRolesByAppl(val);
    this.assign_recruiter = val.recruiter_id;
    this.assign_onboardMgr = val.onb_mgr_id;
    this.assign_teamlead = val.team_lead_id;
    this.assign_manager = val.manager_id;
    //console.log(this.details)
    // for (let i = 0; i < this.allUserRole.length; i++) {
    //   // let index = this.allUserRole.findIndex(j => Number(j.role_id) === Number(this.employeeList[i].role_id));
    //   // //console.log(index)
    //   for (let j = 0; j < this.employeeList.length; j++) {

    //   }

    // }
  }


  checkBoxSelect(val, index) {
    let id: any = document.getElementById("Day" + index);
    //console.log(id.checked)
    if (id.checked === true) {
      val.employeeArray = [];
      for (let j = 0; j < this.employeeList.length; j++) {
        if (Number(this.employeeList[j].role_id) === Number(val.role_id)) {
          val.employeeArray.push(this.employeeList[j]);
        }
      }
      val.dropdownShow = true;
    }
    else if (id.checked === false) {
      val.employeeArray = [];
      val.dropdownShow = false;
    }

    //console.log(this.allUserRole)
  }


  selectEmployee(val, emp) {
    //console.log(val, emp)
    val.selected_emp = emp;
    //console.log(this.allUserRole)
  }

  addManagers(val) {
    if (Number(val.role_id) === 1) {
      // admin
      this.submitManager(val);
    }
    else if (Number(val.role_id) === 5) {
      // recruiter
      this.submitRecruiter(val);
    }
    else if (Number(val.role_id) === 9) {
      // on-boarding
      this.submitOnbordMgr(val);
    }
    else if (Number(val.role_id) === 10) {
      // team lead
      this.submitOTeamLead(val);
    }
    else {
      // others
      this.submitManagerOthers(val);
    }
  }

  focusVCsEmpList() {
    this.vcsempListShow = true;
  }

  selectVCSReqName(val) {
    this.assign_recruiter = val.user_id;
    //console.log(this.assign_recruiter)
    if (val.user_middle_name) {
      this.assign_vcs_emp_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    } else {
      this.assign_vcs_emp_name = val.user_first_name + ' ' + val.user_last_name;
    }
    this.vcsempListShow = false;
  }

  selectVCSOnbMgrName(val) {
    this.assign_onboardMgr = val.user_id;
    //console.log(this.assign_onboardMgr)
    if (val.user_middle_name) {
      this.assign_vcs_emp_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    } else {
      this.assign_vcs_emp_name = val.user_first_name + ' ' + val.user_last_name;
    }
    this.vcsempListShow = false;
  }

  selectVCSTeamLeadName(val) {
    this.assign_teamlead = val.user_id;
    //console.log(this.assign_teamlead)
    if (val.user_middle_name) {
      this.assign_vcs_emp_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    } else {
      this.assign_vcs_emp_name = val.user_first_name + ' ' + val.user_last_name;
    }
    this.vcsempListShow = false;
  }

  selectVCSManagerName(val) {
    this.assign_manager = val.user_id;
    //console.log(this.assign_manager)
    if (val.user_middle_name) {
      this.assign_vcs_emp_name = val.user_first_name + ' ' + val.user_middle_name + ' ' + val.user_last_name;
    } else {
      this.assign_vcs_emp_name = val.user_first_name + ' ' + val.user_last_name;
    }
    this.vcsempListShow = false;
  }

  searchVCSEmployee(ev) {
    //console.log(this.assign_vcs_emp_name)
    let search_data = this.assign_vcs_emp_name;
    this.employeeList = search_data ? this.filterListEmpVCS(search_data) : this.empListFilter;
  }

  filterListEmpVCS(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.empListFilter.filter((list: any) =>
      list.user_first_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.user_last_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }

  submitRecruiter(val) {
    //this.vcsempListShow = false;
    let data = {
      application_id: this.details.application_id,
      user_id: val.selected_emp,
      role_id: val.role_id,
      incentive_percentage: val.incentive_percentage,
      recruitee_id: this.details.recruitee_id
    }
    // //console.log(data)
    this.http.assignRecruiter(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Recruiter assigned successfully.");
        this.assignRecClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  submitOnbordMgr(val) {
    //this.vcsempListShow = false;
    let data = {
      application_id: this.details.application_id,
      user_id: val.selected_emp,
      role_id: val.role_id,
      incentive_percentage: val.incentive_percentage,
      recruitee_id: this.details.recruitee_id
    }
    this.http.assignOnboardMgr(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Onboard manager assigned successfully.");
        this.assignOnClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  submitOTeamLead(val) {
    //this.vcsempListShow = false;
    let data = {
      application_id: this.details.application_id,
      user_id: val.selected_emp,
      role_id: val.role_id,
      incentive_percentage: val.incentive_percentage,
      recruitee_id: this.details.recruitee_id
    }
    this.http.assignTeamLead(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Team-Lead assigned successfully.");
        this.assignTeamClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  submitManager(val) {
    //this.vcsempListShow = false;
    let data = {
      application_id: this.details.application_id,
      user_id: val.selected_emp,
      role_id: val.role_id,
      incentive_percentage: val.incentive_percentage,
      recruitee_id: this.details.recruitee_id
    }
    this.http.assignManager(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Manager assigned successfully.");
        this.assignManagerClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  submitManagerOthers(val) {
    //this.vcsempListShow = false;
    let data = {
      application_id: this.details.application_id,
      user_id: val.selected_emp,
      role_id: val.role_id,
      incentive_percentage: val.incentive_percentage,
      recruitee_id: this.details.recruitee_id
    }
    this.http.assignOthers(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "success") {
        this.successMsg("Assigned successfully.");
        this.assignManagerClose.nativeElement.click();
      }
      else {
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  //**********************************//

  allUserRole: any = [];
  getUserRoleDetailsAll() {
    this.allUserRole = [];
    this.http.getUserRoleDetails().subscribe((r: any) => {
      // //console.log(r);
      r.forEach(e => {
        //console.log(e.role_status)
        if (e.role_status === "active") {
          e.value = false;
          e.employeeArray = [];
          e.dropdownShow = false;
          this.allUserRole.push(e);

        }
      });
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
