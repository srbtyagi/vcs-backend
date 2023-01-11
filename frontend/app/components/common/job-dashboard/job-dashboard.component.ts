import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-job-dashboard',
  templateUrl: './job-dashboard.component.html',
  styleUrls: ['./job-dashboard.component.css']
})
export class JobDashboardComponent implements OnInit {
  data: any;
  moduleArray: any = [];

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
            case "POST JOB": {
              e.submodule_name_lower = "Post A Job";
              e.routing = "/post-jobs";
              break;
            }
            case "MANAGE JOB": {
              e.submodule_name_lower = "Manage Jobs";
              e.routing = "/manage-jobs";
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
    //   document.getElementById("clsActive101").className = "active";
    // }, 200)
  }

  navigateTo(val){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(val.module_id)
      }
    };
    this.router.navigate([val.routing], navigationExtras);
  }

}
