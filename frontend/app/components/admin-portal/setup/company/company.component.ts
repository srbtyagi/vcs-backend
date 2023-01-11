import { Component, OnInit } from '@angular/core';
import { CompanyServiceService } from "./company-service.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  cmpName: any;
  cmpaddress: any;
  cmpPhone: any;
  CmpEmail: any;

  cmpNamecopy: any;
  cmpaddresscopy: any;
  cmpPhonecopy: any;
  CmpEmailcopy: any;
  compantDetailsForm: FormGroup;

  data: any;
  moduleArray: any = [];

  constructor(public service: CompanyServiceService, public fb: FormBuilder, public route: ActivatedRoute,
    public router: Router, public http: AdminService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    // //console.log(this.data)
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);
    this.getCompanyAllData();

    this.compantDetailsForm = this.fb.group({
      name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      address: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
      phone: new FormControl(null, [Validators.required, Validators.min(10000000), Validators.max(999999999999999)]),
      email: new FormControl(null, [Validators.required, Validators.maxLength(80), Validators.email, Validators.maxLength(40), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
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
      document.getElementById("clsActive401").className = "active";
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

  getCompanyAllData() {
    this.service.getCompanyDetails().subscribe((r: any) => {
      //console.log(r);
      this.cmpName = r[0].company_name;
      this.cmpaddress = r[0].company_addr;
      this.cmpPhone = parseInt(r[0].company_phone);
      this.CmpEmail = r[0].company_email;
      this.cmpNamecopy = r[0].company_name;
      this.cmpaddresscopy = r[0].company_addr;
      this.cmpPhonecopy = parseInt(r[0].company_phone);
      this.CmpEmailcopy = r[0].company_email;




    });
  }

  setFormData() {
    this.compantDetailsForm.setValue({
      name: this.cmpName,
      address: this.cmpaddress,
      phone: this.cmpPhone,
      email: this.CmpEmail,
    });
  }



  submitDetails() {
    const data = {
      company_name: this.compantDetailsForm.controls.name.value,
      company_addr: this.compantDetailsForm.controls.address.value,
      company_phone: this.compantDetailsForm.controls.phone.value,
      company_email: this.compantDetailsForm.controls.email.value,
    };
    this.service.updateCompanyDetails(data).subscribe(r => {
      //console.log(r);
      if (r === "success") {
        Swal.fire({
          title: 'Company name updated successfully.',
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
            this.compantDetailsForm.reset();
            this.getCompanyAllData();
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
