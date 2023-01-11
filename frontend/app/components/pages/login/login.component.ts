import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService) { }

  loginForm: FormGroup;
  forgotPassForm: FormGroup;
  title="Login To You Now";
  titleDetails="Lorem Ipsum is simply dummy text of the printing and typesetting industry has been the industry."

  ngOnInit() {
    
    this.loginForm = this.fb.group({
      email: new FormControl(null, [Validators.required,Validators.email,Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      password: new FormControl(null, [Validators.required]),
    });
    this.forgotPassForm = this.fb.group({
      email: new FormControl(null, [Validators.required,Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')])
    });
  }

  onClickForgotPass(){
    this.title="Forgot Password";
  this.titleDetails="Lorem Ipsum is simply dummy text of the printing and typesetting industry has been the industry."
  }

  login() {
    this.service.spinnerShow();
    //console.log(this.loginForm.value)
    let modulearray = [];
    this.service.login(this.loginForm.value).subscribe((res) => {
      //console.log("result",res);
      let result: any = res;
      if (result === "username and password is not matched") {
        this.service.spinnerHide();
        this.error2("Wrong Password. Try Again!!!");
      }
      else if (result === "No username in database please signup first" || result==="unregistered") {
        this.service.spinnerHide();
        this.error3("Invalid Email. Please Signup!!!");
      }
      else if (result.message === "You are login" && result!==null) {
        this.service.spinnerHide();
        sessionStorage.setItem("user_id", result.user_id);
        sessionStorage.setItem("user_name", result.username);
        //console.log(result)
        if(result.u_access.length)
        {
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
      if(sessionStorage.getItem('user_type')==="recruitee")
      {
        this.router.navigate(["/candi-profile"]);
      }
      else{
        this.router.navigate(["/"]);
      }
        
        setTimeout(() => {
          window.location.reload();
        }, 100);
        // this.success("Logged in successfully.");
      }
      else if(result===null){
        this.service.spinnerHide();
        this.error("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.service.spinnerHide();
      this.error("Something went wrong. Please Try Again.");
    });






  }

  forgotPass() {

    this.service.spinnerShow();
    //console.log(this.forgotPassForm.value)
    this.service.forgotPass(this.forgotPassForm.value).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result === "success") {
        this.service.spinnerHide();
        this.success2("New Password sent to the registered email address.");
      }
      else if (result === "invalid email") {
        this.service.spinnerHide();
        this.error("Email Do Not Exist. Please Signup!!!");
      }
      else {
        this.service.spinnerHide();
        this.error("Something went wrong. Please Try Again.");
      }
    }, err => {this.service.spinnerHide();
      this.error("Something went wrong. Please Try Again.");
    });

  }

  createAccountCheck(){
    sessionStorage.setItem("registerModel", "no-apply");
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
        this.forgotPassForm.reset()
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
        this.loginForm.patchValue({password:""})
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
        this.loginForm.reset()
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
        this.loginForm.reset();
      }
    })
  }
  success2(msg) {
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
        this.forgotPassForm.reset();
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }
    })
  }

}
