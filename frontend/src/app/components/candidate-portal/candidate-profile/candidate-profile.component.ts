import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecruiteeService } from 'src/app/recruitee.service';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {

  checkUserType: boolean = false;
  userData: any;
  status = false;
  url = "";
  badge:Number;

  constructor(public service: RecruiteeService, public router: Router) { }

  ngOnInit() {
    if (sessionStorage.getItem("user_type") === 'recruitee') {
      this.checkUserType = true;
    }
    this.getUser(); 
    this.checkResume();
    this.getBadge();
  }

  getUser() {
    this.service.getUserRecruiteeById(sessionStorage.getItem('user_id')).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length) {
        this.userData = result[0];
      }
     
    });
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

 


}
