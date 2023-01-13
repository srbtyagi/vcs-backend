import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-passcode',
  templateUrl: './change-passcode.component.html',
  styleUrls: ['./change-passcode.component.css']
})
export class ChangePasscodeComponent implements OnInit {


  checkUserType:boolean=false;
  passcodeForm:FormGroup;
  passwordPatterRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  old_password:boolean=false;
  old_passcode:boolean=false;
  passcodePattern="[0-9]*";
  badge:Number;

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService,) { }

  ngOnInit() {
    if (sessionStorage.getItem("user_type") === 'recruitee') {
      this.checkUserType = true;
    }
    this.passcodeForm = this.fb.group({
      old_passcode: new FormControl(null, [Validators.required]),
      passcode: new FormControl(null, [Validators.required,Validators.pattern(this.passcodePattern),Validators.maxLength(4),Validators.minLength(4)]),
      retype_passcode: new FormControl(null, [Validators.required])
    });
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

  reset_retype_passcode() {
    this.passcodeForm.patchValue({
      retype_passcode: ""
    })
  }

  changePasscode(){
    this.service.spinnerShow();
    if(this.old_passcode){
      if(this.passcodeForm.value.passcode===this.passcodeForm.value.retype_passcode){
    this.service.change_passcode({ passcode: this.passcodeForm.value.passcode,user_id:sessionStorage.getItem('user_id') }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result==="success") {
        this.service.spinnerHide();
        this.success("Passcode updated successfully.")
      }
      else{
        this.service.spinnerHide();
        this.error("Something went wrong, please try again.");
      }
    });
    this.passcodeForm.reset();
  }else{
    this.service.spinnerHide();
    this.error("Passcode And Confirmed Passcode does not match.");
    this.reset_retype_passcode();
  }
  }
  else{
    this.service.spinnerHide();
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
