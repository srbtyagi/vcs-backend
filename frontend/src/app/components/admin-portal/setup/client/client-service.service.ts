import {Injectable} from '@angular/core';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import Swall from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  header = new HttpHeaders().set('Authorization', 'Bearear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfbW9iIjoiODM2OTU2NDAwNSIsInVzZXJfcGFzc2NvZGUiOiJ1bmRlZmluZWQifSwiaWF0IjoxNjIyNDY5MTkzLCJhdWQiOiI4MzY5NTY0MDA1IiwiaXNzIjoiMTUuMjA3LjE5My4xMTYifQ.-Kp_kfLhj_L3bqRLOMYk44JAU_IfPgRr8-FgNRnL7ho');

  constructor(public http: HttpClient) {
  }


  getClientsDetails() {
    return this.http.get('https://vishusa.com/vcsapi/get/all/clients', {headers: this.header})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  } 


  addClient(details) {
    return this.http.post('https://vishusa.com/vcsapi/add/api/client/client_name', details, {headers: this.header})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateClient(details) {
    return this.http.post('https://vishusa.com/vcsapi/update/api/client_name', details, {headers: this.header})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  changeStatusClient(details) {
    return this.http.post('https://vishusa.com/vcsapi/edit/api/change_status/client', details, {headers: this.header})
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
