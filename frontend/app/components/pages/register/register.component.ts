import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService, public route: ActivatedRoute) { }

  file_name = "";
  current_date = "";
  registerForm: FormGroup;
  fileData = "";
  emp_preference = ["permanent"];
  professionData = [];
  specialityData = [];
  passwordPatterRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  checkEmail: boolean = false;
  viewShow: any = "no";
  showPercentage: number = 0;
  showProgressBar: boolean = false;
  viewfinalErr: boolean = false;
  status = false;
  url = "";
  fileExistData = 0;
  exist = "NO";
  registerexist = "NO";
  codePattern = "[+]?[0-9]*";
  phonePattern = "[0-9]*";
  applyData: any = {};


  ngOnInit() {
    this.registerForm = this.fb.group({
      first_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      middle_name: new FormControl(null, [Validators.maxLength(100)]),
      last_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required, Validators.maxLength(60), Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      password: new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.minLength(8), Validators.pattern(this.passwordPatterRegex)]),
      retype_password: new FormControl(null, [Validators.required]),
      phone_no: new FormControl(null, [Validators.required,Validators.maxLength(10),Validators.minLength(10), Validators.pattern(this.phonePattern)]),
      resume: new FormControl(null, []),
      tc: new FormControl(false, [Validators.requiredTrue])
    }
    );


    //console.log("data2", sessionStorage.getItem('registerModel'))
    if (sessionStorage.getItem('registerModel') === "apply") {

      this.route.queryParams.subscribe((r: any) => {

        // //console.log(r.special);
        // this.applyData = JSON.parse(r.special);
        // //console.log("data",this.applyData)

        let a = decodeURIComponent(escape(window.atob(r.special)));
        this.applyData = JSON.parse(a);
        //console.log("data", this.applyData)

      });


    }

  }



  register() {
    this.service.spinnerShow();
    if (this.fileExistData) {
      this.registerexist = "YES";
    }
    let modulearray = [];
    //console.log(this.registerForm.value)
      let data = this.registerForm.value;
      let m_name = "";
      if (data.middle_name) {
        m_name = data.middle_name;
      }
      let obj = {
        user_first_name: data.first_name,
        user_middle_name: m_name,
        user_last_name: data.last_name,
        phone: data.phone_no,
        email: data.email,
        password: data.password,
        user_type: "recruitee"
      }
      //console.log(obj)
      this.service.register(obj, this.registerexist, this.fileExistData).subscribe((res) => {
        //console.log(res);
        let result: any = res;
        if (result.message === "You are login") {
          this.service.spinnerHide();

          sessionStorage.setItem("user_id", result.user_details.user_id);
          sessionStorage.setItem("user_name", result.user_details.user_first_name);
          if (result.u_access.length) {
            sessionStorage.setItem("user_type", result.u_access[0].user_type);

            result.u_access.forEach(e => {
              let data = {
                module_name: e.module_name,
                module_id: e.module_id,
                submodule_name: e.submodule_name,
                submodule_id: e.submodule_id,
                action_name: e.action_name,
                action_id: e.action_id
              }
              modulearray.push(data);
            });
            sessionStorage.setItem('moduleArray', JSON.stringify(modulearray));
          }

          if (sessionStorage.getItem("registerModel") === "apply") {
            //console.log(this.applyData)
            let navigationExtras: NavigationExtras = {
              queryParams: {
                special: btoa(unescape(encodeURIComponent(JSON.stringify(this.applyData)))),
              }
            };
            //console.log(this.applyData, navigationExtras);
            this.router.navigate(["/apply-job"], navigationExtras);
            setTimeout(() => {
              window.location.reload();
            }, 200);
          }
          else {
            if(sessionStorage.getItem('user_type')==="recruitee")
            {
              this.router.navigate(["/candi-profile"]);
            }
            else{
              this.router.navigate(["/"]);
            }
            setTimeout(() => { 
              window.location.reload();
            }, 200);
          }
          this.success("Registered successfully.");

        }
        else if (result === "user exists") {
          this.service.spinnerHide();
          this.error("Already registered with this email address.");
        }
      }, err => {
        this.service.spinnerHide();
        this.error("Something went wrong. Please Try Again.");
      });






  }

  checkUniqueEmail() {
    //console.log(this.registerForm.value.email)
    this.service.check_email_register({ email: this.registerForm.value.email }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.user_id) {
        this.checkEmail = true;
        // this.error3("Already registered with this email address.");
      }
      else {
        this.checkEmail = false;
      }
    });
  }

  checkResume() {
    this.service.check_resume({ user_id: sessionStorage.getItem("user_id") }).subscribe((res) => {
      let result: any = res;
      if (result[0].resume_doc_path) {
        this.status = true;
        this.url = "https://vishusa.com/vcsapi/get/resume/" + sessionStorage.getItem("user_id")+"/"+sessionStorage.getItem('user_name')+"_resume";
      }
      else {
        this.status = false;
        this.url = "";
      }
    });
  }

  fileUpload(files: FileList) {

    if (this.fileExistData) {
      this.exist = "YES";
    }
    let fileInput: any = (<HTMLInputElement>document.getElementById('customFile'));
    let fileData = files[0];
    this.file_name = fileData.name;
    this.showProgressBar = false;
    this.viewShow = "false";
    this.viewfinalErr = false;
    if(fileData.size>25000000)
    {
      this.error("File size exceeds the maximum limit 25mb.")
    }
    else{
    this.uploadFiles(fileData, this.exist, this.fileExistData);
    }

  }


  uploadFiles(file, param1, param2) {
    // //console.log("UPLOAD------",file)
    this.showProgressBar = true;
    this.showPercentage = 0;
    let formData = new FormData();

    formData.append('file', file, file.name);
    // //console.log(formData,file.name)

    this.service.uploadFileRegister(formData, param1, param2).subscribe(res => {
      let result: any = res;
      //console.log("upload", result)

      this.viewShow = "try";
      this.showPercentage = Math.round(100 * result.loaded / result.total);
      if (result.body !== undefined) {
        if (result.body.message === "success") {
          this.showProgressBar = false;
          this.viewShow = "true";
          this.viewfinalErr = false;
          // this.success("Resume Uploaded Successfully.");
          this.fileExistData = result.body.user_details.user_id;
          this.status = true;
          this.url = "https://vishusa.com/vcsapi/get/resume/" + result.body.user_details.user_id+"/"+sessionStorage.getItem('user_name')+"_resume";
        }
      }
      else {
        this.status = false;
        this.url = "";
        this.viewfinalErr = true;
        this.viewShow = "false";
      }
    }, err => {
      this.status = false;
      this.url = "";
      this.viewfinalErr = true;
      this.viewShow = "false";
    });



  }





  deleteTempREgistration() {
    this.service.delete_temp_registration({ user_id: this.fileExistData }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result === "delete") {
        this.registerForm.reset();
      }
      else {
        this.error("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    
    });
  }



  reset_retype_pass() {
    this.registerForm.patchValue({
      retype_password: ""
    })
  }

  error(msg) {
    Swal.fire({
      title: msg,
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
  error2(msg) {
    Swal.fire({
      title: msg,
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
        this.registerForm.patchValue({
          retype_password: ""
        })
      }
    })
  }
  error3(msg) {
    Swal.fire({
      title: msg,
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
        this.registerForm.patchValue({
          email: ""
        })
      }
    })
  }
  error4(msg) {
    Swal.fire({
      title: msg,
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
        this.registerForm.patchValue({
          password: ""
        })
      }
    })
  }
  success(msg) {
    Swal.fire({
      title: msg,
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
        this.registerForm.reset();
      }
    })
  }


}
