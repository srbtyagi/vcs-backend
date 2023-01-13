import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import { ClientServiceService } from "./client-service.service";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  addClientForm: FormGroup;
  editClientForm: FormGroup;

  defaultStatus = 'active';
/*paginate */
public count:any = 20;
public page: any;
/**paginate  */

  allClients: any;
  clientId: any;
  moduleArray: any = [];


  constructor(public service: ClientServiceService, public fb: FormBuilder,public route: ActivatedRoute,
    public router: Router, public http: AdminService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);
    this.getClientDetailsAll();
    this.addClientForm = this.fb.group({
      client_name: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    });

    this.editClientForm = this.fb.group({
      edit_client: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    });
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
            case "COMPANY": {
              e.submodule_name_lower = "Company";
              e.routing = "/company";
              break;
            }
            case "DEPARTMENT": {
              e.submodule_name_lower = "Department";
              e.routing = "/department";
              break;
            }
            case "USER ROLE": {
              e.submodule_name_lower = "User Role";
              e.routing = "/user-role";
              break;
            }
            case "EMPLOYEE": {
              e.submodule_name_lower = "Employee";
              e.routing = "/employee";
              break;
            }
            case "CLIENT": {
              e.submodule_name_lower = "Client";
              e.routing = "/client";
              break;
            }
            case "DROPDOWN LIST": {
              e.submodule_name_lower = "Dropdown-List";
              e.routing = "/dropdown-list";
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
      document.getElementById("clsActive405").className = "active";
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

  /////////////

  getClientDetailsAll() {
    this.service.getClientsDetails().subscribe(r => {
      //console.log(r);
      this.allClients = r;
    });
  }

  insertClient() {
    const data = {
      client_name: this.addClientForm.controls.client_name.value
    };
    this.service.addClient(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Client Added successfully.',
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
            this.addClientForm.reset();
            this.getClientDetailsAll();
          }
        });
      }
      else {
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

    });
  }

  setClientId(value) {
    this.clientId = value.client_id;
    this.editClientForm.setValue({
      edit_client: value.client_name,
    });
    this.defaultStatus = value.client_status;
  }

  updateClient() {
    const data = {
      client_name: this.editClientForm.controls.edit_client.value,
      client_id: this.clientId
    };
    this.service.updateClient(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Client Updated successfully.',
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
            this.editClientForm.reset();
            this.getClientDetailsAll();
          }
        });
      }
      else {
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

    });
  }


  changeStatusClient() {
    const data = {
      client_status: this.defaultStatus,
      client_id: this.clientId
    };
    //console.log(data)
    this.service.changeStatusClient(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Status change successfully.',
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
            this.getClientDetailsAll();
          }
        });
      }
      else {
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

    });
  }

}
