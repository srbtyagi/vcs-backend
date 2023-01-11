import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IDayCalendarConfig } from 'ng2-date-picker';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import { EmployeeServiceService } from "./employee-service.service";
import * as moment from 'moment';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  defaultStatus = 'active';
  defaultSignatory: any = 'no';
  defaultSignatory2: any = 'no';

  defaultBlockUser = 'block';
  /*paginate */
  public count: any = 20;
  public page: any;
  /**paginate  */

  employeeData: any;
  filterArray: any = [];
  search_data: any;

  showRole: any;
  showDepartment: any;

  employeeAddFrom: FormGroup;
  employeeEditFrom: FormGroup;

  formBindDataEdit: any;
  employeeUserId: any;

  //// access work

  accessWebAllData: any = [];
  accessWebAllDataCopy: any = [];

  sortedModuleName: any = [];
  sortedModuleIds: any;
  assignAccessCheckBoxList: any = [];
  forCheckingNumber = 0;

  /// view Details

  empName: any;
  empCode: any;
  empRole: any;
  empDesignation: any;
  empDepartment: any;
  empEmail: any;
  empPhone: any;
  EmpDataOfJoining: any;
  supervisorName: any;
  EmpSignatory: any;

  moduleArray: any = [];

  dropDownEmpList: any;
  datePickerConfig = <IDayCalendarConfig>{
    drops: 'up',
    format: 'MM/DD/YYYY'
  }
  old_email: any;
  user_id: string;
  excelfileName: string;
  DesignationList: any = [];
  dropDownEmpListFilter: any = [];
  empList: boolean = false;
  sup_id: any = "";
  empList2: boolean = false;


  constructor(public service: EmployeeServiceService, public fb: FormBuilder, public route: ActivatedRoute,
    public router: Router, public http: AdminService) {
    this.user_id = sessionStorage.getItem("user_id");
    this.excelfileName = "employee_report(" + moment(new Date).format("MM-DD-YYYY") + ")";
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
    this.allEmployees();
    this.getDropDownRole();
    this.getDropDownDepartment();
    this.getAllModuleSubModule();
    this.getAllModuleSubModuleApp();
    this.getAllRecruiter();
    this.getempDesignations();

    this.employeeAddFrom = this.fb.group({
      first_name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      middle_name: new FormControl('', [Validators.maxLength(100)]),
      last_name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      employee_code: new FormControl('', [Validators.maxLength(30)]),
      role: new FormControl("", [Validators.required]),
      designation: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      department: new FormControl("", [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.email, Validators.maxLength(40), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      phoneCode: new FormControl('', [Validators.min(1), Validators.max(999999)]),
      phone: new FormControl('', [Validators.min(10000000), Validators.max(9999999999999)]),
      joiningDate: new FormControl('', [Validators.maxLength(80), Validators.required]),
      supervisorName: new FormControl('', [Validators.maxLength(80), Validators.required]),
    });

    this.employeeEditFrom = this.fb.group({
      first_name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      middle_name: new FormControl('', [Validators.maxLength(100)]),
      last_name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      employee_code: new FormControl('', [Validators.maxLength(30)]),
      role: new FormControl("", [Validators.required]),
      designation: new FormControl('', [Validators.maxLength(100)]),
      department: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.email, Validators.maxLength(40), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      phoneCode: new FormControl('', [Validators.min(1), Validators.max(999999)]),
      phone: new FormControl('', [Validators.min(10000000), Validators.max(9999999999999)]),
      joiningDate: new FormControl('', [Validators.maxLength(80), Validators.required]),
      supervisorName: new FormControl('', [Validators.maxLength(80), Validators.required]),
    });


  }

  /////////////////////////////
  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }
  ///////////////////////

  getAllRecruiter() {
    this.service.getAllEmployeeDropDown().subscribe(r => {
      //console.log(r);
      this.dropDownEmpList = r;
      this.dropDownEmpListFilter = r;
    });
  }

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
      document.getElementById("clsActive404").className = "active";
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

  allEmployees() {
    this.service.getAllEmployee().subscribe(r => {
      //console.log(r);
      this.employeeData = r;
      this.filterArray = r;
    });
  }

  onOptionsSelectedEmp(value: any) {
    //console.log(value);
    this.sup_id = value.user_id;
    if (value.user_middle_name) {
      this.employeeAddFrom.controls['supervisorName'].setValue(value.user_first_name + ' ' + value.user_middle_name + ' ' + value.user_last_name);
    }
    else {
      this.employeeAddFrom.controls['supervisorName'].setValue(value.user_first_name + ' ' + value.user_last_name);
    }

    this.empList = false;
  }

  focusInputEmp() {
    this.empList = true;
  }

  searchEmp(ev) {
    //console.log(ev.target.value)
    let search_data = ev.target.value;
    this.dropDownEmpList = search_data ? this.filterListEmp(search_data) : this.dropDownEmpListFilter;
  }

  filterListEmp(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.dropDownEmpListFilter.filter((list: any) =>
      list.user_first_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.user_last_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.designation_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }



  getDropDownRole() {
    this.service.dropDownRole().subscribe(r => {
      //console.log(r);
      this.showRole = r;
    });
  }

  getDropDownDepartment() {
    this.service.dropDownDepartment().subscribe(r => {
      //console.log(r);
      this.showDepartment = r;
    });
  }


  get searchData() {
    return this.search_data;
  }

  set searchData(value) {
    this.search_data = value;
    this.employeeData = this.search_data ? this.filterList(this.search_data) : this.filterArray;
  }

  filterList(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.filterArray.filter((list: any) =>
      list.user_first_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      // list.employee_code.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.user_last_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );

  }


  submitAddEmployee() {
    let PhoneEnter: any;
    let PhoneCodeEnter: any;
    if (this.employeeAddFrom.controls.phoneCode.value != null) {
      PhoneCodeEnter = this.employeeAddFrom.controls.phoneCode.value;
    } else {
      PhoneCodeEnter = '';
    }
    if (this.employeeAddFrom.controls.phone.value != null) {
      PhoneEnter = this.employeeAddFrom.controls.phone.value;
    } else {
      PhoneEnter = '';
    }

    const data = {
      user_first_name: this.employeeAddFrom.controls.first_name.value,
      user_last_name: this.employeeAddFrom.controls.last_name.value,
      user_middle_name: this.employeeAddFrom.controls.middle_name.value,
      phone: '' + PhoneCodeEnter + '-' + PhoneEnter + '',
      email: this.employeeAddFrom.controls.email.value,
      designation: this.employeeAddFrom.controls.designation.value,
      employee_code: this.employeeAddFrom.controls.employee_code.value,
      role_id: this.employeeAddFrom.controls.role.value,
      dept_id: this.employeeAddFrom.controls.department.value,
      date_of_joining: this.employeeAddFrom.controls.joiningDate.value,
      supervisor_name: this.sup_id,
      signatory_flag: this.defaultSignatory
    };
    // //console.log(data);
    this.service.addEmployeeData(data).subscribe(r => {
      //console.log(r);
      if (r === "200") {
        Swal.fire({
          title: 'Employee added successfully.',
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
            this.employeeAddFrom.reset();
            this.allEmployees();
            this.getAllRecruiter();
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
      this.allEmployees();
      this.getAllRecruiter();
    });
  }

  checkEmailUniqueAdd() {
    let data = {
      email: this.employeeAddFrom.controls.email.value
    }
    this.service.checkUniqueEmail(data).subscribe((res: any) => {
      //console.log(res)
      if (res.user_id) {
        Swal.fire({
          title: 'Email already exist.',
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
            this.employeeAddFrom.get('email').reset();
          }
        });

      }

    }, err => {

    })
  }

  changeStatusBindData(value) {
    this.defaultStatus = value.user_status;
    this.defaultBlockUser = value.login_block_status;
    this.employeeUserId = value.user_id;

  }


  /// edit work

  onOptionsSelectedEmp2(value: any) {
    //console.log(value);
    this.sup_id = value.user_id;
    if (value.user_middle_name) {
      this.employeeEditFrom.controls['supervisorName'].setValue(value.user_first_name + ' ' + value.user_middle_name + ' ' + value.user_last_name);
    }
    else {
      this.employeeEditFrom.controls['supervisorName'].setValue(value.user_first_name + ' ' + value.user_last_name);
    }

    this.empList2 = false;
  }

  focusInputEmp2() {
    this.empList2 = true;
  }

  modelBindData(value) {
    //console.log(value);
    this.sup_id = "";
    this.empList2 = false;
    this.tempCode = value.supervisor_code;
    this.employeeUserId = value.user_id;
    this.formBindDataEdit = value;
    this.defaultSignatory2 = value.signatory_flag;

    let phoneCodee: any;
    let phonee: any;
    this.old_email = value.email;
    if (value.supervisor_middle_name) {
      var supervisor_name = value.supervisor_first_name + ' ' + value.supervisor_middle_name + ' ' + value.supervisor_last_name;
    }
    else {
      var supervisor_name = value.supervisor_first_name + ' ' + value.supervisor_last_name;
    }
    this.sup_id = value.supervisor_name;


    if (value.phone !== null) {
      phoneCodee = value.phone.split('-')[0];
      phonee = value.phone.split('-')[1];
    } else {
      phoneCodee = null;
      phonee = null;

    }

    this.employeeEditFrom.setValue({
      first_name: value.user_first_name,
      middle_name: value.user_middle_name,
      last_name: value.user_last_name,
      employee_code: value.employee_code,
      role: value.role_id,
      designation: value.designation,
      department: value.dept_id,
      email: value.email,
      phoneCode: phoneCodee,
      phone: phonee,
      joiningDate: value.date_of_joining,
      supervisorName: supervisor_name,
    });
  }

  checkEmailUniqueEdit() {
    let data = {
      email: this.employeeEditFrom.controls.email.value,
      old_email: this.old_email
    }
    //console.log(data)
    this.service.checkUniqueEmailforEdit(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "exist") {
        Swal.fire({
          title: 'Email already exist.',
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
            this.employeeEditFrom.get('email').reset();
          }
        });

      }

    }, err => {

    })
  }

  submitUpdateEmployee() {
    let PhoneEnter: any;
    let PhoneCodeEnter: any;
    if (this.employeeEditFrom.controls.phoneCode.value != null) {
      PhoneCodeEnter = this.employeeEditFrom.controls.phoneCode.value;
    } else {
      PhoneCodeEnter = '';
    }
    if (this.employeeEditFrom.controls.phone.value != null) {
      PhoneEnter = this.employeeEditFrom.controls.phone.value;
    } else {
      PhoneEnter = '';
    }
    const data = {
      user_id: this.employeeUserId,
      user_first_name: this.employeeEditFrom.controls.first_name.value,
      user_last_name: this.employeeEditFrom.controls.last_name.value,
      user_middle_name: this.employeeEditFrom.controls.middle_name.value,
      phone: '' + PhoneCodeEnter + '-' + PhoneEnter + '',
      email: this.employeeEditFrom.controls.email.value,
      designation: this.employeeEditFrom.controls.designation.value,
      employee_code: this.employeeEditFrom.controls.employee_code.value,
      role_id: this.employeeEditFrom.controls.role.value,
      dept_id: this.employeeEditFrom.controls.department.value,
      date_of_joining: this.employeeEditFrom.controls.joiningDate.value,
      supervisor_name: this.sup_id,
      signatory_flag: this.defaultSignatory2
    };
    //console.log(data);
    this.service.UpdateEmployeeData(data).subscribe((r: any) => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Employee Updated successfully.',
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
            this.employeeEditFrom.reset();
            this.allEmployees();
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

  updateStatusEmployee() {
    const data = {
      user_id: this.employeeUserId,
      user_status: this.defaultStatus
    };
    //console.log(data);
    this.service.employeeChangeStatus(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Status Updated successfully.',
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
            this.allEmployees();
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

  changePassword() {
    const data = {
      user_id: this.employeeUserId
    };
    this.service.employeeResetPassword(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Password reset successfully.',
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
            this.allEmployees();
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


  blockUserFunction() {
    const data = {
      user_id: this.employeeUserId,
      login_block_status: this.defaultBlockUser
    };
    this.service.employeeBlock(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'User blocked successfully.',
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
            this.allEmployees();
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
        });
      }
    });
  }


  /// assign Access web work start


  getAllModuleSubModule() {
    this.accessWebAllData = [];
    this.sortedModuleName = [];
    this.sortedModuleIds = null;
    this.service.moduleSubModuleShow().subscribe(r => {
      //console.log(r);
      let duplicateModuleName = [];
      for (const key in r) {
        r[key].value = false;
        duplicateModuleName.push(r[key].module_id);
        this.accessWebAllData.push(r[key]);
        this.accessWebAllDataCopy.push(r[key]);
      }
      this.sortedModuleIds = duplicateModuleName.filter(function (item, index) {
        return duplicateModuleName.indexOf(item) === index;
      });
      for (const key in this.sortedModuleIds) {
        for (const keys in this.accessWebAllData) {
          if (this.sortedModuleIds[key] === this.accessWebAllData[keys].module_id) {
            this.sortedModuleName.push(this.accessWebAllData[keys].module_name);
            break;
          }
        }

      }


    });
  }

  getDedfaultAccessData(data) {
    this.assignAccessCheckBoxList = [];
    this.accessWebAllData = [];
    this.employeeUserId = data.user_id;
    const json = {
      user_id: data.user_id
    };
    this.service.getDefaultAccessWEbData(json).subscribe((r: any) => {
      //console.log(r);
      for (const key in this.accessWebAllDataCopy) {
        this.accessWebAllDataCopy[key].value = false;
        for (const keys in r) {
          if (this.accessWebAllDataCopy[key].action_id === r[keys]) {
            this.accessWebAllDataCopy[key].value = true;
            const data = {
              value: true,
              action_id: r[keys]
            };
            this.assignAccessCheckBoxList.push(data);
          }
        }
        this.accessWebAllData.push(this.accessWebAllDataCopy[key]);
      }
    });

  }

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


  insertWebAccessData() {
    const data = {
      userId: this.employeeUserId,
      data: this.assignAccessCheckBoxList
    };
    //console.log(data);
    this.service.postWebAccess(data).subscribe((r: any) => {
      //console.log(r);
      if (r == 'check_value') {
        Swal.fire({
          title: 'Assign Access(web) Updated Successfully.',
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

  /// assign Access work end


  /// assign access app  work start

  getAllModuleSubModuleApp() {
    this.accessWebAllData = [];
    this.sortedModuleName = [];
    this.sortedModuleIds = null;
    this.service.moduleSubModuleShowApp().subscribe(r => {
      //console.log(r);
      // let duplicateModuleName = [];
      // for (const key in r) {
      //   r[key].value = false;
      //   duplicateModuleName.push(r[key].module_id);
      //   this.accessWebAllData.push(r[key]);
      //   this.accessWebAllDataCopy.push(r[key]);
      // }
      // this.sortedModuleIds = duplicateModuleName.filter(function (item, index) {
      //   return duplicateModuleName.indexOf(item) === index;
      // });
      // for (const key in this.sortedModuleIds) {
      //   for (const keys in this.accessWebAllData) {
      //     if (this.sortedModuleIds[key] === this.accessWebAllData[keys].module_id) {
      //       this.sortedModuleName.push(this.accessWebAllData[keys].module_name);
      //       break;
      //     }
      //   }
      //
      // }


    });
  }


  /// view Details

  employeeViewDetails(value) {
    if (value.user_middle_name) {
      this.empName = '' + value.user_first_name + ' ' + value.user_middle_name + ' ' + value.user_last_name + '';
    }
    else {
      this.empName = '' + value.user_first_name + ' ' + value.user_last_name + '';
    }

    this.empCode = value.employee_code;
    this.empRole = value.role_name;
    this.empDesignation = value.designation_name;
    this.empDepartment = value.dept_name;
    this.empEmail = value.email;
    this.empPhone = value.phone;
    this.EmpDataOfJoining = value.date_of_joining;
    this.supervisorName = '';
    if (value.supervisor_first_name !== null) {
      this.supervisorName += value.supervisor_first_name + ' ';
    }
    if (value.supervisor_middle_name !== null) {
      this.supervisorName += value.supervisor_middle_name + ' ';
    }
    if (value.supervisor_last_name !== null) {
      this.supervisorName += value.supervisor_last_name;
    }
    this.EmpSignatory = value.signatory_flag;
  }

  duplicateCheck = false;
  duplicateCheck2 = false;

  superCode: any;
  superCode2: any;
  tempCode: any;


  supervisorCodeDuplicateCheck(value) {
    if (value != null) {
      const data = {
        supervisor_code: value.toLowerCase().trim()
      };
      this.service.supervisorCodeCheckApi(data).subscribe((r: any) => {
        //console.log(r);
        if (r === 'EXIST') {
          this.duplicateCheck = true;
        } else {
          this.duplicateCheck = false;
        }
      });
    }
  }

  supervisorCodeDuplicateCheck2(value) {
    //console.log(value);
    if (value != null) {
      const data = {
        supervisor_code: value.toLowerCase().trim()
      };
      this.service.supervisorCodeCheckApi(data).subscribe((r: any) => {
        //console.log(r);
        if (r === 'EXIST' && this.tempCode !== value) {
          this.duplicateCheck2 = true;
        } else {
          this.duplicateCheck2 = false;
        }
      });
    }
  }


  /// designation 

  getempDesignations() {
    this.service.getEmpDesignation().subscribe((res: any) => {
      //console.log(res)
      this.DesignationList = res;
    }, err => {

    })
  }


}
