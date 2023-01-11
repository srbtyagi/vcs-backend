import {Component, OnInit, ViewChild, ElementRef, Renderer2, Inject} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {RecruiteeService} from 'src/app/recruitee.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {Title, Meta} from '@angular/platform-browser';

@Component({
  selector: 'app-jobdetails',
  templateUrl: './jobdetails.component.html',
  styleUrls: ['./jobdetails.component.css'],


})
export class JobdetailsComponent implements OnInit {
  @ViewChild('closeModal', {static: false}) private closeModal: ElementRef;
  jsonLD2: SafeHtml;

  constructor(public router: Router, public fb: FormBuilder, public service: RecruiteeService, public route: ActivatedRoute,
              private sanitizer: DomSanitizer, private _renderer2: Renderer2,
              @Inject(DOCUMENT) private _document: Document, private titleService: Title,
              private metaTagService: Meta) {
  }

  details: any = {};
  checkLoggedIn = false;
  loginForm: FormGroup;
  checkUserType: boolean = false;
  applyStatus: boolean = true;

  ///// Google job post Work ////////

  jsonLD: any;


   ngOnInit() {
    // let jsonLdScript: any = document.querySelector('script[type="application/ld+json"]');
    // let jsonld = JSON.parse(jsonLdScript.innerText);
    // jsonld['@context'] = "https";
    // let newJson = JSON.stringify(jsonld);
    // jsonLdScript.innerHTML = newJson;
    // //console.log(jsonld);

    this.route.queryParams.subscribe((r: any) => {
      let a = r.special;
      //console.log(r)
      this.service.getJobDetailsById({job_id: a}).subscribe((res) => {
        //console.log(res);
        let result: any = res;
        if (result.length > 0) {
          this.details = result[0];
          // const json = {
          //   "@context": "https://schema.org/",
          //   "@type": "JobPosting",
          //   "title": this.details.job_title,
          //   "description": this.details.job_description,
          //   "identifier": {
          //     "@type": "PropertyValue",
          //     "name": "Vish Consulting Services",
          //     "value": "10"
          //   },
          //   "datePosted": moment(this.details.job_post_date).format("YYYY-MM-DD"),
          //   "validThrough": "2022-07-18T00:00",
          //   "applicantLocationRequirements": {
          //     "@type": "Country",
          //     "name": this.details.country
          //   },

          //   "employmentType": this.details.job_type_name,
          //   "hiringOrganization": {
          //     "@type": "Organization",
          //     "name": "Vish Consulting Services",
          //     "sameAs": "https://vishusa.com/"
          //   },
          //   "jobLocation": {
          //     "@type": "Place",
          //     "address": {
          //       "@type": "PostalAddress",
          //       "addressLocality": this.details.city,
          //       "addressRegion": this.details.state,
          //       "addressCountry": this.details.country
          //     }
          //   },
          //   "jobLocationType": "TELECOMMUTE",
          //   "baseSalary": {
          //     "@type": "MonetaryAmount",
          //     "currency": "USD",
          //     "value": {
          //       "@type": "QuantitativeValue",
          //       "value": this.details.regular_pay_rate,
          //       "unitText": "HOUR"
          //     }
          //   }
          // };
          // //console.log(json);
          this.titleService.setTitle(this.details.job_title);
          // this.jsonLD2 = this.getSafeHTML(json);
          //this.jsonLD = json;
          // let script = this._renderer2.createElement('script');
          // script.type = `application/ld+json`;
          // script.innerHTML = `${this.jsonLD2}`;
          // this._renderer2.appendChild(this._document.head, script);


        }
      });

    });

    this.getRecData();

    if (sessionStorage.getItem("user_id")) {
      this.checkLoggedIn = true;
    }
    //console.log(this.checkLoggedIn)

    this.loginForm = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]),
      password: new FormControl(null, [Validators.required]),
    });

    if (sessionStorage.getItem('user_type')) {
      if (sessionStorage.getItem('user_type') === "recruitee") {
        this.checkUserType = true;
      }
    }

  }

  getSafeHTML(value: {}) {
    // If value convert to JSON and escape / to prevent script tag in JSON
    const json = value
      ? JSON.stringify(value, null, 2).replace(/\//g, '/')
      : '';
    const html = `${json}`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  getRecData() {
    let user_ = '0';
    if (sessionStorage.getItem('user_id')) {
      user_ = sessionStorage.getItem('user_id');
    }
    this.service.getRecruiteeStatus({user_id: user_}).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {
        if (result[0].apply_status !== "regular") {
          this.applyStatus = false;
        }
      }
    });
  }

  applyStatusFalse() {
    this.error('You are restricted to apply.');
  }

  loginGuest() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(this.details)))),
      }
    };
    this.closeModal.nativeElement.click();
    this.router.navigate(["/apply-job-guest"], navigationExtras);
  }

  createAccountCheck() {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(this.details)))),
      }
    };

    sessionStorage.setItem("registerModel", "apply");
    this.router.navigate(["/register"], navigationExtras);
  }

  createAccountCheck2() {

    this.closeModal.nativeElement.click();
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(this.details)))),
      }
    };
    this.closeModal.nativeElement.click();

    sessionStorage.setItem("registerModel", "apply");
    this.router.navigate(["/register"], navigationExtras);
  }

  toApplicant() {

    if (this.checkLoggedIn) {
      this.service.getAlreadyAppliedStatus({
        job_id: this.details.job_id,
        user_id: sessionStorage.getItem('user_id')
      }).subscribe((res) => {
        //console.log(res);
        let result: any = res;
        if (result.length > 0) {
          this.error('You have already applied.');
        }
        else {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              special: btoa(unescape(encodeURIComponent(JSON.stringify(this.details)))),
            }
          };
          this.closeModal.nativeElement.click();
          this.router.navigate(["/apply-job"], navigationExtras);
        }
      });


    }

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
            special: btoa(unescape(encodeURIComponent(JSON.stringify(this.details)))),
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

}
