import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user_id: any;
  user_name: any;
  moduleArray: any;
  checkUserType: boolean = false;
  navStatus: boolean = false;

  constructor(public router: Router) {
    this.user_id = sessionStorage.getItem("user_id");
    this.user_name = sessionStorage.getItem("user_name");

  }

  changeCss() {
    var classname = document.getElementById('navbarNavDropdown').className;
    ////console.log(classname);
    if (classname === "header-nav navbar-collapse justify-content-start collapse show" && this.navStatus === false) {
      //document.getElementById('navbarNavDropdown').className = "header-nav navbar-collapse justify-content-start collapse";
      this.navStatus = true;
      setTimeout(() => {
        document.getElementById('navbarNavDropdown').style.display = "none";
      }, 100);
    }
    else {
      this.navStatus = false;
      //document.getElementById('navbarNavDropdown').className = "header-nav navbar-collapse justify-content-start collapse";
      document.getElementById('navbarNavDropdown').style.display = "block";
    }
  }

  hideMenu(){
   
    this.navStatus = true;
    document.getElementById('navbarNavDropdown').style.display = "none";
    document.getElementById('menuBtn').className = "navbar-toggler collapsed navicon justify-content-end";
  }

  ngOnInit() {
    this.functionassignAccess();
    if (sessionStorage.getItem("user_type") === 'recruitee') {
      this.checkUserType = true;
    }
  }

  functionassignAccess() {
    if (sessionStorage.getItem("user_id")) {
      const arr = JSON.parse(sessionStorage.getItem("moduleArray"));
      //console.log(arr)
      const ids = arr.map(o => o.module_id);
      this.moduleArray = arr.filter(({ module_id }, index) => !ids.includes(module_id, index + 1));
      this.moduleArray.forEach(e => {
        if (e.module_name === "JOBS") {
          e.module_name_lower = "Jobs";
          //e.route = "/job-dashboard";
          e.route = "/manage-jobs";
        }
        if (e.module_name === "MY JOBS" && sessionStorage.getItem("user_type") === "recruitee") {
          e.module_name_lower = "My Jobs";
          //e.route = "/myjobs-dashboard";
          e.route = "/job-applications";
        }
        if (e.module_name === "MY JOBS") {
          e.module_name_lower = "My Jobs";
          //e.route = "/myjobs-dashboard";
          e.route = "/job-applications";
        }
        if (e.module_name === "SETUP") {
          e.module_name_lower = "Setup";
          //e.route = "/setup-dashboard";
          e.route = "/company";
        }
        if (e.module_name === "APPLICANT") {
          e.module_name_lower = "Applicants";
          //e.route = "/applicant-dashboard";
          e.route = "/applicants";
        }
        if (e.module_name === "FINANCE") {
          e.module_name_lower = "Finance";
          //e.route = "/finance-dashboard";
          e.route = "/payroll-processing";
        }
        if (e.module_name === "ASSIGNMENT") {
          e.module_name_lower = "Assignment";
          e.route = "/company";
        }
        if (e.module_name === "PROFILE") {
          e.module_name_lower = "Profile";
          e.route = "/company";
        }

      });
      //console.log(arr, this.moduleArray)
    }
  }

  navigateToRecruitee() {
    this.router.navigate(['current-assignment'])
  }

  navigateToProfile() {
    this.router.navigate(['candi-profile'])
  }

  navigateTo(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(val.module_id)
      }
    };
    this.router.navigate([val.route], navigationExtras);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(["/"]);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

}
