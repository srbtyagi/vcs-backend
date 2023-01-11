import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import { DropdownServiceService } from "./dropdown-service.service";

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.css']
})
export class DropdownListComponent implements OnInit {
  allProfessionData: any;
  allSpecialityData: any;
  allJobSectorData: any;
  allPositionTypeData: any;
  allJobTypeData: any;
  allSystemNameData: any;
  allStandardDocumentData: any;
  allGetDesignation: any;

 
  hideShowHeader: boolean = false;

  addHeaderShow: any;

  addDropDownList: FormGroup;
  editDropDownList: FormGroup;

  editHeaderShow: any;

  editCommonId: any;

  defaultStatus: any = 'active';
  moduleArray: any = [];


  constructor(public service: DropdownServiceService, public fb: FormBuilder, public route: ActivatedRoute,
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
    this.getDataProfession();
    this.getDataSpeciality();
    this.getDataJobSector();
    this.getDataPositionType();
    this.getDataJobType();
    this.getDataSystemName();
    this.getDataStandardDocument();
    this.getDesignationData();

    this.addDropDownList = this.fb.group({
      name: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    });

    this.editDropDownList = this.fb.group({
      edit_name: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
    });


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
      document.getElementById("clsActive406").className = "active";
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

  headerSHowFunctions(value) {
    this.hideShowHeader = value;
  }

  /// add button

  addButtonHit(header) {
    this.addHeaderShow = header;
    this.addDropDownList.reset();
  }

  addsubmitHit() {
    if (this.addHeaderShow === 'Profession') {
      this.insertProfession();
    } else if (this.addHeaderShow === 'Speciality') {
      this.insertSpeciality();
    } else if (this.addHeaderShow === 'Job Sector') {
      this.insertJobSector();
    } else if (this.addHeaderShow === 'Position Type') {
      this.insertPositionType();
    } else if (this.addHeaderShow === 'Job Type') {
      this.insertJobType();
    } else if (this.addHeaderShow === 'System Name') {
      this.insertSystemName();
    } else if (this.addHeaderShow === 'Standard Document') {
      this.insertStandardDocument();
    } else if (this.addHeaderShow === 'Designation') {
      this.insertDesignation();
    }

  }


  /// edit  button

  editButtonHit(header, value) {
    this.editHeaderShow = header;
    if (this.editHeaderShow === 'Profession') {
      this.editCommonId = value.profession_id;
      this.defaultStatus = value.profession_status;
      this.editDropDownList.setValue({
        edit_name: value.profession_name,
      });
    } else if (this.editHeaderShow === 'Speciality') {
      this.editCommonId = value.speciality_id;
      this.defaultStatus = value.speciality_status;
      this.editDropDownList.setValue({
        edit_name: value.speciality_name,
      });
    } else if (this.editHeaderShow === 'Job Sector') {
      this.editCommonId = value.job_sector_id;
      this.defaultStatus = value.job_sector_status;
      this.editDropDownList.setValue({
        edit_name: value.job_sector_name,
      });
    } else if (this.editHeaderShow === 'Position Type') {
      this.editCommonId = value.position_type_id;
      this.defaultStatus = value.position_type_status;

      this.editDropDownList.setValue({
        edit_name: value.position_type_name,
      });
    } else if (this.editHeaderShow === 'Job Type') {
      this.editCommonId = value.job_type_id;
      this.defaultStatus = value.job_type_status;
      this.editDropDownList.setValue({
        edit_name: value.job_type_name,
      });
    } else if (this.editHeaderShow === 'System Name') {
      this.editCommonId = value.system_name_id;
      this.defaultStatus = value.system_name_status;
      this.editDropDownList.setValue({
        edit_name: value.system_name,
      });
    } else if (this.editHeaderShow === 'Standard Document') {
      this.editCommonId = value.doc_id;
      this.defaultStatus = value.doc_status;
      this.editDropDownList.setValue({
        edit_name: value.doc_name,
      });
    } else if (this.editHeaderShow === 'Designation') {
      this.editCommonId = value.designation_id;
      this.defaultStatus = value.designation_status;
      this.editDropDownList.setValue({
        edit_name: value.designation_name,
      });
    }

  }

  editsubmitHit() {
    if (this.editHeaderShow === 'Profession') {
      this.updateProfession();
    } else if (this.editHeaderShow === 'Speciality') {
      this.updateSpeciality();
    } else if (this.editHeaderShow === 'Job Sector') {
      this.updateJobSector();
    } else if (this.editHeaderShow === 'Position Type') {
      this.updatePositionType();
    } else if (this.editHeaderShow === 'Job Type') {
      this.updateJobType();
    } else if (this.editHeaderShow === 'System Name') {
      this.updateSystemName();
    } else if (this.editHeaderShow === 'Standard Document') {
      this.updateStandardDocument();
    } else if (this.editHeaderShow === 'Designation') {
      this.updateDesignation();
    }

  }


  /// status button
  statussubmitHit() {
    if (this.editHeaderShow === 'Profession') {
      this.statusProfession();
    } else if (this.editHeaderShow === 'Speciality') {
      this.statusSpeciality();
    } else if (this.editHeaderShow === 'Job Sector') {
      this.statusJobSector();
    } else if (this.editHeaderShow === 'Position Type') {
      this.statusPositionType();
    } else if (this.editHeaderShow === 'Job Type') {
      this.statusJobType();
    } else if (this.editHeaderShow === 'System Name') {
      this.statusSystemName();
    } else if (this.editHeaderShow === 'Standard Document') {
      this.statusStandardDocument();
    } else if (this.editHeaderShow === 'Designation') {
      this.statusDesignation();
    }

  }


  getDataProfession() {
    this.service.getApiProfession().subscribe(r => {
      //console.log(r);
      this.allProfessionData = r;
    });
  }

  getDataSpeciality() {
    this.service.getApiSpeciality().subscribe(r => {
      //console.log(r);
      this.allSpecialityData = r;
    });
  }

  getDataJobSector() {
    this.service.getApiJobSector().subscribe(r => {
      //console.log(r);
      this.allJobSectorData = r;
    });
  }

  getDataPositionType() {
    this.service.getApiPositionType().subscribe(r => {
      //console.log(r);
      this.allPositionTypeData = r;
    });
  }

  getDataJobType() {
    this.service.getApiJobType().subscribe(r => {
      //console.log(r);
      this.allJobTypeData = r;
    });
  }

  getDataSystemName() {
    this.service.getApiSystemName().subscribe(r => {
      //console.log(r);
      this.allSystemNameData = r;
    });
  }


  getDataStandardDocument() {
    this.service.getApiStandardDocument().subscribe(r => {
      //console.log(r);
      this.allStandardDocumentData = r;
    });
  }

  getDesignationData() {
    this.service.getApiDesignation().subscribe(r => {
      //console.log(r);
      this.allGetDesignation = r;
    });
  }


  /// insert Api work

  insertProfession() {
    const data = {
      profession_name: this.addDropDownList.controls.name.value
    };
    this.service.addApiProfession(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Profession Added successfully.',
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
            this.addDropDownList.reset();
            this.getDataProfession();
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

  insertSpeciality() {
    const data = {
      speciality_name: this.addDropDownList.controls.name.value
    };
    this.service.addApiSpeciality(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Speciality Added successfully.',
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
            this.addDropDownList.reset();
            this.getDataSpeciality();
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

  insertJobType() {
    const data = {
      job_type_name: this.addDropDownList.controls.name.value
    };
    this.service.addApiJobType(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Job Type Added successfully.',
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
            this.addDropDownList.reset();
            this.getDataJobType();
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

  insertJobSector() {
    const data = {
      job_sector_name: this.addDropDownList.controls.name.value
    };
    this.service.addApiJobSector(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Job Sector Added successfully.',
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
            this.addDropDownList.reset();
            this.getDataJobSector();
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

  insertPositionType() {
    const data = {
      position_type_name: this.addDropDownList.controls.name.value
    };
    this.service.addApiPositionType(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Position Type Added successfully.',
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
            this.addDropDownList.reset();
            this.getDataPositionType();
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


  insertSystemName() {
    const data = {
      system_name: this.addDropDownList.controls.name.value
    };
    this.service.addApiSystemName(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'System Name Added successfully.',
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
            this.addDropDownList.reset();
            this.getDataSystemName();
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

  insertStandardDocument() {
    const data = {
      doc_name: this.addDropDownList.controls.name.value
    };
    this.service.addApiDocumentName(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Standard Document Added successfully.',
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
            this.addDropDownList.reset();
            this.getDataStandardDocument();
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

  checkUniqueDesignation() {
    if (this.addHeaderShow === 'Designation') {
      this.service.checkUniqueDesignation(this.addDropDownList.controls.name.value).subscribe((res: any) => {
        //console.log(res)
        if (res === "exist") {
          Swal.fire({
            title: 'Designation Name already exist!',
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
              this.addDropDownList.reset();
              this.editDropDownList.reset();
            }
          });
        }
        else if (res === "do not exist") {

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
      }, err => {

      });
    }
  }

  checkUniqueDesignationEdit() {
    if (this.editHeaderShow === 'Designation') {
      this.service.checkUniqueDesignation(this.editDropDownList.controls.edit_name.value).subscribe((res: any) => {
        //console.log(res)
        if (res === "exist") {
          Swal.fire({
            title: 'Designation Name already exist!',
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
              this.editDropDownList.reset();
            }
          });
        }
        else if (res === "do not exist") {

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
      }, err => {

      });
    }
  }

  insertDesignation() {
    const data = {
      designation_name: this.addDropDownList.controls.name.value
    };
    this.service.addApiDesignationName(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Designation Added successfully.',
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
            this.addDropDownList.reset();
            this.getDesignationData();
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


  //// update api work

  updateProfession() {
    const data = {
      profession_name: this.editDropDownList.controls.edit_name.value,
      profession_id: this.editCommonId
    };
    this.service.editApiProfession(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Profession updated successfully.',
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
            this.editDropDownList.reset();
            this.getDataProfession();
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

  updateSpeciality() {
    const data = {
      speciality_name: this.editDropDownList.controls.edit_name.value,
      speciality_id: this.editCommonId

    };
    this.service.editApiSpeciality(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Speciality Updated successfully.',
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
            this.editDropDownList.reset();
            this.getDataSpeciality();
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

  updateJobType() {
    const data = {
      job_type_name: this.editDropDownList.controls.edit_name.value,
      job_type_id: this.editCommonId
    };
    this.service.editApiJobType(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Job Type updated successfully.',
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
            this.editDropDownList.reset();
            this.getDataJobType();
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

  updateJobSector() {
    const data = {
      job_sector_name: this.editDropDownList.controls.edit_name.value,
      job_sector_id: this.editCommonId
    };
    this.service.editApiJobSector(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Job Sector Updated successfully.',
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
            this.editDropDownList.reset();
            this.getDataJobSector();
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

  updatePositionType() {
    const data = {
      position_type_name: this.editDropDownList.controls.edit_name.value,
      position_type_id: this.editCommonId
    };
    this.service.editApiPositionType(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Position Type updated successfully.',
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
            this.editDropDownList.reset();
            this.getDataPositionType();
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

  updateSystemName() {
    const data = {
      system_name: this.editDropDownList.controls.edit_name.value,
      system_name_id: this.editCommonId
    };
    this.service.editApiSystemName(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'System Name updated successfully.',
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
            this.editDropDownList.reset();
            this.getDataSystemName();
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

  updateStandardDocument() {
    const data = {
      doc_name: this.editDropDownList.controls.edit_name.value,
      doc_id: this.editCommonId
    };
    this.service.editApiStandardDocument(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Document updated successfully.',
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
            this.editDropDownList.reset();
            this.getDataStandardDocument();
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

  updateDesignation() {
    const data = {
      designation_name: this.editDropDownList.controls.edit_name.value,
      designation_id: this.editCommonId
    };
    this.service.editApiDesignation(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Designation updated successfully.',
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
            this.editDropDownList.reset();
            this.getDesignationData();
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


  // status change api work


  statusProfession() {
    const data = {
      profession_status: this.defaultStatus,
      profession_id: this.editCommonId
    };
    this.service.statusApiProfession(data).subscribe(r => {
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
            this.getDataProfession();
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

  statusSpeciality() {
    const data = {
      speciality_status: this.defaultStatus,
      speciality_id: this.editCommonId

    };
    this.service.statusApiSpeciality(data).subscribe(r => {
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
            this.getDataSpeciality();
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

  statusJobType() {
    const data = {
      job_type_status: this.defaultStatus,
      job_type_id: this.editCommonId
    };
    this.service.statusApiJobType(data).subscribe(r => {
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
            this.getDataJobType();
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

  statusJobSector() {
    const data = {
      job_sector_status: this.defaultStatus,
      job_sector_id: this.editCommonId
    };
    this.service.statusApiJobSector(data).subscribe(r => {
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
            this.getDataJobSector();
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

  statusPositionType() {
    const data = {
      position_type_status: this.defaultStatus,
      position_type_id: this.editCommonId
    };
    this.service.statusApiPositionType(data).subscribe(r => {
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
            this.getDataPositionType();
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


  statusSystemName() {
    const data = {
      system_name_status: this.defaultStatus,
      system_name_id: this.editCommonId
    };
    this.service.statusApiSystemName(data).subscribe(r => {
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
            this.getDataSystemName();
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

  statusStandardDocument() {
    const data = {
      doc_status: this.defaultStatus,
      doc_id: this.editCommonId
    };
    this.service.statusApiStandardDocument(data).subscribe(r => {
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
            this.getDataStandardDocument();
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

  statusDesignation() {
    const data = {
      designation_status: this.defaultStatus,
      designation_id: this.editCommonId
    };
    this.service.statusApiDesignation(data).subscribe(r => {
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
            this.getDesignationData();
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
