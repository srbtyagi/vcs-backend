import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  checkUserType:boolean=false;
  passwordForm:FormGroup;
  passcodeForm:FormGroup;
  passwordPatterRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  old_password:boolean=false;
  old_passcode:boolean=false;
  passcodePattern="[0-9]*";
  badge:Number;

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService,) { }

  ngOnInit() {

    this.passwordForm = this.fb.group({
      old_password: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required,Validators.maxLength(30), Validators.minLength(8), Validators.pattern(this.passwordPatterRegex)]),
      retype_password: new FormControl(null, [Validators.required])
    });
    this.passcodeForm = this.fb.group({
      old_passcode: new FormControl(null, [Validators.required]),
      passcode: new FormControl(null, [Validators.required,Validators.pattern(this.passcodePattern),Validators.maxLength(4),Validators.minLength(4)]),
      retype_passcode: new FormControl(null, [Validators.required])
    });

    if(sessionStorage.getItem("user_type")==='recruitee')
    {
      this.checkUserType=true;
    }
    this.getBadge();
  }

  getBadge() {
    this.service.getCurrentReqDocs(sessionStorage.getItem('user_id')).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length) {
        this.badge=result.length;
      }
     
    });
  }

  checkOldPassword(){
    this.service.check_old_password({ password: this.passwordForm.value.old_password,user_id:sessionStorage.getItem('user_id') }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result==="password not matched") {
        this.old_password=false;
      }
      else{
        this.old_password=true;
      }
    });
  }

  checkOldPasscode(){
    this.service.check_old_passcode({ passcode: this.passcodeForm.value.old_passcode,user_id:sessionStorage.getItem('user_id') }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result==="passcode not matched") {
        this.old_passcode=false;
      }
      else{
        this.old_passcode=true;
      }
    });
  }

  reset_retype_pass() {
    this.passwordForm.patchValue({
      retype_password: ""
    })
  }
  reset_retype_passcode() {
    this.passcodeForm.patchValue({
      retype_passcode: ""
    })
  }

  changePassword(){
    this.service.spinnerShow();
    if(this.old_password){
      if(this.passwordForm.value.password===this.passwordForm.value.retype_password){
    this.service.change_password({ password: this.passwordForm.value.password,user_id:sessionStorage.getItem('user_id') }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result==="success") {
        this.service.spinnerHide();
        this.success("Password updated successfully.");
      }
      else{
        this.service.spinnerHide();
        this.error("Something went wrong, please try again.");
      }
    });
    this.passwordForm.reset();
  }else{
    this.service.spinnerHide();
    this.error("Password And Confirmed Password does not match.");
    this.reset_retype_pass();
  }
  }
  else{
    this.service.spinnerHide();
    this.error("Old Password does not match.")
    this.passwordForm.patchValue({
      old_password:""
    });
  }
  }

  changePasscode(){
    if(this.old_passcode){
      if(this.passcodeForm.value.passcode===this.passcodeForm.value.retype_passcode){
    this.service.change_passcode({ passcode: this.passcodeForm.value.passcode,user_id:sessionStorage.getItem('user_id') }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result==="success") {
        this.success("Passcode updated successfully.")
      }
      else{
        this.error("Something went wrong, please try again.");
      }
    });
    this.passcodeForm.reset();
  }else{
    this.error("Passcode And Confirmed Passcode does not match.");
    this.reset_retype_passcode();
  }
  }
  else{
    this.error("Old Passcode does not match.")
    this.passcodeForm.patchValue({
      old_passcode:""
    });
  }
  }


  success(msg)
  {
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
      }
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

}
