import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-add-applicant-admin',
  templateUrl: './add-applicant-admin.component.html',
  styleUrls: ['./add-applicant-admin.component.css']
})
export class AddApplicantAdminComponent implements OnInit {
  data: any;
  applicantFormAdmin: FormGroup;
  details = {};
  status = false;
  url = "";
  emp_preference = ["permanent"];
  fileToUpload: any | null = null;
  file_name: any = '';
  showForm: boolean = false;
  first_name: any;
  middle_namee: any;
  last_name: any;
  phone_no: any;
  recruitee_id_exist: any = "";
  resumeStatus: boolean = false;

  constructor(public http: AdminService, public route: ActivatedRoute, public router: Router,
    public fb: FormBuilder) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      //let a = atob(r.special);
      let a = decodeURIComponent(escape(window.atob(r.special)));
      this.data = JSON.parse(a);
      //console.log(this.data)

    });
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {
      this.http.spinnerHide();
    }, 900);

    this.applicantFormAdmin = this.fb.group({
      first_name: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      middle_namee: new FormControl(null, [Validators.maxLength(100)]),
      last_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required, Validators.required, Validators.maxLength(60)]),
      phone_no: new FormControl(null, [Validators.max(99999999999999), Validators.required]),
      //current_loc: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      message: new FormControl(null, []),
      availability: new FormControl(null, []),
      resume: new FormControl(null)
    });
  }

  back() {
    window.history.back();
  }

  checkBoxSelect(value) {
    let index = this.emp_preference.indexOf(value);
    if (index > -1) {
      this.emp_preference.splice(index, 1);
    }
    else {
      this.emp_preference.push(value);
    }
    //console.log(this.emp_preference)
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    //console.log(this.fileToUpload)
    this.file_name = this.fileToUpload.name;
    this.resumeStatus = true;
    //this.uploadFileToActivity(this.fileToUpload, this.user_id);
  }

  checkEmail() {
    this.first_name = "";
    this.middle_namee = "";
    this.last_name = "";
    this.recruitee_id_exist = "";
    this.resumeStatus = false;
    this.phone_no = "";
    let data = {
      email: this.applicantFormAdmin.controls.email.value
    }
    //console.log(data)
    this.http.checkEmailApplicant(data).subscribe((res: any) => {
      //console.log(res)
      if (res === "no user found by given email") {

      }
      else if (res === "Employee") {
        this.errorMsg("This email cann't be added as it is already used by VCS employee!");
        this.applicantFormAdmin.reset();
        this.resumeStatus = false;
      }
      else if (res !== "no user found by given email" && res !== "Employee") {
        this.showForm = true;
        this.first_name = res[0].user_first_name;
        this.middle_namee = res[0].user_middle_name;
        this.last_name = res[0].user_last_name;
        this.recruitee_id_exist = res[0].user_id;
        this.resumeStatus = res[0].resume;

        if (res[0].phone !== null) {
          this.phone_no = res[0].phone;
        }
        this.checkRecruiteeStatus(this.recruitee_id_exist);

      }
      else {
        this.errorMsg("Something went wrong,please try again!");
      }
    }, err => {
      this.errorMsg("Something went wrong,please try again!");
    });
  }

  checkRecruiteeStatus(user_id_recruitee) {
    let data = {
      user_id: user_id_recruitee
    }
    this.http.getRecruiteeStatus(data).subscribe((res: any) => {
      //console.log(res)
      if (res[0].apply_status === "regular") {
        this.checkApplystatus(user_id_recruitee);
      }
      else if (res === "DNH") {
        //this.errorMsg("This applicant can not be added!");
        this.checkApplystatus(user_id_recruitee);
      }
      else {
        this.errorMsg("Something went wrong,please try again!");
      }
    }, err => {
      this.errorMsg("Something went wrong,please try again!");
    })
  }

  checkApplystatus(user_id_recruitee) {
    let data = {
      user_id: user_id_recruitee,
      job_id: this.data.job_id
    }
    this.http.getAlreadyAppliedStatus(data).subscribe((res: any) => {
      //console.log(res)
      if (res.length !== 0) {
        this.errorMsg("The applicant already applied for this job.");
        this.applicantFormAdmin.reset();
        this.resumeStatus = false;
      }
      else if (res.length === 0) {

      }
      else {
        this.errorMsg("Something went wrong,please try again!");
      }
    }, err => {
      this.errorMsg("Something went wrong,please try again!");
    })
  }


  uploadDoc(file, resultval) {
    //console.log("UPLOAD------")
    let formData = new FormData();
    formData.append('file', file, file.name);
    //console.log(formData)
    this.http.uploadResumeAppl(formData, resultval).subscribe(res => {
      let result: any = res;
      //console.log(result)
      if (result === "success") {
        this.applyJobFunction(resultval);
        //this.success("Registered successfully.");
      }
      else {
        this.http.spinnerHide();
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    });

  }

  uploadDoc2(file, resultval) {
    //console.log("UPLOAD------")
    let formData = new FormData();
    formData.append('file', file, file.name);
    //console.log(formData)
    this.http.uploadResumeAppl(formData, resultval).subscribe(res => {
      let result: any = res;
      // console.log(result)
      if (result === "success") {
        this.applyJobFunction(resultval);
        //this.success("Registered successfully.");
      }
      else {
        this.http.spinnerHide();
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    });

  }

  applyJobFunction(applicant_id) {

    let applyJobObj = {
      phone: this.applicantFormAdmin.controls.phone_no.value,
      email: this.applicantFormAdmin.controls.email.value,
      message: this.applicantFormAdmin.controls.message.value,
      availability: this.applicantFormAdmin.controls.availability.value,
      user_id: applicant_id,
      job_id: this.data.job_id,
      applied_by: sessionStorage.getItem("user_id"),
      recruiter_id: sessionStorage.getItem("user_id"),
      prefered_state: this.data["state"],
      prefered_city: this.data["city"],
      job_no: this.data["job_no"]
    }
    //console.log(applyJobObj)
    this.http.add_applicant(applyJobObj).subscribe((result: any) => {
      // console.log(result)
      if (result === "success") {
        this.http.spinnerHide();
        this.successMsg("Applicant added Successfully.");
      }
      if (result === "ERROR") {
        this.http.spinnerHide();
        this.errorMsg("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.http.spinnerHide();
      this.errorMsg("Something went wrong. Please Try Again.");
    })

  }

  addApplicant() {
    this.http.spinnerShow();
    if (this.recruitee_id_exist === "") {

      let regObj = {
        user_first_name: this.applicantFormAdmin.controls.first_name.value,
        user_middle_name: this.applicantFormAdmin.controls.middle_namee.value,
        user_last_name: this.applicantFormAdmin.controls.last_name.value,
        phone: this.applicantFormAdmin.controls.phone_no.value,
        email: this.applicantFormAdmin.controls.email.value,
        password: "1234",
        user_type: "recruitee",
        dob: "",
        ssn_4digit: "",
        profession: 0,
        speciality: 0,
        desired_location_1: "",
        desired_location_2: ""
      }

      //console.log(regObj)

      this.http.register(regObj).subscribe((res: any) => {
        //console.log(res);
        if (res.message === "You are login") {
          this.uploadDoc(this.fileToUpload, res.user_details.user_id);
        }
        else if (res === "user exists") {
          this.http.spinnerHide();
          this.errorMsg("Already registered with this email address.");
        }
      }, err => {
        this.http.spinnerHide();
        this.errorMsg("Something went wrong. Please Try Again.");
      });
    }
    else if (this.recruitee_id_exist !== "") {

      let regObj = {
        user_id: this.recruitee_id_exist,
        user_first_name: this.applicantFormAdmin.controls.first_name.value,
        user_middle_name: this.applicantFormAdmin.controls.middle_namee.value,
        user_last_name: this.applicantFormAdmin.controls.last_name.value,
        phone: this.applicantFormAdmin.controls.phone_no.value,
        email: this.applicantFormAdmin.controls.email.value
      }

      //console.log(regObj)

      this.http.updateRecruitee(regObj).subscribe((res: any) => {
        //console.log(res);
        if (res === "success") {
          if (this.file_name !== "") {
            this.uploadDoc2(this.fileToUpload, this.recruitee_id_exist);
          }
          else {
            this.applyJobFunction(this.recruitee_id_exist);
          }
        }
        else {
          this.http.spinnerHide();
          this.errorMsg("Something went wrong. Please Try Again.");
        }
      }, err => {
        this.http.spinnerHide();
        this.errorMsg("Something went wrong. Please Try Again.");
      });
    }


  }





  ////////////////////////////

  errorMsg(msg) {
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
    });
  }

  successMsg(msg) {
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
        //window.location.reload();
        window.history.back();
      }
    })
  }

  successMsg2(msg) {
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
        //window.location.reload();
      }
    })
  }


}
