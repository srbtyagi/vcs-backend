import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import { Country, State, City } from 'country-state-city';



@Component({
  selector: 'app-apply-job-guest',
  templateUrl: './apply-job-guest.component.html',
  styleUrls: ['./apply-job-guest.component.css'],
  //template: '<div [innerHTML]="jsonLD"></div>'
})
export class ApplyJobGuestComponent implements OnInit {

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService, public route: ActivatedRoute,
  ) { }

  applicantForm: FormGroup;
  details: any = {};
  file_name = "";
  status = false;
  url = "";
  viewShow: any = "no";
  showPercentage: number = 0;
  showProgressBar: boolean = false;
  viewfinalErr: boolean = false;
  codePattern = "[+]?[0-9]*";
  phonePattern = "[0-9]*";
  exist: any = "NO";
  fileExistData: number = 0;
  checkEmail: boolean = false;
  user_existance: any = "";
  states: any = [];
  stateList: boolean = false;
  filterArrayState: any = [];
  cityList: boolean = false;
  filterArrayCity: any = [];
  filteredCity: any = [];




  ngOnInit() {

    // var str = "JOB123-050522001".replace(/^'|'$/g, "").split(/\s*\-\s*/g)
    // var dtt = str[1].slice(2, 4);
    // var mmm = str[1].slice(0, 2);
    // var yyy = str[1].slice(4, 6);
    // var ccc = str[1].slice(6, 9);

    // //console.log(str[1], dtt, mmm, yyy, ccc)

    this.states = State.getStatesOfCountry("US");
    this.filterArrayState = State.getStatesOfCountry("US");
    this.applicantForm = this.fb.group({
      first_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      //middle_name: new FormControl(null, [Validators.maxLength(100)]),
      last_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required, Validators.maxLength(60), Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      phone_no: new FormControl(null, [Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.phonePattern)]),
      message: new FormControl(null, [Validators.maxLength(500)]),
      //availability: new FormControl(null, [Validators.maxLength(500)]),
      resume: new FormControl(null, []),
      state: new FormControl(null, []),
      city: new FormControl(null, [])
    });

    this.route.queryParams.subscribe((r: any) => {
      let a = decodeURIComponent(escape(window.atob(r.special)));
      this.details = JSON.parse(a);
      // //console.log(this.details)
    });


    // this.getUserByID();
    // this.checkResume();

  }

  onOptionsSelected(value: any, name) {
    //console.log(value, name);
    this.filteredCity = [];
    this.filterArrayCity = [];
    this.filteredCity = City.getCitiesOfState("US", value);
    this.filterArrayCity = City.getCitiesOfState("US", value);
    this.applicantForm.controls['state'].setValue(name);
    this.stateList = false;
    //console.log(this.filteredCity)
    // for (var key in this.cities) {
    //   if (this.cities.hasOwnProperty(key)) {
    //     ////console.log(key);
    //     if (key.toLowerCase() === value.toLowerCase()) {
    //       this.filteredCity = this.cities[key];
    //     }
    //   }
    // }
  }

  onOptionsSelectedCity(value: any) {
    //console.log(value);
    this.applicantForm.controls['city'].setValue(value);
    this.cityList = false;
  }

  focusInputCity() {
    this.cityList = true;
  }

  focusInputState() {
    this.stateList = true;
  }

  searchState(ev) {
    //console.log(this.postJobForm.controls.state.value)
    let search_data = this.applicantForm.controls.state.value;
    this.states = search_data ? this.filterListState(search_data) : this.filterArrayState;
  }

  filterListState(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.filterArrayState.filter((list: any) =>
      list.name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.isoCode.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }

  searchCity(ev) {
    //console.log(this.postJobForm.controls.city.value)
    let search_data = this.applicantForm.controls.city.value;
    this.filteredCity = search_data ? this.filterListCity(search_data) : this.filterArrayCity;
  }

  filterListCity(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.filterArrayCity.filter((list: any) =>
      list.name.toLocaleLowerCase().indexOf(filterby) !== -1
    );
  }



  getUserByID() {
    this.service.getUserById({ user_id: sessionStorage.getItem("user_id") }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {


        this.applicantForm.patchValue({
          name: result[0].user_first_name + " " + result[0].user_middle_name + " " + result[0].user_last_name,
          email: result[0].email,
          phone_no: result[0].phone
        })
      }
      else {
        this.error("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");
    });
  }

  checkResume() {
    this.service.check_resume({ user_id: sessionStorage.getItem("user_id") }).subscribe((res) => {
      let result: any = res;
      if (result[0].resume_doc_path) {
        this.status = true;
        this.url = "https://vishusa.com/vcsapi/get/resume/" + sessionStorage.getItem("user_id") + "/" + sessionStorage.getItem('user_name') + "_resume";
      }
      else {
        this.status = false;
        this.url = "";
      }
    });
  }

  addApplicant() {
    this.service.spinnerShow();

    //console.log(this.applicantForm.value)
    //if (this.status) {
    if (this.fileExistData) {
      this.exist = "YES";

      let data = this.applicantForm.value;

      var pref_state: any;
      var pref_city: any;

      if (data.state === null && data.city === null) {
        pref_state = this.details.state;
        pref_city = this.details.city;
      }
      else if (data.state !== null && data.city === null) {
        pref_state = data.state;
        pref_city = this.details.city;
      }
      else if (data.state === null && data.city !== null) {
        pref_state = this.details.state;
        pref_city = data.city;
      }
      else if (data.state !== null && data.city !== null) {
        pref_state = data.state;
        pref_city = data.city;
      }

      let obj = {
        first_name: data.first_name,
        middle_name: "",
        last_name: data.last_name,
        phone: data.phone_no,
        email: data.email,
        message: data.message,
        availability: "",
        user_id: this.fileExistData,
        job_id: this.details["job_id"],
        applied_by: "own",
        recruiter_id: 0,
        user_exist: this.user_existance,
        job_no: this.details["job_no"],
        prefered_state: pref_state,
        prefered_city: pref_city
      }
      // //console.log(obj)
      this.service.getAlreadyAppliedStatus(obj).subscribe((res) => {
        // //console.log("res", res);
        let result: any = res;
        if (result.length && result[0].user_status !== "deleted") {
          this.service.spinnerHide();
          this.error1('You have already applied.');
        }
        else {

          //console.log("else")
          this.service.add_applicant_guest(obj, this.exist).subscribe((res) => {
            //console.log("resultt", res);
            let result: any = res;
            if (result.message === "success") {
              this.service.spinnerHide();
              this.exist = "Yes";
              this.fileExistData = result.user_details["user_id"];

              this.success2("Applied Successfully.");
            }
            if (result === "ERROR") {
              this.service.spinnerHide();
              this.error("Something went wrong. Please Try Again.");
            }
          }, err => {

            this.service.spinnerHide();
            this.error("Something went wrong. Please Try Again.");
          });
        }

      }, err => {
        this.service.spinnerHide();
        this.error("Something went wrong. Please Try Again.");
      });

    }
    else {
      let data = this.applicantForm.value;

      var pref_state: any;
      var pref_city: any;

      if (data.state === null && data.city === null) {
        pref_state = this.details.state;
        pref_city = this.details.city;
      }
      else if (data.state !== null && data.city === null) {
        pref_state = data.state;
        pref_city = this.details.city;
      }
      else if (data.state === null && data.city !== null) {
        pref_state = this.details.state;
        pref_city = data.city;
      }
      else if (data.state !== null && data.city !== null) {
        pref_state = data.state;
        pref_city = data.city;
      }

      let obj = {
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: "",
        phone: data.phone_no,
        email: data.email,
        message: data.message,
        availability: "",
        job_id: this.details["job_id"],
        applied_by: "own",
        recruiter_id: 0,
        user_exist: this.user_existance,
        job_no: this.details["job_no"],
        prefered_state: pref_state,
        prefered_city: pref_city
      }
      // //console.log(obj)
      this.service.getAlreadyAppliedStatusByEmail(obj).subscribe((res) => {
        // //console.log("res", res);
        let result: any = res;
        if (result.length && result[0].user_status !== "deleted") {
          this.service.spinnerHide();
          this.error1('You have already applied.');
        }
        else {

          //console.log("else")
          this.service.add_applicant_guest_By_email(obj).subscribe((res) => {
            // //console.log("resultt", res);
            let result: any = res;
            if (result.message === "success") {
              this.service.spinnerHide();
              this.exist = "Yes";
              this.fileExistData = result.user_details["user_id"];

              this.success2("Applied Successfully.");
            }
            if (result === "ERROR") {
              this.service.spinnerHide();
              this.error("Something went wrong. Please Try Again.");
            }
          }, err => {

            this.service.spinnerHide();
            this.error("Something went wrong. Please Try Again.");
          });
        }

      }, err => {
        this.service.spinnerHide();
        this.error("Something went wrong. Please Try Again.");
      });
    }
    //}
    // else {
    //   this.service.spinnerHide();
    //   this.error("Upload Resume.");

    // }

  }



  fileUpload(files: FileList) {
    if (this.applicantForm.value.email) {
      if (this.fileExistData !== 0) {
        this.exist = "YES";
      }
      let fileInput: any = (<HTMLInputElement>document.getElementById('customFile'));
      let fileData = files[0];
      this.file_name = fileData.name;
      this.showProgressBar = false;
      this.viewShow = "false";
      this.viewfinalErr = false;
      if (fileData.size > 25000000) {
        this.error("File size exceeds the maximum limit 25mb.")
      }
      else {
        this.uploadFiles(fileData, this.exist, this.fileExistData);
      }
    }
    else {
      this.error("Fill up the above details first.")
    }

  }


  uploadFiles(file, param1, param2) {
    // //console.log("UPLOAD------", param1, param2)
    this.showProgressBar = true;
    this.showPercentage = 0;
    let formData = new FormData();

    formData.append('file', file, file.name);
    // //console.log(formData,file.name)

    this.service.uploadFileRegisterGuest(formData, param1, param2, this.applicantForm.value.email).subscribe(res => {
      let result: any = res;
      // //console.log("upload", result)

      this.viewShow = "try";
      this.showPercentage = Math.round(100 * result.loaded / result.total);
      if (result.body !== undefined) {
        if (result.body.message === "success") {
          this.showProgressBar = false;
          this.viewShow = "true";
          this.viewfinalErr = false;
          // this.success("Resume Uploaded Successfully.");
          this.fileExistData = result.body.user_details.user_id;
          this.user_existance = result.body.user_exist
          this.status = true;
          this.url = "https://vishusa.com/vcsapi/get/resume/" + result.body.user_details.user_id + "/" + sessionStorage.getItem('user_name') + "_resume";
        }
      }
      else {
        this.status = false;
        this.url = "";
        this.viewfinalErr = true;
        this.viewShow = "false";
      }
    }, err => {
      // //console.log(err)
      this.status = false;
      this.url = "";
      this.viewfinalErr = true;
      this.viewShow = "false";
    });



  }

  deleteTempApplicationGuest() {
    this.service.delete_temp_registration({ user_id: this.fileExistData }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result === "delete") {
        this.applicantForm.reset();
      }
      else {
        this.error("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");

    });
  }

  // checkUniqueEmail(){
  //   //console.log(this.applicantForm.value.email)
  //       this.service.check_email({email:this.applicantForm.value.email}).subscribe((res) => {
  //         //console.log(res);
  //         let result: any = res;
  //         if(result.user_id){
  //           this.checkEmail=true;
  //           // this.error3("Already registered with this email address.");
  //         }
  //         else{
  //           this.checkEmail=false;
  //         }
  //       });
  //     }



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
  error1(msg) {
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
        this.router.navigate(["/jobs"]);

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
        this.applicantForm.patchValue({
          message: "",
          availability: ""
        });
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
        this.applicantForm.reset();



        this.router.navigate(["/jobs"]);
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
        this.applicantForm.patchValue({ email: "" });
      }
    })
  }

}
