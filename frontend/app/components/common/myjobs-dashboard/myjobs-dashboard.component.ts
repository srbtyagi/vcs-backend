import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-myjobs-dashboard',
  templateUrl: './myjobs-dashboard.component.html',
  styleUrls: ['./myjobs-dashboard.component.css']
})
export class MyjobsDashboardComponent implements OnInit {

  moduleArray: any = [];
  data: any;

  constructor(public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      this.data = JSON.parse(r.special);
    });
    //console.log(this.data)
    this.getAssignaccess(this.data);
  }

  getAssignaccess(val) {
    if (sessionStorage.getItem("user_id")) {
      this.moduleArray = [];
      const arr = JSON.parse(sessionStorage.getItem("moduleArray"));
      const ids = arr.map(o => o.submodule_id);
      const arry = arr.filter(({ submodule_id }, index) => !ids.includes(submodule_id, index + 1));
      arry.forEach((e, index) => {
        if (e.module_id === val) {
          this.moduleArray.push(e);
          switch (e.submodule_name) {
            case "SEARCH JOB": {
              e.submodule_name_lower = "Search job";
              e.routing = "/";
              break;
            }
            case "APPLICATION": {
              e.submodule_name_lower = "Application";
              e.routing = "/job-applications";
              break;
            }
            case "ONBOARDING & HIRING": {
              e.submodule_name_lower = "On Boarding";
              e.routing = "/recruitee-onboarding-hiring";
              break;
            }

            default: {
              //statements; 
              break;
            }
          }

        }
      });
    }
    //console.log(this.moduleArray)
    // setTimeout(() => {
    //   document.getElementById("clsActive201").className = "active";
    // }, 200)
  }

  navigateTo(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(val.module_id)
      }
    };
    this.router.navigate([val.routing], navigationExtras);
  }

}
