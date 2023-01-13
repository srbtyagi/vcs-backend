import { Component, OnInit } from '@angular/core';
import { UserRoleServiceService } from "./user-role-service.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {
  allUserRole: any;
  addUserRoleForm: FormGroup;
  editUserRoleForm: FormGroup;
  defaultStatus = 'active';
  /*paginate */
  public count: any = 20;
  public page: any;
  /**paginate  */

  userRoleID: any;

  assignAccessCheckBoxList = [];
  sortedModuleName: any;
  sortedModuleIds: any;

  accessRoleAllData: any = [];
  accessRoleAllDatacopy: any = [];

  defaultAccessShow = [];
  defaultAccessModuleNameShow: any = [];
  defaultAccessModuleIdShow: any;


  role: any;
  incentive_perc:any;

  duplicateCheck: any = false;

  moduleArray: any = [];

  constructor(public service: UserRoleServiceService, public fb: FormBuilder, public route: ActivatedRoute,
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
    this.getUserRoleDetailsAll();

    this.addUserRoleForm = this.fb.group({
      role: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      incentive_perc: new FormControl(null, [Validators.required]),
    });

    this.editUserRoleForm = this.fb.group({
      editRole: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      incentive_perc: new FormControl(null, [Validators.required]),
    });
    this.getAllModuleSubModule();

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
      document.getElementById("clsActive403").className = "active";
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

  getUserRoleDetailsAll() {
    this.service.getUserRoleDetails().subscribe(r => {
      //console.log(r);
      this.allUserRole = r;
    });
  }


  insertUserRole() {
    const data = {
      role_name: this.addUserRoleForm.controls.role.value,
      incentive_perc: this.addUserRoleForm.controls.incentive_perc.value
    };
    this.service.addUserRole(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'User Role Added successfully.',
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
            this.addUserRoleForm.reset();
            this.getUserRoleDetailsAll();
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

  setUSerRoleId(value) {
    this.role = null;
    this.userRoleID = value.role_id;
    this.tempRole = value.role_name;
    this.editUserRoleForm.setValue({
      editRole: value.role_name,
      incentive_perc: value.incentive_percentage
    });
    this.defaultStatus = value.role_status;
  }

  resetAddRole() {
    this.addUserRoleForm.reset();
    this.role = null;
  }

  updateUserRole() {
    const data = {
      role_name: this.editUserRoleForm.controls.editRole.value,
      role_id: this.userRoleID,
      incentive_perc: this.editUserRoleForm.controls.incentive_perc.value
    };
    this.service.updateUserRole(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'User Role Updated successfully.',
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
            this.editUserRoleForm.reset();
            this.getUserRoleDetailsAll();
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


  changeStatusUserRole() {
    const data = {
      role_status: this.defaultStatus,
      role_id: this.userRoleID
    };
    //console.log(data);
    this.service.changeStatusUserRole(data).subscribe(r => {
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
            this.getUserRoleDetailsAll();
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


  getAllModuleSubModule() {
    this.accessRoleAllData = [];
    this.accessRoleAllDatacopy = [];
    this.sortedModuleName = [];
    this.sortedModuleIds = null;
    this.service.moduleSubModuleShow().subscribe(r => {
      //console.log(r);
      let duplicateModuleName = [];
      let sortModulename: any;
      for (const key in r) {
        r[key].value = false;
        duplicateModuleName.push(r[key].module_id);
        this.accessRoleAllData.push(r[key]);
        this.accessRoleAllDatacopy.push(r[key]);

      }
      this.sortedModuleIds = duplicateModuleName.filter(function (item, index) {
        return duplicateModuleName.indexOf(item) === index;
      });
      for (const key in this.sortedModuleIds) {
        for (const keys in this.accessRoleAllData) {
          if (this.sortedModuleIds[key] === this.accessRoleAllData[keys].module_id) {
            this.sortedModuleName.push(this.accessRoleAllData[keys].module_name);
            break;
          }
        }

      }


    });
  }

  forCheckingNumber = 0;

  getList(ev, details) {
    if (ev.target.checked === true) {
      if (this.assignAccessCheckBoxList.length > 0) {
        for (const i in this.assignAccessCheckBoxList) {
          if (details.action_id !== this.assignAccessCheckBoxList[i].action_id) {
            this.forCheckingNumber += 1;
            if (this.forCheckingNumber === this.assignAccessCheckBoxList.length) {
              const data = {
                value: true,
                action_id: details.action_id
              };
              this.assignAccessCheckBoxList.push(data);
              this.forCheckingNumber = 0;

            }
          }
        }
      } else {
        const data = {
          value: true,
          action_id: details.action_id
        };
        this.assignAccessCheckBoxList.push(data);

      }
    }
    else if (ev.target.checked === false) {
      for (let i = 0; i < this.assignAccessCheckBoxList.length; i++) {
        if (this.assignAccessCheckBoxList[i].action_id === details.action_id) {
          this.assignAccessCheckBoxList.splice(i, 1);
        }
      }

    }
    //console.log(this.assignAccessCheckBoxList);
  }


  getDedfaultData(data) {
    this.assignAccessCheckBoxList = [];
    this.assignAccessCheckBoxList = [];
    this.userRoleID = data.role_id;
    this.accessRoleAllData = [];
    // setTimeout(r => {
    //   for (const key in this.accessRoleAllDatacopy) {
    //     this.accessRoleAllData.push(this.accessRoleAllDatacopy[key]);
    //     //console.log('here2')
    //   }
    // }, 400);
    const json = {
      role_id: data.role_id
    };
    //console.log(json);
    this.service.getDefaultRoleData(json).subscribe((r: any) => {
      //console.log(r);
      for (const key in this.accessRoleAllDatacopy) {
        this.accessRoleAllDatacopy[key].value = false;
        for (const keys in r) {
          if (this.accessRoleAllDatacopy[key].action_id === r[keys].action_id) {
            this.accessRoleAllDatacopy[key].value = true;
            const data = {
              value: true,
              action_id: r[keys].action_id
            };
            this.assignAccessCheckBoxList.push(data);
            //console.log('here');
          }
        }
        this.accessRoleAllData.push(this.accessRoleAllDatacopy[key]);
      }
    });

  }

  getDedfaultData2(data) {
    this.defaultAccessShow = [];
    this.defaultAccessModuleNameShow = [];
    this.defaultAccessModuleIdShow = null;
    const json = {
      role_id: data.role_id
    };
    this.service.getDefaultRoleData(json).subscribe((r: any) => {
      //console.log(r);
      let duplicateModuleId = [];
      for (const key in r) {
        r[key].value = false;
        duplicateModuleId.push(r[key].module_id);
        this.defaultAccessShow.push(r[key]);
      }
      this.defaultAccessModuleIdShow = duplicateModuleId.filter(function (item, index) {
        return duplicateModuleId.indexOf(item) === index;
      })


      for (const key in this.defaultAccessModuleIdShow) {
        for (const keys in this.defaultAccessShow) {
          if (this.defaultAccessModuleIdShow[key] === this.defaultAccessShow[keys].module_id) {
            this.defaultAccessModuleNameShow.push(this.defaultAccessShow[keys].module_name);
            break;
          }
        }

      }


    });

  }


  insertRoleData() {
    const data = {
      role_id: this.userRoleID,
      data: this.assignAccessCheckBoxList
    };
    //console.log(data);
    this.service.postAccessRole(data).subscribe(r => {
      //console.log(r);
      if (r === "check_value") {
        Swal.fire({
          title: 'Assign Access Updated Successfully.',
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

  tempRole: any;

  roleDuplicateCheck(value) {
    if (value != null) {
      const data = {
        role_name: value.toLowerCase().trim()
      };
      this.service.duplicateRoleCheck(data).subscribe((r: any) => {
        if (r.length > 0 && this.tempRole !== value) {
          this.duplicateCheck = true;
        } else {
          this.duplicateCheck = false;
        }
      });
    }
  }


}
