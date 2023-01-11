import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import Swall from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class DropdownServiceService {

  header = new HttpHeaders().set('Authorization', 'Bearear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfbW9iIjoiODM2OTU2NDAwNSIsInVzZXJfcGFzc2NvZGUiOiJ1bmRlZmluZWQifSwiaWF0IjoxNjIyNDY5MTkzLCJhdWQiOiI4MzY5NTY0MDA1IiwiaXNzIjoiMTUuMjA3LjE5My4xMTYifQ.-Kp_kfLhj_L3bqRLOMYk44JAU_IfPgRr8-FgNRnL7ho');

  constructor(public http: HttpClient) {
  }

  getApiProfession() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/profession', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getApiSpeciality() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/speciality', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getApiJobSector() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/job_sector', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getApiPositionType() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/position_type', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getApiJobType() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/job_type', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getApiSystemName() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/system_name/all', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  getApiDesignation() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/designation/all', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  getApiStandardDocument() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/tbl/standard_document/all', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  /// add api

  addApiProfession(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/tbl/profession', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addApiSpeciality(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/tbl/speciality', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addApiJobSector(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/tbl/job_sector', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addApiPositionType(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/tbl/position_type', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addApiJobType(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/tbl/job_type', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addApiSystemName(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/name/tbl/system_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addApiDocumentName(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/name/tbl/standard_document', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  addApiDesignationName(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/tbl/designation', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }



  /// edit api


  editApiProfession(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/profession_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  editApiSpeciality(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/speciality_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  editApiJobSector(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/job_sector_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  editApiPositionType(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/position_type_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  editApiJobType(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/job_type_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  editApiSystemName(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/name/tbl/system_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  editApiStandardDocument(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/name/tbl/standard_document', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  editApiDesignation(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/designation_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }




  /// status change

  statusApiProfession(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/profession_status', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  statusApiSpeciality(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/speciality_status', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  statusApiJobSector(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/job_sector_status', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  statusApiPositionType(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/position_type_status', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  statusApiJobType(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/job_type_status', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  statusApiSystemName(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/status/tbl/system_name', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  statusApiStandardDocument(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/status/tbl/standard_document', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  statusApiDesignation(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/designation_status', details, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  checkUniqueDesignation(desg) {
    return this.http.get(`https://vishusa.com/vcsapi/checkIfExists/designation/${desg}`, { headers: this.header })
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
