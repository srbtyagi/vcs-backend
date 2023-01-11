import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import { Title, Meta } from '@angular/platform-browser';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  title = 'Job Openings';

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService, public route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta, public http: AdminService) { }

  @ViewChild('closeModal', { static: false }) private closeModal: ElementRef;

  loginForm: FormGroup;
  allJobs = [];
  checkLoggedIn = false;
  details: any = {};
  applyData: any = {};
  allJobsector: any = [];
  checkUserType: boolean = false;
  signupData: any = {};
  search1: any = "";
  search2: any = "";
  search3: any = "";
  applyStatus: boolean = true;



  ngOnInit() {

    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'RN Jobs, Technologist Jobs, LPN Jobs, High Pay Nursing jobs' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'Nursing and Allied health Jobs' }
    );

    this.loginForm = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      password: new FormControl(null, [Validators.required]),
    });

    this.getAllJobs();
    //this.getAllJobsector();
    // this.getRecData();
    this.getPositionType();
    if (sessionStorage.getItem("user_id")) {
      this.checkLoggedIn = true;
    }

    if (sessionStorage.getItem('user_type')) {
      if (sessionStorage.getItem('user_type') === "recruitee") {
        this.checkUserType = true;
      }
    }

  }

  getRecData() {
    let user_ = '0';
    if (sessionStorage.getItem('user_id')) {
      user_ = sessionStorage.getItem('user_id');
    }
    this.service.getRecruiteeStatus({ user_id: user_ }).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {
        if (result[0].apply_status !== "regular") {
          this.applyStatus = false;
        }
      }
    });
  }

  getAllJobs() {

    this.allJobs = [];
    let obj = {
      s1: this.search1,
      s2: this.search2,
      s3: this.search3,


    }
    // //console.log(obj)
    this.service.getAllJob(obj).subscribe((res) => {
      // //console.log(res);
      let result: any = res;
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].job_status === "open") {
            result[i]["regular_pay"] = Math.trunc(result[i].regular_pay_rate);
            result[i]["blended_pay"] = Math.trunc(result[i].blended_pay_rate);
            this.allJobs.push(result[i]);
          }

        }
      }
    });
  }

  getAllJobsector() {
    this.service.geAllJobSector().subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].job_sector_status === "active") {
            this.allJobsector.push(result[i]);
          }
        }
      }
    });
  }

  positiontype: any = [];
  getPositionType() {
    this.positiontype = [];
    this.http.getAllPositionType().subscribe((res: any) => {
      res.forEach(e => {
        if (e.position_type_status === "active") {
          this.positiontype.push(e);
        }
      });
      //console.log(this.positiontype)
    });
  }

  applyStatusFalse() {
    this.error('You are restricted to apply.');
  }

  createAccountCheck(data) {
    this.applyData = data;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(this.applyData)))),
      }
    };

    sessionStorage.setItem("registerModel", "apply");
    this.router.navigate(["/register"], navigationExtras);
  }

  createAccountCheck2() {

    this.closeModal.nativeElement.click();
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(this.signupData)))),
      }
    };
    this.closeModal.nativeElement.click();

    sessionStorage.setItem("registerModel", "apply");
    this.router.navigate(["/register"], navigationExtras);
  }

  jobApply(data, index) {
    //console.log("APPLY", this.applyData)
    this.applyData = data;
    if (this.checkLoggedIn) {
      this.service.getAlreadyAppliedStatus({ job_id: data.job_id, user_id: sessionStorage.getItem('user_id') }).subscribe((res) => {
        //console.log(res);
        let result: any = res;
        if (result.length > 0) {
          this.error('You have already applied.');
        }
        else {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              special: btoa(unescape(encodeURIComponent(JSON.stringify(this.applyData)))),
            }
          };
          this.closeModal.nativeElement.click();
          this.router.navigate(["/apply-job"], navigationExtras);
        }
      });




    }
  }

  beforeApplyLogin(data) {
    this.applyData = data;
    this.signupData = data;
  }

  goTo(data) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(data.job_id),
      }
    };
    //this.router.navigate(["/job-details"], navigationExtras);

    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(["/job-details"], navigationExtras)
    // );

    // window.open(url, '_blank');

  }

  loginGuest(data) {
    this.applyData = data;
    this.signupData = data;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(this.applyData)))),
      }
    };
    this.closeModal.nativeElement.click();
    this.router.navigate(["/apply-job-guest"], navigationExtras);
  }

  loginGuest2() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(this.applyData)))),
      }
    };
    this.closeModal.nativeElement.click();
    this.router.navigate(["/apply-job-guest"], navigationExtras);
  }

  login() {
    //console.log("LOGIN", this.loginForm.value)
    let modulearray = [];
    this.service.login(this.loginForm.value).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result === "username and password is not matched") {
        this.error1("Wrong Password. Try Again!!!");
      }
      else if (result === "No username in database please signup first" || result === "unregistered") {
        this.error2("Invalid Email. Please Signup!!!");
      }
      else if (result.message === "You are login") {
        sessionStorage.setItem("user_id", result.user_id);
        sessionStorage.setItem("user_name", result.username);
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

        let navigationExtras: NavigationExtras = {
          queryParams: {
            special: btoa(unescape(encodeURIComponent(JSON.stringify(this.applyData)))),
          }
        };
        this.closeModal.nativeElement.click();
        this.router.navigate(["/apply-job"], navigationExtras);
        setTimeout(() => {
          window.location.reload();
        }, 200);
        // this.success("Logged in successfully.");
      }
      else {
        this.closeModal.nativeElement.click();
        this.error("Something went wrong. Please Try Again.");
      }
    }, err => {
      this.closeModal.nativeElement.click();
      this.error("Something went wrong. Please Try Again.");
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
        this.loginForm.patchValue({
          password: ""
        })
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
        this.loginForm.reset();
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




}
