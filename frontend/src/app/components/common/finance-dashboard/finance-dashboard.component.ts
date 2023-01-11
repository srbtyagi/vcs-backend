import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.css']
})
export class FinanceDashboardComponent implements OnInit {

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
            case "PAYROLL PROCESSING": {
              e.submodule_name_lower = "Payroll Process";
              e.routing = "/payroll-processing";
              break;
            }
            case "PAYROLL APPROVAL": {
              e.submodule_name_lower = "Payroll Approval";
              e.routing = "/payroll-approval";
              break;
            }
            case "PAYROLL & INVOICE": {
              e.submodule_name_lower = "Payroll & Invoice";
              e.routing = "/payroll-invoice";
              break;
            }
            // case "INCENTIVE PROCESSING": {
            //   e.submodule_name_lower = "Incentive Processing";
            //   e.routing = "/";
            //   break;
            // }
            // case "INCENTIVE APPROVAL": {
            //   e.submodule_name_lower = "Incentive Approval";
            //   e.routing = "/";
            //   break;
            // }
            case "INCENTIVES": {
              e.submodule_name_lower = "Incentives";
              e.routing = "/incentives";
              break;
            }
            case "INVOICE RECON": {
              e.submodule_name_lower = "Invoice Reconcile";
              e.routing = "/invoice-reconcile";
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
