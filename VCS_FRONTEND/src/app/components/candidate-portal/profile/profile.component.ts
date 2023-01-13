import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { IDayCalendarConfig } from 'ng2-date-picker';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService, public route: ActivatedRoute) { }

  checkUserType:boolean=false;
  file_name = "";
  current_date = "";
  registerForm: FormGroup;
  fileData = "";
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
  codePattern = "[+]?[0-9]*";
  phonePattern = "[0-9]*";
  emp_preference:any=[{type:"Permanent"},{type:"Travel"},{type:"Per Diem"}];
  emp_data: any = [];
  old_email:any;
  badge:Number;

  datePickerConfig = <IDayCalendarConfig>{
    drops: 'down',
    format: 'MM/DD/YYYY'
  }


  ngOnInit() {
    this.registerForm = this.fb.group({
      first_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      middle_name: new FormControl(null, [Validators.maxLength(100)]),
      last_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required, Validators.maxLength(60), Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      phone_no: new FormControl(null, [Validators.required,Validators.maxLength(10),Validators.minLength(10), Validators.pattern(this.phonePattern)]),
      dob: new FormControl(null, [Validators.maxLength(50)]),
      ssn: new FormControl(null, []),
      profession: new FormControl(null, []),
      speciality: new FormControl(null, []),
      current_loc: new FormControl(null, [Validators.maxLength(200)]),
      desired_loc1: new FormControl(null, [Validators.maxLength(100)]),
      desired_loc2: new FormControl(null, [Validators.maxLength(100)]),
      resume: new FormControl(null, [])
    }
    );

    if(sessionStorage.getItem("user_type")==='recruitee')
    {
      this.checkUserType=true;
    }

    this.getAllProfession();
    this.getAllSpeciality();
    this.getUser();
    this.checkResume();
    //console.log("data2", sessionStorage.getItem('registerModel'))
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

  back() {
    window.history.back();
  }



  register() {

    this.service.spinnerShow();
    

    //console.log(this.registerForm.value)
      let data = this.registerForm.value;
      let m_name = "";
      if (data.middle_name) {
        m_name = data.middle_name;
      }
      let obj = {
        user_id:sessionStorage.getItem('user_id'),
        user_first_name: data.first_name,
        user_middle_name: m_name,
        user_last_name: data.last_name,
        phone: data.phone_no,
        email: data.email,
        dob: moment(data.dob).format('MM/DD/YYYY'),
        ssn_4digit: data.ssn,
        profession: data.profession,
        speciality: data.speciality,
        current_location: data.current_loc,
        desired_location_1: data.desired_loc1,
        desired_location_2: data.desired_loc2,
        employement_preference: this.emp_data.join(',')
      }
      //console.log(obj)
      this.service.updateUserData(obj).subscribe((res) => {
        //console.log(res);
        let result: any = res;
        if (result === "success") {

           


          this.service.spinnerHide();
          this.success("Updated successfully.");
          this.getUser();
          

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

  getUser(){
    this.service.getUserRecruiteeById(sessionStorage.getItem('user_id') ).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length) {
        let DOB="";
        if(result[0].dob!=="")
        {
          DOB=moment(result[0].dob).format('MM/DD/YYYY');
        }
        this.registerForm.patchValue({
          first_name: result[0].user_first_name,
          middle_name: result[0].user_middle_name,
          last_name: result[0].user_last_name,
          email: result[0].email,
          phone_no: result[0].phone,
          dob: DOB,
          ssn: result[0].ssn_4digit,
          profession: result[0].profession,
          speciality: result[0].speciality,
          current_loc:result[0].current_location,
          desired_loc1: result[0].desired_location_1,
          desired_loc2: result[0].desired_location_2
        });
        this.old_email=result[0].email;

        this.emp_data=[];


        var array = [];
        if(result[0].employement_preference)
        {
          array=result[0].employement_preference.split(',');
        }
        for (var i in this.emp_preference) {
          this.emp_preference[i]["value"] = false;
          if (array.indexOf(this.emp_preference[i]["type"]) > -1) {
            this.emp_data.push(this.emp_preference[i]["type"]);
            this.emp_preference[i]["value"] = true;
          }
        }
      }
      else {
        this.error("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    });
  }


  checkUniqueEmail() {
    //console.log(this.registerForm.value.email)
    this.service.check_email_old({ email: this.registerForm.value.email,old_email:this.old_email }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result==="exist") {
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
    this.uploadFiles(fileData);
    }

  }


  uploadFiles(file) {
    // //console.log("UPLOAD------",file)
    this.showProgressBar = true;
    this.showPercentage = 0;
    let formData = new FormData();

    formData.append('file', file, file.name);
    // //console.log(formData,file.name)

    this.service.uploadFile(formData, sessionStorage.getItem('user_id')).subscribe(res => {
      let result: any = res;
      //console.log("upload", result)

      this.viewShow = "try";
      this.showPercentage = Math.round(100 * result.loaded / result.total);
      if (result.body !== undefined) {
        if (result.body === "success") {
          this.showProgressBar = false;
          this.viewShow = "true";
          this.viewfinalErr = false;
          this.status = true;
          this.url = "https://vishusa.com/vcsapi/get/resume/" + sessionStorage.getItem('user_id')+"/"+sessionStorage.getItem('user_name')+"_resume";
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

  checkBoxSelect(value) {

    let index = this.emp_data.indexOf(value);
    if (index > -1) {
      this.emp_data.splice(index, 1);
    }
    else {
      this.emp_data.push(value);
    }
    //console.log(this.emp_data)



  }

  getAllProfession() {
    this.service.getAllProfession().subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {
        this.professionData = result;
      }
    });
  }



  getAllSpeciality() {
    this.service.getAllSpeciality().subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {
        this.specialityData = result;
      }
    });
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
        this.router.navigate(['/candi-profile']);
      }
    })
  }


}
