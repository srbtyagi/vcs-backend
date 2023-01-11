import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import Swall from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  c
  header = new HttpHeaders().set('Authorization', 'Bearear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfbW9iIjoiODM2OTU2NDAwNSIsInVzZXJfcGFzc2NvZGUiOiJ1bmRlZmluZWQifSwiaWF0IjoxNjIyNDY5MTkzLCJhdWQiOiI4MzY5NTY0MDA1IiwiaXNzIjoiMTUuMjA3LjE5My4xMTYifQ.-Kp_kfLhj_L3bqRLOMYk44JAU_IfPgRr8-FgNRnL7ho');

  constructor(public http: HttpClient) {
  }


  getAllEmployee() {
    return this.http.get('https://vishusa.com/vcsapi/get/all/employee/details', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllEmployeeDropDown() {
    return this.http.get('https://vishusa.com/vcsapi/get/Recruiter/all', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  dropDownRole() {
    return this.http.get('https://vishusa.com/vcsapi/get/all/role', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  dropDownDepartment() {
    return this.http.get('https://vishusa.com/vcsapi/get/all/dept', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  addEmployeeData(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/tbl/employee/details', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  checkUniqueEmail(details) {
    return this.http.post('https://vishusa.com/vcsapi/check/email', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  checkUniqueEmailforEdit(details) {
    return this.http.post('https://vishusa.com/vcsapi/check/email/edit', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  UpdateEmployeeData(details) {
    return this.http.post('https://vishusa.com/vcsapi/edit/api/employee', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  employeeChangeStatus(details) {
    return this.http.post('https://vishusa.com/vcsapi/edit/api/change_status/applicant/recruit_status', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  employeeResetPassword(details) {
    return this.http.post('https://vishusa.com/vcsapi/edit/api/change_password', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  employeeBlock(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/login_block_status', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  moduleSubModuleShow() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/user/access', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getDefaultAccessWEbData(details) {
    return this.http.post('https://vishusa.com/vcsapi/get/action_id_by_user_id', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  postWebAccess(details) {
    return this.http.post('https://vishusa.com/vcsapi/post/user_access_insert', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  moduleSubModuleShowApp() {
    return this.http.get('https://vishusa.com/vcsapi/get/app_action', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  supervisorCodeCheckApi(details) {
    return this.http.post('https://vishusa.com/vcsapi/check/supervisor_code', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getEmpDesignation() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/designation/dropdown/list', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }




  handleError(error: any) {
    let Swal: any = Swall;
    if (error.status == 0) {
      Swal.fire({
        text: 'No Internet Connection',
        type: 'error'
      }).then(() => {
        location.reload();
      })
    }
    else if (error.status == 400) {
      Swal.fire({
        text: 'Invalid Syntex',
        type: 'error'
      })
    }
    else if (error.status == 403) {
      Swal.fire({
        text: 'Unauthorized Access',
        type: 'error'
      })
    }
    else if (error.status == 404) {
      Swal.fire({
        text: 'URL Is Not Recognized',
        type: 'error'
      })
    }
    else if (error.status == 500) {
      Swal.fire({
        text: 'Internal Server Error',
        type: 'error'
      })
    }
    else if (error.status == 501) {
      Swal.fire({
        text: 'Not Implemented',
        type: 'error'
      })
    }
    else if (error.status == 503) {
      Swal.fire({
        text: 'Service Unavailable',
        type: 'error'
      })
    }
    else if (error.status == 511) {
      Swal.fire({
        text: 'Network Authentication Required',
        type: 'error'
      })
    }
    return throwError(error.statusText);
  }
}
