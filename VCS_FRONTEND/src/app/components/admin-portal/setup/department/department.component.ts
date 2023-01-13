import { Component, OnInit } from '@angular/core';
import { DepartmentServiceService } from "./department-service.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  addDeptForm: FormGroup;
  editDeptForm: FormGroup;
/*paginate */
public count:any = 20;
public page: any;
/**paginate  */
  defaultStatus = 'active';

  allDepartment: any;
  deptId: any;
  moduleArray: any = [];


  constructor(public service: DepartmentServiceService, public fb: FormBuilder,public route: ActivatedRoute,
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
    this.getDepartmentDetailsAll();

    this.addDeptForm = this.fb.group({
      dept: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    });

    this.editDeptForm = this.fb.group({
      editDept: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
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
      document.getElementById("clsActive402").className = "active";
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

  getDepartmentDetailsAll() {
    this.service.getDepartmentDetails().subscribe(r => {
      //console.log(r);
      this.allDepartment = r;
    });
  }

  insertDept() {
    const data = {
      dept_name: this.addDeptForm.controls.dept.value
    };
    this.service.addDepartment(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Department Added successfully.',
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
            this.addDeptForm.reset();
            this.getDepartmentDetailsAll();
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

  setDeptId(value) {
    this.deptId = value.dept_id;
    this.editDeptForm.setValue({
      editDept: value.dept_name,
    });
    this.defaultStatus = value.dept_status;
  }

  updateDept() {
    const data = {
      dept_name: this.editDeptForm.controls.editDept.value,
      dept_id: this.deptId
    };
    this.service.updateDepartment(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Department Updated successfully.',
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
            this.editDeptForm.reset();
            this.getDepartmentDetailsAll();
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


  changeStatusDept() {
    const data = {
      dept_status: this.defaultStatus,
      dept_id: this.deptId
    };
    //console.log(data)
    this.service.changeStatusDept(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Status Change successfully.',
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
            this.getDepartmentDetailsAll();
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
