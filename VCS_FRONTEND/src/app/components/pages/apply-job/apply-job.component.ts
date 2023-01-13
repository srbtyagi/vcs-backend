import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent implements OnInit {

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService, public route: ActivatedRoute) { }

  applicantForm: FormGroup;
  details: any = {};
  file_name = "";
  status = false;
  url = "";
  viewShow: any = "";
  showPercentage: number = 0;
  showProgressBar: boolean = false;
  viewfinalErr: boolean = false;
  codePattern = "[+]?[0-9]*";
  phonePattern = "[0-9]*";
  name: any;
  email: any;

  ngOnInit() {

    this.applicantForm = this.fb.group({
      phone_no: new FormControl(null, [Validators.maxLength(10), Validators.pattern(this.phonePattern)]),
      message: new FormControl(null, [Validators.maxLength(500)]),
      availability: new FormControl(null, [Validators.maxLength(500)]),
      resume: new FormControl(null, [])
    });

    this.route.queryParams.subscribe((r: any) => {
      let a = decodeURIComponent(escape(window.atob(r.special)));
      this.details = JSON.parse(a);
      //console.log(this.details, "data")
    });


    this.getUserByID();
    this.checkResume();

  }

  getUserByID() {
    this.service.getUserById({ user_id: sessionStorage.getItem("user_id") }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {

        if (result[0].user_middle_name !== null) {
          this.name = result[0].user_first_name + " " + result[0].user_middle_name + " " + result[0].user_last_name;
        }
        else {
          this.name = result[0].user_first_name + " " + result[0].user_last_name;
        }

        this.email = result[0].email;

        this.applicantForm.patchValue({
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
    if (this.status) {
      let data = this.applicantForm.value;


      let obj = {
        phone: data.phone_no,
        email: data.email,
        message: data.message,
        availability: data.availability,
        user_id: sessionStorage.getItem("user_id"),
        job_id: this.details["job_id"],
        applied_by: "own",
        recruiter_id: 0,
        job_no: this.details["job_no"],
        prefered_state: this.details["state"],
        prefered_city: this.details["city"]
      }
      //console.log(obj)
      this.service.add_applicant(obj).subscribe((res) => {
        //console.log(res);
        let result: any = res;
        if (result === "success") {
          this.service.spinnerHide();
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
    else {
      this.service.spinnerHide();
      this.error("Upload Resume.");

    }
  }

  fileUpload(files: FileList) {
    //console.log(files)
    let fileInput: any = (<HTMLInputElement>document.getElementById('customFile'));
    let file = files[0];
    // //console.log("filesss",file)
    this.file_name = file.name;

    if (file.size > 25000000) {
      this.error("File size exceeds the maximum limit 25mb.")
    }
    else {
      this.uploadFiles(file, sessionStorage.getItem("user_id"))
    }

  }

  uploadFiles(file, user) {
    // //console.log("UPLOAD------",file)
    this.showProgressBar = true;
    this.showPercentage = 0;
    let formData = new FormData();

    formData.append('file', file, file.name);
    // //console.log(formData,file.name)

    this.service.uploadFile(formData, user).subscribe(res => {
      let result: any = res;
      //console.log(result)
      this.showPercentage = Math.round(100 * result.loaded / result.total);
      if (result.body === "success") {
        this.showProgressBar = false;
        this.viewShow = "true";
        this.viewfinalErr = false;
        // this.success("Resume Uploaded Successfully.");
        this.status = true;
        this.url = "https://vishusa.com/vcsapi/get/resume/" + sessionStorage.getItem("user_id") + "/" + sessionStorage.getItem('user_name') + "_resume";
      }
      else {
        this.status = false;
        this.url = "";
        this.viewfinalErr = true;
        this.viewShow = "false";
      }
    }, err => {
      this.viewfinalErr = true;
      this.viewShow = "false";
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
        this.applicantForm.patchValue({
          message: "",
          availability: ""
        });
        let navigationExtras: NavigationExtras = {
          queryParams: {
            special: JSON.stringify(5),
          }
        }

        this.router.navigate(["/job-applications"], navigationExtras);
      }
    })
  }

}
