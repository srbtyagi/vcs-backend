import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import Swall from 'sweetalert2';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecruiteeService {

  header = new HttpHeaders().set('Authorization', 'Bearear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfbW9iIjoiODM2OTU2NDAwNSIsInVzZXJfcGFzc2NvZGUiOiJ1bmRlZmluZWQifSwiaWF0IjoxNjIyNDY5MTkzLCJhdWQiOiI4MzY5NTY0MDA1IiwiaXNzIjoiMTUuMjA3LjE5My4xMTYifQ.-Kp_kfLhj_L3bqRLOMYk44JAU_IfPgRr8-FgNRnL7ho');

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }


  handleError(error: any) {
    let Swal: any = Swall;
    //console.log(error);
    if (error.status == 0) {
      Swal.fire({
        title: 'Something went wrong. Please Try Again.',
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
      }).then(() => {
        location.reload();
      })
    }
    else if (error.status == 400) {

      Swal.fire({
        title: 'Invalid Syntax',
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
      })
    }
    else if (error.status == 403) {

      Swal.fire({
        title: 'Unauthorized Access',
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
      })
    }
    else if (error.status == 404) {

      Swal.fire({
        title: 'URL Is Not Recognized',
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
      })
    }
    else if (error.status == 500) {

      Swal.fire({
        title: 'Internal Server Error',
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
      })
    }
    else if (error.status == 501) {

      Swal.fire({
        title: 'Not Implemented',
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
      })
    }
    else if (error.status == 503) {

      Swal.fire({
        title: 'Service Unavailable',
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
      })
    }
    else if (error.status == 511) {

      Swal.fire({
        title: 'Network Authentication Required',
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
      })
    }
    return throwError(error.statusText);
  }



  spinnerShow() {
    //console.log("g")
    this.spinner.show(undefined,
      {
        type: 'ball-square-clockwise-spin',
        size: 'medium',
        bdColor: "rgba(0, 0, 0, 0.8)",
        color: '#4C96D7',
        fullScreen: true
      }
    );
    //console.log("h")
  }

  spinnerHide() {
    this.spinner.hide();
  }

  token(datas) {
    //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get_token', datas)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  login(datas) {
    //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/api/login/user', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  register(datas, d1, d2) {
    // //console.log(datas)
    return this.http.post(`https://vishusa.com/vcsapi/api/updateOrInsert/registration/user/${d1}/${d2}`, datas)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateUserData(datas) {
    // //console.log(datas)
    return this.http.post(`https://vishusa.com/vcsapi/update/api/rec_details/and/recudetails`, datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  forgotPass(datas) {
    //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/api/forgot/user/password', datas)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  uploadFile(datas, user) {
    // //console.log(datas)
    return this.http.post(`https://vishusa.com/vcsapi/upload/resume/${user}`, datas, { reportProgress: true, observe: "events", headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  uploadFileRegister(datas, d1, d2) {
    // //console.log(datas)
    return this.http.post(`https://vishusa.com/vcsapi/upload/registration_api/resume/${d1}/${d2}`, datas, { reportProgress: true, observe: "events", headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  uploadFileRegisterGuest(datas, d1, d2, d3) {
    // //console.log(datas)
    return this.http.post(`https://vishusa.com/vcsapi/upload/registration_api/resume/guest/${d1}/${d2}/${d3}`, datas, { reportProgress: true, observe: "events", headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  check_email(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/check/email', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  check_email_register(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/check/email/register', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  check_email_old(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/check/email/edit', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  check_old_password(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/check/api/new/password', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  check_old_passcode(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/check/api/new/passcode', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  change_password(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/update/api/new/password/not/autogenerated', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  change_passcode(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/update/api/new/passcode/not/autogenerated', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllProfession() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/profession', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllSpeciality() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/speciality', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllJob(datas) {
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/tbl/job/search_job/with/filter', datas, { headers: this.header })
    return data;
  }

  getUserById(id) {
    return this.http.post('https://vishusa.com/vcsapi/get/api/users', id, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getCandidateByUserId(id) {
    return this.http.post('https://vishusa.com/vcsapi/get/api/candidate/by/userID', id, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUserRecruiteeById(id) {
    return this.http.get(`https://vishusa.com/vcsapi/get/api/allrecruiteedetails/${id}`, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  add_applicant(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/insert/api/tbl/application', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  add_applicant_guest(datas, exist) {
    //console.log(datas)
    return this.http.post(`https://vishusa.com/vcsapi/api/updateOrInsert/registration/user/application/guest/${exist}/${datas.user_id}`, datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  add_applicant_guest_By_email(datas) {
    //console.log(datas)
    return this.http.post(`https://vishusa.com/vcsapi/api/updateOrInsert/registration/user/application/guest/ByEmail`, datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  check_resume(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/check/resume', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getApplicationById(id) {
    // //console.log(id)
    return this.http.post('https://vishusa.com/vcsapi/get/api/application/user_id', id, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllDocs(datas) {
    return this.http.get(`https://vishusa.com/vcsapi/get/uploaded/document/list/current/${datas}`, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getCurrentReqDocs(datas) {
    return this.http.get(`https://vishusa.com/vcsapi/get/required/doc/${datas}`, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllDocuments(datas) {
    return this.http.get(`https://vishusa.com/vcsapi/get/uploaded/document/list/${datas}`, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  uploadDoc(datas, user, doc_id, doc_name, expiry_date) {
    //console.log("abc", datas, user, doc_id, doc_name)
    return this.http.post(`https://vishusa.com/vcsapi/upload/document/${doc_name}/${user}/${doc_id}/${expiry_date}`, datas, {
      reportProgress: true, observe: "events",
      headers: this.header
    })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getDocumentType() {
    return this.http.get('https://vishusa.com/vcsapi/api/get/standard/document/data', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  changeJobApplicantStatus(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/update/api/application_stage/byJobID/offer/accepted/OR/rejected', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  delete_temp_registration(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/delete/temp/registration', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getApplicationOnboard(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get/application/onboarding/user', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getStandardDocDetails(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/api/get/standard/document/by/doc_id', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getStandardDocbyIdDetails(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get/api/standard/docby/IDs', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getFacilityDocbyNameDetails(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get/api/facility/doc/byname', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getOthersDocbyNameDetails(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get/api/other/doc/byname', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getdocBydoc_name(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get/doc_id/other/or/facility', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateFillup(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/update/fillup/status/done', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateReqDocStatus(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/update/req/doc/status', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  geAllJobSector() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/job_sector', { headers: this.header })
    return data;
  }

  getClientDetails() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/assignment/and/client/data', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getYearDetails() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/account_file/year', { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getMonthDetails(year) {
    return this.http.get(`https://vishusa.com/vcsapi/get/api/tbl/account_file/month/${year}`, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAssignmentDetails(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/api/get/payroll/assignment', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getAssignmentPayrollDetails(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get/assignmentdata/assignment_history/filtered', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getJobIdDetails(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/api/get/job_no/assignment_id/and/job_id', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getWorkDetails(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/api/get/tbl_week/week_id/not/in/tbl_rec_work_hr', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  insertWorkHour(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/api/insert/tbl_rec_work_hr', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getAssignmentDataByapplication(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get/api/payroll_status/approved/assgnmnt_status/workingORclosed/by/applID', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  geAllJobCategory_Area() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/skill_area/byall/activecatID', { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  geAllJobDomain_skillset(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/get/api/skill_domain/skillset/by/skill_area_id', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  geAllSkillCategoryByuserId(datas) {
    // //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/skilldata/by/user_id', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getRecruiteeStatus(datas) {
    return this.http.post('https://vishusa.com/vcsapi/get/recruitee/status/by/user_id', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getAlreadyAppliedStatus(datas) {
    return this.http.post('https://vishusa.com/vcsapi/get/user/already/applied/job', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getAlreadyAppliedStatusByEmail(datas) {
    return this.http.post('https://vishusa.com/vcsapi/get/user/already/applied/job/ByEmail', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updatePassword(datas) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/new/password/not/autogenerated', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updatePasscode(datas) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/new/passcode/not/autogenerated', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  insertCandidate(datas) {
    return this.http.post('https://vishusa.com/vcsapi/insert/api/canditate/skillset_map/data', datas, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getJobDetailsById(id) {
    return this.http.post('https://vishusa.com/vcsapi/get/api/tbl/job/by/id', id, { headers: this.header }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }




}
